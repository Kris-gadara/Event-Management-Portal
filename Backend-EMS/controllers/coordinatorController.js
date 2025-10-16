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
