// Script to reset admin password
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require('./models/userModel');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(async () => {
    console.log('MongoDB connected successfully');

    // Find and update admin user
    const admin = await User.findOne({ email: 'harshadmin@gmail.com' });

    if (admin) {
      const hashedPassword = await bcrypt.hash('Harsh@123', 10);
      admin.password = hashedPassword;
      admin.name = 'Admin';
      await admin.save();

      console.log('✅ Admin password reset successfully!');
      console.log('Email: harshadmin@gmail.com');
      console.log('Password: Harsh@123');

      // Verify it works
      const isMatch = await bcrypt.compare('Harsh@123', admin.password);
      console.log('Password verification:', isMatch ? '✅ SUCCESS' : '❌ FAILED');
    } else {
      console.log('Creating new admin user...');
      const hashedPassword = await bcrypt.hash('Harsh@123', 10);
      const newAdmin = new User({
        name: 'Admin',
        email: 'harshadmin@gmail.com',
        password: hashedPassword,
        role: 'admin'
      });
      await newAdmin.save();
      console.log('✅ Admin user created successfully!');
    }

    mongoose.connection.close();
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });
