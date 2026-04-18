const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? ''
    : '';  // same origin — Render serves frontend and backend together
