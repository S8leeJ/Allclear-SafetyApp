# AllClear - Authentication System

A modern React application with a complete authentication system, featuring a sidebar navigation and secure backend API.

## Features

- 🔐 **Complete Authentication System**
  - User registration and login
  - JWT token-based authentication
  - Protected routes
  - Password strength validation
  - Form validation

- 🎨 **Modern UI/UX**
  - Responsive sidebar navigation
  - Dark theme with blue accents
  - Smooth animations and transitions
  - User profile display

- 🛡️ **Security Features**
  - Password hashing with bcrypt
  - JWT token authentication
  - Input validation and sanitization
  - Protected API endpoints

## Project Structure

```
allclear/
├── src/                    # React frontend
│   ├── components/         # Reusable components
│   ├── context/           # React context providers
│   ├── pages/             # Page components
│   └── App.js             # Main app component
├── server/                # Express.js backend
│   ├── server.js          # Main server file
│   └── package.json       # Backend dependencies
└── package.json           # Frontend dependencies
```

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to the server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file (optional):**
   ```bash
   # Create .env file in server directory
   echo "JWT_SECRET=your-super-secret-key-here" > .env
   echo "PORT=5000" >> .env
   ```

4. **Start the backend server:**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:5000`

### Frontend Setup

1. **Navigate to the project root:**
   ```bash
   cd ..  # if you're in the server directory
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the React development server:**
   ```bash
   npm start
   ```

   The app will open on `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login

### User Management

- `GET /api/user/profile` - Get user profile (protected)
- `PUT /api/user/profile` - Update user profile (protected)

### Health Check

- `GET /api/health` - API health status

## Usage

1. **First Time Setup:**
   - Open `http://localhost:3000`
   - You'll be redirected to the sign-in page
   - Click "Sign up" to create a new account

2. **Creating an Account:**
   - Fill in your first name, last name, email, and password
   - The password strength indicator will help you create a secure password
   - Accept the terms and conditions
   - Click "Create Account"

3. **Signing In:**
   - Enter your email and password
   - Optionally check "Remember me"
   - Click "Sign In"

4. **Navigation:**
   - Use the sidebar to navigate between pages
   - Your profile information is displayed at the bottom of the sidebar
   - Click "Sign Out" to log out

## Development

### Frontend Development

The React app uses:
- **React Router** for navigation
- **Context API** for state management
- **Tailwind CSS** for styling
- **Protected Routes** for authentication

### Backend Development

The Express server includes:
- **JWT authentication** with jsonwebtoken
- **Password hashing** with bcryptjs
- **Input validation** with express-validator
- **CORS** enabled for cross-origin requests

### Adding New Features

1. **New Protected Routes:**
   - Create the page component in `src/pages/`
   - Add the route to `App.js` wrapped with `ProtectedRoute`
   - Add navigation link to the sidebar in `Navbar.js`

2. **New API Endpoints:**
   - Add the route to `server/server.js`
   - Use `authenticateToken` middleware for protected endpoints
   - Add validation using express-validator

## Security Notes

- The current implementation uses in-memory storage for users
- For production, replace with a proper database (MongoDB, PostgreSQL, etc.)
- Use environment variables for sensitive data (JWT_SECRET, database credentials)
- Implement rate limiting for API endpoints
- Add HTTPS in production
- Consider implementing refresh tokens for better security

## Troubleshooting

### Common Issues

1. **Backend not starting:**
   - Check if port 5000 is available
   - Ensure all dependencies are installed
   - Check for syntax errors in server.js

2. **Frontend can't connect to backend:**
   - Verify the backend is running on port 5000
   - Check the proxy configuration in package.json
   - Ensure CORS is properly configured

3. **Authentication issues:**
   - Clear browser localStorage
   - Check browser console for errors
   - Verify JWT token is being sent in requests

### Getting Help

- Check the browser console for frontend errors
- Check the terminal running the backend for server errors
- Verify all dependencies are installed correctly

## License

MIT License - feel free to use this project for your own applications!
