const bcrypt = require('bcrypt');
const User = require('../models/userModel');

// Register Faculty
exports.registerFaculty = async (req, res) => {
  try {
    const { name, email, contactNo, password, photo } = req.body;

    // Check if faculty already exists
    const existingFaculty = await User.findOne({ email });
    if (existingFaculty) {
      return res.status(400).json({ message: 'Faculty with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create faculty
    const faculty = new User({
      name,
      email,
      contactNo,
      password: hashedPassword,
      photo: photo || '',
      role: 'faculty',
      createdBy: req.user._id
    });

    await faculty.save();

    res.status(201).json({
      message: 'Faculty registered successfully',
      faculty: {
        id: faculty._id,
        name: faculty.name,
        email: faculty.email,
        contactNo: faculty.contactNo
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all faculties
exports.getAllFaculties = async (req, res) => {
  try {
    const faculties = await User.find({ role: 'faculty' }).select('-password');
    res.json(faculties);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update faculty
exports.updateFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, contactNo, photo } = req.body;

    const faculty = await User.findOneAndUpdate(
      { _id: id, role: 'faculty' },
      { name, email, contactNo, photo },
      { new: true }
    ).select('-password');

    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    res.json({ message: 'Faculty updated successfully', faculty });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete faculty
exports.deleteFaculty = async (req, res) => {
  try {
    const { id } = req.params;

    const faculty = await User.findOneAndDelete({ _id: id, role: 'faculty' });

    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    res.json({ message: 'Faculty deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
