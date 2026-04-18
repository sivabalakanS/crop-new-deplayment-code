const express = require('express');
const router = express.Router();
const Location = require('../models/Location');
const { protect } = require('../middleware/auth');

// @route   POST /api/location/save
// @desc    Save farmer location
router.post('/save', protect, async (req, res) => {
  try {
    const { state, district, taluk, area, latitude, longitude } = req.body;

    if (!state || !district || !taluk || !area) {
      return res.status(400).json({ success: false, message: 'All location fields are required' });
    }

    // Check if location already exists for user
    let location = await Location.findOne({ userId: req.user.id });

    if (location) {
      // Update existing location
      location.state = state;
      location.district = district;
      location.taluk = taluk;
      location.area = area;
      location.latitude = latitude;
      location.longitude = longitude;
      await location.save();
    } else {
      // Create new location
      location = await Location.create({
        userId: req.user.id,
        state,
        district,
        taluk,
        area,
        latitude,
        longitude
      });
    }

    res.status(200).json({ success: true, location });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/location/:userId
// @desc    Get farmer location
router.get('/:userId', protect, async (req, res) => {
  try {
    const location = await Location.findOne({ userId: req.params.userId });

    if (!location) {
      return res.status(404).json({ success: false, message: 'Location not found' });
    }

    res.status(200).json({ success: true, location });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/location/me
// @desc    Get current user location
router.get('/me/location', protect, async (req, res) => {
  try {
    const location = await Location.findOne({ userId: req.user.id });

    if (!location) {
      return res.status(404).json({ success: false, message: 'Location not found' });
    }

    res.status(200).json({ success: true, location });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
