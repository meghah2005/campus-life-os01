/**
 * Campus Life OS Database Seeder
 * Seeds the main application database with student, task, auth, and campus data
 */

const mongoose = require('mongoose');
const SeedRunner = require('../utils/seed-runner');
const { studentData, tasksData, authData, campusData } = require('./data');

const MONGODB_URI = 'mongodb://localhost:27017/campus_life_os';

/**
 * Main seeding function for campus_life_os database
 */
async function seedCampusLifeOS(runner) {
  console.log('\n📚 Seeding Campus Life OS Database');
  console.log('=====================================');

  // Define State schema for Mongoose
  const stateSchema = new mongoose.Schema({
    key: String,
    value: mongoose.Schema.Types.Mixed,
    createdAt: { type: Date, default: Date.now }
  });

  const State = mongoose.model('State', stateSchema);

  // Clear existing data
  await State.deleteMany({});
  console.log('  ✓ Cleared existing State documents');

  // Prepare all state documents
  const stateDocuments = [
    // Student Service
    { key: 'student:profile', value: studentData.profile },
    { key: 'student:stats', value: studentData.stats },
    { key: 'student:activity', value: studentData.activity },
    { key: 'student:gpa-courses', value: studentData.gpaCoursesForGpaCalculator },
    { key: 'student:attendance', value: studentData.attendance },
    { key: 'student:meal-plan', value: studentData.mealPlan },

    // Tasks Service
    { key: 'tasks:items', value: tasksData },

    // Auth Service
    { key: 'auth:users', value: authData },

    // Campus Service
    { key: 'campus:lost-found-items', value: campusData.lostFoundItems },
    { key: 'campus:lost-found-contact-requests', value: [] },
    { key: 'campus:rides', value: campusData.rides },
    { key: 'campus:notes', value: campusData.notes },
    { key: 'campus:marketplace-contacts', value: campusData.marketplaceContacts },
    { key: 'campus:directory-contacts', value: campusData.directoryContacts },

    // Notifications Service
    { key: 'notifications:items', value: [] }
  ];

  // Insert state documents
  const result = await State.insertMany(stateDocuments);
  console.log(`\n  ✓ Inserted ${result.length} state documents:`);

  const categories = {
    'student': ['profile', 'stats', 'activity', 'gpa-courses', 'attendance', 'meal-plan'],
    'tasks': ['items'],
    'auth': ['users'],
    'campus': ['lost-found-items', 'lost-found-contact-requests', 'rides', 'notes', 'marketplace-contacts', 'directory-contacts'],
    'notifications': ['items']
  };

  Object.entries(categories).forEach(([service, keys]) => {
    console.log(`    ${service}:`);
    keys.forEach(key => {
      const doc = stateDocuments.find(d => d.key === `${service}:${key}`);
      const count = Array.isArray(doc.value) ? doc.value.length : 1;
      console.log(`      - ${key}: ${count}`);
    });
  });

  console.log('\n  ✓ Campus Life OS database seeded successfully');
}

/**
 * Run the seeder
 */
async function run() {
  const runner = new SeedRunner(MONGODB_URI, 'campus_life_os');
  const success = await runner.run(seedCampusLifeOS);

  if (success) {
    console.log('\n✅ Seeding completed successfully!\n');
    process.exit(0);
  } else {
    console.log('\n❌ Seeding failed!\n');
    process.exit(1);
  }
}

// Export for use as module
module.exports = { seedCampusLifeOS };

// Run directly if executed as script
if (require.main === module) {
  run();
}
