const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');
const adminController = require('../controllers/adminController');

const router = express.Router();

// All routes require authentication and admin role
router.use(authMiddleware);
router.use(checkRole('admin'));

// Faculty management
router.post('/register-faculty', adminController.registerFaculty);
router.get('/faculties', adminController.getAllFaculties);
router.put('/faculty/:id', adminController.updateFaculty);
router.delete('/faculty/:id', adminController.deleteFaculty);

module.exports = router;
