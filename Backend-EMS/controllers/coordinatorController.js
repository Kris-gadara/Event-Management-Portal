const Event = require('../models/eventModel');

// Create Event
exports.createEvent = async (req, res) => {
  try {
    const {
      name,
      description,
      date,
      time,
      venue,
      address,
      contactEmail,
      image,
      primaryImage,
      additionalImages,
      additionalDescriptions
    } = req.body;

    if (req.user.role !== 'coordinator') {
      return res.status(403).json({ message: 'Only coordinators can create events' });
    }

    const event = new Event({
      name,
      description,
      date,
      time,
      venue,
      address,
      contactEmail,
      image: image || primaryImage || '', // Fallback for backward compatibility
      primaryImage: primaryImage || image || '',
      additionalImages: additionalImages || [],
      additionalDescriptions: additionalDescriptions || [],
      createdBy: req.user._id,
      club: req.user.assignedClub,
      status: 'pending'
    });

    await event.save();

    res.status(201).json({ message: 'Event created and sent for verification', event });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get events created by coordinator
exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.user._id })
      .populate('club', 'name');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update event (before approval)
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      date,
      time,
      venue,
      address,
      contactEmail,
      image,
      primaryImage,
      additionalImages,
      additionalDescriptions
    } = req.body;

    const event = await Event.findOne({ _id: id, createdBy: req.user._id });

    if (!event) {
      return res.status(404).json({ message: 'Event not found or unauthorized' });
    }

    if (event.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot update approved or rejected events' });
    }

    event.name = name || event.name;
    event.description = description || event.description;
    event.date = date || event.date;
    event.time = time || event.time;
    event.venue = venue || event.venue;
    event.address = address || event.address;
    event.contactEmail = contactEmail || event.contactEmail;
    event.image = image || primaryImage || event.image;
    event.primaryImage = primaryImage || image || event.primaryImage;
    event.additionalImages = additionalImages || event.additionalImages;
    event.additionalDescriptions = additionalDescriptions || event.additionalDescriptions;

    await event.save();

    res.json({ message: 'Event updated successfully', event });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get participants for a specific event
exports.getEventParticipants = async (req, res) => {
  try {
    const { eventId } = req.params;
    const Feedback = require('../models/feedbackModel');

    console.log('Fetching participants for event:', eventId);
    console.log('Coordinator ID:', req.user._id);

    // Find the event and verify it belongs to this coordinator
    const event = await Event.findOne({
      _id: eventId,
      createdBy: req.user._id
    })
      .populate('club', 'name')
      .populate({
        path: 'registeredStudents',
        select: 'name email studentId department photo contactNo'
      });

    console.log('Event found:', event ? 'Yes' : 'No');

    if (!event) {
      console.log('Event not found or unauthorized');
      return res.status(404).json({ message: 'Event not found or unauthorized' });
    }

    console.log('Registered students count:', event.registeredStudents.length);

    // Fetch feedback for this event
    const feedbacks = await Feedback.find({ event: eventId })
      .populate('student', 'name')
      .select('student rating comment createdAt');

    console.log('Feedbacks found:', feedbacks.length);

    // Return event details with participants and feedback
    res.json({
      event: {
        _id: event._id,
        name: event.name,
        description: event.description,
        date: event.date,
        time: event.time,
        venue: event.venue,
        address: event.address,
        contactEmail: event.contactEmail,
        club: event.club,
        status: event.status
      },
      participants: event.registeredStudents,
      attendance: event.attendance || [],
      feedbacks: feedbacks || [],
      totalParticipants: event.registeredStudents.length
    });
  } catch (error) {
    console.error('Error in getEventParticipants:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Mark attendance for a student
exports.markAttendance = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { studentId, status } = req.body;

    console.log('Marking attendance:', { eventId, studentId, status });

    if (!['present', 'absent'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be "present" or "absent"' });
    }

    // Find the event and verify it belongs to this coordinator
    const event = await Event.findOne({
      _id: eventId,
      createdBy: req.user._id
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found or unauthorized' });
    }

    // Check if event time has started
    const eventDateTime = new Date(event.date);
    const [hours, minutes] = event.time.split(':');
    eventDateTime.setHours(parseInt(hours), parseInt(minutes), 0);
    const currentTime = new Date();

    if (currentTime < eventDateTime) {
      return res.status(400).json({
        message: 'Cannot mark attendance before event starts',
        eventTime: eventDateTime
      });
    }

    // Check if student is registered for this event
    const isRegistered = event.registeredStudents.some(
      student => student.toString() === studentId
    );

    if (!isRegistered) {
      return res.status(400).json({ message: 'Student is not registered for this event' });
    }

    // Initialize attendance array if it doesn't exist
    if (!event.attendance) {
      event.attendance = [];
    }

    // Check if attendance already marked for this student
    const existingAttendanceIndex = event.attendance.findIndex(
      att => att.student.toString() === studentId
    );

    if (existingAttendanceIndex !== -1) {
      // Update existing attendance
      event.attendance[existingAttendanceIndex].status = status;
      event.attendance[existingAttendanceIndex].markedAt = new Date();
      event.attendance[existingAttendanceIndex].markedBy = req.user._id;
    } else {
      // Add new attendance record
      event.attendance.push({
        student: studentId,
        status: status,
        markedAt: new Date(),
        markedBy: req.user._id
      });
    }

    await event.save();

    res.json({
      message: 'Attendance marked successfully',
      attendance: event.attendance
    });
  } catch (error) {
    console.error('Error in markAttendance:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
