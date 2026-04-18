// Protect route - check authentication
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
            document.getElementById('username').textContent = data.user.username;
        }
    } catch (error) {
        window.location.replace('/');
    }
}

// Logout functionality
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

// Prevent back button after login
window.history.pushState(null, '', window.location.href);
window.onpopstate = function() {
    window.history.pushState(null, '', window.location.href);
};
