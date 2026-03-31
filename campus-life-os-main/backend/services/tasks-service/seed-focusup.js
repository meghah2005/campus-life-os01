import mongoose from 'mongoose'

const uri = 'mongodb://localhost:27017/focusup'

async function seed() {
  await mongoose.connect(uri)
  const db = mongoose.connection.db

  // Clear
  await db.collection('analytics').deleteMany({})
  await db.collection('contents').deleteMany({})
  await db.collection('groups').deleteMany({})
  await db.collection('sessions').deleteMany({})
  await db.collection('users').deleteMany({})

  // Insert analytics
  await db.collection('analytics').insertMany([
    { userId: 1, date: '2026-03-27', totalFocusTime: 180, sessionsCompleted: 7, distractionsDetected: 3, topicFocused: 'Data Structures' },
    { userId: 1, date: '2026-03-26', totalFocusTime: 150, sessionsCompleted: 6, distractionsDetected: 2, topicFocused: 'Algorithms' },
    { userId: 2, date: '2026-03-27', totalFocusTime: 120, sessionsCompleted: 5, distractionsDetected: 1, topicFocused: 'Web Development' },
  ])

  // Insert contents
  await db.collection('contents').insertMany([
    { id: 1, title: 'Data Structures Fundamentals', subject: 'Computer Science', creator: 'Prof. Chen', type: 'study-material', downloads: 245, rating: 4.8 },
    { id: 2, title: 'Web Development Best Practices', subject: 'Programming', creator: 'Alex Kumar', type: 'tutorial', downloads: 189, rating: 4.6 },
    { id: 3, title: 'Calculus III Summary Notes', subject: 'Mathematics', creator: 'Study Group Alpha', type: 'notes', downloads: 128, rating: 4.5 },
    { id: 4, title: 'Physics Lab Experiment Guide', subject: 'Physics', creator: 'Dr. Wilson', type: 'guide', downloads: 87, rating: 4.7 },
  ])

  // Insert groups
  await db.collection('groups').insertMany([
    { id: 1, name: 'Data Structures Study Circle', subject: 'Computer Science', members: 8, maxMembers: 15, leader: 'Sarah Johnson', nextSession: '2026-03-28 at 5:00 PM' },
    { id: 2, name: 'Physics Problem Solving', subject: 'Physics', members: 6, maxMembers: 10, leader: 'Priya Patel', nextSession: '2026-03-29 at 3:00 PM' },
    { id: 3, name: 'Web Dev Bootcamp', subject: 'Programming', members: 12, maxMembers: 20, leader: 'Mike Brown', nextSession: '2026-03-28 at 7:00 PM' },
    { id: 4, name: 'Calculus Support Group', subject: 'Mathematics', members: 5, maxMembers: 12, leader: 'Emma Wilson', nextSession: '2026-03-30 at 6:00 PM' },
  ])

  // Insert sessions
  await db.collection('sessions').insertMany([
    { id: 1, groupId: 1, title: 'Trees and Balanced Binary Search Trees', date: '2026-03-20', startTime: '17:00', endTime: '18:30', attendees: 7, status: 'completed' },
    { id: 2, groupId: 1, title: 'Graph Algorithms - DFS and BFS', date: '2026-03-27', startTime: '17:00', endTime: '18:30', attendees: 6, status: 'completed' },
    { id: 3, groupId: 2, title: 'Newtons Laws and Forces', date: '2026-03-21', startTime: '15:00', endTime: '16:30', attendees: 5, status: 'completed' },
    { id: 4, groupId: 3, title: 'React Hooks Deep Dive', date: '2026-03-26', startTime: '19:00', endTime: '20:30', attendees: 10, status: 'completed' },
    { id: 5, groupId: 3, title: 'State Management with Redux', date: '2026-03-28', startTime: '19:00', endTime: '20:30', attendees: 0, status: 'scheduled' },
    { id: 6, groupId: 4, title: 'Limits and Continuity Review', date: '2026-03-25', startTime: '18:00', endTime: '19:00', attendees: 4, status: 'completed' },
  ])

  // Insert users
  await db.collection('users').insertMany([
    { id: 1, email: 'alex.johnson@university.edu', name: 'Alex Johnson', role: 'student', department: 'Computer Science' },
    { id: 2, email: 'priya.patel@university.edu', name: 'Priya Patel', role: 'student', department: 'Physics' },
    { id: 3, email: 'mike.brown@university.edu', name: 'Mike Brown', role: 'mentor', department: 'Computer Science' },
  ])

  console.log('✅ focusup database seeded successfully!')
  console.log('  analytics: 3 records')
  console.log('  contents: 4 records')
  console.log('  groups: 4 records')
  console.log('  sessions: 6 records')
  console.log('  users: 3 records')

  await mongoose.disconnect()
  process.exit(0)
}

seed().catch(e => { console.error(e); process.exit(1) })
