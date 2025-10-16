// Quick Test Script - Approve All Pending Events
// Run this in Backend-EMS folder: node approveAllEvents.js

const mongoose = require('mongoose');
const Event = require('./models/eventModel');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/event-management', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const approveAllPendingEvents = async () => {
  try {
    const result = await Event.updateMany(
      { status: 'pending' },
      { $set: { status: 'approved' } }
    );

    console.log(`✅ Approved ${result.modifiedCount} pending events`);

    const allEvents = await Event.find({}).populate('club', 'name');
    console.log('\n📋 All Events:');
    allEvents.forEach(event => {
      console.log(`- ${event.name} (${event.status}) - Club: ${event.club?.name || 'N/A'}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

approveAllPendingEvents();
