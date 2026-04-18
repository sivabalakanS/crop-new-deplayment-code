// API base URL — change this after deploying backend to Render
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? ''   // localhost — use relative URLs
    : 'https://smart-agri-region.onrender.com';  // production Render backend
