const locationData = { 'Tamil Nadu': {}, 'Kerala': {}, 'Karnataka': {} };
const _loaded = {};

async function loadLocationData(state) {
    if (!state) return locationData;
    if (_loaded[state]) return locationData;

    try {
        if (state === 'Tamil Nadu') {
            const [tn1, tn2, tn3] = await Promise.all([
                fetch('data/tn-data.json').then(r => r.json()),
                fetch('data/tn-data2.json').then(r => r.json()),
                fetch('data/tn-data3.json').then(r => r.json())
            ]);
            Object.assign(locationData['Tamil Nadu'], tn1, tn2, tn3);
        } else if (state === 'Kerala') {
            const kerala = await fetch('data/kerala-data.json').then(r => r.json());
            Object.assign(locationData['Kerala'], kerala);
        } else if (state === 'Karnataka') {
            const [k1, k2] = await Promise.all([
                fetch('data/karnataka-data.json').then(r => r.json()),
                fetch('data/karnataka-data2.json').then(r => r.json())
            ]);
            Object.assign(locationData['Karnataka'], k1, k2);
        }
        _loaded[state] = true;
    } catch (error) {
        console.error('Error loading location data:', error);
        return null;
    }
    return locationData;
}
