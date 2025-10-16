// Script to verify admin user and test login
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

    // Find admin user
    const admin = await User.findOne({ email: 'harshadmin@gmail.com' });

    if (admin) {
      console.log('\n✅ Admin user found:');
      console.log('Name:', admin.name);
      console.log('Email:', admin.email);
      console.log('Role:', admin.role);
      console.log('Password hash:', admin.password);

      // Test password
      const testPassword = 'Harsh@123';
      const isMatch = await bcrypt.compare(testPassword, admin.password);
      console.log('\n🔐 Password test for "Harsh@123":', isMatch ? '✅ CORRECT' : '❌ INCORRECT');

    } else {
      console.log('\n❌ Admin user NOT found! Creating now...');
      const hashedPassword = await bcrypt.hash('Harsh@123', 10);
      const newAdmin = new User({
        name: 'Admin',
        email: 'harshadmin@gmail.com',
        password: hashedPassword,
        role: 'admin'
      });
      await newAdmin.save();
      console.log('✅ Admin user created successfully');
    }

    mongoose.connection.close();
    process.exit(0);
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
