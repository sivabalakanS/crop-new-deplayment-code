// Sidebar toggle
const hamburger = document.getElementById('hamburger');
const sidebar   = document.getElementById('sidebar');
const overlay   = document.getElementById('overlay');
const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');

function openSidebar()  { sidebar.classList.add('active');    overlay.classList.add('active'); }
function closeSidebar() { sidebar.classList.remove('active'); overlay.classList.remove('active'); }

hamburger.addEventListener('click', openSidebar);
overlay.addEventListener('click',   closeSidebar);
if (sidebarCloseBtn) sidebarCloseBtn.addEventListener('click', closeSidebar);

// Auth check
(async function () {
    try {
        const r = await fetch('/api/auth/me', { credentials: 'include' });
        if (!r.ok) window.location.replace('/');
    } catch { window.location.replace('/'); }
})();

// Build flat crop list for autocomplete
const allCrops = [];
for (const [category, crops] of Object.entries(cropData)) {
    for (const cropName of Object.keys(crops)) {
        allCrops.push({ name: cropName, category });
    }
}

// ── Autocomplete ───────────────────────────────────────────────────────────
function onCropInput() {
    const input = document.getElementById('cropInput').value.trim().toLowerCase();
    const box   = document.getElementById('cropSuggestions');

    if (!input) { box.style.display = 'none'; return; }

    const matches = allCrops.filter(c => c.name.toLowerCase().includes(input));

    if (matches.length === 0) { box.style.display = 'none'; return; }

    box.innerHTML = matches.map(c =>
        `<div class="suggestion-item" onclick="selectCrop('${c.name}')">
            🌱 ${c.name} <span class="suggestion-cat">${c.category}</span>
         </div>`
    ).join('');
    box.style.display = 'block';
}

function selectCrop(name) {
    document.getElementById('cropInput').value = name;
    document.getElementById('cropSuggestions').style.display = 'none';
}

// Close suggestions when clicking outside
document.addEventListener('click', e => {
    if (!e.target.closest('#cropInput') && !e.target.closest('#cropSuggestions')) {
        document.getElementById('cropSuggestions').style.display = 'none';
    }
});

// ── Location cascades ──────────────────────────────────────────────────────
async function onStateChange() {
    const state   = document.getElementById('stateSelect').value;
    const distSel = document.getElementById('districtSelect');
    const talukSel = document.getElementById('talukSelect');
    const areaSel  = document.getElementById('areaSelect');
    const soilSel  = document.getElementById('soilSelect');

    distSel.innerHTML  = '<option value="">-- Select District --</option>';
    talukSel.innerHTML = '<option value="">-- Select Taluk --</option>';
    areaSel.innerHTML  = '<option value="">-- Select Area --</option>';
    soilSel.innerHTML  = '<option value="">-- Select District first --</option>';
    distSel.disabled  = true;
    talukSel.disabled = true;
    areaSel.disabled  = true;
    soilSel.disabled  = true;
    if (!state) return;

    await loadLocationData(state);
    Object.keys(locationData[state] || {}).sort().forEach(d => {
        const opt = document.createElement('option');
        opt.value = d; opt.textContent = d;
        distSel.appendChild(opt);
    });
    distSel.disabled = false;
}

function onDistrictChange() {
    const state    = document.getElementById('stateSelect').value;
    const district = document.getElementById('districtSelect').value;
    const talukSel = document.getElementById('talukSelect');
    const areaSel  = document.getElementById('areaSelect');
    const soilSel  = document.getElementById('soilSelect');

    talukSel.innerHTML = '<option value="">-- Select Taluk --</option>';
    areaSel.innerHTML  = '<option value="">-- Select Area --</option>';
    talukSel.disabled  = true;
    areaSel.disabled   = true;

    // Populate soils based on district
    soilSel.innerHTML = '<option value="">-- Select Soil Type --</option>';
    if (district) {
        const soils = getSoilsForDistrict(state, district);
        soils.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s; opt.textContent = s;
            soilSel.appendChild(opt);
        });
        soilSel.disabled = false;
    } else {
        soilSel.disabled = true;
        soilSel.innerHTML = '<option value="">-- Select District first --</option>';
    }

    if (!district) return;

    const taluks = Object.keys((locationData[state] || {})[district] || {});
    taluks.sort().forEach(t => {
        const opt = document.createElement('option');
        opt.value = t; opt.textContent = t;
        talukSel.appendChild(opt);
    });
    talukSel.disabled = false;
}

function onTalukChange() {
    const state    = document.getElementById('stateSelect').value;
    const district = document.getElementById('districtSelect').value;
    const taluk    = document.getElementById('talukSelect').value;
    const areaSel  = document.getElementById('areaSelect');

    areaSel.innerHTML = '<option value="">-- Select Area --</option>';
    areaSel.disabled  = true;
    if (!taluk) return;

    const areas = ((locationData[state] || {})[district] || {})[taluk] || [];
    areas.slice().sort().forEach(a => {
        const opt = document.createElement('option');
        opt.value = a; opt.textContent = a;
        areaSel.appendChild(opt);
    });
    areaSel.disabled = false;
}

// ── Core suitability function ──────────────────────────────────────────────
function checkCropSuitability(cropName, soilType) {
    // Case-insensitive match
    let cropInfo = null, cropCategory = null;
    for (const [cat, crops] of Object.entries(cropData)) {
        for (const [name, info] of Object.entries(crops)) {
            if (name.toLowerCase() === cropName.toLowerCase()) {
                cropInfo = info; cropCategory = cat; cropName = name; break;
            }
        }
        if (cropInfo) break;
    }

    if (!cropInfo) {
        return {
            isSuitable: false,
            reason: `"${cropName}" was not found in our crop database. Please check the spelling or try a different crop name.`,
            cropInfo: null, cropCategory: null, alternatives: [], cropName
        };
    }

    const soilMatch = cropInfo.soils.includes(soilType);

    // Build alternatives for the selected soil
    const alternatives = [];
    for (const [cat, crops] of Object.entries(cropData)) {
        for (const [name, info] of Object.entries(crops)) {
            if (name !== cropName && info.soils.includes(soilType) && !alternatives.includes(name)) {
                alternatives.push(name);
                if (alternatives.length >= 6) break;
            }
        }
        if (alternatives.length >= 6) break;
    }

    if (soilMatch) {
        return { isSuitable: true, reason: '', cropInfo, cropCategory, alternatives: alternatives.slice(0, 4), cropName };
    }

    const reason = `${cropName} grows best in ${cropInfo.soils.join(', ')}. Your selected soil (${soilType}) is not ideal for this crop.`;
    return { isSuitable: false, reason, cropInfo, cropCategory, alternatives: alternatives.slice(0, 4), cropName };
}

// ── UI handler ─────────────────────────────────────────────────────────────
function checkSuitability() {
    const cropName = document.getElementById('cropInput').value.trim();
    const state    = document.getElementById('stateSelect').value;
    const district = document.getElementById('districtSelect').value;
    const taluk    = document.getElementById('talukSelect').value;
    const area     = document.getElementById('areaSelect').value;
    const soilType = document.getElementById('soilSelect').value;

    if (!cropName) { alert('Please type a crop name.'); return; }
    if (!state)    { alert('Please select a State.'); return; }
    if (!soilType) { alert('Please select a Soil Type.'); return; }

    const result = checkCropSuitability(cropName, soilType);
    renderResult(result.cropName || cropName, state, district, taluk, area, soilType, result);
}

function renderResult(cropName, state, district, taluk, area, soilType, result) {
    const card       = document.getElementById('resultCard');
    const icon       = document.getElementById('resultIcon');
    const title      = document.getElementById('resultTitle');
    const subtitle   = document.getElementById('resultSubtitle');
    const reasonBox  = document.getElementById('reasonBox');
    const reasonText = document.getElementById('reasonText');
    const altSection = document.getElementById('altSection');
    const altChips   = document.getElementById('altChips');
    const infoBox    = document.getElementById('cropInfoBox');

    const locationLabel = [district, state].filter(Boolean).join(', ');
    document.getElementById('rCrop').textContent     = cropName;
    document.getElementById('rLocation').textContent = locationLabel;
    document.getElementById('rTaluk').textContent    = taluk || '—';
    document.getElementById('rArea').textContent     = area  || '—';
    document.getElementById('rSoil').textContent     = soilType;

    // Crop info pills
    if (result.cropInfo) {
        const ci = result.cropInfo;
        infoBox.innerHTML = `
            <div class="info-pill"><strong>Category</strong>${result.cropCategory}</div>
            <div class="info-pill"><strong>Season</strong>${ci.season}</div>
            <div class="info-pill"><strong>Duration</strong>${ci.duration}</div>
            <div class="info-pill"><strong>Expected Yield</strong>${ci.yield}</div>
            <div class="info-pill"><strong>Suitable Soils</strong>${ci.soils.join(', ')}</div>
        `;
        infoBox.style.display = 'grid';
    } else {
        infoBox.style.display = 'none';
    }

    if (result.isSuitable) {
        card.className = 'result-card suitable';
        icon.textContent = '✅';
        title.textContent = 'This crop is suitable for your land!';
        subtitle.textContent = `${cropName} grows well in ${soilType} in ${locationLabel}.`;
        reasonBox.style.display  = 'none';
        altSection.style.display = 'none';
    } else {
        card.className = 'result-card unsuitable';
        icon.textContent = '❌';
        title.textContent = 'This crop is not suitable.';
        subtitle.textContent = `${cropName} may not thrive in ${soilType} in ${locationLabel}.`;

        reasonBox.style.display = 'block';
        reasonText.textContent  = result.reason;

        if (result.alternatives.length > 0) {
            altSection.style.display = 'block';
            altChips.innerHTML = result.alternatives.map(alt =>
                `<span class="alt-chip" onclick="selectAlternative('${alt}')">${alt}</span>`
            ).join('');
        } else {
            altSection.style.display = 'none';
        }
    }

    card.style.display = 'block';
    card.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Click alternative chip → fill input and re-check
function selectAlternative(name) {
    document.getElementById('cropInput').value = name;
    checkSuitability();
}
