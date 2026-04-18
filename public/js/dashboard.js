// Check authentication
checkAuth();

async function checkAuth() {
    try {
        const response = await fetch('/api/auth/me', {
            credentials: 'include'
        });
        
        if (!response.ok) {
            window.location.replace('/');
            return;
        }
        
        const data = await response.json();
        if (data.success && data.user) {
            const usernameEl = document.getElementById('username');
            if (usernameEl) {
                usernameEl.textContent = data.user.username;
            }
        }
    } catch (error) {
        window.location.replace('/');
    }
}

// Sidebar toggle
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
});

overlay.addEventListener('click', () => {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
});

// Close sidebar when clicking nav item on mobile
const navItems = document.querySelectorAll('.nav-item');
navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        }
    });
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', async () => {
    try {
        const response = await fetch('/api/auth/logout', {
            credentials: 'include'
        });
        
        if (response.ok) {
            window.location.replace('/');
        }
    } catch (error) {
        console.error('Logout error:', error);
    }
});

// Prevent back button
window.history.pushState(null, '', window.location.href);
window.onpopstate = function() {
    window.history.pushState(null, '', window.location.href);
};
