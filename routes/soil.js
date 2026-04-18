const express = require('express');
const router = express.Router();

// Soil image search terms for Unsplash
const soilSearchTerms = {
    'Red Loamy Soil': 'red soil texture agriculture',
    'Red Sandy Soil': 'red sandy soil texture',
    'Black Cotton Soil': 'black cotton soil agriculture',
    'Black Soil': 'black soil texture',
    'Red Soil': 'red soil agriculture',
    'Alluvial Soil': 'alluvial soil river delta',
    'Deltaic Alluvial Soil': 'delta soil fertile',
    'Coastal Alluvial Soil': 'coastal soil beach sand',
    'Laterite Soil': 'laterite red soil tropical',
    'Saline Soil': 'saline soil salt affected',
    'Forest Loam Soil': 'forest soil organic matter',
    'Kuttanad Clay Soil': 'clay soil wet texture',
    'Kari Soil': 'dark organic soil peat',
    'Mountain Soil': 'mountain rocky soil',
    'Mixed Red Black Soil': 'mixed soil red black'
};

// Get soil image from Unsplash
router.get('/soil-image/:soilType', async (req, res) => {
    try {
        const soilType = req.params.soilType;
        const searchTerm = soilSearchTerms[soilType] || 'soil texture';
        
        // Using Unsplash Source API (no API key needed)
        const imageUrl = `https://source.unsplash.com/400x300/?${encodeURIComponent(searchTerm)}`;
        
        res.json({
            success: true,
            imageUrl: imageUrl,
            soilType: soilType
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch soil image',
            error: error.message
        });
    }
});

// Get all soil images
router.post('/soil-images', async (req, res) => {
    try {
        const { soilTypes } = req.body;
        
        const images = {};
        soilTypes.forEach(soilType => {
            const searchTerm = soilSearchTerms[soilType] || 'soil texture';
            images[soilType] = `https://source.unsplash.com/400x300/?${encodeURIComponent(searchTerm)}`;
        });
        
        res.json({
            success: true,
            images: images
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch soil images',
            error: error.message
        });
    }
});

module.exports = router;
