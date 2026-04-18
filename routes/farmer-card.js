const express = require('express');
const router = express.Router();
const User = require('../models/User');
const CropProgress = require('../models/CropProgress');
const FinancialRecord = require('../models/FinancialRecord');

// @route  GET /api/farmer-card/:userId
// @desc   Public endpoint — called when QR code is scanned
// @access Public (no auth required)
router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('username aadharName aadharDob aadharAddress aadharNumber createdAt');
        if (!user) return res.status(404).json({ success: false, message: 'Farmer not found' });

        // Crops
        const crops = await CropProgress.find({ userId: user._id })
            .select('cropName location soilType startDate status completionPercentage actualHarvestDate')
            .sort('-createdAt')
            .limit(20);

        // Finance summary
        const records = await FinancialRecord.find({ userId: user._id });
        let totalIncome = 0, totalExpense = 0;
        const cropMap = {};
        records.forEach(r => {
            if (r.type === 'income')  totalIncome  += r.amount;
            else                      totalExpense += r.amount;
            if (!cropMap[r.cropName]) cropMap[r.cropName] = { income: 0, expense: 0 };
            r.type === 'income' ? cropMap[r.cropName].income += r.amount : cropMap[r.cropName].expense += r.amount;
        });
        const byCrop = Object.entries(cropMap).map(([crop, v]) => ({ crop, ...v }));

        res.json({
            success: true,
            farmer: {
                id: user._id,
                name: user.aadharName || user.username,
                dob: user.aadharDob || '',
                address: user.aadharAddress || '',
                aadharNumber: user.aadharNumber || '',
                memberSince: user.createdAt
            },
            crops,
            finance: { totalIncome, totalExpense, byCrop }
        });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
});

module.exports = router;
