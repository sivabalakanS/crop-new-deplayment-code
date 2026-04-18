# Crop Recommendation System - Full Stack Authentication

Complete authentication system with MongoDB, JWT, and bcrypt password hashing.

## Features ✨

✅ **User Registration**
- Username, mobile number (10 digits), password
- Password confirmation validation
- Bcrypt password hashing (10 salt rounds)
- Unique mobile number check
- MongoDB storage

✅ **User Login**
- Mobile number + password authentication
- Bcrypt password comparison
- JWT token generation
- HTTP-only cookie storage
- Session management

✅ **Security**
- Passwords hashed with bcrypt
- JWT tokens with 7-day expiry
- HTTP-only cookies
- Protected routes with middleware
- Prevent back navigation after login

✅ **Route Protection**
- Middleware authentication
- Auto-redirect if not logged in
- Auto-redirect to home if already logged in

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT, bcrypt
- **Session**: HTTP-only cookies

## Project Structure

```
crop website/
├── models/
│   └── User.js                 # User schema with bcrypt
├── routes/
│   └── auth.js                 # Register, login, logout routes
├── middleware/
│   └── auth.js                 # JWT verification middleware
├── public/
│   ├── css/
│   │   └── style.css          # Styles
│   ├── js/
│   │   ├── login.js           # Login logic
│   │   ├── register.js        # Register logic
│   │   └── home.js            # Home page + auth check
│   ├── login.html             # Login page
│   ├── register.html          # Register page
│   └── home.html              # Protected home page
├── .env                        # Environment variables
├── server.js                   # Main server
└── package.json               # Dependencies
```

## Setup Instructions

### 1. Install MongoDB
Download and install from: https://www.mongodb.com/try/download/community

Start MongoDB:
```bash
mongod
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Edit `.env` file:
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/crop_recommendation
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
```

### 4. Start Server
```bash
npm start
```

Or with auto-reload:
```bash
npm run dev
```

### 5. Access Application
Open browser: **http://localhost:3001**

## API Endpoints

### POST /api/auth/register
Register new user
```json
{
  "username": "John Doe",
  "mobile": "9876543210",
  "password": "password123",
  "confirmPassword": "password123"
}
```

### POST /api/auth/login
Login user
```json
{
  "mobile": "9876543210",
  "password": "password123"
}
```

### GET /api/auth/logout
Logout user (clears cookie)

### GET /api/auth/me
Get current user (protected route)

## Database Schema

### users Collection
```javascript
{
  username: String,
  mobile: String (unique, 10 digits),
  password: String (bcrypt hashed),
  createdAt: Date
}
```

## Security Features

1. **Password Hashing**: bcrypt with 10 salt rounds
2. **JWT Tokens**: Signed with secret key, 7-day expiry
3. **HTTP-only Cookies**: Prevents XSS attacks
4. **Route Protection**: Middleware checks JWT validity
5. **Unique Mobile**: Prevents duplicate registrations
6. **Input Validation**: Server-side validation for all fields

## Validation Rules

- **Username**: Required
- **Mobile**: Exactly 10 digits, unique
- **Password**: Minimum 6 characters
- **Confirm Password**: Must match password

## Usage Flow

1. **Register**: `/register` → Create account → Auto-login → Redirect to `/home`
2. **Login**: `/` → Enter credentials → Generate JWT → Redirect to `/home`
3. **Home**: Protected route, requires valid JWT token
4. **Logout**: Clear JWT cookie → Redirect to `/`

## Testing

1. Register a new user
2. Login with credentials
3. Access home page (should work)
4. Try accessing home without login (should redirect to login)
5. Logout and verify redirect to login
6. Try registering with same mobile (should fail)

## Next Steps

Add crop recommendation features:
- Soil data input form
- Weather API integration
- ML model for crop prediction
- Profit calculator
- Crop guidance system
