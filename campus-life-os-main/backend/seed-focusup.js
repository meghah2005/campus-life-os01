const mongoose = require('mongoose')

const MONGODB_URI = 'mongodb://localhost:27017/focusup'

async function seedFocusupDb() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to focusup database')

    const db = mongoose.connection.db

    // Clear existing collections
    await db.collection('analytics').deleteMany({})
    await db.collection('contents').deleteMany({})
    await db.collection('groups').deleteMany({})
    await db.collection('sessions').deleteMany({})
    await db.collection('users').deleteMany({})
    console.log('✓ Cleared all collections')

    // Seed analytics
    const analyticsData = [
      {
        userId: 1,
        date: '2026-03-27',
        totalFocusTime: 180,
        sessionsCompleted: 7,
        distractionsDetected: 3,
        avgFocusTime: 26,
        topicFocused: 'Data Structures',
      },
      {
        userId: 1,
        date: '2026-03-26',
        totalFocusTime: 150,
        sessionsCompleted: 6,
        distractionsDetected: 2,
        avgFocusTime: 25,
        topicFocused: 'Algorithms',
      },
      {
        userId: 2,
        date: '2026-03-27',
        totalFocusTime: 120,
        sessionsCompleted: 5,
        distractionsDetected: 1,
        avgFocusTime: 24,
        topicFocused: 'Web Development',
      },
    ]

    const analyticsResult = await db.collection('analytics').insertMany(analyticsData)
    console.log(`✓ Inserted ${analyticsResult.insertedCount} analytics records`)

    // Seed contents
    const contentsData = [
      {
        id: 1,
        title: 'Data Structures Fundamentals',
        subject: 'Computer Science',
        creator: 'Prof. Chen',
        type: 'study-material',
        downloads: 245,
        rating: 4.8,
        createdAt: '2026-01-15',
      },
      {
        id: 2,
        title: 'Web Development Best Practices',
        subject: 'Programming',
        creator: 'Alex Kumar',
        type: 'tutorial',
        downloads: 189,
        rating: 4.6,
        createdAt: '2026-02-20',
      },
      {
        id: 3,
        title: 'Calculus III Summary Notes',
        subject: 'Mathematics',
        creator: 'Study Group Alpha',
        type: 'notes',
        downloads: 128,
        rating: 4.5,
        createdAt: '2026-03-10',
      },
      {
        id: 4,
        title: 'Physics Lab Experiment Guide',
        subject: 'Physics',
        creator: 'Dr. Wilson',
        type: 'guide',
        downloads: 87,
        rating: 4.7,
        createdAt: '2026-03-01',
      },
    ]

    const contentsResult = await db.collection('contents').insertMany(contentsData)
    console.log(`✓ Inserted ${contentsResult.insertedCount} content records`)

    // Seed groups
    const groupsData = [
      {
        id: 1,
        name: 'Data Structures Study Circle',
        subject: 'Computer Science',
        members: 8,
        maxMembers: 15,
        leader: 'Sarah Johnson',
        nextSession: '2026-03-28 at 5:00 PM',
        description: 'Weekly sessions covering trees, graphs, and algorithms',
        createdAt: '2026-01-10',
      },
      {
        id: 2,
        name: 'Physics Problem Solving',
        subject: 'Physics',
        members: 6,
        maxMembers: 10,
        leader: 'Priya Patel',
        nextSession: '2026-03-29 at 3:00 PM',
        description: 'Collaborative problem-solving for midterm prep',
        createdAt: '2026-02-05',
      },
      {
        id: 3,
        name: 'Web Dev Bootcamp',
        subject: 'Programming',
        members: 12,
        maxMembers: 20,
        leader: 'Mike Brown',
        nextSession: '2026-03-28 at 7:00 PM',
        description: 'Full-stack development with React and Node.js',
        createdAt: '2026-02-15',
      },
      {
        id: 4,
        name: 'Calculus Support Group',
        subject: 'Mathematics',
        members: 5,
        maxMembers: 12,
        leader: 'Emma Wilson',
        nextSession: '2026-03-30 at 6:00 PM',
        description: 'Peer tutoring and exam preparation',
        createdAt: '2026-03-05',
      },
    ]

    const groupsResult = await db.collection('groups').insertMany(groupsData)
    console.log(`✓ Inserted ${groupsResult.insertedCount} group records`)

    // Seed sessions
    const sessionsData = [
      {
        id: 1,
        groupId: 1,
        title: 'Trees and Balanced Binary Search Trees',
        date: '2026-03-20',
        startTime: '17:00',
        endTime: '18:30',
        attendees: 7,
        notes: 'Covered AVL trees, red-black trees, rotations',
        status: 'completed',
      },
      {
        id: 2,
        groupId: 1,
        title: 'Graph Algorithms - DFS and BFS',
        date: '2026-03-27',
        startTime: '17:00',
        endTime: '18:30',
        attendees: 6,
        notes: 'In-depth exploration of depth-first and breadth-first search',
        status: 'completed',
      },
      {
        id: 3,
        groupId: 2,
        title: 'Newton\'s Laws and Forces',
        date: '2026-03-21',
        startTime: '15:00',
        endTime: '16:30',
        attendees: 5,
        notes: 'Problem-solving session on applied forces',
        status: 'completed',
      },
      {
        id: 4,
        groupId: 3,
        title: 'React Hooks Deep Dive',
        date: '2026-03-26',
        startTime: '19:00',
        endTime: '20:30',
        attendees: 10,
        notes: 'useState, useEffect, useContext, custom hooks',
        status: 'completed',
      },
      {
        id: 5,
        groupId: 3,
        title: 'State Management with Redux',
        date: '2026-03-28',
        startTime: '19:00',
        endTime: '20:30',
        attendees: 0,
        notes: 'Upcoming: Actions, reducers, store configuration',
        status: 'scheduled',
      },
      {
        id: 6,
        groupId: 4,
        title: 'Limits and Continuity Review',
        date: '2026-03-25',
        startTime: '18:00',
        endTime: '19:00',
        attendees: 4,
        notes: 'Epsilon-delta proofs and exam tips',
        status: 'completed',
      },
    ]

    const sessionsResult = await db.collection('sessions').insertMany(sessionsData)
    console.log(`✓ Inserted ${sessionsResult.insertedCount} session records`)

    // Seed users
    const usersData = [
      {
        id: 1,
        email: 'alex.johnson@university.edu',
        name: 'Alex Johnson',
        role: 'student',
        department: 'Computer Science',
        joinedAt: '2026-01-10',
      },
      {
        id: 2,
        email: 'priya.patel@university.edu',
        name: 'Priya Patel',
        role: 'student',
        department: 'Physics',
        joinedAt: '2026-01-15',
      },
      {
        id: 3,
        email: 'mike.brown@university.edu',
        name: 'Mike Brown',
        role: 'mentor',
        department: 'Computer Science',
        joinedAt: '2025-11-20',
      },
    ]

    const usersResult = await db.collection('users').insertMany(usersData)
    console.log(`✓ Inserted ${usersResult.insertedCount} user records`)

    console.log('\n✅ focusup database seeding complete!')
    console.log('Collections populated:')
    console.log('  - analytics: 3 records')
    console.log('  - contents: 4 records')
    console.log('  - groups: 4 records')
    console.log('  - sessions: 6 records')
    console.log('  - users: 3 records')

    await mongoose.disconnect()
    process.exit(0)
  } catch (error) {
    console.error('Error seeding focusup database:', error.message)
    process.exit(1)
  }
}

seedFocusupDb()
