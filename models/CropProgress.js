const mongoose = require('mongoose');

const cropProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cropName: {
        type: String,
        required: true
    },
    location: {
        state: String,
        district: String,
        taluk: String,
        area: String
    },
    soilType: String,
    startDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['current', 'completed'],
        default: 'current'
    },
    steps: [{
        stepNumber: Number,
        title: String,
        description: String,
        completed: {
            type: Boolean,
            default: false
        },
        completedDate: Date,
        notes: String
    }],
    completionPercentage: {
        type: Number,
        default: 0
    },
    expectedHarvestDate: Date,
    actualHarvestDate: Date
}, {
    timestamps: true
});

module.exports = mongoose.model('CropProgress', cropProgressSchema);