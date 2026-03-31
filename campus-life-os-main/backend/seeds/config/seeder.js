/**
 * Config Database Seeder
 * Seeds the application configuration and feature flags database
 */

const mongoose = require('mongoose');
const SeedRunner = require('../utils/seed-runner');
const { settingsData, featuresData, notificationsConfigData } = require('./data');

const MONGODB_URI = 'mongodb://localhost:27017/config';

/**
 * Main seeding function for config database
 */
async function seedConfig(runner) {
  console.log('\n⚙️ Seeding Config Database');
  console.log('==========================');

  // Seed collections
  await runner.seedCollection('settings', settingsData);
  await runner.seedCollection('features', featuresData);
  await runner.seedCollection('notifications_config', notificationsConfigData);

  console.log('\n  🔧 Collection Summary:');
  console.log(`    - settings: ${settingsData.length} records`);
  console.log(`    - features: ${featuresData.length} records`);
  console.log(`    - notifications_config: ${notificationsConfigData.length} records`);

  const total = settingsData.length + featuresData.length + notificationsConfigData.length;
  console.log(`\n  ✓ Total records seeded: ${total}`);
  console.log('  ✓ Config database seeded successfully');
}

/**
 * Run the seeder
 */
async function run() {
  const runner = new SeedRunner(MONGODB_URI, 'config');
  const success = await runner.run(seedConfig);

  if (success) {
    console.log('\n✅ Seeding completed successfully!\n');
    process.exit(0);
  } else {
    console.log('\n❌ Seeding failed!\n');
    process.exit(1);
  }
}

// Export for use as module
module.exports = { seedConfig };

// Run directly if executed as script
if (require.main === module) {
  run();
}
