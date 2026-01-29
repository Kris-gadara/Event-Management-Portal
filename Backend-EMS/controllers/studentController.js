const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const Event = require('../models/eventModel');
const Club = require('../models/clubModel');
const Feedback = require('../models/feedbackModel');

// Register Student
exports.registerStudent = async (req, res) => {
  try {
    const { name, email, password, department, image, studentId } = req.body;

    // Check if student already exists
    const existingStudent = await User.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Check if studentId already exists
    if (studentId) {
      const existingStudentId = await User.findOne({ studentId });
      if (existingStudentId) {
        return res.status(400).json({ message: 'Student ID already exists' });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create student
    const student = new User({
      name,
      email,
      password: hashedPassword,
      department,
      photo: image || '',
      studentId: studentId || '',
      role: 'student'
    });

    await student.save();

    res.status(201).json({
      message: 'Student registered successfully',
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        studentId: student.studentId
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all published events
exports.getPublishedEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: 'approved' })
      .populate('club', 'name')
      .populate('createdBy', 'name');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all clubs
exports.getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.find()
      .populate('coordinator', 'name email')
      .populate('createdBy', 'name');
    res.json(clubs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Register for an event
exports.registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.status !== 'approved') {
      return res.status(400).json({ message: 'Cannot register for this event' });
    }

    // Check if already registered
    if (event.registeredStudents.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    event.registeredStudents.push(req.user._id);
    await event.save();

    res.json({ message: 'Successfully registered for event', event });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get registered events
exports.getMyRegisteredEvents = async (req, res) => {
  try {
    const events = await Event.find({
      registeredStudents: req.user._id,
      status: 'approved'
    }).populate('club', 'name');

    // For each event, check if user has submitted feedback
    const eventsWithFeedbackStatus = await Promise.all(
      events.map(async (event) => {
        const feedback = await Feedback.findOne({
          event: event._id,
          student: req.user._id
        });

        return {
          ...event.toObject(),
          userHasFeedback: !!feedback
        };
      })
    );

    res.json(eventsWithFeedbackStatus);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Submit feedback
exports.submitFeedback = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { rating, comment } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if student is registered
    if (!event.registeredStudents.includes(req.user._id)) {
      return res.status(403).json({ message: 'You must be registered for this event to give feedback' });
    }

    // Check if event date has passed
    if (new Date(event.date) > new Date()) {
      return res.status(400).json({ message: 'Cannot give feedback before event date' });
    }

    // Check if feedback already exists
    const existingFeedback = await Feedback.findOne({
      event: eventId,
      student: req.user._id
    });

    if (existingFeedback) {
      return res.status(400).json({ message: 'Feedback already submitted' });
    }

    const feedback = new Feedback({
      event: eventId,
      student: req.user._id,
      rating,
      comment
    });

    await feedback.save();

    res.status(201).json({ message: 'Feedback submitted successfully', feedback });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Submit review for an event
exports.submitReview = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { rating, comment } = req.body;

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if student is registered for the event
    if (!event.registeredStudents.includes(req.user._id)) {
      return res.status(403).json({ message: 'You must be registered for this event to submit a review' });
    }

    // Check if event date has passed
    if (new Date(event.date) > new Date()) {
      return res.status(400).json({ message: 'Cannot submit review before event date' });
    }

    // Check if review already exists
    const existingReview = event.reviews.find(
      review => review.student.toString() === req.user._id.toString()
    );

    if (existingReview) {
      return res.status(400).json({ message: 'You have already submitted a review for this event' });
    }

    // Add review to event
    event.reviews.push({
      student: req.user._id,
      studentName: req.user.name,
      rating,
      comment,
      createdAt: new Date()
    });

    await event.save();

    res.status(201).json({ message: 'Review submitted successfully ⭐', review: event.reviews[event.reviews.length - 1] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
