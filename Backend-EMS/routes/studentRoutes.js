const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');
const studentController = require('../controllers/studentController');

const router = express.Router();

// Public route - student registration
router.post('/register', studentController.registerStudent);

// Protected routes - require authentication and student role
router.use(authMiddleware);
router.use(checkRole('student'));

// View events and clubs
router.get('/events', studentController.getPublishedEvents);
router.get('/clubs', studentController.getAllClubs);

// Event registration
router.post('/register-event/:eventId', studentController.registerForEvent);
router.get('/my-events', studentController.getMyRegisteredEvents);

// Feedback
router.post('/feedback/:eventId', studentController.submitFeedback);

// Review
router.post('/review/:eventId', studentController.submitReview);

module.exports = router;
