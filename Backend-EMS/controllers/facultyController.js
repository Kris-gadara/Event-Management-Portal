const Club = require('../models/clubModel');
const Event = require('../models/eventModel');
const User = require('../models/userModel');

// Create Club
exports.createClub = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    const club = new Club({
      name,
      description,
      image: image || '',
      createdBy: req.user._id
    });

    await club.save();

    res.status(201).json({ message: 'Club created successfully', club });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all clubs created by faculty
exports.getMyClubs = async (req, res) => {
  try {
    const clubs = await Club.find({ createdBy: req.user._id })
      .populate('coordinator', 'name email');
    res.json(clubs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Assign coordinator to club
exports.assignCoordinator = async (req, res) => {
  try {
    const { clubId, studentId } = req.body;

    const club = await Club.findOne({ _id: clubId, createdBy: req.user._id });
    if (!club) {
      return res.status(404).json({ message: 'Club not found or unauthorized' });
    }

    const student = await User.findOne({ _id: studentId, role: 'student' });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Update student role to coordinator
    student.role = 'coordinator';
    student.assignedClub = clubId;
    await student.save();

    // Update club
    club.coordinator = studentId;
    await club.save();

    res.json({ message: 'Coordinator assigned successfully', club });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Remove coordinator from club
exports.removeCoordinator = async (req, res) => {
  try {
    const { clubId } = req.body;

    const club = await Club.findOne({ _id: clubId, createdBy: req.user._id });
    if (!club) {
      return res.status(404).json({ message: 'Club not found or unauthorized' });
    }

    if (club.coordinator) {
      // Change coordinator back to student
      await User.findByIdAndUpdate(club.coordinator, {
        role: 'student',
        assignedClub: null
      });
    }

    club.coordinator = null;
    await club.save();

    res.json({ message: 'Coordinator removed successfully', club });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all students for dropdown
exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('name email');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get pending events
exports.getPendingEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: 'pending' })
      .populate('createdBy', 'name email')
      .populate('club', 'name');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get approved events
exports.getApprovedEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: 'approved' })
      .populate('createdBy', 'name email')
      .populate('club', 'name');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Verify and approve event
exports.verifyEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, name, description, date, time, venue, address, contactEmail } = req.body;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Update event details if provided
    if (name) event.name = name;
    if (description) event.description = description;
    if (date) event.date = date;
    if (time) event.time = time;
    if (venue) event.venue = venue;
    if (address) event.address = address;
    if (contactEmail) event.contactEmail = contactEmail;

    event.status = status || 'approved';
    await event.save();

    res.json({ message: 'Event verified successfully', event });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
