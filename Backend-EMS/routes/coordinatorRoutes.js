const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');
const coordinatorController = require('../controllers/coordinatorController');

const router = express.Router();

// All routes require authentication and coordinator role
router.use(authMiddleware);
router.use(checkRole('coordinator'));

// Event management
router.post('/create-event', coordinatorController.createEvent);
router.get('/events', coordinatorController.getMyEvents);
router.put('/event/:id', coordinatorController.updateEvent);

module.exports = router;
