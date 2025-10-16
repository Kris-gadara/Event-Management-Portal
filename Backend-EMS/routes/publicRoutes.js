const express = require('express');
const Event = require('../models/eventModel');
const Club = require('../models/clubModel');

const router = express.Router();

// Get all published events (public)
router.get('/events', async (req, res) => {
  try {
    const events = await Event.find({ status: 'approved' })
      .populate('club', 'name')
      .populate('createdBy', 'name')
      .select('-registeredStudents');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all clubs (public)
router.get('/clubs', async (req, res) => {
  try {
    const clubs = await Club.find()
      .populate('coordinator', 'name email')
      .populate('createdBy', 'name');
    res.json(clubs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
