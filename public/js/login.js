checkAuth();

async function checkAuth() {
    try {
        const response = await fetch('/api/auth/me', { credentials: 'include' });
        if (response.ok) {
            window.location.replace('/home');
        }
    } catch (error) {
        // Not logged in, stay on login page
    }
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const mobile = document.getElementById('mobile').value;
    const password = document.getElementById('password').value;

    if (mobile.length !== 10) {
        showMessage('Please enter a valid 10-digit mobile number', 'error');
        return;
    }

    const btn = e.target.querySelector('button');
    btn.disabled = true;
    btn.textContent = 'Logging in...';

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ mobile, password })
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            showMessage('Login successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.replace('/home');
            }, 1000);
        } else {
            showMessage(data.message, 'error');
            btn.disabled = false;
            btn.textContent = 'Login';
        }
    } catch (error) {
        showMessage('Connection error. Please try again.', 'error');
        btn.disabled = false;
        btn.textContent = 'Login';
    }
});

function showMessage(message, type) {
    const existingMsg = document.querySelector('.message');
    if (existingMsg) existingMsg.remove();

    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${type}`;
    msgDiv.textContent = message;

    const form = document.getElementById('loginForm');
    form.parentNode.insertBefore(msgDiv, form);

    setTimeout(() => msgDiv.remove(), 5000);
}
