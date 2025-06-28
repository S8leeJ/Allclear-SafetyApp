# MongoDB Atlas Setup Guide

This guide will help you set up MongoDB Atlas and connect it to your AllClear backend.

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" or "Sign Up"
3. Create an account or sign in with Google/GitHub

## Step 2: Create a New Cluster

1. **Choose a plan:**
   - Select "FREE" tier (M0 Sandbox)
   - Click "Create"

2. **Choose a cloud provider:**
   - Select AWS, Google Cloud, or Azure (any is fine)
   - Choose a region close to you

3. **Cluster name:**
   - Name it "allclear-cluster" or similar
   - Click "Create Cluster"

## Step 3: Set Up Database Access

1. In the left sidebar, click "Database Access"
2. Click "Add New Database User"
3. **Authentication Method:** Password
4. **Username:** Create a username (e.g., "allclear-user")
5. **Password:** Create a strong password (save this!)
6. **Database User Privileges:** "Read and write to any database"
7. Click "Add User"

## Step 4: Set Up Network Access

1. In the left sidebar, click "Network Access"
2. Click "Add IP Address"
3. **For development:** Click "Allow Access from Anywhere" (0.0.0.0/0)
4. **For production:** Add your specific IP addresses
5. Click "Confirm"

## Step 5: Get Your Connection String

1. Go back to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. **Driver:** Node.js
5. **Version:** 5.0 or later
6. Copy the connection string

## Step 6: Configure Your Environment

1. In your `server` directory, create a `.env` file:
   ```bash
   cd server
   touch .env
   ```

2. Add your configuration to `.env`:
   ```env
   PORT=5001
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/allclear?retryWrites=true&w=majority
   NODE_ENV=development
   ```

3. **Replace the placeholders:**
   - `your-username`: The database username you created
   - `your-password`: The database password you created
   - `your-cluster`: Your actual cluster name
   - `allclear`: Your database name (can be anything)

## Step 7: Test the Connection

1. Start your backend server:
   ```bash
   cd server
   npm run dev
   ```

2. You should see:
   ```
   MongoDB Connected: your-cluster.mongodb.net
   Server running on port 5001
   ```

3. Test the health endpoint:
   ```bash
   curl http://localhost:5001/api/health
   ```

   You should see:
   ```json
   {
     "status": "OK",
     "message": "AllClear API is running",
     "database": "Connected"
   }
   ```

## Step 8: Test Authentication

1. Start your frontend:
   ```bash
   npm start
   ```

2. Go to `http://localhost:3000`
3. Try to sign up with a new account
4. Check your MongoDB Atlas dashboard to see the user data

## Troubleshooting

### Connection Issues

1. **"Authentication failed"**
   - Check your username and password in the connection string
   - Make sure you URL-encoded special characters in the password

2. **"Network timeout"**
   - Check your Network Access settings in Atlas
   - Make sure you allowed your IP address

3. **"Invalid connection string"**
   - Double-check the connection string format
   - Make sure you replaced all placeholders

### Common Issues

1. **Password with special characters:**
   - URL-encode special characters in your password
   - Example: `@` becomes `%40`, `#` becomes `%23`

2. **Cluster name:**
   - Make sure you're using the correct cluster name from your Atlas dashboard

3. **Database name:**
   - The database will be created automatically when you first save data

## Security Best Practices

1. **Environment Variables:**
   - Never commit your `.env` file to version control
   - Use different JWT secrets for different environments

2. **Network Access:**
   - For production, only allow specific IP addresses
   - Use VPC peering for better security

3. **Database User:**
   - Use strong passwords
   - Give minimal required privileges

## Production Considerations

1. **Connection String:**
   - Use environment variables for all sensitive data
   - Consider using connection pooling for better performance

2. **Monitoring:**
   - Set up MongoDB Atlas alerts
   - Monitor your database performance

3. **Backup:**
   - Enable automated backups in Atlas
   - Test your backup and restore procedures

## Next Steps

Once your MongoDB Atlas is connected:

1. **Test the full authentication flow**
2. **Add more user fields** to the User model as needed
3. **Implement additional features** like password reset, email verification
4. **Add data validation** and business logic
5. **Set up proper logging** and monitoring

Your AllClear app is now connected to a real database! 🎉 