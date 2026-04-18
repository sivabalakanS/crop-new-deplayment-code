const mongoose = require('mongoose');

const cropSelectionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    state: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    taluk: {
        type: String,
        required: true
    },
    area: {
        type: String,
        required: true
    },
    cropCategory: {
        type: String,
        required: true,
        enum: ['Cereals', 'Vegetables', 'Fruits', 'Pulses', 'Oil Seeds', 'Flowers', 'Plantation Crops', 'Spices']
    },
    soilType: {
        type: String,
        required: false,
        default: 'Not specified'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('CropSelection', cropSelectionSchema);
