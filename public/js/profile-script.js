// Check authentication
checkAuth();

async function checkAuth() {
    try {
        const response = await fetch('/api/auth/me', { credentials: 'include' });
        if (!response.ok) { window.location.replace('/'); return; }

        const data = await response.json();
        if (data.success && data.user) {
            // Clear ALL old localStorage profile picture keys
            Object.keys(localStorage).forEach(k => {
                if (k.startsWith('profilePicture')) localStorage.removeItem(k);
            });

            document.getElementById('profileUsername').textContent = data.user.username;
            document.getElementById('profileMobile').textContent = data.user.mobile;
            document.getElementById('profileCreated').textContent = data.user.createdAt
                ? new Date(data.user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
                : 'N/A';

            // Load profile picture from MongoDB (per user)
            const profileImage = document.getElementById('profileImage');
            profileImage.src = data.user.profilePicture || getDefaultAvatar();
        }
    } catch (error) {
        window.location.replace('/');
    }
}

function getDefaultAvatar() {
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ccircle cx="50" cy="50" r="50" fill="%23ecf0f1"/%3E%3Ctext x="50" y="65" font-size="50" text-anchor="middle" fill="%237f8c8d"%3E👤%3C/text%3E%3C/svg%3E';
}

// Handle image upload — saves to MongoDB under logged-in user only
document.getElementById('imageUpload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async function(event) {
        const imageData = event.target.result;
        document.getElementById('profileImage').src = imageData;
        const res = await fetch('/api/auth/profile-picture', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ profilePicture: imageData })
        });
        const result = await res.json();
        if (!result.success) alert('Failed to save profile picture. Try again.');
    };
    reader.readAsDataURL(file);
});

// Sidebar toggle
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');

function openSidebar()  { sidebar.classList.add('active');    overlay.classList.add('active'); }
function closeSidebar() { sidebar.classList.remove('active'); overlay.classList.remove('active'); }

hamburger.addEventListener('click', openSidebar);
overlay.addEventListener('click', closeSidebar);
if (sidebarCloseBtn) sidebarCloseBtn.addEventListener('click', closeSidebar);

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => { if (window.innerWidth <= 768) closeSidebar(); });
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', async () => {
    await fetch('/api/auth/logout', { credentials: 'include' });
    window.location.replace('/');
});

// Prevent back button
window.history.pushState(null, '', window.location.href);
window.onpopstate = () => window.history.pushState(null, '', window.location.href);
