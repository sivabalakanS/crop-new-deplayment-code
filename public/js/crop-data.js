// Crop image map — all served locally
const cropImageMap = {
    'Drumstick':     'images/crops/drumstick.jpg',
    'Bitter Gourd':  'images/crops/bittergourd.jpeg',
    'Snake Gourd':   'images/crops/snakegourd.jpeg',
    'Okra':          'images/crops/okra.jpeg',
    'Pumpkin':       'images/crops/pumpkin.jpg',
    'Spinach':       'images/crops/spinach.jpeg',
    'Papaya':        'images/crops/papaya.jpg',
    'Guava':         'images/crops/guava.jpg',
    'Sapota':        'images/crops/sapota.jpg',
    'Watermelon':    'images/crops/watermelon.jpg',
    'Pineapple':     'images/crops/pineapple.jpeg',
    'Rice': 'images/crops/rice.jpg',
    'Wheat': 'images/crops/wheat.jpg',
    'Maize': 'images/crops/maize.jpg',
    'Millets': 'images/crops/millets.jpeg',
    'Tomato': 'images/crops/tomato.jpg',
    'Onion': 'images/crops/onion.jpg',
    'Potato': 'images/crops/potato.jpg',
    'Cabbage': 'images/crops/cabbage.jpeg',
    'Carrot': 'images/crops/carrot.jpg',
    'Brinjal': 'images/crops/brinjal.jpg',
    'Mango': 'images/crops/mango.jpg',
    'Banana': 'images/crops/banana.jpg',
    'Orange': 'images/crops/orange.jpg',
    'Grapes': 'images/crops/grapes.jpg',
    'Pomegranate': 'images/crops/pomegranate.jpg',
    'Chickpea': 'images/crops/chickpea.jpg',
    'Pigeon Pea': 'images/crops/pigeonpea.jpeg',
    'Black Gram': 'images/crops/blackgram.jpeg',
    'Green Gram': 'images/crops/greengram.jpg',
    'Groundnut': 'images/crops/groundnut.jpg',
    'Sunflower': 'images/crops/sunflower.jpeg',
    'Sesame': 'images/crops/sesame.jpg',
    'Castor': 'images/crops/castor.jpg',
    'Rose': 'images/crops/rose.jpg',
    'Jasmine': 'images/crops/jasmine.jpeg',
    'Marigold': 'images/crops/marigold.jpg',
    'Chrysanthemum': 'images/crops/chrysanthemum.jpeg',
    'Coffee': 'images/crops/coffee.jpg',
    'Tea': 'images/crops/tea.jpeg',
    'Coconut': 'images/crops/coconut.jpg',
    'Rubber': 'images/crops/rubber.jpg',
    'Turmeric': 'images/crops/turmeric.jpg',
    'Ginger': 'images/crops/ginger.jpg',
    'Chilli': 'images/crops/chilli.jpg',
    'Coriander': 'images/crops/coriander.jpeg',
    'Black Pepper': 'images/crops/blackpepper.jpg',
    'Cardamom': 'images/crops/cardamom.jpg'
};

function getCropImageUrl(cropName) {
    return cropImageMap[cropName] || 'images/crops/rice.jpg';
}

const cropData = {
    'Cereals': {
        'Rice':    { soils: ['Deltaic Alluvial Soil', 'Coastal Alluvial Soil', 'Black Cotton Soil'], season: 'Kharif, Rabi',  duration: '120-150 days', yield: '3-5 tons/hectare' },
        'Wheat':   { soils: ['Alluvial Soil', 'Black Cotton Soil', 'Red Loamy Soil'],                season: 'Rabi',          duration: '120-140 days', yield: '2-4 tons/hectare' },
        'Maize':   { soils: ['Red Loamy Soil', 'Black Soil', 'Alluvial Soil'],                       season: 'Kharif, Rabi',  duration: '90-120 days',  yield: '3-6 tons/hectare' },
        'Millets': { soils: ['Red Sandy Soil', 'Red Loamy Soil', 'Black Soil'],                      season: 'Kharif',        duration: '70-120 days',  yield: '1-3 tons/hectare' }
    },
    'Vegetables': {
        'Tomato':     { soils: ['Red Loamy Soil', 'Black Soil', 'Alluvial Soil'],          season: 'Year-round',   duration: '90-120 days',  yield: '20-40 tons/hectare' },
        'Onion':      { soils: ['Red Loamy Soil', 'Black Cotton Soil', 'Alluvial Soil'],   season: 'Rabi, Summer', duration: '120-150 days', yield: '15-25 tons/hectare' },
        'Potato':     { soils: ['Red Loamy Soil', 'Alluvial Soil', 'Mountain Soil'],       season: 'Rabi',         duration: '90-120 days',  yield: '20-30 tons/hectare' },
        'Cabbage':    { soils: ['Red Loamy Soil', 'Alluvial Soil', 'Black Soil'],          season: 'Winter',       duration: '90-120 days',  yield: '25-40 tons/hectare' },
        'Carrot':     { soils: ['Red Loamy Soil', 'Alluvial Soil', 'Red Sandy Soil'],      season: 'Winter',       duration: '90-120 days',  yield: '15-25 tons/hectare' },
        'Brinjal':    { soils: ['Red Loamy Soil', 'Black Soil', 'Alluvial Soil'],          season: 'Year-round',   duration: '120-150 days', yield: '15-25 tons/hectare' },
        'Drumstick':  { soils: ['Red Loamy Soil', 'Red Sandy Soil', 'Black Soil', 'Alluvial Soil'], season: 'Year-round', duration: '6-8 months', yield: '40-50 tons/hectare' },
        'Bitter Gourd': { soils: ['Red Loamy Soil', 'Alluvial Soil', 'Black Soil'],       season: 'Kharif, Summer', duration: '55-75 days', yield: '8-12 tons/hectare' },
        'Snake Gourd':  { soils: ['Red Loamy Soil', 'Alluvial Soil', 'Black Soil'],       season: 'Kharif, Summer', duration: '60-90 days', yield: '10-15 tons/hectare' },
        'Okra':         { soils: ['Red Loamy Soil', 'Black Soil', 'Alluvial Soil'],       season: 'Kharif, Summer', duration: '45-60 days', yield: '8-12 tons/hectare' },
        'Pumpkin':      { soils: ['Alluvial Soil', 'Red Loamy Soil', 'Black Soil'],       season: 'Kharif, Rabi',  duration: '90-120 days', yield: '15-25 tons/hectare' },
        'Spinach':      { soils: ['Alluvial Soil', 'Red Loamy Soil', 'Black Soil'],       season: 'Year-round',    duration: '30-45 days',  yield: '10-15 tons/hectare' }
    },
    'Fruits': {
        'Mango':        { soils: ['Red Loamy Soil', 'Laterite Soil', 'Alluvial Soil'],          season: 'Perennial',  duration: '3-5 years to fruit',  yield: '10-15 tons/hectare' },
        'Banana':       { soils: ['Red Loamy Soil', 'Alluvial Soil', 'Coastal Alluvial Soil'],  season: 'Year-round', duration: '12-15 months',        yield: '30-50 tons/hectare' },
        'Orange':       { soils: ['Red Loamy Soil', 'Laterite Soil', 'Black Soil'],             season: 'Perennial',  duration: '3-4 years to fruit',  yield: '15-25 tons/hectare' },
        'Grapes':       { soils: ['Red Loamy Soil', 'Black Cotton Soil', 'Laterite Soil'],      season: 'Perennial',  duration: '2-3 years to fruit',  yield: '20-30 tons/hectare' },
        'Pomegranate':  { soils: ['Red Loamy Soil', 'Black Soil', 'Mixed Red Black Soil'],      season: 'Perennial',  duration: '2-3 years to fruit',  yield: '10-15 tons/hectare' },
        'Papaya':       { soils: ['Red Loamy Soil', 'Alluvial Soil', 'Black Soil'],             season: 'Year-round', duration: '9-12 months',         yield: '40-60 tons/hectare' },
        'Guava':        { soils: ['Red Loamy Soil', 'Laterite Soil', 'Alluvial Soil'],          season: 'Perennial',  duration: '2-3 years to fruit',  yield: '15-25 tons/hectare' },
        'Sapota':       { soils: ['Red Loamy Soil', 'Laterite Soil', 'Coastal Alluvial Soil'],  season: 'Perennial',  duration: '4-5 years to fruit',  yield: '10-20 tons/hectare' },
        'Watermelon':   { soils: ['Red Sandy Soil', 'Alluvial Soil', 'Red Loamy Soil'],         season: 'Summer',     duration: '70-90 days',          yield: '20-30 tons/hectare' },
        'Pineapple':    { soils: ['Laterite Soil', 'Red Loamy Soil', 'Forest Loam Soil'],       season: 'Perennial',  duration: '18-24 months',        yield: '15-25 tons/hectare' }
    },
    'Pulses': {
        'Chickpea':   { soils: ['Black Cotton Soil', 'Red Loamy Soil', 'Mixed Red Black Soil'], season: 'Rabi',         duration: '90-120 days', yield: '1-2 tons/hectare'   },
        'Pigeon Pea': { soils: ['Red Loamy Soil', 'Black Cotton Soil', 'Mixed Red Black Soil'], season: 'Kharif',       duration: '150-180 days', yield: '1-2 tons/hectare'  },
        'Black Gram': { soils: ['Red Loamy Soil', 'Black Soil', 'Alluvial Soil'],               season: 'Kharif, Summer', duration: '60-90 days', yield: '0.8-1.5 tons/hectare' },
        'Green Gram': { soils: ['Red Loamy Soil', 'Black Soil', 'Alluvial Soil'],               season: 'Kharif, Summer', duration: '60-90 days', yield: '0.8-1.2 tons/hectare' }
    },
    'Oil Seeds': {
        'Groundnut': { soils: ['Red Sandy Soil', 'Red Loamy Soil', 'Black Cotton Soil'],  season: 'Kharif, Rabi',  duration: '100-130 days', yield: '2-3 tons/hectare'   },
        'Sunflower': { soils: ['Red Loamy Soil', 'Black Cotton Soil', 'Alluvial Soil'],   season: 'Kharif, Rabi',  duration: '90-120 days',  yield: '1.5-2.5 tons/hectare' },
        'Sesame':    { soils: ['Red Loamy Soil', 'Black Soil', 'Alluvial Soil'],          season: 'Kharif, Summer', duration: '90-120 days', yield: '0.5-1 ton/hectare'  },
        'Castor':    { soils: ['Red Loamy Soil', 'Black Cotton Soil', 'Mixed Red Black Soil'], season: 'Kharif',   duration: '150-180 days', yield: '1-2 tons/hectare'   }
    },
    'Flowers': {
        'Rose':           { soils: ['Red Loamy Soil', 'Laterite Soil', 'Black Soil'],  season: 'Year-round', duration: 'Perennial',   yield: '15-25 tons/hectare' },
        'Jasmine':        { soils: ['Red Loamy Soil', 'Laterite Soil', 'Black Soil'],  season: 'Year-round', duration: 'Perennial',   yield: '5-8 tons/hectare'   },
        'Marigold':       { soils: ['Red Loamy Soil', 'Black Soil', 'Alluvial Soil'],  season: 'Winter, Summer', duration: '60-90 days', yield: '10-15 tons/hectare' },
        'Chrysanthemum':  { soils: ['Red Loamy Soil', 'Black Soil', 'Alluvial Soil'],  season: 'Winter',     duration: '90-120 days', yield: '8-12 tons/hectare'  }
    },
    'Plantation Crops': {
        'Coffee':  { soils: ['Laterite Soil', 'Forest Loam Soil', 'Red Loamy Soil'],  season: 'Perennial', duration: '3-4 years to fruit', yield: '1-2 tons/hectare'   },
        'Tea':     { soils: ['Laterite Soil', 'Forest Loam Soil', 'Mountain Soil'],   season: 'Perennial', duration: '3-5 years to harvest', yield: '2-3 tons/hectare' },
        'Coconut': { soils: ['Coastal Alluvial Soil', 'Laterite Soil', 'Red Loamy Soil'], season: 'Perennial', duration: '5-6 years to fruit', yield: '8-12 tons/hectare' },
        'Rubber':  { soils: ['Laterite Soil', 'Forest Loam Soil', 'Red Loamy Soil'],  season: 'Perennial', duration: '6-7 years to tap',   yield: '1.5-2.5 tons/hectare' }
    },
    'Spices': {
        'Turmeric':    { soils: ['Red Loamy Soil', 'Laterite Soil', 'Forest Loam Soil'],  season: 'Kharif',    duration: '8-10 months',        yield: '3-5 tons/hectare'     },
        'Ginger':      { soils: ['Red Loamy Soil', 'Laterite Soil', 'Forest Loam Soil'],  season: 'Kharif',    duration: '8-10 months',        yield: '8-12 tons/hectare'    },
        'Chilli':      { soils: ['Red Loamy Soil', 'Black Soil', 'Alluvial Soil'],         season: 'Kharif, Rabi', duration: '120-150 days',    yield: '2-4 tons/hectare'     },
        'Coriander':   { soils: ['Red Loamy Soil', 'Black Soil', 'Alluvial Soil'],         season: 'Rabi',      duration: '90-120 days',        yield: '1-2 tons/hectare'     },
        'Black Pepper':{ soils: ['Laterite Soil', 'Forest Loam Soil', 'Red Loamy Soil'],  season: 'Perennial', duration: '3-4 years to fruit', yield: '2-3 tons/hectare'     },
        'Cardamom':    { soils: ['Forest Loam Soil', 'Laterite Soil', 'Mountain Soil'],   season: 'Perennial', duration: '3-4 years to fruit', yield: '0.2-0.5 tons/hectare' }
    }
};

// Inject image into each crop dynamically
for (const [category, crops] of Object.entries(cropData)) {
    for (const [cropName, cropInfo] of Object.entries(crops)) {
        cropInfo.image = getCropImageUrl(cropName);
    }
}

function getRecommendedCrops(category, soilType) {
    const categoryData = cropData[category];
    if (!categoryData) return [];
    const recommendations = [];
    for (const [cropName, cropInfo] of Object.entries(categoryData)) {
        if (cropInfo.soils.includes(soilType)) {
            recommendations.push({ name: cropName, ...cropInfo, suitability: 'High' });
        }
    }
    if (recommendations.length < 3) {
        for (const [cropName, cropInfo] of Object.entries(categoryData)) {
            if (!recommendations.find(r => r.name === cropName)) {
                recommendations.push({ name: cropName, ...cropInfo, suitability: 'Medium' });
                if (recommendations.length >= 4) break;
            }
        }
    }
    return recommendations.slice(0, 4);
}

function getAllCropsForCategory(category) {
    const categoryData = cropData[category];
    if (!categoryData) return [];
    return Object.entries(categoryData).map(([name, info]) => ({ name, ...info, suitability: 'Medium' }));
}

function getCropsBySeason(season) {
    const seasonCrops = { 'Summer': [], 'Winter': [], 'Monsoon': [] };
    for (const [category, crops] of Object.entries(cropData)) {
        for (const [cropName, cropInfo] of Object.entries(crops)) {
            const s = cropInfo.season.toLowerCase();
            if (s.includes('summer') || s.includes('kharif') || s.includes('year-round') || s.includes('perennial'))
                seasonCrops['Summer'].push({ name: cropName, category, ...cropInfo });
            if (s.includes('winter') || s.includes('rabi') || s.includes('year-round') || s.includes('perennial'))
                seasonCrops['Winter'].push({ name: cropName, category, ...cropInfo });
            if (s.includes('kharif') || s.includes('year-round') || s.includes('perennial'))
                seasonCrops['Monsoon'].push({ name: cropName, category, ...cropInfo });
        }
    }
    return season ? seasonCrops[season] : seasonCrops;
}

function getSeasonWiseRecommendations(soilType) {
    const allSeasons = getCropsBySeason();
    const recommendations = { 'Summer': [], 'Winter': [], 'Monsoon': [] };
    for (const [season, crops] of Object.entries(allSeasons)) {
        recommendations[season] = crops.filter(crop => crop.soils.includes(soilType)).slice(0, 6);
    }
    return recommendations;
}
