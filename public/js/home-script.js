// Check authentication
checkAuth();

async function checkAuth() {
    try {
        const response = await fetch((typeof API_BASE !== 'undefined' ? API_BASE : '') + '/api/auth/me', { 
            credentials: 'include',
            cache: 'no-store'
        });
        if (!response.ok) {
            window.location.replace('/');
            return;
        }
        const data = await response.json();
        if (data.success && data.user) {
            const nameEl = document.getElementById('username');
            if (nameEl) nameEl.textContent = data.user.username || 'Farmer';
        }
    } catch (error) {
        window.location.replace('/');
    }
}

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

// Close sidebar on nav item click (mobile)
const navItems = document.querySelectorAll('.nav-item');
navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (window.innerWidth <= 768) closeSidebar();
    });
});

// Logout
if (document.getElementById('logoutBtn')) {
    document.getElementById('logoutBtn').addEventListener('click', async () => {
        try {
            await fetch((typeof API_BASE !== 'undefined' ? API_BASE : '') + '/api/auth/logout', { credentials: 'include' });
            window.location.replace('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    });
}

// Prevent back button
window.history.pushState(null, '', window.location.href);
window.onpopstate = function() {
    window.history.pushState(null, '', window.location.href);
};

// Fetch weather
localStorage.removeItem('weatherCache');
localStorage.removeItem('weatherCacheV2');
fetchWeather();

async function fetchWeather() {
    const t = (typeof translations !== 'undefined' ? translations[localStorage.getItem('language') || 'en'] : null)
        || { temperature: 'Temperature', humidity: 'Humidity', windSpeed: 'Wind Speed' };

    const cached = localStorage.getItem('wc3');
    if (cached) {
        try {
            const { data, ts } = JSON.parse(cached);
            if (Date.now() - ts < 30 * 60 * 1000 && data.current && data.current.weather_code !== undefined) {
                renderWeather(data, t); return;
            }
        } catch(e) { localStorage.removeItem('wc3'); }
    }

    try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=11.0168&longitude=76.9558&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,is_day&timezone=Asia/Kolkata');
        const data = await res.json();
        localStorage.setItem('wc3', JSON.stringify({ data, ts: Date.now() }));
        renderWeather(data, t);
    } catch (e) {
        document.getElementById('weatherInfo').innerHTML = '<div class="weather-loading">Unable to load weather.</div>';
    }
}

function getWeatherType(code, isDay) {
    if (!isDay) return 'night';
    if (code <= 1) return 'sunny';
    if (code <= 3 || (code >= 45 && code <= 48) || (code >= 71 && code <= 77)) return 'cloudy';
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'rainy';
    if (code >= 95) return 'stormy';
    return 'sunny';
}

function getWeatherTip(type, temp) {
    const tips = {
        sunny: temp > 35 ? '🌞 Very hot today! Water crops early morning or evening.' : '☀️ Sunny day! Great time for harvesting and field work.',
        rainy:  '🌧️ Rainy day! Avoid pesticide spraying. Check field drainage.',
        stormy: '⛈️ Storm alert! Secure your crops and avoid field work today.',
        cloudy: '⛅ Cloudy weather. Good time for transplanting seedlings.',
        night:  '🌙 Night time. Protect crops from pests and cold.'
    };
    return tips[type] || '🌾 Check your crops regularly for best yield.';
}

function buildParticles(type) {
    if (type === 'rainy' || type === 'stormy') {
        return Array.from({length: 20}, () =>
            `<div class="rain-drop" style="left:${(Math.random()*100).toFixed(1)}%;animation-delay:${(Math.random()*1.5).toFixed(2)}s;animation-duration:${(0.5+Math.random()*0.6).toFixed(2)}s"></div>`
        ).join('');
    }
    if (type === 'night') {
        return Array.from({length: 22}, () =>
            `<div class="star" style="left:${(Math.random()*100).toFixed(1)}%;top:${(Math.random()*85).toFixed(1)}%;animation-delay:${(Math.random()*3).toFixed(2)}s"></div>`
        ).join('');
    }
    if (type === 'sunny') return '<div class="sun-glow"></div>';
    return '';
}

function renderWeather(data, t) {
    const code  = data.current.weather_code  ?? 0;
    const isDay = data.current.is_day        ?? 1;
    const temp  = data.current.temperature_2m;
    const type  = getWeatherType(code, isDay);

    document.querySelector('.weather-card').className = 'weather-card weather-' + type;

    document.getElementById('weatherInfo').innerHTML = `
        <div class="weather-particles">${buildParticles(type)}</div>
        <div class="weather-tip">${getWeatherTip(type, temp)}</div>
        <div class="weather-items-row">
            <div class="weather-item"><div class="weather-item-icon">🌡️</div><div class="weather-item-label">${t.temperature}</div><div class="weather-item-value">${temp}°C</div></div>
            <div class="weather-item"><div class="weather-item-icon">💧</div><div class="weather-item-label">${t.humidity}</div><div class="weather-item-value">${data.current.relative_humidity_2m}%</div></div>
            <div class="weather-item"><div class="weather-item-icon">🌬️</div><div class="weather-item-label">${t.windSpeed}</div><div class="weather-item-value">${data.current.wind_speed_10m} km/h</div></div>
        </div>
    `;
}

// Government Schemes Modal Functions
function showModal(scheme) {
    const modal = document.getElementById('schemeModal');
    const modalContent = document.getElementById('modalContent');
    
    const schemes = {
        pmkisan: {
            title: 'How to Apply for PM-KISAN',
            steps: [
                'Visit the official PM-KISAN website: <a href="https://pmkisan.gov.in" target="_blank">pmkisan.gov.in</a>',
                'Click on "Farmers Corner" and select "New Farmer Registration"',
                'Enter your Aadhaar number and mobile number',
                'Fill in personal details, bank account information, and land details',
                'Upload required documents (Aadhaar, Bank Passbook, Land Records)',
                'Submit the application and note the registration number',
                'Track your application status using the registration number',
                'You can also apply through your village Patwari or Agriculture Office'
            ],
            website: 'https://pmkisan.gov.in'
        },
        pmfby: {
            title: 'How to Apply for PMFBY',
            steps: [
                'Visit the official PMFBY website: <a href="https://pmfby.gov.in" target="_blank">pmfby.gov.in</a>',
                'Click on "Farmer Application" or "Apply for Crop Insurance"',
                'Register with your mobile number and Aadhaar card',
                'Fill in your personal details, land details, and crop information',
                'Select the season (Kharif/Rabi) and crop you want to insure',
                'Pay the premium amount online',
                'Download and save the insurance certificate',
                'You can also apply through your nearest bank, CSC center, or agriculture office'
            ],
            website: 'https://pmfby.gov.in'
        },
        pmksy: {
            title: 'How to Apply for PMKSY',
            steps: [
                'Visit the official PMKSY website: <a href="https://pmksy.gov.in" target="_blank">pmksy.gov.in</a>',
                'Go to the "Application" or "Schemes" section',
                'Select the component you want to apply for (Drip/Sprinkler irrigation, Watershed, etc.)',
                'Register with your details (Name, Aadhaar, Land records)',
                'Upload required documents (Land ownership proof, Bank details, Aadhaar)',
                'Submit the application form online',
                'Track your application status using the reference number',
                'Alternatively, visit your District Agriculture Office or Krishi Vigyan Kendra for offline application'
            ],
            website: 'https://pmksy.gov.in'
        }
    };
    
    const schemeData = schemes[scheme];
    
    modalContent.innerHTML = `
        <h3>${schemeData.title}</h3>
        <ol>
            ${schemeData.steps.map(step => `<li>${step}</li>`).join('')}
        </ol>
        <p><strong>Official Website:</strong> <a href="${schemeData.website}" target="_blank">${schemeData.website}</a></p>
    `;
    
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('schemeModal');
    modal.classList.remove('active');
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('schemeModal');
    if (e.target === modal) {
        closeModal();
    }
});

// Expert Advisory Modal Functions
function showExpertModal(type) {
    const modal = document.getElementById('expertModal');
    const modalContent = document.getElementById('expertModalContent');
    
    const content = {
        kcc: {
            title: 'How to Apply for Kisan Credit Card (KCC)',
            info: [
                '<h4>Eligibility:</h4>',
                '<ul>',
                '<li>All farmers (individual/joint borrowers)</li>',
                '<li>Tenant farmers, oral lessees, and sharecroppers</li>',
                '<li>Self Help Groups or Joint Liability Groups</li>',
                '</ul>',
                '<h4>Required Documents:</h4>',
                '<ul>',
                '<li>Aadhaar Card</li>',
                '<li>Land ownership documents</li>',
                '<li>Bank account details</li>',
                '<li>Passport size photographs</li>',
                '</ul>',
                '<h4>How to Apply:</h4>',
                '<ol>',
                '<li>Visit your nearest bank branch (any nationalized bank)</li>',
                '<li>Fill the KCC application form</li>',
                '<li>Submit required documents</li>',
                '<li>Bank will verify and process within 7-14 days</li>',
                '<li>Receive your KCC card and start using credit facility</li>',
                '</ol>'
            ]
        },
        term: {
            title: 'Agriculture Term Loan - Application Process',
            info: [
                '<h4>Loan Purpose:</h4>',
                '<ul>',
                '<li>Purchase of tractors and farm equipment</li>',
                '<li>Land development and leveling</li>',
                '<li>Construction of farm buildings</li>',
                '<li>Installation of irrigation systems</li>',
                '</ul>',
                '<h4>Documents Required:</h4>',
                '<ul>',
                '<li>Land ownership documents</li>',
                '<li>Income proof and bank statements</li>',
                '<li>Quotation for equipment/work</li>',
                '<li>Aadhaar and PAN card</li>',
                '</ul>',
                '<h4>Application Steps:</h4>',
                '<ol>',
                '<li>Visit bank or NABARD office</li>',
                '<li>Submit loan application with documents</li>',
                '<li>Bank will assess and approve loan</li>',
                '<li>Loan disbursement in stages based on work progress</li>',
                '</ol>'
            ]
        },
        contact: {
            title: 'Contact Agriculture Department',
            info: [
                '<h4>National Helplines:</h4>',
                '<ul>',
                '<li><strong>Kisan Call Centre:</strong> 1800-180-1551 (Toll Free)</li>',
                '<li><strong>PM-KISAN Helpline:</strong> 011-24300606</li>',
                '<li><strong>Crop Insurance:</strong> 1800-200-7710</li>',
                '</ul>',
                '<h4>Visit Local Offices:</h4>',
                '<ul>',
                '<li>District Agriculture Office</li>',
                '<li>Krishi Vigyan Kendra (KVK)</li>',
                '<li>Block Development Office</li>',
                '<li>Common Service Centre (CSC)</li>',
                '</ul>',
                '<h4>Online Resources:</h4>',
                '<ul>',
                '<li><a href="https://agricoop.nic.in" target="_blank">Ministry of Agriculture</a></li>',
                '<li><a href="https://farmer.gov.in" target="_blank">Farmer Portal</a></li>',
                '<li><a href="https://mkisan.gov.in" target="_blank">mKisan Portal</a></li>',
                '</ul>'
            ]
        }
    };
    
    const data = content[type];
    modalContent.innerHTML = `
        <h3>${data.title}</h3>
        ${data.info.join('')}
    `;
    
    modal.classList.add('active');
}

function closeExpertModal() {
    const modal = document.getElementById('expertModal');
    modal.classList.remove('active');
}

// Close expert modal when clicking outside
window.addEventListener('click', (e) => {
    const expertModal = document.getElementById('expertModal');
    if (e.target === expertModal) {
        closeExpertModal();
    }
});
