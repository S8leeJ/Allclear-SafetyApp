const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if MONGODB_URI is defined
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    console.log('Attempting to connect to MongoDB...');
    console.log('Connection string:', process.env.MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials in logs

    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    
    // Provide helpful error messages
    if (error.message.includes('ENOTFOUND')) {
      console.error('❌ DNS resolution failed. Check your connection string format.');
      console.error('Make sure your MongoDB Atlas cluster is running and accessible.');
    } else if (error.message.includes('Authentication failed')) {
      console.error('❌ Authentication failed. Check your username and password.');
    } else if (error.message.includes('MONGODB_URI environment variable is not defined')) {
      console.error('❌ MONGODB_URI is not set in your .env file.');
    }
    
    process.exit(1);
  }
};

module.exports = connectDB; 