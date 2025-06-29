# AllClear - Safety Network Platform 🌪️

A comprehensive safety and emergency management platform that helps users stay connected with their network during disasters and emergencies. Built with React, Node.js, and MongoDB.

![AllClear Dashboard](https://img.shields.io/badge/Status-Active-brightgreen)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-brightgreen)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)

## 🚀 Features

### 🔐 **Authentication & Security**
- **Complete User Authentication System**
  - User registration and login with JWT tokens
  - Password strength validation and hashing
  - Protected routes and API endpoints
  - Session management with automatic token refresh
  - Form validation and error handling

### 🌤️ **Weather & Disaster Monitoring**
- **Real-time Weather Data**
  - Current weather conditions for any city
  - Temperature, humidity, wind speed, and pressure
  - Weather alerts and warnings
  - OpenWeatherMap API integration

- **Interactive Weather Radar**
  - Animated rain radar overlay on maps
  - Real-time precipitation tracking
  - Historical weather data visualization

- **Multi-Disaster Map Layers**
  - **🔥 Wildfire Tracking**: Active fire locations with intensity levels
  - **🌀 Hurricane Monitoring**: Storm tracks and surge predictions
  - **🌪️ Tornado Warnings**: EF scale ratings and storm paths
  - **🌊 Flood Zones**: Water levels and flood risk areas
  - **🌋 Earthquake Data**: Seismic activity with magnitude circles
  - **Layer Controls**: Toggle layers on/off with opacity adjustment

### 👥 **Safety Network Management**
- **Friends Network**
  - Add and manage safety contacts
  - Real-time location tracking
  - Status updates (Safe, In Risk Zone, Emergency)
  - Contact information and coordinates
  - Visual status indicators on maps

- **Location Management**
  - Save important locations (Home, Work, Hospitals, Shelters)
  - Emergency service locations (Police, Fire Stations)
  - Essential services (Gas Stations, Pharmacies, Banks)
  - Custom location descriptions and categories

### 💬 **Communication System**
- **Safety Chat Interface**
  - Real-time messaging with network members
  - Emergency status updates
  - Group communication during disasters
  - Message history and timestamps
  - Status-based chat organization

### 🗺️ **Interactive Mapping**
- **Comprehensive Map View**
  - OpenStreetMap integration with Leaflet
  - Real-time friend and location markers
  - Weather radar overlay
  - Disaster layer toggles
  - Responsive design for all devices

### 📱 **Modern UI/UX**
- **Responsive Design**
  - Mobile-first approach
  - Dark theme with blue accents
  - Smooth animations and transitions
  - Intuitive navigation with sidebar
  - Accessibility features

## 🏗️ **Architecture**

### **Frontend (React)**
```
src/
├── components/          # Reusable UI components
│   ├── MapView.js      # Interactive map with layers
│   ├── WeatherDashboard.js # Weather monitoring
│   ├── FriendsList.js  # Network management
│   ├── LocationsList.js # Location management
│   ├── MessagingUI.js  # Chat interface
│   ├── DisasterMapLayers.js # Disaster overlays
│   └── AnimatedRadarLayer.js # Weather radar
├── pages/              # Main application pages
│   ├── Home.js         # Dashboard
│   ├── Friends.js      # Network management
│   ├── News.js         # Emergency news
│   └── Settings.js     # User preferences
├── context/            # React context providers
│   └── AuthContext.js  # Authentication state
└── App.js              # Main application component
```

### **Backend (Node.js/Express)**
```
server/
├── models/             # MongoDB schemas
│   ├── User.js         # User authentication
│   ├── Friend.js       # Network contacts
│   └── Location.js     # Saved locations
├── config/             # Configuration files
│   └── database.js     # MongoDB connection
├── server.js           # Main server file
└── package.json        # Dependencies
```

### **Database (MongoDB Atlas)**
- **User Collection**: Authentication and profile data
- **Friends Collection**: Safety network contacts
- **Locations Collection**: Saved important locations
- **Real-time Updates**: Live data synchronization

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (free tier available)

### **1. Clone the Repository**
```bash
git clone <repository-url>
cd allclear
```

### **2. Backend Setup**
```bash
cd server
npm install
```

Create `.env` file:
```env
PORT=5001
JWT_SECRET=your-super-secret-jwt-key
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/allclear
NODE_ENV=development
```

Start the server:
```bash
npm run dev
```

### **3. Frontend Setup**
```bash
cd ..
npm install
npm start
```

### **4. Database Setup**
Follow the [MongoDB Atlas Setup Guide](MONGODB_SETUP.md) for detailed instructions.

## 📊 **API Endpoints**

### **Authentication**
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/auth/verify` - Token verification

### **User Management**
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `PUT /api/user/password` - Change password

### **Friends Network**
- `GET /api/friends` - Get all friends
- `POST /api/friends` - Add new friend
- `PUT /api/friends/:id/status` - Update friend status
- `PUT /api/friends/:id/location` - Update friend location
- `DELETE /api/friends/:id` - Remove friend

### **Locations**
- `GET /api/locations` - Get all locations
- `POST /api/locations` - Add new location
- `PUT /api/locations/:id` - Update location
- `DELETE /api/locations/:id` - Remove location

### **Health Check**
- `GET /api/health` - API status and database connection

## 🛠️ **Technologies Used**

### **Frontend**
- **React 19.1.0** - UI framework
- **React Router** - Navigation
- **Leaflet** - Interactive maps
- **Tailwind CSS** - Styling
- **Context API** - State management

### **Backend**
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### **APIs & Services**
- **OpenWeatherMap API** - Weather data
- **RainViewer API** - Weather radar
- **MongoDB Atlas** - Cloud database
- **NASA FIRMS** - Fire data (demo)

## 🎯 **Use Cases**

### **Emergency Preparedness**
- Monitor weather conditions in real-time
- Track multiple disaster types simultaneously
- Maintain updated contact information
- Plan evacuation routes

### **Disaster Response**
- Check on safety network members
- Share emergency status updates
- Locate emergency services
- Coordinate evacuation efforts

### **Daily Safety**
- Weather monitoring for daily activities
- Location-based safety alerts
- Network status tracking
- Emergency contact management

## 🔧 **Development**

### **Adding New Features**
1. **Frontend Components**: Create in `src/components/`
2. **Pages**: Add to `src/pages/` and update routing
3. **API Endpoints**: Add to `server/server.js`
4. **Database Models**: Create in `server/models/`

### **Environment Variables**
```env
# Required
PORT=5001
JWT_SECRET=your-secret-key
MONGODB_URI=your-mongodb-connection-string

# Optional
NODE_ENV=development
OPENWEATHER_API_KEY=your-api-key
```

### **Testing**
```bash
# Frontend tests
npm test

# Backend health check
curl http://localhost:5001/api/health
```

## 🔒 **Security Features**

- **JWT Authentication** with token expiration
- **Password Hashing** using bcrypt
- **Input Validation** and sanitization
- **Protected Routes** and API endpoints
- **CORS Configuration** for cross-origin requests
- **Environment Variables** for sensitive data

## 🚀 **Deployment**

### **Frontend (Vercel/Netlify)**
```bash
npm run build
# Deploy the build folder
```

### **Backend (Heroku/Railway)**
```bash
# Set environment variables
# Deploy with MongoDB Atlas connection
```

### **Database (MongoDB Atlas)**
- Free tier available
- Automatic backups
- Global distribution
- Built-in security

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 **License**

MIT License - feel free to use this project for your own applications!

## 🆘 **Support**

For support and questions:
- Check the [MongoDB Setup Guide](MONGODB_SETUP.md)
- Review the troubleshooting section
- Open an issue on GitHub

---

**AllClear** - Stay connected, stay safe! 🛡️
