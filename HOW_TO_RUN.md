# 🚀 HOW TO RUN THE PROJECT

## Quick Start (Easiest Method)

### Step 1: Double-click this file
📁 **START_ALL.bat**

This will automatically:
- ✅ Start MongoDB database
- ✅ Start Node.js server
- ✅ Open the application

### Step 2: Open your browser
Go to: **http://localhost:3001**

---

## Manual Start (If batch file doesn't work)

### Step 1: Start MongoDB
Open Command Prompt and run:
```
mongod
```
Keep this window open!

### Step 2: Start Server
Open another Command Prompt in project folder and run:
```
npm start
```
OR for auto-reload:
```
npm run dev
```

### Step 3: Open Browser
Go to: **http://localhost:3001**

---

## First Time Setup (Only Once)

If you haven't installed dependencies yet:

1. Open Command Prompt in project folder
2. Run: `npm install`
3. Wait for installation to complete
4. Then use Quick Start method above

---

## Project URLs

- **Login Page**: http://localhost:3001
- **Register**: http://localhost:3001/register
- **Home**: http://localhost:3001/home
- **Crop Recommendation**: http://localhost:3001/crop-location
- **Season-Wise Crops**: http://localhost:3001/season-recommendation
- **Crop Status**: http://localhost:3001/status
- **Financial Tracker**: http://localhost:3001/finance

---

## Troubleshooting

### MongoDB Error?
- Install MongoDB from: https://www.mongodb.com/try/download/community
- Or start MongoDB manually: `mongod`

### Port Already in Use?
- Change PORT in `.env` file
- Or stop other applications using port 3001

### Dependencies Missing?
- Run: `npm install`

---

## Features Available

✅ User Registration & Login (JWT Authentication)
✅ AI-Powered Crop Recommendations (Advanced IDBN Model)
✅ Season-Wise Crop Recommendations (Summer/Winter/Monsoon)
✅ Step-by-Step Cultivation Guide
✅ Crop Progress Tracking
✅ Financial Management
✅ Government Schemes Information
✅ Weather Integration
✅ Agriculture Videos

---

## Default Test Account

If you want to test without registering:
- Mobile: 9876543210
- Password: test123

(Create this account first by registering)

---

## Need Help?

Check the README.md file for detailed documentation.

Happy Farming! 🌾
