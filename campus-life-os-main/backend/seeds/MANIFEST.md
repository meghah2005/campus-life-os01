/**
 * SEEDS DIRECTORY - INDEX & MANIFEST
 * 
 * This file documents the complete structure of the database seeding system
 * for Campus Life OS.
 * 
 * @version 1.0.0
 * @author Team
 * @description Modular MongoDB seeding with clean separation of concerns
 */

/*
  PROJECT STRUCTURE
  =================

  backend/seeds/
  ├── index.js                      [ENTRY POINT] Orchestrates all seeders
  ├── utils/
  │   └── seed-runner.js            [SHARED] Common database operations
  │
  ├── campus-life-os/               [DATABASE 1]
  │   ├── data.js                   └─ Seed data (student, tasks, auth, campus)
  │   └── seeder.js                 └─ Seeder script for campus_life_os
  │
  ├── focusup/                      [DATABASE 2]
  │   ├── data.js                   └─ Seed data (analytics, groups, sessions)
  │   └── seeder.js                 └─ Seeder script for focusup
  │
  ├── config/                       [DATABASE 3]
  │   ├── data.js                   └─ Seed data (settings, features, notifications)
  │   └── seeder.js                 └─ Seeder script for config
  │
  ├── README.md                     [DOCS] Complete documentation
  ├── SETUP.md                      [DOCS] Quick start guide
  └── MANIFEST.md                   [DOCS] This file


  EXECUTION FLOW
  ==============

  1. Run: node seeds/index.js
     ↓
  2. Orchestrator loads all seeders
     ↓
  3. Campus Life OS seeder runs
     ├─ Connects to mongodb://localhost:27017/campus_life_os
     ├─ Clears State collection
     ├─ Inserts 15+ State documents
     └─ Disconnects
     ↓
  4. FocusUp seeder runs
     ├─ Connects to mongodb://localhost:27017/focusup
     ├─ Seeds 5 collections (analytics, contents, groups, sessions, users)
     ├─ Total: 20 documents
     └─ Disconnects
     ↓
  5. Config seeder runs
     ├─ Connects to mongodb://localhost:27017/config
     ├─ Seeds 3 collections (settings, features, notifications_config)
     ├─ Total: 14 documents
     └─ Disconnects
     ↓
  6. Summary report displays
  7. Process exits with status 0 (success) or 1 (failure)


  DATABASE SCHEMAS
  ================

  CAMPUS_LIFE_OS
  ──────────────
  Collection: State
  Documents:
    ├─ student:profile              Object      Student profile
    ├─ student:stats                Array       Dashboard stats
    ├─ student:activity             Array       Activity log
    ├─ student:gpa-courses          Array       GPA calculator courses
    ├─ student:attendance           Array       Attendance records
    ├─ student:meal-plan            Object      Meal plan info
    ├─ tasks:items                  Array       Deadlines/assignments
    ├─ auth:users                   Array       User accounts
    ├─ campus:lost-found-items      Array       Lost & found items
    ├─ campus:lost-found-contact-requests Array
    ├─ campus:rides                 Array       Ride-sharing offers
    ├─ campus:notes                 Array       Shared study notes
    ├─ campus:marketplace-contacts  Array       Service providers
    ├─ campus:directory-contacts    Array       Campus directory
    └─ notifications:items          Array       User reminders

  FOCUSUP
  ───────
  Collections:
    ├─ analytics                    3 docs      Focus session metrics
    ├─ contents                     4 docs      Study resources
    ├─ groups                       4 docs      Study groups
    ├─ sessions                     6 docs      Study group meetings
    └─ users                        3 docs      User profiles
  (Total: 20 documents)

  CONFIG
  ──────
  Collections:
    ├─ settings                     7 docs      App configuration
    ├─ features                     4 docs      Feature flags
    └─ notifications_config         3 docs      Notification settings
  (Total: 14 documents)


  KEY CLASSES & UTILITIES
  =======================

  SeedRunner (utils/seed-runner.js)
  ─────────────────────────────────
  Methods:
    ├─ connect()                    Connect to MongoDB
    ├─ disconnect()                 Disconnect from MongoDB
    ├─ clearCollection(name)        Delete all documents in collection
    ├─ seedCollection(name, data)   Insert documents into collection
    └─ run(seedFn)                  Execute seeding function with lifecycle

  Seed Functions
  ──────────────
  ├─ seedCampusLifeOS(runner)       Seeds main application database
  ├─ seedFocusUp(runner)            Seeds study analytics database
  └─ seedConfig(runner)             Seeds configuration database


  DATA ORGANIZATION
  =================

  campus-life-os/data.js
  ────────────────────
  Exports:
    ├─ studentData                  Student profile and stats
    ├─ tasksData                    Assignments and deadlines
    ├─ authData                     User authentication
    └─ campusData                   Campus resources (rides, notes, lost-found, etc.)

  focusup/data.js
  ───────────────
  Exports:
    ├─ analyticsData                Focus session analytics
    ├─ contentsData                 Study materials and resources
    ├─ groupsData                   Study group definitions
    ├─ sessionsData                 Study group meeting records
    └─ usersData                    User profiles

  config/data.js
  ──────────────
  Exports:
    ├─ settingsData                 Application settings (7 items)
    ├─ featuresData                 Feature flags (4 items)
    └─ notificationsConfigData      Notification configurations (3 items)


  USAGE EXAMPLES
  ==============

  # Seed all databases
  node seeds/index.js

  # Seed individual database
  node seeds/campus-life-os/seeder.js
  node seeds/focusup/seeder.js
  node seeds/config/seeder.js

  # From service directory with npm script
  npm run seed                       (requires script in package.json)


  CUSTOMIZATION GUIDE
  ===================

  To add a new field to student profile:
    1. Edit: seeds/campus-life-os/data.js
    2. Modify: studentData.profile
    3. Run: node seeds/campus-life-os/seeder.js

  To add a new study group:
    1. Edit: seeds/focusup/data.js
    2. Modify: groupsData array
    3. Run: node seeds/focusup/seeder.js

  To add a new setting:
    1. Edit: seeds/config/data.js
    2. Modify: settingsData array
    3. Run: node seeds/config/seeder.js

  To add a new State document in campus_life_os:
    1. Edit: seeds/campus-life-os/data.js
    2. Add data to appropriate object (studentData, tasksData, etc.)
    3. In seeder.js, add entry to stateDocuments array
    4. Run: node seeds/campus-life-os/seeder.js


  BENEFITS OF THIS STRUCTURE
  ==========================

  ✅ Modularity
     └─ Each database is independent and can be seeded separately

  ✅ Reusability
     └─ Shared SeedRunner class eliminates code duplication

  ✅ Scalability
     └─ Easy to add new databases or collections

  ✅ Maintainability
     └─ Clear separation of data and seeding logic

  ✅ Clarity
     └─ Self-documenting code with logical organization

  ✅ Testability
     └─ Each seeder can be tested independently

  ✅ Team Collaboration
     └─ Different team members can manage different databases


  VERIFICATION CHECKLIST
  =====================

  After running seeders, verify:
    ☐ All three databases exist in MongoDB
    ☐ campus_life_os has State collection with 15+ documents
    ☐ focusup has 5 collections with 20 documents total
    ☐ config has 3 collections with 14 documents total
    ☐ Dashboard displays student profile and stats
    ☐ API gateway aggregation endpoint returns data
    ☐ No console errors in seeder output


  TROUBLESHOOTING
  ===============

  MongoDB not connecting?
    └─ Start MongoDB: mongosh or MongoDB service

  Module not found?
    └─ Ensure mongoose is installed in project

  Collections not created?
    └─ Verify MongoDB is running and accessible

  Data not showing in dashboard?
    └─ Restart services and clear browser cache


  RELATED FILES
  =============

  Main orchestrator:      seeds/index.js
  Full documentation:     seeds/README.md
  Quick start guide:      seeds/SETUP.md
  Database manifest:      seeds/MANIFEST.md (this file)

*/

// CONFIG
const DATABASES = {
  CAMPUS_LIFE_OS: {
    uri: 'mongodb://localhost:27017/campus_life_os',
    collections: 1,
    documents: 15,
    purpose: 'Main application database'
  },
  FOCUSUP: {
    uri: 'mongodb://localhost:27017/focusup',
    collections: 5,
    documents: 20,
    purpose: 'Study analytics and collaboration'
  },
  CONFIG: {
    uri: 'mongodb://localhost:27017/config',
    collections: 3,
    documents: 14,
    purpose: 'Application configuration'
  }
};

// TOTALS
const TOTALS = {
  DATABASES: Object.keys(DATABASES).length,
  COLLECTIONS: Object.values(DATABASES).reduce((sum, db) => sum + db.collections, 0),
  DOCUMENTS: Object.values(DATABASES).reduce((sum, db) => sum + db.documents, 0)
};

module.exports = {
  DATABASES,
  TOTALS,
  version: '1.0.0',
  lastUpdated: '2026-03-27'
};
