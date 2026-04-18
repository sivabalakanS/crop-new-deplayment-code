const express = require('express');
const router = express.Router();
const CropSelection = require('../models/CropSelection');
const { protect } = require('../middleware/auth');

// @route   POST /api/crop/recommend
// @desc    Save crop selection
router.post('/recommend', protect, async (req, res) => {
    try {
        const { state, district, taluk, area, cropCategory, soilType } = req.body;

        if (!state || !district || !taluk || !area || !cropCategory) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields' });
        }

        const cropSelection = await CropSelection.create({
            userId: req.user.id,
            state,
            district,
            taluk,
            area,
            cropCategory,
            soilType: soilType || 'Not specified'
        });

        res.status(201).json({
            success: true,
            message: 'Crop selection saved successfully',
            data: cropSelection
        });
    } catch (error) {
        console.error('Crop save error:', error);
        res.status(500).json({ success: false, message: 'Failed to save crop selection. Please try again.' });
    }
});

// @route   GET /api/crop/selections
// @desc    Get user's crop selections
router.get('/selections', protect, async (req, res) => {
    try {
        const selections = await CropSelection.find({ userId: req.user.id }).sort('-createdAt');
        res.status(200).json({ success: true, data: selections });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
