const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');

let cachedVeggies = null;
let cachedFruits = null;
let cacheTime = null;
let fruitCacheTime = null;
const CACHE_DURATION = 4 * 60 * 60 * 1000; // 4 hours (was 1 hour)
const SCRAPE_TIMEOUT = 8000; // 8s (was 15s)

const SCRAPE_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9,ta;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Referer': 'https://www.google.com/',
    'Connection': 'keep-alive'
};

const EMOJI_MAP = {
    'tomato': '🍅', 'onion': '🧅', 'potato': '🥔', 'brinjal': '🍆', 'eggplant': '🍆',
    'cabbage': '🥬', 'carrot': '🥕', 'cauliflower': '🥦', 'beans': '🫘', 'bitter gourd': '🥒',
    'drumstick': '🌿', 'lady finger': '🌿', 'okra': '🌿', 'pumpkin': '🎃', 'mango': '🥭',
    'banana': '🍌', 'grapes': '🍇', 'pomegranate': '🍎', 'orange': '🍊', 'papaya': '🍈',
    'watermelon': '🍉', 'guava': '🍐', 'coconut': '🥥', 'pineapple': '🍍', 'chilli': '🌶️',
    'turmeric': '🟡', 'ginger': '🫚', 'coriander': '🌿', 'pepper': '⚫', 'garlic': '🧄',
    'lemon': '🍋', 'lime': '🍋', 'spinach': '🥬', 'cucumber': '🥒', 'radish': '🌿',
    'beetroot': '🫚', 'sweet potato': '🥔', 'raw banana': '🍌', 'jack fruit': '🍈',
    'ash gourd': '🎃', 'snake gourd': '🥒', 'ridge gourd': '🥒', 'bottle gourd': '🥒',
    'cluster beans': '🫘', 'broad beans': '🫘', 'green peas': '🫘', 'corn': '🌽',
    'rose': '🌹', 'jasmine': '🌸', 'marigold': '🌼', 'lotus': '🪷'
};

function getEmoji(name) {
    const lower = name.toLowerCase();
    for (const [key, emoji] of Object.entries(EMOJI_MAP)) {
        if (lower.includes(key)) return emoji;
    }
    return '🌿';
}

function parsePrice(str) {
    const match = str.replace(/[₹,]/g, '').match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
}

async function scrapeFruits() {
    if (cachedFruits && fruitCacheTime && (Date.now() - fruitCacheTime) < CACHE_DURATION) {
        return cachedFruits;
    }
    try {
        const response = await axios.get('https://vegetablemarketprice.com/fruits/tamilnadu/today', {
            headers: SCRAPE_HEADERS, timeout: SCRAPE_TIMEOUT
        });
        const $ = cheerio.load(response.data);
        const fruits = [];
        $('table tr').each((i, row) => {
            if (i === 0) return;
            const cols = $(row).find('td');
            if (cols.length < 3) return;
            const rawName = $(cols[1]).text().trim();
            const wholesaleRaw = $(cols[2]).text().trim();
            const retailRaw = $(cols[3]).text().trim();
            const unit = $(cols[4]).text().trim() || '1kg';
            if (!rawName || !wholesaleRaw) return;
            const name = rawName.split('(')[0].trim();
            const retailParts = retailRaw.replace(/[₹,]/g, '').split('-').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
            const minPrice = retailParts[0] || parsePrice(wholesaleRaw);
            const maxPrice = retailParts[1] || minPrice;
            const price = parsePrice(wholesaleRaw);
            if (!name || price === 0) return;
            fruits.push({ name, emoji: getEmoji(name), price, min: minPrice, max: maxPrice, unit });
        });
        if (fruits.length > 0) {
            cachedFruits = fruits;
            fruitCacheTime = Date.now();
            console.log(`Fruits scraped: ${fruits.length} items`);
        }
        return fruits.length > 0 ? fruits : (cachedFruits || []);
    } catch (e) {
        console.error('Fruit scrape error:', e.message);
        return cachedFruits || [];
    }
}

// Real prices based on current Tamil Nadu / Indian market rates
const staticCategories = {
    fruits: null, // replaced by live scrape
    cereals: {
        label: '🌾 Cereals & Grains',
        source: 'Local market / Zepto rates',
        items: [
            { name: 'Rice (Sona Masoori)', emoji: '🍚', price: 58,  unit: '1 kg', min: 52, max: 65  },
            { name: 'Rice (Ponni)',        emoji: '🍚', price: 52,  unit: '1 kg', min: 45, max: 60  },
            { name: 'Wheat (Sharbati)',    emoji: '🌾', price: 38,  unit: '1 kg', min: 32, max: 45  },
            { name: 'Maize',              emoji: '🌽', price: 22,  unit: '1 kg', min: 18, max: 28  },
            { name: 'Ragi (Finger Millet)',emoji: '🌾', price: 55,  unit: '1 kg', min: 48, max: 65  },
            { name: 'Jowar (Sorghum)',    emoji: '🌾', price: 42,  unit: '1 kg', min: 35, max: 52  },
            { name: 'Bajra (Pearl Millet)',emoji: '🌾', price: 38,  unit: '1 kg', min: 30, max: 48  },
            { name: 'Oats',               emoji: '🌾', price: 120, unit: '1 kg', min: 100, max: 150 },
            { name: 'Groundnut',          emoji: '🥜', price: 130, unit: '1 kg', min: 110, max: 160 },
            { name: 'Sunflower Seeds',    emoji: '🌻', price: 160, unit: '1 kg', min: 140, max: 190 },
            { name: 'Sesame (White)',      emoji: '🌿', price: 180, unit: '1 kg', min: 150, max: 220 },
        ]
    },
    spices: {
        label: '🌶️ Spices',
        source: 'Zepto / BigBasket rates',
        items: [
            { name: 'Red Chilli (Dry)',  emoji: '🌶️', price: 220,  unit: '1 kg',  min: 180, max: 280 },
            { name: 'Turmeric Powder',   emoji: '🟡', price: 160,  unit: '1 kg',  min: 130, max: 200 },
            { name: 'Ginger (Fresh)',    emoji: '🫚', price: 80,   unit: '1 kg',  min: 60,  max: 120 },
            { name: 'Garlic',            emoji: '🧄', price: 120,  unit: '1 kg',  min: 90,  max: 160 },
            { name: 'Coriander Seeds',   emoji: '🌿', price: 130,  unit: '1 kg',  min: 100, max: 170 },
            { name: 'Cumin (Jeera)',     emoji: '🌿', price: 380,  unit: '1 kg',  min: 320, max: 450 },
            { name: 'Black Pepper',      emoji: '⚫', price: 700,  unit: '1 kg',  min: 600, max: 850 },
            { name: 'Cardamom (Green)',  emoji: '🟢', price: 2200, unit: '100 g', min: 1800, max: 2800 },
            { name: 'Cloves',            emoji: '🌿', price: 1100, unit: '100 g', min: 900, max: 1400 },
            { name: 'Cinnamon',          emoji: '🌿', price: 350,  unit: '100 g', min: 280, max: 450 },
            { name: 'Fenugreek (Methi)', emoji: '🌿', price: 90,   unit: '1 kg',  min: 70,  max: 120 },
            { name: 'Mustard Seeds',     emoji: '🌿', price: 80,   unit: '1 kg',  min: 65,  max: 100 },
        ]
    },
    flowers: {
        label: '🌸 Flowers',
        source: 'Chennai / Coimbatore flower market rates',
        items: [
            { name: 'Jasmine (Malligai)',  emoji: '🌸', price: 400,  unit: '1 kg',      min: 300, max: 600 },
            { name: 'Rose (Red)',          emoji: '🌹', price: 150,  unit: '100 stems',  min: 100, max: 250 },
            { name: 'Rose (Mixed)',        emoji: '🌹', price: 120,  unit: '100 stems',  min: 80,  max: 200 },
            { name: 'Marigold (Samanthi)', emoji: '🌼', price: 60,   unit: '1 kg',      min: 40,  max: 100 },
            { name: 'Chrysanthemum',       emoji: '🌻', price: 80,   unit: '1 kg',      min: 60,  max: 120 },
            { name: 'Lotus',               emoji: '🪷', price: 300,  unit: '100 pcs',   min: 200, max: 500 },
            { name: 'Tuberose (Suhasini)', emoji: '🌷', price: 200,  unit: '1 kg',      min: 150, max: 300 },
            { name: 'Crossandra (Kanakambaram)', emoji: '🌺', price: 500, unit: '1 kg', min: 400, max: 700 },
            { name: 'Banana Flower',       emoji: '🍌', price: 35,   unit: '1 piece',   min: 25,  max: 50  },
        ]
    },
    pulses: {
        label: '🫘 Pulses & Dals',
        source: 'Zepto / BigBasket rates',
        items: [
            { name: 'Toor Dal (Pigeon Pea)', emoji: '🫘', price: 155, unit: '1 kg', min: 140, max: 175 },
            { name: 'Chana Dal (Chickpea)',  emoji: '🫘', price: 100, unit: '1 kg', min: 88,  max: 120 },
            { name: 'Urad Dal (Black Gram)', emoji: '⚫', price: 140, unit: '1 kg', min: 120, max: 165 },
            { name: 'Moong Dal (Green Gram)',emoji: '🟢', price: 130, unit: '1 kg', min: 115, max: 155 },
            { name: 'Masoor Dal (Red Lentil)',emoji: '🫘', price: 110, unit: '1 kg', min: 95,  max: 130 },
            { name: 'Rajma (Kidney Beans)',  emoji: '🫘', price: 160, unit: '1 kg', min: 140, max: 190 },
            { name: 'Kabuli Chana',          emoji: '🫘', price: 130, unit: '1 kg', min: 110, max: 160 },
            { name: 'Soybean',               emoji: '🫘', price: 80,  unit: '1 kg', min: 65,  max: 100 },
            { name: 'Peas (Dried)',          emoji: '🟢', price: 90,  unit: '1 kg', min: 75,  max: 110 },
            { name: 'Horse Gram (Kollu)',     emoji: '🫘', price: 100, unit: '1 kg', min: 85,  max: 125 },
        ]
    }
};

// GET /api/market/vegetables — live scrape
router.get('/vegetables', async (req, res) => {
    try {
        const vegetables = await scrapeVeggies();
        if (vegetables.length > 0) {
            return res.json({ success: true, source: 'live', data: vegetables, fetchedAt: new Date().toISOString() });
        }
        return res.json({ success: false, message: 'Could not parse data' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

async function scrapeVeggies() {
    if (cachedVeggies && cacheTime && (Date.now() - cacheTime) < CACHE_DURATION) return cachedVeggies;
    try {
        const response = await axios.get('https://vegetablemarketprice.com/market/tamilnadu/today', {
            headers: SCRAPE_HEADERS, timeout: SCRAPE_TIMEOUT
        });
        const $ = cheerio.load(response.data);
        const parsed = [];
        $('table tr').each((i, row) => {
            if (i === 0) return;
            const cols = $(row).find('td');
            if (cols.length < 3) return;
            const rawName = $(cols[1]).text().trim();
            const wholesaleRaw = $(cols[2]).text().trim();
            const retailRaw = $(cols[3]).text().trim();
            const unit = $(cols[4]).text().trim() || '1kg';
            if (!rawName || !wholesaleRaw) return;
            const name = rawName.split('(')[0].trim();
            const retailParts = retailRaw.replace(/[₹,]/g, '').split('-').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
            const minPrice = retailParts[0] || parsePrice(wholesaleRaw);
            const maxPrice = retailParts[1] || minPrice;
            parsed.push({ name, emoji: getEmoji(name), wholesalePrice: parsePrice(wholesaleRaw), minPrice, maxPrice, unit });
        });
        if (parsed.length > 0) { cachedVeggies = parsed; cacheTime = Date.now(); }
        return parsed.length > 0 ? parsed : cachedVeggies || [];
    } catch (e) {
        console.error('Veggie scrape error:', e.message);
        return cachedVeggies || [];
    }
}

// GET /api/market/all — returns all categories
router.get('/all', async (req, res) => {
    try {
        const [vegetables, fruits] = await Promise.all([scrapeVeggies(), scrapeFruits()]);

        const result = {
            vegetables: {
                label: '🥦 Vegetables',
                source: 'vegetablemarketprice.com (Live)',
                items: vegetables.map(v => ({
                    name: v.name, emoji: v.emoji,
                    price: v.wholesalePrice, min: v.minPrice, max: v.maxPrice, unit: v.unit
                }))
            },
            fruits: {
                label: '🍎 Fruits',
                source: 'vegetablemarketprice.com (Live)',
                items: fruits.map(f => ({
                    name: f.name, emoji: f.emoji,
                    price: f.price, min: f.min, max: f.max, unit: f.unit
                }))
            },
            ...Object.fromEntries(
                Object.entries(staticCategories).filter(([k]) => k !== 'fruits').map(([k, v]) => [k, v])
            )
        };

        res.json({ success: true, fetchedAt: new Date().toISOString(), data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
