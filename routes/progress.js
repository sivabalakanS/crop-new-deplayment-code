const express = require('express');
const router = express.Router();
const CropProgress = require('../models/CropProgress');
const { protect } = require('../middleware/auth');

// @route   POST /api/progress/start
// @desc    Start new crop cultivation tracking
router.post('/start', protect, async (req, res) => {
    try {
        const { cropName, location, soilType, steps } = req.body;

        if (!cropName || !steps || steps.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Crop name and steps are required' 
            });
        }

        const cropProgress = await CropProgress.create({
            userId: req.user.id,
            cropName,
            location: location || {},
            soilType: soilType || 'Not specified',
            steps: steps.map(step => ({
                stepNumber: step.stepNumber,
                title: step.title,
                description: step.description,
                completed: step.completed || false
            })),
            expectedHarvestDate: calculateHarvestDate(cropName, new Date())
        });

        res.status(201).json({
            success: true,
            data: cropProgress
        });
    } catch (error) {
        console.error('Progress start error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to save progress. Please try again.' 
        });
    }
});

// @route   PUT /api/progress/step/:id
// @desc    Update step completion status
router.put('/step/:id', protect, async (req, res) => {
    try {
        const { stepNumber, completed, notes } = req.body;
        
        const cropProgress = await CropProgress.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!cropProgress) {
            return res.status(404).json({ success: false, message: 'Crop progress not found' });
        }

        // Update specific step
        const stepIndex = cropProgress.steps.findIndex(step => step.stepNumber === stepNumber);
        if (stepIndex !== -1) {
            cropProgress.steps[stepIndex].completed = completed;
            cropProgress.steps[stepIndex].completedDate = completed ? new Date() : null;
            cropProgress.steps[stepIndex].notes = notes || '';
        }

        // Calculate completion percentage
        const completedSteps = cropProgress.steps.filter(step => step.completed).length;
        cropProgress.completionPercentage = Math.round((completedSteps / cropProgress.steps.length) * 100);

        // Update status if all steps completed
        if (cropProgress.completionPercentage === 100) {
            cropProgress.status = 'completed';
            cropProgress.actualHarvestDate = new Date();
        }

        await cropProgress.save();

        res.json({
            success: true,
            data: cropProgress
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/progress/current
// @desc    Get current crop progress
router.get('/current', protect, async (req, res) => {
    try {
        const currentCrops = await CropProgress.find({
            userId: req.user.id,
            status: 'current'
        }).sort('-createdAt');

        res.json({
            success: true,
            data: currentCrops
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/progress/completed
// @desc    Get completed crop progress
router.get('/completed', protect, async (req, res) => {
    try {
        const completedCrops = await CropProgress.find({
            userId: req.user.id,
            status: 'completed'
        }).sort('-actualHarvestDate');

        res.json({
            success: true,
            data: completedCrops
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/progress/:id
// @desc    Get specific crop progress details
router.get('/:id', protect, async (req, res) => {
    try {
        const cropProgress = await CropProgress.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!cropProgress) {
            return res.status(404).json({ success: false, message: 'Crop progress not found' });
        }

        res.json({
            success: true,
            data: cropProgress
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Helper function to calculate harvest date
function calculateHarvestDate(cropName, startDate) {
    const cropDurations = {
        'Rice': 120,
        'Wheat': 120,
        'Maize': 90,
        'Tomato': 90,
        'Onion': 120,
        'Potato': 90
    };
    
    const duration = cropDurations[cropName] || 120;
    const harvestDate = new Date(startDate);
    harvestDate.setDate(harvestDate.getDate() + duration);
    return harvestDate;
}

module.exports = router;