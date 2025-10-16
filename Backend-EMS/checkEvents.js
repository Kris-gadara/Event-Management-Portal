// Check Events Status
// Run: node checkEvents.js

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/event-management', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async function () {
  console.log('✅ Connected to MongoDB\n');

  try {
    const Event = mongoose.model('Event', new mongoose.Schema({}, { strict: false }));

    const allEvents = await Event.find({});
    console.log(`📊 Total Events: ${allEvents.length}\n`);

    const pending = allEvents.filter(e => e.status === 'pending');
    const approved = allEvents.filter(e => e.status === 'approved');
    const rejected = allEvents.filter(e => e.status === 'rejected');

    console.log(`🟡 Pending: ${pending.length}`);
    if (pending.length > 0) {
      pending.forEach(e => console.log(`   - ${e.name}`));
    }

    console.log(`\n🟢 Approved: ${approved.length}`);
    if (approved.length > 0) {
      approved.forEach(e => console.log(`   - ${e.name}`));
    }

    console.log(`\n🔴 Rejected: ${rejected.length}`);
    if (rejected.length > 0) {
      rejected.forEach(e => console.log(`   - ${e.name}`));
    }

    if (pending.length > 0) {
      console.log('\n💡 TIP: Login as Faculty to approve pending events!');
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
});
