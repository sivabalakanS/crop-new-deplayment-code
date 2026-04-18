// ─── CONFIG ───────────────────────────────────────────────────────────────────
// Replace with your Google Maps API key (enable Maps JS API + Places API)
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';
const SEARCH_RADIUS = 5000; // metres (5 km)

// ─── STATE ────────────────────────────────────────────────────────────────────
let map, userMarker, placesService;

// ─── ENTRY POINT ──────────────────────────────────────────────────────────────
function findShops() {
    const btn = document.getElementById('locateBtn');
    btn.disabled = true;
    btn.textContent = '⏳ Locating...';
    setStatus('loading', '📍 Getting your location...');

    if (!navigator.geolocation) {
        setStatus('error', '❌ Geolocation is not supported by your browser.');
        btn.disabled = false;
        btn.textContent = '📍 Find Shops Near Me';
        return;
    }

    navigator.geolocation.getCurrentPosition(onLocationSuccess, onLocationError, {
        enableHighAccuracy: true, timeout: 10000
    });
}

function onLocationSuccess(position) {
    const { latitude: lat, longitude: lng } = position.coords;
    setStatus('loading', '🗺️ Loading map and searching for shops...');
    loadGoogleMapsScript(lat, lng);
}

function onLocationError(err) {
    const msgs = {
        1: '❌ Location permission denied. Please allow location access and try again.',
        2: '❌ Location unavailable. Check your GPS/network.',
        3: '❌ Location request timed out. Try again.'
    };
    setStatus('error', msgs[err.code] || '❌ Could not get your location.');
    resetBtn();
}

// ─── GOOGLE MAPS LOADER ───────────────────────────────────────────────────────
function loadGoogleMapsScript(lat, lng) {
    if (window.google && window.google.maps) {
        initMap(lat, lng);
        return;
    }

    if (GOOGLE_MAPS_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY') {
        // Fallback: show OpenStreetMap link + static demo cards
        showFallbackMode(lat, lng);
        return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=_mapsReady`;
    script.async = true;
    script.onerror = () => {
        setStatus('error', '❌ Failed to load Google Maps. Check your API key.');
        resetBtn();
    };
    window._mapsReady = () => initMap(lat, lng);
    document.head.appendChild(script);
}

// ─── MAP INIT + PLACES SEARCH ─────────────────────────────────────────────────
function initMap(lat, lng) {
    const center = { lat, lng };
    const mapEl = document.getElementById('map');
    mapEl.innerHTML = '';

    map = new google.maps.Map(mapEl, {
        center, zoom: 14,
        styles: [{ featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] }]
    });

    userMarker = new google.maps.Marker({
        position: center, map,
        title: 'Your Location',
        icon: { path: google.maps.SymbolPath.CIRCLE, scale: 10, fillColor: '#2ecc71', fillOpacity: 1, strokeColor: '#fff', strokeWeight: 2 }
    });

    new google.maps.Circle({ map, center, radius: SEARCH_RADIUS, fillColor: '#2ecc71', fillOpacity: 0.08, strokeColor: '#2ecc71', strokeWeight: 1 });

    placesService = new google.maps.places.PlacesService(map);
    searchFertilizerShops(center);
}

function searchFertilizerShops(center) {
    const queries = ['fertilizer shop', 'agri input store', 'krishi kendra', 'pesticide shop'];
    const allResults = [];
    let pending = queries.length;

    queries.forEach(query => {
        placesService.textSearch({ query, location: center, radius: SEARCH_RADIUS }, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                allResults.push(...results);
            }
            pending--;
            if (pending === 0) renderShops(allResults, center);
        });
    });
}

// ─── RENDER SHOPS ─────────────────────────────────────────────────────────────
function renderShops(results, userLocation) {
    // Deduplicate by place_id
    const seen = new Set();
    const unique = results.filter(p => {
        if (seen.has(p.place_id)) return false;
        seen.add(p.place_id);
        return true;
    });

    // Sort by distance
    unique.forEach(p => {
        p._dist = haversine(userLocation.lat, userLocation.lng, p.geometry.location.lat(), p.geometry.location.lng());
    });
    unique.sort((a, b) => a._dist - b._dist);

    const nearby = unique.filter(p => p._dist <= SEARCH_RADIUS / 1000);

    const title = document.getElementById('shopsTitle');
    const grid = document.getElementById('shopsGrid');

    if (nearby.length === 0) {
        title.style.display = 'none';
        grid.innerHTML = `<div class="no-shops"><span>🔍</span><p>No fertilizer shops found within 5 km.<br>Try searching on Google Maps directly.</p><a href="https://www.google.com/maps/search/fertilizer+shop+near+me" target="_blank" class="btn-directions" style="display:inline-block;margin-top:16px;padding:12px 24px;text-decoration:none;">Open Google Maps</a></div>`;
        setStatus('success', `✅ Search complete. No shops found within 5 km.`);
        resetBtn();
        return;
    }

    title.textContent = `🏪 Found ${nearby.length} Shops Nearby`;
    title.style.display = 'block';

    grid.innerHTML = nearby.map(shop => {
        const dist = shop._dist.toFixed(1);
        const rating = shop.rating ? `<div class="shop-rating"><span class="stars">${'★'.repeat(Math.round(shop.rating))}${'☆'.repeat(5 - Math.round(shop.rating))}</span><span>${shop.rating}</span><span class="rating-count">(${shop.user_ratings_total || 0})</span></div>` : '';
        const openNow = shop.opening_hours
            ? `<span class="open-status ${shop.opening_hours.open_now ? 'open' : 'closed'}">${shop.opening_hours.open_now ? '🟢 Open Now' : '🔴 Closed'}</span>`
            : `<span class="open-status unknown">⚪ Hours Unknown</span>`;
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${shop.geometry.location.lat()},${shop.geometry.location.lng()}`;

        // Add marker on map
        new google.maps.Marker({
            position: shop.geometry.location, map,
            title: shop.name,
            icon: { url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png' }
        });

        return `
        <div class="shop-card">
            <div class="shop-card-header">
                <div class="shop-icon">🏪</div>
                <div>
                    <div class="shop-name">${shop.name}</div>
                    <div class="shop-distance">📍 ${dist} km away</div>
                </div>
            </div>
            <div class="shop-address">📌 ${shop.formatted_address || shop.vicinity || 'Address not available'}</div>
            ${rating}
            ${openNow}
            <div class="shop-actions">
                <a href="${mapsUrl}" target="_blank" class="btn-directions">🗺️ Get Directions</a>
                ${shop.formatted_phone_number ? `<a href="tel:${shop.formatted_phone_number}" class="btn-call-shop">📞 Call</a>` : ''}
            </div>
        </div>`;
    }).join('');

    setStatus('success', `✅ Found ${nearby.length} fertilizer shops within 5 km of your location.`);
    resetBtn();
}

// ─── FALLBACK (no API key) ────────────────────────────────────────────────────
function showFallbackMode(lat, lng) {
    const mapEl = document.getElementById('map');
    mapEl.innerHTML = `
        <div style="width:100%;height:100%;border-radius:16px;overflow:hidden;">
            <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.05},${lat-0.05},${lng+0.05},${lat+0.05}&layer=mapnik&marker=${lat},${lng}"
                style="width:100%;height:100%;border:none;">
            </iframe>
        </div>`;

    const grid = document.getElementById('shopsGrid');
    const title = document.getElementById('shopsTitle');
    title.textContent = '🔍 Search on Google Maps';
    title.style.display = 'block';

    grid.innerHTML = `
        <div class="shop-card" style="grid-column:1/-1;text-align:center;border-left-color:#f39c12;">
            <div style="font-size:48px;margin-bottom:12px;">⚠️</div>
            <h4 style="color:#e67e22;margin-bottom:8px;">Google Maps API Key Required</h4>
            <p style="color:#666;margin-bottom:16px;font-size:14px;">
                To show real nearby shops, add your Google Maps API key in <strong>js/fertilizer-shops.js</strong> (line 2).<br>
                Enable <strong>Maps JavaScript API</strong> and <strong>Places API</strong> in Google Cloud Console.
            </p>
            <a href="https://www.google.com/maps/search/fertilizer+shop/@${lat},${lng},14z" target="_blank" class="btn-directions" style="display:inline-block;padding:12px 28px;text-decoration:none;border-radius:8px;">
                🗺️ Search on Google Maps
            </a>
        </div>
        <div class="shop-card">
            <div class="shop-card-header"><div class="shop-icon">🏪</div><div><div class="shop-name">Agri Input Center</div><div class="shop-distance">📍 ~0.8 km away</div></div></div>
            <div class="shop-address">📌 Near your location</div>
            <span class="open-status open">🟢 Open Now</span>
            <div class="shop-actions"><a href="https://www.google.com/maps/search/fertilizer+shop+near+me" target="_blank" class="btn-directions">🗺️ Find on Maps</a></div>
        </div>
        <div class="shop-card">
            <div class="shop-card-header"><div class="shop-icon">🌱</div><div><div class="shop-name">Krishi Kendra</div><div class="shop-distance">📍 ~1.5 km away</div></div></div>
            <div class="shop-address">📌 Near your location</div>
            <span class="open-status unknown">⚪ Hours Unknown</span>
            <div class="shop-actions"><a href="https://www.google.com/maps/search/krishi+kendra+near+me" target="_blank" class="btn-directions">🗺️ Find on Maps</a></div>
        </div>`;

    setStatus('success', `✅ Location found (${lat.toFixed(4)}, ${lng.toFixed(4)}). Add API key for real shop data.`);
    resetBtn();
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371, dLat = rad(lat2 - lat1), dLon = rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function rad(d) { return d * Math.PI / 180; }

function setStatus(type, msg) {
    const bar = document.getElementById('statusBar');
    bar.style.display = 'flex';
    bar.className = `status-bar ${type}`;
    bar.textContent = msg;
}

function resetBtn() {
    const btn = document.getElementById('locateBtn');
    btn.disabled = false;
    btn.textContent = '🔄 Refresh';
}
