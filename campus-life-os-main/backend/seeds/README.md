# Database Seeding Documentation

This directory contains a modular, well-organized database seeding system for Campus Life OS. It manages sample data for three MongoDB databases with clean separation of concerns.

## Directory Structure

```
seeds/
├── index.js                           # Main orchestrator - runs all seeders
├── utils/
│   └── seed-runner.js                 # Shared utilities for database operations
├── campus-life-os/                    # Main application database
│   ├── data.js                        # Seed data for all services
│   └── seeder.js                      # Campus Life OS seeder script
├── focusup/                           # Study analytics & collaboration database
│   ├── data.js                        # Analytics, groups, sessions data
│   └── seeder.js                      # FocusUp seeder script
├── config/                            # Application configuration database
│   ├── data.js                        # Settings, features, notifications
│   └── seeder.js                      # Config seeder script
└── README.md                          # This file
```

## Database Overview

### 1. Campus Life OS (`campus_life_os`)
**Purpose:** Main application database containing core service data

**Collections (as State documents):**
- **Student Service**
  - `student:profile` - User profile information
  - `student:stats` - Statistics dashboard data
  - `student:activity` - Activity logs
  - `student:gpa-courses` - GPA calculator course records
  - `student:attendance` - Class attendance tracking
  - `student:meal-plan` - Dining plan information

- **Tasks Service**
  - `tasks:items` - User deadlines and assignments

- **Auth Service**
  - `auth:users` - User authentication records

- **Campus Service**
  - `campus:lost-found-items` - Lost and found items
  - `campus:lost-found-contact-requests` - Contact requests
  - `campus:rides` - Ride-sharing offers
  - `campus:notes` - Shared study notes
  - `campus:marketplace-contacts` - Service providers
  - `campus:directory-contacts` - Campus directory

- **Notifications Service**
  - `notifications:items` - User reminders

### 2. FocusUp (`focusup`)
**Purpose:** Study analytics and group collaboration platform

**Collections:**
- **analytics** - User focus session metrics
- **contents** - Study resources and materials
- **groups** - Study group definitions
- **sessions** - Study group meeting schedules
- **users** - User profiles

### 3. Config (`config`)
**Purpose:** Application configuration and feature management

**Collections:**
- **settings** - App settings and system configuration
- **features** - Feature flags and beta features
- **notifications_config** - Notification type configurations

## Usage

### Seed All Databases
```bash
# From project root
npm run seed

# Or from backend directory
node seeds/index.js
```

### Seed Individual Databases
```bash
cd backend

# Seed only Campus Life OS
node seeds/campus-life-os/seeder.js

# Seed only FocusUp
node seeds/focusup/seeder.js

# Seed only Config
node seeds/config/seeder.js
```

## Adding Custom Data

### To Add Data to Campus Life OS:

1. Edit `seeds/campus-life-os/data.js`
2. Update the relevant section (e.g., `studentData`, `tasksData`, etc.)
3. Run: `node seeds/campus-life-os/seeder.js`

Example:
```javascript
// In seeds/campus-life-os/data.js
const tasksData = [
  { id: 1, title: 'My Task', dueDate: '2026-04-15', priority: 'high', completed: false },
  // Add more tasks here
];
```

### To Add Data to FocusUp:

1. Edit `seeds/focusup/data.js`
2. Update the relevant collection data
3. Run: `node seeds/focusup/seeder.js`

### To Add Configuration:

1. Edit `seeds/config/data.js`
2. Add entries to `settingsData`, `featuresData`, or `notificationsConfigData`
3. Run: `node seeds/config/seeder.js`

## Key Features of This Structure

### ✅ Modularity
- Each database has its own seeder
- Data and seeding logic are separated
- Easy to maintain and extend

### ✅ Reusability
- Shared `SeedRunner` class handles common operations
- Consistent error handling across all seeders
- Connection management automated

### ✅ Clarity
- Clear data organization by service
- Descriptive variable names
- Commented code sections

### ✅ Maintainability
- Each seeder is standalone and can run independently
- Easy to add new collections
- Centralized orchestration in `index.js`

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Ensure MongoDB is running locally:
```bash
# Windows (if using MongoDB Community Edition)
mongosh

# Or start MongoDB service if installed
```

### Collections Already Exist
All seeders **clear existing data** before inserting new seed data. This ensures clean databases on each run.

### Check Seeded Data in MongoDB Compass
1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. View the three databases:
   - `campus_life_os` - Browse State collection
   - `focusup` - Browse 5 collections
   - `config` - Browse 3 collections

## npm Scripts Reference

Add these to `backend/package.json`:
```json
{
  "scripts": {
    "seed": "node seeds/index.js",
    "seed:campus": "node seeds/campus-life-os/seeder.js",
    "seed:focusup": "node seeds/focusup/seeder.js",
    "seed:config": "node seeds/config/seeder.js"
  }
}
```

## Sample Data Overview

- **Student Profile:** Alex Johnson (Junior, CS, GPA 3.7)
- **Tasks:** 4 assignments with various priorities
- **Study Groups:** 4 active groups across different subjects
- **Analytics:** 3 users with focus session data
- **Features:** Study Timer, Group Sessions, Analytics, Marketplace
- **Settings:** 7 configuration parameters

---

For more information, see the individual seeder comments in each file.
