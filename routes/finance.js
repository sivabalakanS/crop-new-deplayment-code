const express = require('express');
const router = express.Router();
const FinancialRecord = require('../models/FinancialRecord');
const { protect } = require('../middleware/auth');

// @route   POST /api/finance/create
// @desc    Create new financial record
router.post('/create', protect, async (req, res) => {
  try {
    const { cropName, date, type, amount, description } = req.body;

    if (!cropName || !date || !type || !amount) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const record = await FinancialRecord.create({
      userId: req.user.id,
      cropName,
      date,
      type,
      amount,
      description,
      status: 'active'
    });

    res.status(201).json({ success: true, record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/finance/active
// @desc    Get active records
router.get('/active', protect, async (req, res) => {
  try {
    const records = await FinancialRecord.find({
      userId: req.user.id,
      status: 'active'
    }).sort({ date: -1 });

    res.status(200).json({ success: true, records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/finance/history
// @desc    Get history records
router.get('/history', protect, async (req, res) => {
  try {
    const records = await FinancialRecord.find({
      userId: req.user.id,
      status: 'history'
    }).sort({ date: -1 });

    res.status(200).json({ success: true, records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/finance/:id/archive
// @desc    Move record to history
router.put('/:id/archive', protect, async (req, res) => {
  try {
    const record = await FinancialRecord.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { status: 'history' },
      { new: true }
    );

    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    res.status(200).json({ success: true, record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/finance/:id
// @desc    Delete record
router.delete('/:id', protect, async (req, res) => {
  try {
    const record = await FinancialRecord.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    res.status(200).json({ success: true, message: 'Record deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
