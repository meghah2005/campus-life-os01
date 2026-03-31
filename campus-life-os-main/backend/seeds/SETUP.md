# Seed Database Setup Guide

Quick reference for using the new modular seed system.

## Quick Start

```bash
# 1. Ensure MongoDB is running
# Windows: mongosh (if installed, or start MongoDB service)

# 2. From project root or backend directory
node seeds/index.js

# This will seed all three databases in sequence:
# ✓ campus_life_os (20+ documents)
# ✓ focusup (20 documents)
# ✓ config (14 documents)

# 3. Start services
npm run dev         # Run all services
# Or individually from each service directory
```

## Individual Database Commands

```bash
# Seed only one database
node seeds/campus-life-os/seeder.js    # Main app database
node seeds/focusup/seeder.js           # Study analytics
node seeds/config/seeder.js            # Configuration
```

## Database Contents

| Database | Collections | Purpose |
|----------|-----------|---------|
| **campus_life_os** | State (student, tasks, auth, campus) | Main application data |
| **focusup** | analytics, contents, groups, sessions, users | Study collaboration |
| **config** | settings, features, notifications_config | App configuration |

## File Structure

```
backend/seeds/
├── index.js                      ← Run this for complete seeding
├── utils/seed-runner.js          ← Shared utilities
├── campus-life-os/
│   ├── data.js                   ← Edit to customize student/task data
│   └── seeder.js
├── focusup/
│   ├── data.js                   ← Edit to customize study data
│   └── seeder.js
├── config/
│   ├── data.js                   ← Edit app settings & features
│   └── seeder.js
├── README.md                     ← Full documentation
└── SETUP.md                      ← This file
```

## How to Customize Data

### Example: Change Student Profile
```javascript
// In seeds/campus-life-os/data.js
const studentData = {
  profile: {
    id: 1,
    name: 'Your Name',        // ← Change this
    email: 'your@email.edu',  // ← And this
    level: 'Senior',          // ← And this
    // ... rest of profile
  }
}
```
Then run: `node seeds/campus-life-os/seeder.js`

### Example: Add New Task
```javascript
// In seeds/campus-life-os/data.js
const tasksData = [
  // ... existing tasks
  { id: 5, title: 'New Task', dueDate: '2026-05-01', priority: 'high', completed: false }
];
```
Then run: `node seeds/campus-life-os/seeder.js`

### Example: Disable a Feature
```javascript
// In seeds/config/data.js
const featuresData = [
  { id: 1, name: 'Study Timer', enabled: false, ... },  // ← Set to false
  // ... other features
];
```
Then run: `node seeds/config/seeder.js`

## Verifying Seeded Data

### Using MongoDB Compass
1. Connect to `mongodb://localhost:27017`
2. Check these databases exist:
   - `campus_life_os` - Should have State collection with 15+ documents
   - `focusup` - Should have 5 collections with 20 documents total
   - `config` - Should have 3 collections with 14 documents total

### Using Dashboard
1. Start all services: `npm run dev`
2. Visit frontend (default: `http://localhost:3000`)
3. Check Dashboard - should show:
   - Profile: Alex Johnson
   - Stats: 4 items
   - Deadlines: 4 items
   - Reminders: 4 items

### Using API
```bash
# Check if services are responding
curl http://localhost:4000/api/dashboard-summary

# Should return aggregated data from all services
```

## Troubleshooting

### Issue: "Cannot find module 'mongoose'"
**Solution:** Install mongoose in one service (already done) or run from that service directory

### Issue: "ECONNREFUSED" when connecting to MongoDB
**Solution:** Start MongoDB:
```bash
mongosh
# Or on Windows, start MongoDB service
```

### Issue: Seeded data not showing in dashboard
**Solution:** 
1. Restart all services: `npm run dev`
2. Clear browser cache (Ctrl+F5)
3. Check that service keys match (e.g., `tasks:items` not `tasks:list`)

## NPM Scripts (Optional)

To add convenience scripts, update each service's `package.json`:

```json
{
  "scripts": {
    "seed": "node ../seeds/index.js",
    "seed:campus": "node ../seeds/campus-life-os/seeder.js",
    "seed:focusup": "node ../seeds/focusup/seeder.js",
    "seed:config": "node ../seeds/config/seeder.js"
  }
}
```

Then run: `npm run seed`

## Architecture Benefits

✅ **Modular** - Each database is independent  
✅ **Reusable** - Shared SeedRunner class  
✅ **Scalable** - Easy to add new collections  
✅ **Maintainable** - Clear separation of concerns  
✅ **Documented** - Self-explanatory code  

## Next Steps

1. Review the structure in the editor
2. Run `node seeds/index.js` to seed all databases
3. Start services and verify data
4. Modify `seeds/*/data.js` files to customize data
5. Share seed scripts with team for consistent testing

---

See [README.md](./README.md) for complete documentation.
