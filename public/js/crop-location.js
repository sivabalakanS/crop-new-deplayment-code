let locationDataLoaded = null;
let userLocation = { latitude: null, longitude: null };
let selectedLocation = { state: '', district: '', taluk: '', area: '' };
let selectedCategory = '';
let selectedSoil = '';

// Load location data on page load
document.addEventListener('DOMContentLoaded', () => {
    locationDataLoaded = locationData; // reference, populated lazily
});

// State selection handler
document.getElementById('state').addEventListener('change', async function() {
    const state = this.value;
    const districtSelect = document.getElementById('district');
    const talukSelect = document.getElementById('taluk');
    const areaSelect = document.getElementById('area');
    
    districtSelect.innerHTML = '<option value="">-- Select District --</option>';
    talukSelect.innerHTML = '<option value="">-- Select Taluk --</option>';
    areaSelect.innerHTML = '<option value="">-- Select Area --</option>';
    
    districtSelect.disabled = true;
    talukSelect.disabled = true;
    areaSelect.disabled = true;
    
    if (state) {
        showLoading('districtLoading');
        await loadLocationData(state);
        const districts = Object.keys(locationDataLoaded[state] || {}).sort();
        districts.forEach(district => {
            const option = document.createElement('option');
            option.value = district;
            option.textContent = district;
            districtSelect.appendChild(option);
        });
        districtSelect.disabled = false;
        hideLoading('districtLoading');
    }
    
    updateSummary();
    validateForm();
});

// District selection handler
document.getElementById('district').addEventListener('change', function() {
    const state = document.getElementById('state').value;
    const district = this.value;
    const talukSelect = document.getElementById('taluk');
    const areaSelect = document.getElementById('area');
    
    talukSelect.innerHTML = '<option value="">-- Select Taluk --</option>';
    areaSelect.innerHTML = '<option value="">-- Select Area --</option>';
    
    talukSelect.disabled = true;
    areaSelect.disabled = true;
    
    if (district && locationDataLoaded[state][district]) {
        showLoading('talukLoading');
        const taluks = Object.keys(locationDataLoaded[state][district]).sort();
        taluks.forEach(taluk => {
            const option = document.createElement('option');
            option.value = taluk;
            option.textContent = taluk;
            talukSelect.appendChild(option);
        });
        talukSelect.disabled = false;
        hideLoading('talukLoading');
    }
    
    updateSummary();
    validateForm();
});

// Taluk selection handler
document.getElementById('taluk').addEventListener('change', function() {
    const state = document.getElementById('state').value;
    const district = document.getElementById('district').value;
    const taluk = this.value;
    const areaSelect = document.getElementById('area');
    
    areaSelect.innerHTML = '<option value="">-- Select Area --</option>';
    areaSelect.disabled = true;
    
    if (taluk && locationDataLoaded[state][district][taluk]) {
        showLoading('areaLoading');
        const areas = locationDataLoaded[state][district][taluk].sort();
        areas.forEach(area => {
            const option = document.createElement('option');
            option.value = area;
            option.textContent = area;
            areaSelect.appendChild(option);
        });
        areaSelect.disabled = false;
        hideLoading('areaLoading');
    }
    
    updateSummary();
    validateForm();
});

// Area selection handler
document.getElementById('area').addEventListener('change', function() {
    updateSummary();
    validateForm();
});

// Update location summary
function updateSummary() {
    const state = document.getElementById('state').value;
    const district = document.getElementById('district').value;
    const taluk = document.getElementById('taluk').value;
    const area = document.getElementById('area').value;
    
    const summaryDiv = document.getElementById('locationSummary');
    const summaryText = document.getElementById('summaryText');
    
    if (state && district && taluk && area) {
        summaryText.textContent = `${area}, ${taluk}, ${district}, ${state}`;
        summaryDiv.style.display = 'block';
        selectedLocation = { state, district, taluk, area };
    } else {
        summaryDiv.style.display = 'none';
    }
}

// Validate form and enable/disable next button
function validateForm() {
    const state = document.getElementById('state').value;
    const district = document.getElementById('district').value;
    const taluk = document.getElementById('taluk').value;
    const area = document.getElementById('area').value;
    const nextBtn = document.getElementById('nextBtn');
    
    if (state && district && taluk && area) {
        nextBtn.disabled = false;
    } else {
        nextBtn.disabled = true;
    }
}

// Show/hide loading indicator
function showLoading(elementId) {
    const loader = document.getElementById(elementId);
    if (loader) {
        loader.textContent = '⏳';
        loader.style.display = 'inline';
    }
}

function hideLoading(elementId) {
    const loader = document.getElementById(elementId);
    if (loader) {
        loader.style.display = 'none';
    }
}

// Detect location using Geolocation API
document.getElementById('detectLocationBtn').addEventListener('click', function() {
    if (navigator.geolocation) {
        this.textContent = '📡 Detecting...';
        this.disabled = true;
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation.latitude = position.coords.latitude;
                userLocation.longitude = position.coords.longitude;
                alert(`Location detected!\nLatitude: ${userLocation.latitude}\nLongitude: ${userLocation.longitude}\n\nPlease select your location manually from the dropdowns.`);
                this.textContent = '✓ Location Detected';
                this.disabled = false;
            },
            (error) => {
                alert('Unable to detect location. Please select manually.');
                this.textContent = '📡 Detect My Location';
                this.disabled = false;
            }
        );
    } else {
        alert('Geolocation is not supported by your browser.');
    }
});

// Next button - Move to crop category selection
document.getElementById('nextBtn').addEventListener('click', function() {
    document.getElementById('step1').style.display = 'none';
    document.getElementById('step2').style.display = 'block';
});

// Back button - Return to location selection
document.getElementById('backBtn').addEventListener('click', function() {
    document.getElementById('step2').style.display = 'none';
    document.getElementById('step1').style.display = 'block';
});

// Category card selection
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', function() {
        document.querySelectorAll('.category-card').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        selectedCategory = this.dataset.category;
        document.getElementById('categoryText').textContent = selectedCategory;
        document.getElementById('categorySelected').style.display = 'block';
        document.getElementById('nextToSoilBtn').disabled = false;
    });
});

// Next to soil selection
document.getElementById('nextToSoilBtn').addEventListener('click', function() {
    document.getElementById('step2').style.display = 'none';
    document.getElementById('step3').style.display = 'block';
    
    document.getElementById('soilLocation').textContent = `${selectedLocation.district}, ${selectedLocation.state}`;
    loadSoilTypes();
});

// Load soil types based on location
function loadSoilTypes() {
    const soilGrid = document.getElementById('soilGrid');
    soilGrid.innerHTML = '';
    
    // Get district-specific soils
    const soils = getSoilsForDistrict(selectedLocation.state, selectedLocation.district);
    
    // Get recommended soil for selected crop category
    const recommendedSoil = getRecommendedSoil(selectedCategory, soils);
    
    soils.forEach(soil => {
        const card = document.createElement('div');
        card.className = 'soil-card';
        card.dataset.soil = soil;
        
        // Add recommended badge
        const isRecommended = soil === recommendedSoil;
        const badge = isRecommended ? '<div style="position: absolute; top: 10px; left: 10px; background: #27ae60; color: white; padding: 4px 8px; border-radius: 5px; font-size: 12px; font-weight: bold; z-index: 10;">✓ Recommended</div>' : '';
        
        card.innerHTML = `
            ${badge}
            <img src="${getSoilImage(soil)}" alt="${soil}" class="soil-image" onerror="this.src='https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop'">
            <div class="soil-name">${soil}</div>
        `;
        soilGrid.appendChild(card);
    });
    
    document.querySelectorAll('.soil-card').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('.soil-card').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            selectedSoil = this.dataset.soil;
            document.getElementById('soilText').textContent = selectedSoil;
            document.getElementById('soilSelected').style.display = 'block';
            document.getElementById('proceedBtn').disabled = false;
        });
    });
}

// Back to category from soil
document.getElementById('backToCategory').addEventListener('click', function() {
    document.getElementById('step3').style.display = 'none';
    document.getElementById('step2').style.display = 'block';
});



// Proceed button - Submit to backend
document.getElementById('proceedBtn').addEventListener('click', async function() {
    if (!selectedCategory) {
        alert('Please select a crop category.');
        return;
    }
    
    if (!selectedSoil) {
        alert('Please select a soil type.');
        return;
    }
    
    const data = {
        state: selectedLocation.state,
        district: selectedLocation.district,
        taluk: selectedLocation.taluk,
        area: selectedLocation.area,
        cropCategory: selectedCategory,
        soilType: selectedSoil
    };
    
    // Store data in localStorage for the results page
    localStorage.setItem('selectedCategory', selectedCategory);
    localStorage.setItem('selectedSoil', selectedSoil);
    localStorage.setItem('selectedLocation', `${selectedLocation.area}, ${selectedLocation.taluk}, ${selectedLocation.district}, ${selectedLocation.state}`);
    
    try {
        this.textContent = 'Processing...';
        this.disabled = true;
        
        const response = await fetch('/api/crop/recommend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Redirect to results page with parameters
            const params = new URLSearchParams({
                category: selectedCategory,
                soil: selectedSoil,
                location: `${selectedLocation.area}, ${selectedLocation.taluk}, ${selectedLocation.district}, ${selectedLocation.state}`
            });
            window.location.href = `crop-recommendation-result.html?${params.toString()}`;
        } else {
            // Still redirect to show recommendations even if save failed
            const params = new URLSearchParams({
                category: selectedCategory,
                soil: selectedSoil,
                location: `${selectedLocation.area}, ${selectedLocation.taluk}, ${selectedLocation.district}, ${selectedLocation.state}`
            });
            window.location.href = `crop-recommendation-result.html?${params.toString()}`;
        }
    } catch (error) {
        console.error('Error:', error);
        // Redirect to results page even if API call fails
        const params = new URLSearchParams({
            category: selectedCategory,
            soil: selectedSoil,
            location: `${selectedLocation.area}, ${selectedLocation.taluk}, ${selectedLocation.district}, ${selectedLocation.state}`
        });
        window.location.href = `crop-recommendation-result.html?${params.toString()}`;
    }
});
