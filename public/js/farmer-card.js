const DEFAULT_AVATAR = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%"><circle cx="50" cy="35" r="22" fill="#a5d6a7"/><ellipse cx="50" cy="85" rx="35" ry="25" fill="#a5d6a7"/></svg>`;
const DEFAULT_CARD_AVATAR = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%"><circle cx="50" cy="35" r="22" fill="rgba(255,255,255,0.6)"/><ellipse cx="50" cy="85" rx="35" ry="25" fill="rgba(255,255,255,0.6)"/></svg>`;

const API = (typeof window.API_BASE !== 'undefined') ? window.API_BASE : '';
let currentUserId = null;
let photoBase64 = null;

window.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('fcName').value    = '';
    document.getElementById('fcDob').value     = '';
    document.getElementById('fcAddress').value = '';
    document.getElementById('fcAadhar').value  = '';
    document.getElementById('photoInput').value = '';
    await loadCardData();
    await loadStats();
});

async function loadCardData() {
    try {
        // Get user id FIRST so QR generates correctly — no-store prevents cache bleed between users
        const meRes = await fetch(`${API}/api/auth/me`, { credentials: 'include', cache: 'no-store' });
        const meData = await meRes.json();
        if (!meData.success) return;
        currentUserId = meData.user.id;
        document.getElementById('previewId').textContent = `ID: ${currentUserId}`;

        // Load THIS user's saved card data
        const res = await fetch(`${API}/api/auth/aadhar`, { credentials: 'include', cache: 'no-store' });
        const data = await res.json();
        if (!data.success) { liveUpdate(); return; }

        // Only fill if data exists for this user
        document.getElementById('fcName').value    = data.aadharName    || '';
        document.getElementById('fcDob').value     = data.aadharDob     || '';
        document.getElementById('fcAddress').value = data.aadharAddress || '';
        if (data.aadharNumber) {
            document.getElementById('fcAadhar').value = data.aadharNumber.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
        }
        // Load saved photo
        if (data.aadharPhoto) {
            photoBase64 = data.aadharPhoto;
            setPhotoPreview(photoBase64);
        }

        liveUpdate();
    } catch (e) { /* not logged in */ }
}

async function loadStats() {
    try {
        const [progRes, finRes] = await Promise.all([
            fetch(`${API}/api/progress/current`,   { credentials: 'include', cache: 'no-store' }),
            fetch(`${API}/api/finance/records`,     { credentials: 'include', cache: 'no-store' })
        ]);
        const progData = await progRes.json();
        const finData  = await finRes.json();

        const active = progData.success ? progData.data.length : 0;
        const compRes = await fetch(`${API}/api/progress/completed`, { credentials: 'include', cache: 'no-store' });
        const compData = await compRes.json();
        const completed = compData.success ? compData.data?.length || 0 : 0;

        let income = 0, expense = 0;
        if (finData.success && finData.data) {
            finData.data.forEach(r => { r.type === 'income' ? income += r.amount : expense += r.amount; });
        }
        const pnl = income - expense;

        document.getElementById('statActive').textContent    = active;
        document.getElementById('statCompleted').textContent = completed;
        const pnlEl = document.getElementById('statPnl');
        pnlEl.textContent = `₹${Math.abs(pnl).toLocaleString('en-IN')}`;
        pnlEl.style.color = pnl >= 0 ? '#2ecc71' : '#e74c3c';
        pnlEl.parentElement.querySelector('.s-lbl').textContent = pnl >= 0 ? 'Profit' : 'Loss';
    } catch (e) { /* ignore */ }
}

function liveUpdate() {
    const name    = document.getElementById('fcName').value.trim()    || 'Your Name';
    const dob     = document.getElementById('fcDob').value.trim()     || '—';
    const address = document.getElementById('fcAddress').value.trim() || '—';
    const aadhar  = document.getElementById('fcAadhar').value.trim()  || 'XXXX XXXX XXXX';

    document.getElementById('previewName').textContent    = name;
    document.getElementById('previewDob').textContent     = dob;
    document.getElementById('previewAddress').textContent = address.length > 20 ? address.slice(0, 20) + '…' : address;
    document.getElementById('previewAadhar').textContent  = aadhar;

    if (currentUserId) generateQR(currentUserId);
}

function generateQR(userId) {
    const box = document.getElementById('qrCodeBox');
    box.innerHTML = '';
    // Use current host as-is — works for both localhost (PC) and LAN IP (mobile)
    const url = `${window.location.protocol}//${window.location.host}/farmer-card-public.html?id=${userId}`;
    new QRCode(box, { text: url, width: 68, height: 68, colorDark: '#1a5c2e', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.M });

    // Show the URL below QR so user knows what IP is encoded
    let hint = document.getElementById('qrUrlHint');
    if (!hint) {
        hint = document.createElement('div');
        hint.id = 'qrUrlHint';
        hint.style.cssText = 'font-size:10px;color:#aaa;margin-top:6px;word-break:break-all;text-align:center;max-width:200px;';
        box.parentElement.appendChild(hint);
    }
    hint.textContent = window.location.hostname === 'localhost'
        ? '⚠️ Open via IP for mobile scan'
        : url;
}

async function saveCard() {
    const name    = document.getElementById('fcName').value.trim();
    const dob     = document.getElementById('fcDob').value.trim();
    const address = document.getElementById('fcAddress').value.trim();
    const rawNum  = document.getElementById('fcAadhar').value.replace(/\s/g, '');
    const msgEl   = document.getElementById('saveMsg');

    if (rawNum && !/^\d{12}$/.test(rawNum)) {
        showMsg(msgEl, 'Aadhar number must be exactly 12 digits.', 'error'); return;
    }

    try {
        const res = await fetch(`${API}/api/auth/aadhar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ aadharNumber: rawNum, aadharName: name, aadharDob: dob, aadharAddress: address, aadharPhoto: photoBase64 })
        });
        if (!res.ok) {
            const text = await res.text();
            showMsg(msgEl, `Error ${res.status}: ${text}`, 'error'); return;
        }
        const data = await res.json();
        if (data.success) {
            showMsg(msgEl, '✅ Farmer card saved! QR code is ready.', 'success');
            if (currentUserId) generateQR(currentUserId);
        } else {
            showMsg(msgEl, data.message || 'Failed to save.', 'error');
        }
    } catch (e) {
        showMsg(msgEl, `Server error: ${e.message}`, 'error');
    }
}

function handlePhoto(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Please select an image file.'); return; }
    if (file.size > 2 * 1024 * 1024) { alert('Photo too large. Max 2MB.'); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
        // Compress image before storing
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX = 300;
            let w = img.width, h = img.height;
            if (w > h) { if (w > MAX) { h = h * MAX / w; w = MAX; } }
            else       { if (h > MAX) { w = w * MAX / h; h = MAX; } }
            canvas.width = w; canvas.height = h;
            canvas.getContext('2d').drawImage(img, 0, 0, w, h);
            photoBase64 = canvas.toDataURL('image/jpeg', 0.7);
            setPhotoPreview(photoBase64);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function setPhotoPreview(src) {
    const preview = document.getElementById('photoPreview');
    const cardPhoto = document.getElementById('cardPhoto');
    if (src) {
        preview.innerHTML = `<img src="${src}" alt="photo" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block;">`;
        cardPhoto.innerHTML = `<img src="${src}" alt="photo" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block;">`;
    } else {
        preview.innerHTML = DEFAULT_AVATAR;
        cardPhoto.innerHTML = DEFAULT_CARD_AVATAR;
    }
}

function formatAadhar() {
    const el = document.getElementById('fcAadhar');
    let v = el.value.replace(/\D/g, '').slice(0, 12);
    el.value = v.replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatDob() {
    const el = document.getElementById('fcDob');
    let v = el.value.replace(/\D/g, '').slice(0, 8);
    if (v.length > 4)      v = v.slice(0,2) + '/' + v.slice(2,4) + '/' + v.slice(4);
    else if (v.length > 2) v = v.slice(0,2) + '/' + v.slice(2);
    el.value = v;
}

function downloadCard() {
    const card = document.querySelector('.farmer-card');
    // Simple screenshot via html2canvas if available, else open print
    if (window.html2canvas) {
        html2canvas(card, { scale: 2 }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'farmer-id-card.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    } else {
        window.print();
    }
}

function showMsg(el, text, type) {
    el.textContent = text;
    el.className = `msg ${type}`;
    setTimeout(() => { el.className = 'msg'; }, 4000);
}
