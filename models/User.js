const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide username'],
    trim: true
  },
  mobile: {
    type: String,
    required: [true, 'Please provide mobile number'],
    unique: true,
    match: [/^\d{10}$/, 'Please provide valid 10-digit mobile number']
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
    select: false
  },
  profilePicture: {
    type: String,
    default: ''
  },
  aadharNumber: { type: String, default: '' },
  aadharName:   { type: String, default: '' },
  aadharDob:    { type: String, default: '' },
  aadharAddress:{ type: String, default: '' },
  aadharPhoto:  { type: String, default: '' },
  aadharStatus: { type: String, enum: ['none','pending','verified'], default: 'none' },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
