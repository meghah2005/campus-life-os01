/**
 * FocusUp Database Seeder
 * Seeds the study analytics and group collaboration database
 */

const mongoose = require('mongoose');
const SeedRunner = require('../utils/seed-runner');
const { analyticsData, contentsData, groupsData, sessionsData, usersData } = require('./data');

const MONGODB_URI = 'mongodb://localhost:27017/focusup';

/**
 * Main seeding function for focusup database
 */
async function seedFocusUp(runner) {
  console.log('\n🎯 Seeding FocusUp Database');
  console.log('============================');

  const collectionCount = {
    analytics: analyticsData.length,
    contents: contentsData.length,
    groups: groupsData.length,
    sessions: sessionsData.length,
    users: usersData.length
  };

  // Seed collections
  await runner.seedCollection('analytics', analyticsData);
  await runner.seedCollection('contents', contentsData);
  await runner.seedCollection('groups', groupsData);
  await runner.seedCollection('sessions', sessionsData);
  await runner.seedCollection('users', usersData);

  console.log('\n  📊 Collection Summary:');
  console.log(`    - analytics: ${collectionCount.analytics} documents`);
  console.log(`    - contents: ${collectionCount.contents} documents`);
  console.log(`    - groups: ${collectionCount.groups} documents`);
  console.log(`    - sessions: ${collectionCount.sessions} documents`);
  console.log(`    - users: ${collectionCount.users} documents`);

  const total = Object.values(collectionCount).reduce((a, b) => a + b, 0);
  console.log(`\n  ✓ Total documents seeded: ${total}`);
  console.log('  ✓ FocusUp database seeded successfully');
}

/**
 * Run the seeder
 */
async function run() {
  const runner = new SeedRunner(MONGODB_URI, 'focusup');
  const success = await runner.run(seedFocusUp);

  if (success) {
    console.log('\n✅ Seeding completed successfully!\n');
    process.exit(0);
  } else {
    console.log('\n❌ Seeding failed!\n');
    process.exit(1);
  }
}

// Export for use as module
module.exports = { seedFocusUp };

// Run directly if executed as script
if (require.main === module) {
  run();
}
