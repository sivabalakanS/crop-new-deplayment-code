const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Send token in cookie
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  };

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    user: {
      id: user._id,
      username: user.username,
      mobile: user.mobile
    }
  });
};

// @route   POST /api/auth/register
// @desc    Register user
router.post('/register', async (req, res) => {
  try {
    const { username, mobile, password, confirmPassword } = req.body;

    // Validation
    if (!username || !mobile || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'Please provide all fields' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    if (!/^\d{10}$/.test(mobile)) {
      return res.status(400).json({ success: false, message: 'Mobile number must be 10 digits' });
    }

    // Check if mobile already exists
    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Mobile number already registered' });
    }

    // Create user
    const user = await User.create({
      username,
      mobile,
      password
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
router.post('/login', async (req, res) => {
  try {
    const { mobile, password } = req.body;

    // Validation
    if (!mobile || !password) {
      return res.status(400).json({ success: false, message: 'Please provide mobile number and password' });
    }

    // Check user
    const user = await User.findOne({ mobile }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/auth/logout
// @desc    Logout user
router.get('/logout', (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

// @route   GET /api/auth/me
// @desc    Get current user
router.get('/me', require('../middleware/auth').protect, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ 
    success: true, 
    user: {
      id: user._id.toString(),
      username: user.username,
      mobile: user.mobile,
      profilePicture: user.profilePicture || '',
      createdAt: user.createdAt
    }
  });
});

// @route   POST /api/auth/profile-picture
router.post('/profile-picture', require('../middleware/auth').protect, async (req, res) => {
  try {
    const { profilePicture } = req.body;
    await User.findByIdAndUpdate(req.user.id, { profilePicture });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/auth/aadhar  — get aadhar data
router.get('/aadhar', require('../middleware/auth').protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      aadharNumber:  user.aadharNumber  || '',
      aadharName:    user.aadharName    || '',
      aadharDob:     user.aadharDob     || '',
      aadharAddress: user.aadharAddress || '',
      aadharPhoto:   user.aadharPhoto   || '',
      aadharStatus:  user.aadharStatus  || 'none'
    });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// @route   POST /api/auth/aadhar  — save aadhar details
router.post('/aadhar', require('../middleware/auth').protect, async (req, res) => {
  try {
    const { aadharNumber, aadharName, aadharDob, aadharAddress } = req.body;
    if (aadharNumber && !/^\d{12}$/.test(aadharNumber))
      return res.status(400).json({ success: false, message: 'Aadhar number must be 12 digits' });
    const update = { aadharName, aadharDob, aadharAddress };
    if (aadharNumber) { update.aadharNumber = aadharNumber; update.aadharStatus = 'pending'; }
    await User.findByIdAndUpdate(req.user.id, update);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// @route   POST /api/auth/aadhar/photo  — save aadhar photo
router.post('/aadhar/photo', require('../middleware/auth').protect, async (req, res) => {
  try {
    const { aadharPhoto } = req.body;
    if (!aadharPhoto) return res.status(400).json({ success: false, message: 'No photo provided' });
    // Limit base64 size (~3.5MB decoded)
    if (aadharPhoto.length > 5 * 1024 * 1024)
      return res.status(400).json({ success: false, message: 'Photo too large' });
    await User.findByIdAndUpdate(req.user.id, { aadharPhoto });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
