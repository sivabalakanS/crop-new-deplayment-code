const API = window.API_BASE || '';

let uploadedPhotoBase64 = null;

// ── Load saved data on page load ──────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', async () => {
    drawBlankCard();
    await loadAadharData();
});

async function loadAadharData() {
    try {
        const res = await fetch(`${API}/api/auth/aadhar`, { credentials: 'include' });
        const data = await res.json();
        if (!data.success) return;

        const { aadharNumber, aadharName, aadharDob, aadharAddress, aadharPhoto, aadharStatus } = data;

        if (aadharNumber) {
            const fmt = aadharNumber.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
            document.getElementById('aadharNumber').value = fmt;
            document.getElementById('genNumber').value = fmt;
        }
        if (aadharName)    { document.getElementById('aadharName').value = aadharName; document.getElementById('genName').value = aadharName; }
        if (aadharDob)     { document.getElementById('aadharDob').value = aadharDob;   document.getElementById('genDob').value = aadharDob; }
        if (aadharAddress) { document.getElementById('aadharAddress').value = aadharAddress; document.getElementById('genAddress').value = aadharAddress; }

        if (aadharPhoto) {
            uploadedPhotoBase64 = aadharPhoto;
            const preview = document.getElementById('uploadPreview');
            preview.src = aadharPhoto;
            preview.style.display = 'block';
            document.getElementById('removePhotoBtn').style.display = 'block';
            document.getElementById('uploadBtn').disabled = false;
        }

        // Status badge
        const statusMap = {
            verified: { cls: 'badge-verified', icon: '✅', text: 'Aadhar Verified' },
            pending:  { cls: 'badge-pending',  icon: '⏳', text: 'Verification Pending' },
            none:     { cls: 'badge-none',     icon: '❌', text: 'Aadhar Not Submitted' }
        };
        const s = statusMap[aadharStatus] || statusMap.none;
        document.getElementById('statusArea').innerHTML =
            `<div class="status-badge ${s.cls}">${s.icon} ${s.text}</div>`;

        if (aadharNumber) generateCard();
    } catch (e) { /* not logged in or no data */ }
}

// ── Save Aadhar details ───────────────────────────────────────────────────────
async function saveAadhar() {
    const rawNum = document.getElementById('aadharNumber').value.replace(/\s/g, '');
    const name    = document.getElementById('aadharName').value.trim();
    const dob     = document.getElementById('aadharDob').value.trim();
    const address = document.getElementById('aadharAddress').value.trim();
    const msgEl   = document.getElementById('saveMsg');

    if (rawNum && !/^\d{12}$/.test(rawNum)) {
        showMsg(msgEl, 'Aadhar number must be exactly 12 digits.', 'error'); return;
    }

    const btn = document.getElementById('saveAadharBtn');
    btn.disabled = true; btn.textContent = 'Saving...';

    try {
        const res = await fetch(`${API}/api/auth/aadhar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ aadharNumber: rawNum, aadharName: name, aadharDob: dob, aadharAddress: address })
        });
        const data = await res.json();
        if (data.success) {
            showMsg(msgEl, '✅ Aadhar details saved successfully!', 'success');
            // sync to generate tab
            document.getElementById('genName').value = name;
            document.getElementById('genDob').value = dob;
            document.getElementById('genAddress').value = address;
            if (rawNum) document.getElementById('genNumber').value = rawNum.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
            generateCard();
            document.getElementById('statusArea').innerHTML =
                `<div class="status-badge badge-pending">⏳ Verification Pending</div>`;
        } else {
            showMsg(msgEl, data.message || 'Failed to save.', 'error');
        }
    } catch (e) {
        showMsg(msgEl, 'Server error. Please try again.', 'error');
    } finally {
        btn.disabled = false; btn.textContent = '💾 Save Aadhar Details';
    }
}

// ── Photo upload ──────────────────────────────────────────────────────────────
function previewUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
        showMsg(document.getElementById('uploadMsg'), 'File too large. Max 5MB.', 'error'); return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
        uploadedPhotoBase64 = e.target.result;
        const preview = document.getElementById('uploadPreview');
        preview.src = uploadedPhotoBase64;
        preview.style.display = 'block';
        document.getElementById('uploadBtn').disabled = false;
        document.getElementById('removePhotoBtn').style.display = 'block';
    };
    reader.readAsDataURL(file);
}

async function uploadAadharPhoto() {
    if (!uploadedPhotoBase64) return;
    const msgEl = document.getElementById('uploadMsg');
    const btn = document.getElementById('uploadBtn');
    btn.disabled = true; btn.textContent = 'Uploading...';

    try {
        const res = await fetch(`${API}/api/auth/aadhar/photo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ aadharPhoto: uploadedPhotoBase64 })
        });
        const data = await res.json();
        showMsg(msgEl, data.success ? '✅ Photo uploaded successfully!' : (data.message || 'Upload failed.'),
            data.success ? 'success' : 'error');
    } catch (e) {
        showMsg(msgEl, 'Server error.', 'error');
    } finally {
        btn.disabled = false; btn.textContent = '📤 Upload Photo';
    }
}

function removePhoto() {
    uploadedPhotoBase64 = null;
    document.getElementById('uploadPreview').style.display = 'none';
    document.getElementById('uploadPreview').src = '';
    document.getElementById('aadharPhotoInput').value = '';
    document.getElementById('uploadBtn').disabled = true;
    document.getElementById('removePhotoBtn').style.display = 'none';
}

// ── Canvas Card Generation ────────────────────────────────────────────────────
function autoGenerate() { generateCard(); }

function drawBlankCard() {
    const canvas = document.getElementById('aadharCanvas');
    if (!canvas) return;
    generateCard();
}

function generateCard() {
    const canvas = document.getElementById('aadharCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const name    = document.getElementById('genName')?.value.trim()    || '';
    const rawNum  = (document.getElementById('genNumber')?.value || '').replace(/\s/g, '');
    const dob     = document.getElementById('genDob')?.value.trim()     || '';
    const address = document.getElementById('genAddress')?.value.trim() || '';
    const gender  = document.getElementById('genGender')?.value         || 'MALE';

    const fmtNum = rawNum.length === 12
        ? rawNum.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3')
        : 'XXXX XXXX XXXX';

    drawRealAadhar(ctx, canvas.width, canvas.height, name, fmtNum, dob, address, gender);
}

function drawRealAadhar(ctx, W, H, name, fmtNum, dob, address, gender) {
    ctx.clearRect(0, 0, W, H);

    // ── Card background: white with subtle cream tint ──
    ctx.fillStyle = '#FAFAFA';
    roundRect(ctx, 0, 0, W, H, 14);
    ctx.fill();

    // ── Outer border ──
    ctx.strokeStyle = '#C8C8C8';
    ctx.lineWidth = 2;
    roundRect(ctx, 1, 1, W - 2, H - 2, 13);
    ctx.stroke();

    // ── TOP HEADER BAND (saffron + white + green tricolor strip) ──
    // Saffron
    ctx.fillStyle = '#FF9933';
    roundRect(ctx, 0, 0, W, 20, { tl: 13, tr: 13, bl: 0, br: 0 });
    ctx.fill();
    // White
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 20, W, 20);
    // Green
    ctx.fillStyle = '#138808';
    ctx.fillRect(0, 40, W, 20);

    // ── HEADER CONTENT AREA (navy blue) ──
    ctx.fillStyle = '#003087';
    ctx.fillRect(0, 60, W, 72);

    // Ashoka Emblem (drawn via canvas)
    drawAshokaEmblem(ctx, 36, 96);

    // Government text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 15px "Arial", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('भारत सरकार', 76, 84);
    ctx.font = '13px Arial';
    ctx.fillText('Government of India', 76, 102);
    ctx.font = '11px Arial';
    ctx.fillStyle = '#B8D4FF';
    ctx.fillText('Unique Identification Authority of India', 76, 120);

    // AADHAAR logo (right side of header)
    ctx.font = 'bold 26px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'right';
    ctx.fillText('आधार', W - 16, 88);
    ctx.font = 'bold 13px Arial';
    ctx.fillStyle = '#FF9933';
    ctx.fillText('AADHAAR', W - 16, 108);
    ctx.font = '9px Arial';
    ctx.fillStyle = '#B8D4FF';
    ctx.fillText('meri pehchaan', W - 16, 122);

    // ── BODY ──
    const bodyY = 132;
    const photoW = 110, photoH = 130;
    const photoX = W - photoW - 20;
    const photoY = bodyY + 12;

    // Photo box
    ctx.fillStyle = '#E8EEF8';
    roundRect(ctx, photoX, photoY, photoW, photoH, 6);
    ctx.fill();
    ctx.strokeStyle = '#003087';
    ctx.lineWidth = 2;
    roundRect(ctx, photoX, photoY, photoW, photoH, 6);
    ctx.stroke();

    if (uploadedPhotoBase64) {
        const img = new Image();
        img.onload = () => {
            ctx.save();
            roundRect(ctx, photoX, photoY, photoW, photoH, 6);
            ctx.clip();
            ctx.drawImage(img, photoX, photoY, photoW, photoH);
            ctx.restore();
            ctx.strokeStyle = '#003087';
            ctx.lineWidth = 2;
            roundRect(ctx, photoX, photoY, photoW, photoH, 6);
            ctx.stroke();
            drawBodyText(ctx, W, H, bodyY, photoX, photoW, photoH, name, fmtNum, dob, address, gender);
        };
        img.src = uploadedPhotoBase64;
    } else {
        // Silhouette placeholder
        drawSilhouette(ctx, photoX, photoY, photoW, photoH);
    }

    drawBodyText(ctx, W, H, bodyY, photoX, photoW, photoH, name, fmtNum, dob, address, gender);
}

function drawBodyText(ctx, W, H, bodyY, photoX, photoW, photoH, name, fmtNum, dob, address, gender) {
    const lx = 20;
    const contentW = photoX - lx - 14;

    // Name
    ctx.fillStyle = '#003087';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(name || 'Your Full Name', lx, bodyY + 30);

    // Thin underline under name
    ctx.strokeStyle = '#FF9933';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(lx, bodyY + 36);
    ctx.lineTo(lx + Math.min(ctx.measureText(name || 'Your Full Name').width + 4, contentW), bodyY + 36);
    ctx.stroke();

    // DOB row
    ctx.fillStyle = '#555';
    ctx.font = '12px Arial';
    ctx.fillText('Date of Birth :', lx, bodyY + 58);
    ctx.fillStyle = '#111';
    ctx.font = 'bold 13px Arial';
    ctx.fillText(dob || 'DD/MM/YYYY', lx + 96, bodyY + 58);

    // Gender row
    ctx.fillStyle = '#555';
    ctx.font = '12px Arial';
    ctx.fillText('Gender :', lx, bodyY + 78);
    ctx.fillStyle = '#111';
    ctx.font = 'bold 13px Arial';
    ctx.fillText(gender || 'MALE', lx + 60, bodyY + 78);

    // Address
    ctx.fillStyle = '#555';
    ctx.font = '12px Arial';
    ctx.fillText('Address :', lx, bodyY + 100);
    ctx.fillStyle = '#222';
    ctx.font = '12px Arial';
    const addrLines = wrapText(ctx, address || 'Village, Taluk, District, State - PIN', contentW, 12);
    addrLines.forEach((line, i) => ctx.fillText(line, lx, bodyY + 116 + i * 16));

    // ── BOTTOM SECTION ──
    const bottomY = H - 88;

    // Horizontal divider
    ctx.strokeStyle = '#DDDDDD';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(lx, bottomY);
    ctx.lineTo(W - lx, bottomY);
    ctx.stroke();

    // QR code placeholder (bottom-left)
    drawQRPlaceholder(ctx, lx, bottomY + 8, 68, 68);

    // Aadhaar number — large, bold, centered
    const numX = lx + 80;
    const numW = W - numX - lx;

    ctx.fillStyle = '#888';
    ctx.font = '10px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Aadhaar No.', numX, bottomY + 22);

    ctx.fillStyle = '#003087';
    ctx.font = 'bold 28px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(fmtNum, numX + numW / 2, bottomY + 52);

    // Fingerprint icon
    drawFingerprint(ctx, W - 58, bottomY + 10, 48);

    // ── FOOTER BAND ──
    ctx.fillStyle = '#003087';
    ctx.fillRect(0, H - 18, W, 18);
    // Round bottom corners
    roundRect(ctx, 0, H - 18, W, 18, { tl: 0, tr: 0, bl: 13, br: 13 });
    ctx.fill();

    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.font = '9px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('uidai.gov.in  |  1947  |  help@uidai.gov.in', W / 2, H - 5);
}

// ── Draw Ashoka Emblem (simplified canvas version) ────────────────────────────
function drawAshokaEmblem(ctx, cx, cy) {
    const r = 22;
    ctx.save();
    // Outer circle
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = '#FFD700';
    ctx.fill();
    ctx.strokeStyle = '#B8860B';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Chakra (wheel) — 24 spokes
    ctx.strokeStyle = '#003087';
    ctx.lineWidth = 1;
    for (let i = 0; i < 24; i++) {
        const angle = (i / 24) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx + 6 * Math.cos(angle), cy + 6 * Math.sin(angle));
        ctx.lineTo(cx + (r - 4) * Math.cos(angle), cy + (r - 4) * Math.sin(angle));
        ctx.stroke();
    }
    // Inner hub
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#003087';
    ctx.fill();
    // Outer rim
    ctx.beginPath();
    ctx.arc(cx, cy, r - 4, 0, Math.PI * 2);
    ctx.strokeStyle = '#003087';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Lions (simplified as text)
    ctx.fillStyle = '#8B6914';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🦁', cx, cy - r - 2);
    ctx.restore();
}

// ── Draw silhouette placeholder ───────────────────────────────────────────────
function drawSilhouette(ctx, x, y, w, h) {
    ctx.save();
    // Head
    ctx.fillStyle = '#B0BEC5';
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h * 0.28, w * 0.22, 0, Math.PI * 2);
    ctx.fill();
    // Body
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h * 0.72, w * 0.32, h * 0.28, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

// ── Draw QR code placeholder ──────────────────────────────────────────────────
function drawQRPlaceholder(ctx, x, y, w, h) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, w, h);

    // Corner squares (QR style)
    const cs = 12;
    [[x + 3, y + 3], [x + w - cs - 3, y + 3], [x + 3, y + h - cs - 3]].forEach(([qx, qy]) => {
        ctx.fillStyle = '#111';
        ctx.fillRect(qx, qy, cs, cs);
        ctx.fillStyle = '#FFF';
        ctx.fillRect(qx + 2, qy + 2, cs - 4, cs - 4);
        ctx.fillStyle = '#111';
        ctx.fillRect(qx + 4, qy + 4, cs - 8, cs - 8);
    });

    // Random dots to simulate QR
    ctx.fillStyle = '#111';
    const seed = 42;
    for (let i = 0; i < 80; i++) {
        const px = x + 4 + ((seed * (i * 7 + 3)) % (w - 8));
        const py = y + 4 + ((seed * (i * 13 + 5)) % (h - 8));
        if (px > x + 18 && py > y + 18) {
            ctx.fillRect(Math.floor(px / 3) * 3, Math.floor(py / 3) * 3, 3, 3);
        }
    }

    ctx.fillStyle = '#555';
    ctx.font = '7px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Scan QR', x + w / 2, y + h + 10);
}

// ── Draw fingerprint (decorative) ─────────────────────────────────────────────
function drawFingerprint(ctx, x, y, size) {
    ctx.save();
    ctx.strokeStyle = 'rgba(0,48,135,0.18)';
    ctx.lineWidth = 1.2;
    const cx = x + size / 2, cy = y + size / 2;
    for (let i = 1; i <= 7; i++) {
        ctx.beginPath();
        ctx.ellipse(cx, cy + i * 1.5, i * 4, i * 3.2, -0.2, 0.15 * Math.PI, 0.85 * Math.PI);
        ctx.stroke();
    }
    ctx.restore();
}

function wrapText(ctx, text, maxWidth, fontSize) {
    const words = text.split(' ');
    const lines = [];
    let line = '';
    for (const word of words) {
        const test = line ? line + ' ' + word : word;
        if (ctx.measureText(test).width > maxWidth && line) {
            lines.push(line);
            line = word;
        } else {
            line = test;
        }
        if (lines.length >= 2) break;
    }
    if (line) lines.push(line);
    return lines.slice(0, 2);
}

function roundRect(ctx, x, y, w, h, r) {
    if (typeof r === 'number') r = { tl: r, tr: r, bl: r, br: r };
    ctx.beginPath();
    ctx.moveTo(x + r.tl, y);
    ctx.lineTo(x + w - r.tr, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r.tr);
    ctx.lineTo(x + w, y + h - r.br);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
    ctx.lineTo(x + r.bl, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r.bl);
    ctx.lineTo(x, y + r.tl);
    ctx.quadraticCurveTo(x, y, x + r.tl, y);
    ctx.closePath();
}

function downloadCard() {
    generateCard();
    setTimeout(() => {
        const canvas = document.getElementById('aadharCanvas');
        const link = document.createElement('a');
        link.download = 'aadhar-card.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }, 200);
}

// ── Utility ───────────────────────────────────────────────────────────────────
function showMsg(el, text, type) {
    el.textContent = text;
    el.className = `msg ${type}`;
    setTimeout(() => { el.className = 'msg'; }, 4000);
}
