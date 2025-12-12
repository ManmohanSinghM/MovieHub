// seedAdmin.js - Run this once to create your admin
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const adminExists = await User.findOne({ username: 'admin' });
    if (adminExists) {
      console.log('Admin user already exists.');
      process.exit();
    }

    // Create Admin
    const adminUser = new User({
      username: 'admin',
      password: 'adminpassword123', // You will use this to login
      role: 'admin'
    });

    await adminUser.save();
    console.log('SUCCESS: Admin user created!');
    console.log('Username: admin');
    console.log('Password: adminpassword123');
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdmin();