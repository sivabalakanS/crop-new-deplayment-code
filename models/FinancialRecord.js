const mongoose = require('mongoose');

const financialRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cropName: {
    type: String,
    required: [true, 'Please provide crop name'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Please provide date']
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: [true, 'Please specify type']
  },
  amount: {
    type: Number,
    required: [true, 'Please provide amount'],
    min: 0
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'history'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FinancialRecord', financialRecordSchema);
