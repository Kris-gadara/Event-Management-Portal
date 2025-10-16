const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');
const facultyController = require('../controllers/facultyController');

const router = express.Router();

// All routes require authentication and faculty role
router.use(authMiddleware);
router.use(checkRole('faculty'));

// Club management
router.post('/create-club', facultyController.createClub);
router.get('/clubs', facultyController.getMyClubs);
router.post('/assign-coordinator', facultyController.assignCoordinator);
router.post('/remove-coordinator', facultyController.removeCoordinator);

// Student list for coordinator assignment
router.get('/students', facultyController.getAllStudents);

// Event verification
router.get('/events/pending', facultyController.getPendingEvents);
router.get('/events/approved', facultyController.getApprovedEvents);
router.put('/verify-event/:id', facultyController.verifyEvent);

module.exports = router;
