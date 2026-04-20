require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const compression = require('compression');

// Force Google DNS to fix SRV lookup issues on some networks
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const app = express();

// Gzip compress all responses
app.use(compression());

// Middleware
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? 'https://crop-new-deplayment-code-1.onrender.com'
        : 'http://localhost:3001',
    credentials: true
}));

// Trust proxy for Render
app.set('trust proxy', 1);

// Serve static files
app.use(express.static('public', {
    maxAge: '0',
    etag: false
}));

// MongoDB Connection
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
})
  .then(() => console.log('MongoDB Atlas Connected ✅'))
  .catch(err => console.log('MongoDB Error:', err.message));

// Admin stats route
const User = require('./models/User');
const CropProgress = require('./models/CropProgress');

app.get('/api/admin/stats', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    const today = new Date(); today.setHours(0,0,0,0);
    const todayUsers = users.filter(u => new Date(u.createdAt) >= today).length;

    const allCrops = await CropProgress.find().sort({ updatedAt: -1 }).limit(20);
    const activeCrops = await CropProgress.countDocuments({ status: 'current' });
    const completedCrops = await CropProgress.countDocuments({ status: 'completed' });

    // Attach username to each crop
    const userMap = {};
    users.forEach(u => userMap[u._id.toString()] = u.username);
    const recentCrops = allCrops.map(c => ({
      ...c.toObject(),
      username: userMap[c.userId?.toString()] || '—'
    }));

    res.json({ totalUsers: users.length, todayUsers, activeCrops, completedCrops, users, recentCrops });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/finance', require('./routes/finance'));
app.use('/api/location', require('./routes/location'));
app.use('/api/crop', require('./routes/crop'));
app.use('/api/soil', require('./routes/soil'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/farmer-card', require('./routes/farmer-card'));

// Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/crop-location', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'crop-location.html'));
});

app.get('/crop', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'crop.html'));
});

app.get('/finance', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'finance.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

app.get('/crop-recommendation-result', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'crop-recommendation-result.html'));
});

app.get('/crop-guide', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'crop-guide.html'));
});

app.get('/status', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'status.html'));
});

app.get('/season-recommendation', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'season-recommendation.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/market-price', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'market-price.html'));
});

app.get('/farmer-card', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'farmer-card.html'));
});

app.get('/farmer-card-public', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'farmer-card-public.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  // Print local network IP so mobile can access
  const { networkInterfaces } = require('os');
  const nets = networkInterfaces();
  let localIP = 'localhost';
  for (const iface of Object.values(nets)) {
    for (const net of iface) {
      if (net.family === 'IPv4' && !net.internal) { localIP = net.address; break; }
    }
  }
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`📱 Mobile access (same WiFi): http://${localIP}:${PORT}`);
  console.log(`🔗 For QR to work on mobile, open: http://${localIP}:${PORT}/farmer-card.html`);
  setTimeout(() => {
    fetch(`http://localhost:${PORT}/api/market/all`).catch(() => {});
  }, 3000);
});
