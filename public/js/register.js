checkAuth();

async function checkAuth() {
    try {
        const response = await fetch(API_BASE + '/api/auth/me', { credentials: 'include' });
        if (response.ok) {
            window.location.href = API_BASE ? '/home.html' : '/home';
        }
    } catch (error) {
        // Not logged in, stay on register page
    }
}

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const mobile = document.getElementById('mobile').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!username) { showMessage('Please enter username', 'error'); return; }
    if (mobile.length !== 10) { showMessage('Mobile number must be 10 digits', 'error'); return; }
    if (password.length < 6) { showMessage('Password must be at least 6 characters', 'error'); return; }
    if (password !== confirmPassword) { showMessage('Passwords do not match', 'error'); return; }

    const btn = e.target.querySelector('button');
    btn.disabled = true;
    btn.textContent = 'Registering...';

    try {
        const response = await fetch(API_BASE + '/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username, mobile, password, confirmPassword })
        });

        const data = await response.json();

        if (data.success) {
            showMessage('Registration successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.replace(API_BASE ? '/home.html' : '/home');
            }, 1000);
        } else {
            showMessage(data.message, 'error');
            btn.disabled = false;
            btn.textContent = 'Register';
        }
    } catch (error) {
        showMessage('Connection error. Please try again.', 'error');
        btn.disabled = false;
        btn.textContent = 'Register';
    }
});

function showMessage(message, type) {
    const existingMsg = document.querySelector('.message');
    if (existingMsg) existingMsg.remove();

    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${type}`;
    msgDiv.textContent = message;

    const form = document.getElementById('registerForm');
    form.parentNode.insertBefore(msgDiv, form);

    setTimeout(() => msgDiv.remove(), 5000);
}
