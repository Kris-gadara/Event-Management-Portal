const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'faculty', 'coordinator', 'student'],
    required: true
  },
  contactNo: {
    type: String
  },
  department: {
    type: String
  },
  photo: {
    type: String,
    default: ''
  },
  assignedClub: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
