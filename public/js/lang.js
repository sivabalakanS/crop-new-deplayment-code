// Shared language applier — include on every page after translations.js
function applyLang(lang) {
    lang = lang || localStorage.getItem('language') || 'en';
    const t = translations[lang] || translations['en'];

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key] !== undefined) el.textContent = t[key];
    });

    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        const key = el.getAttribute('data-i18n-ph');
        if (t[key] !== undefined) el.placeholder = t[key];
    });

    // Update language selector if present on this page
    const sel = document.getElementById('languageSelect');
    if (sel) sel.value = lang;
}

// Apply on page load
applyLang();

// Re-apply when language changes in another tab
window.addEventListener('storage', e => {
    if (e.key === 'language') applyLang(e.newValue);
});

// Handle language selector change on any page
document.addEventListener('DOMContentLoaded', () => {
    const sel = document.getElementById('languageSelect');
    if (sel) {
        sel.value = localStorage.getItem('language') || 'en';
        sel.addEventListener('change', (e) => {
            localStorage.setItem('language', e.target.value);
            applyLang(e.target.value);
        });
    }
});
