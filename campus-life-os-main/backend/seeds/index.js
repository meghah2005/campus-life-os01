#!/usr/bin/env node

/**
 * Main Database Seeding Orchestrator
 * Runs all database seeders in sequence:
 * 1. Campus Life OS - Main application database
 * 2. FocusUp - Study analytics and group collaboration
 * 3. Config - Application configuration and feature flags
 *
 * Usage: npm run seed
 * Or: node seeds/index.js
 */

const path = require('path');
const { seedCampusLifeOS } = require('./campus-life-os/seeder');
const { seedFocusUp } = require('./focusup/seeder');
const { seedConfig } = require('./config/seeder');
const SeedRunner = require('./utils/seed-runner');

/**
 * Run all seeders in sequence
 */
async function runAllSeeders() {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   Campus Life OS - Database Seeding    ║');
  console.log('╚════════════════════════════════════════╝');

  const seeders = [
    {
      name: 'Campus Life OS',
      uri: 'mongodb://localhost:27017/campus_life_os',
      fn: seedCampusLifeOS
    },
    {
      name: 'FocusUp',
      uri: 'mongodb://localhost:27017/focusup',
      fn: seedFocusUp
    },
    {
      name: 'Config',
      uri: 'mongodb://localhost:27017/config',
      fn: seedConfig
    }
  ];

  let successCount = 0;
  let failureCount = 0;

  for (const seeder of seeders) {
    const runner = new SeedRunner(seeder.uri, seeder.name);
    const success = await runner.run(seeder.fn);

    if (success) {
      successCount++;
    } else {
      failureCount++;
    }

    // Add spacing between seeders
    console.log('');
  }

  // Summary
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║          Seeding Summary               ║');
  console.log('╚════════════════════════════════════════╝\n');
  console.log(`  Successful: ${successCount}/${seeders.length}`);
  console.log(`  Failed: ${failureCount}/${seeders.length}`);

  if (failureCount === 0) {
    console.log('\n✅ All databases seeded successfully!');
    console.log('\n📍 Next Steps:');
    console.log('  1. Start all backend services: npm run dev');
    console.log('  2. Open dashboard to verify data is loaded');
    console.log('  3. Check MongoDB Compass to inspect collections\n');
    process.exit(0);
  } else {
    console.log('\n❌ Some databases failed to seed. Check errors above.\n');
    process.exit(1);
  }
}

// Run the seeders
runAllSeeders().catch(error => {
  console.error('\n❌ Fatal error during seeding:', error.message);
  process.exit(1);
});
