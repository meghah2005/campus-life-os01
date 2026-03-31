const mongoose = require('mongoose')

const MONGODB_URI = 'mongodb://localhost:27017/campus_life_os'

const stateSchema = new mongoose.Schema({
  key: String,
  value: mongoose.Schema.Types.Mixed,
})

const State = mongoose.model('State', stateSchema)

const upserts = [
  {
    key: 'tasks:items',
    value: [
      { id: 1, title: 'Data Structures Assignment', date: '2026-04-15', priority: 'high', completed: false },
      { id: 2, title: 'Physics Lab Report', date: '2026-04-10', priority: 'high', completed: false },
      { id: 3, title: 'Semester Fee Payment', date: '2026-03-31', priority: 'critical', completed: false },
      { id: 4, title: 'Calculus Quiz Prep', date: '2026-04-05', priority: 'medium', completed: false },
    ],
  },
  {
    key: 'auth:users',
    value: [
      { id: 1, email: 'alex.johnson@university.edu', password: 'demo123', name: 'Alex Johnson', role: 'student' },
      { id: 2, email: 'admin@university.edu', password: 'admin123', name: 'Campus Admin', role: 'admin' },
    ],
  },
  { key: 'notifications:items', value: [] },
  {
    key: 'campus:lost-found-items',
    value: [
      {
        id: 1,
        item: 'Blue Water Bottle',
        description: 'Hydro Flask, left at library',
        location: 'Main Library',
        status: 'found',
        claimed: false,
        date: '2026-03-25',
      },
      {
        id: 2,
        item: 'TI-84 Calculator',
        description: 'Silver calculator with case',
        location: 'Science Building',
        status: 'lost',
        claimed: false,
        date: '2026-03-24',
      },
      {
        id: 3,
        item: 'Red Backpack',
        description: 'JanSport backpack with laptop pocket',
        location: 'Student Center',
        status: 'found',
        claimed: false,
        date: '2026-03-23',
      },
    ],
  },
  {
    key: 'campus:rides',
    value: [
      {
        id: 1,
        driver: 'Sarah Smith',
        destination: 'City Center',
        time: '3:00 PM',
        seats: 3,
        availableSeats: 3,
        notes: 'Leaving from North Gate',
      },
      {
        id: 2,
        driver: 'Mike Brown',
        destination: 'Airport',
        time: '5:30 PM',
        seats: 2,
        availableSeats: 2,
        notes: 'Can take one backpack',
      },
    ],
  },
  {
    key: 'campus:notes',
    value: [
      { id: 1, title: 'Data Structures Notes', subject: 'CS 301', owner: 'Prof. Chen', downloads: 145, sharedAt: '2026-03-20' },
      { id: 2, title: 'Calculus Summary', subject: 'MATH 210', owner: 'Study Group', downloads: 87, sharedAt: '2026-03-18' },
    ],
  },
  {
    key: 'campus:marketplace-contacts',
    value: [
      { id: 1, name: 'John for Tutoring', email: 'john@university.edu', message: 'Math Tutoring inquiry', createdAt: '2026-03-20' },
      { id: 2, name: 'Emma for Design', email: 'emma@university.edu', message: 'Graphic Design project inquiry', createdAt: '2026-03-19' },
    ],
  },
]

const legacyKeys = [
  'tasks:list',
  'users',
  'notifications',
  'lost-found-items',
  'rides',
  'notes',
  'marketplace-contacts',
  'activity-contacts',
]

async function run() {
  await mongoose.connect(MONGODB_URI)

  for (const doc of upserts) {
    await State.findOneAndUpdate({ key: doc.key }, { value: doc.value }, { upsert: true, new: true })
  }

  await State.deleteMany({ key: { $in: legacyKeys } })

  console.log('Updated keys:', upserts.map((item) => item.key))
  console.log('Removed legacy keys:', legacyKeys)

  await mongoose.disconnect()
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
