const Club = require('../models/clubModel');
const Event = require('../models/eventModel');
const User = require('../models/userModel');
const Feedback = require('../models/feedbackModel');

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
      .populate('coordinators', 'name email');
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

    // Check if student is already a coordinator of this club
    if (club.coordinators && club.coordinators.includes(studentId)) {
      return res.status(400).json({ message: 'Student is already a coordinator of this club' });
    }

    // Update student role to coordinator
    student.role = 'coordinator';
    student.assignedClub = clubId;
    await student.save();

    // Add coordinator to club's coordinators array
    if (!club.coordinators) {
      club.coordinators = [];
    }
    club.coordinators.push(studentId);
    await club.save();

    // Populate coordinators before sending response
    await club.populate('coordinators', 'name email');

    res.json({ message: 'Coordinator assigned successfully', club });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Remove coordinator from club
exports.removeCoordinator = async (req, res) => {
  try {
    const { clubId, coordinatorId } = req.body;

    const club = await Club.findOne({ _id: clubId, createdBy: req.user._id });
    if (!club) {
      return res.status(404).json({ message: 'Club not found or unauthorized' });
    }

    if (!coordinatorId) {
      return res.status(400).json({ message: 'Coordinator ID is required' });
    }

    // Check if coordinator exists in the club
    if (!club.coordinators || !club.coordinators.includes(coordinatorId)) {
      return res.status(404).json({ message: 'Coordinator not found in this club' });
    }

    // Change coordinator back to student
    await User.findByIdAndUpdate(coordinatorId, {
      role: 'student',
      assignedClub: null
    });

    // Remove coordinator from array
    club.coordinators = club.coordinators.filter(
      coord => coord.toString() !== coordinatorId.toString()
    );
    await club.save();

    // Populate coordinators before sending response
    await club.populate('coordinators', 'name email');

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

// Delete Event
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await Event.findByIdAndDelete(id);

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Generate and download event report (Excel)
exports.downloadEventReport = async (req, res) => {
  try {
    const { id } = req.params;
    const XLSX = require('xlsx');

    // Find the event with populated data
    const event = await Event.findById(id)
      .populate('club', 'name')
      .populate({
        path: 'registeredStudents',
        select: 'name email studentId department contactNo'
      })
      .populate({
        path: 'createdBy',
        select: 'name email'
      });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Fetch feedback for this event
    const feedbacks = await Feedback.find({ event: id })
      .populate('student', 'name _id');

    // Prepare participant data with attendance and feedback
    const participantsData = event.registeredStudents.map((participant, index) => {
      const attendanceRecord = event.attendance?.find(att => att.student.toString() === participant._id.toString());
      const attendanceStatus = attendanceRecord
        ? (attendanceRecord.status === 'present' ? 'Present' : 'Absent')
        : 'Not Marked';

      const feedbackRecord = feedbacks.find(fb => fb.student._id.toString() === participant._id.toString());
      const feedbackRating = feedbackRecord ? `${feedbackRecord.rating}/5 stars` : 'Not Submitted';
      const feedbackComment = feedbackRecord ? feedbackRecord.comment : 'N/A';

      return {
        'S.No': index + 1,
        'Student ID': participant.studentId || 'N/A',
        'Name': participant.name,
        'Email': participant.email,
        'Department': participant.department || 'N/A',
        'Contact No': participant.contactNo || 'N/A',
        'Feedback Rating': feedbackRating,
        'Feedback Comment': feedbackComment,
        'Attendance': attendanceStatus
      };
    });

    // Event details header
    const eventInfo = [
      { 'S.No': 'Event Report', 'Student ID': '', 'Name': '', 'Email': '', 'Department': '', 'Contact No': '', 'Feedback Rating': '', 'Feedback Comment': '', 'Attendance': '' },
      { 'S.No': '', 'Student ID': '', 'Name': '', 'Email': '', 'Department': '', 'Contact No': '', 'Feedback Rating': '', 'Feedback Comment': '', 'Attendance': '' },
      { 'S.No': 'Event Name', 'Student ID': event.name, 'Name': '', 'Email': '', 'Department': '', 'Contact No': '', 'Feedback Rating': '', 'Feedback Comment': '', 'Attendance': '' },
      { 'S.No': 'Date', 'Student ID': new Date(event.date).toLocaleDateString(), 'Name': '', 'Email': '', 'Department': '', 'Contact No': '', 'Feedback Rating': '', 'Feedback Comment': '', 'Attendance': '' },
      { 'S.No': 'Time', 'Student ID': event.time, 'Name': '', 'Email': '', 'Department': '', 'Contact No': '', 'Feedback Rating': '', 'Feedback Comment': '', 'Attendance': '' },
      { 'S.No': 'Venue', 'Student ID': event.venue, 'Name': '', 'Email': '', 'Department': '', 'Contact No': '', 'Feedback Rating': '', 'Feedback Comment': '', 'Attendance': '' },
      { 'S.No': 'Club', 'Student ID': event.club?.name || 'N/A', 'Name': '', 'Email': '', 'Department': '', 'Contact No': '', 'Feedback Rating': '', 'Feedback Comment': '', 'Attendance': '' },
      { 'S.No': 'Coordinator', 'Student ID': event.createdBy?.name || 'N/A', 'Name': '', 'Email': '', 'Department': '', 'Contact No': '', 'Feedback Rating': '', 'Feedback Comment': '', 'Attendance': '' },
      { 'S.No': 'Total Participants', 'Student ID': event.registeredStudents.length, 'Name': '', 'Email': '', 'Department': '', 'Contact No': '', 'Feedback Rating': '', 'Feedback Comment': '', 'Attendance': '' },
      { 'S.No': 'Total Feedbacks', 'Student ID': feedbacks.length, 'Name': '', 'Email': '', 'Department': '', 'Contact No': '', 'Feedback Rating': '', 'Feedback Comment': '', 'Attendance': '' },
      { 'S.No': 'Total Present', 'Student ID': event.attendance?.filter(a => a.status === 'present').length || 0, 'Name': '', 'Email': '', 'Department': '', 'Contact No': '', 'Feedback Rating': '', 'Feedback Comment': '', 'Attendance': '' },
      { 'S.No': 'Total Absent', 'Student ID': event.attendance?.filter(a => a.status === 'absent').length || 0, 'Name': '', 'Email': '', 'Department': '', 'Contact No': '', 'Feedback Rating': '', 'Feedback Comment': '', 'Attendance': '' },
      { 'S.No': '', 'Student ID': '', 'Name': '', 'Email': '', 'Department': '', 'Contact No': '', 'Feedback Rating': '', 'Feedback Comment': '', 'Attendance': '' },
      { 'S.No': 'Participant List', 'Student ID': '', 'Name': '', 'Email': '', 'Department': '', 'Contact No': '', 'Feedback Rating': '', 'Feedback Comment': '', 'Attendance': '' }
    ];

    const finalData = [...eventInfo, ...participantsData];

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(finalData);

    // Set column widths
    ws['!cols'] = [
      { wch: 8 },  // S.No
      { wch: 15 }, // Student ID
      { wch: 25 }, // Name
      { wch: 30 }, // Email
      { wch: 20 }, // Department
      { wch: 15 }, // Contact No
      { wch: 18 }, // Feedback Rating
      { wch: 40 }, // Feedback Comment
      { wch: 15 }  // Attendance
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Event Report');

    // Generate buffer
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    // Set headers for file download
    const filename = `${event.name.replace(/[^a-z0-9]/gi, '_')}_Attendance_Report.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Send the file
    res.send(buffer);

  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
