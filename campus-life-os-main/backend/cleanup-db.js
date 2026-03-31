const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/campus_life_os';

const stateSchema = new mongoose.Schema({
  key: String,
  value: mongoose.Schema.Types.Mixed
});

const State = mongoose.model('State', stateSchema);

async function cleanupDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const result = await State.deleteMany({});
    console.log(`✓ Deleted ${result.deletedCount} State documents`);
    console.log('✓ Database cleared. Services will start fresh on next startup.');

    await mongoose.disconnect();
    console.log('✓ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

cleanupDatabase();
