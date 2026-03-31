/**
 * FocusUp database seed data
 * Contains study analytics, content resources, study groups, and session information
 */

const analyticsData = [
  {
    userId: '1',
    date: '2026-03-27',
    totalFocusTime: 240,
    sessionsCompleted: 4,
    distractionsDetected: 2
  },
  {
    userId: '2',
    date: '2026-03-27',
    totalFocusTime: 180,
    sessionsCompleted: 3,
    distractionsDetected: 1
  },
  {
    userId: '3',
    date: '2026-03-27',
    totalFocusTime: 300,
    sessionsCompleted: 5,
    distractionsDetected: 3
  }
];

const contentsData = [
  {
    id: 1,
    title: 'Data Structures Fundamentals',
    subject: 'Computer Science',
    creator: 'Prof. Chen',
    description: 'Comprehensive guide to data structures including arrays, linked lists, trees, and graphs',
    downloads: 256,
    rating: 4.8,
    fileUrl: '/content/data-structures.pdf',
    createdAt: '2026-03-15'
  },
  {
    id: 2,
    title: 'Web Development Best Practices',
    subject: 'Computer Science',
    creator: 'Web Dev Club',
    description: 'Modern web development techniques, frameworks, and optimization strategies',
    downloads: 189,
    rating: 4.6,
    fileUrl: '/content/web-dev.pdf',
    createdAt: '2026-03-10'
  },
  {
    id: 3,
    title: 'Calculus III Notes',
    subject: 'Mathematics',
    creator: 'Study Group',
    description: 'Complete notes from Calculus III course covering multivariable calculus',
    downloads: 312,
    rating: 4.7,
    fileUrl: '/content/calculus-iii.pdf',
    createdAt: '2026-03-08'
  },
  {
    id: 4,
    title: 'Physics II Lab Experiments',
    subject: 'Physics',
    creator: 'Dr. Martinez',
    description: 'Detailed laboratory procedures and expected results for Physics II experiments',
    downloads: 145,
    rating: 4.5,
    fileUrl: '/content/physics-labs.pdf',
    createdAt: '2026-03-05'
  }
];

const groupsData = [
  {
    id: 1,
    name: 'Data Structures Study Circle',
    subject: 'Computer Science',
    description: 'Group focused on mastering data structures and algorithms for technical interviews',
    members: 8,
    leaders: ['Alex Johnson'],
    createdAt: '2026-02-01',
    meetingSchedule: 'Tuesdays & Thursdays, 4 PM'
  },
  {
    id: 2,
    name: 'Physics Problem Solving',
    subject: 'Physics',
    description: 'Collaborative problem-solving sessions for Physics II course',
    members: 6,
    leaders: ['Sarah Smith'],
    createdAt: '2026-02-15',
    meetingSchedule: 'Wednesdays, 5 PM'
  },
  {
    id: 3,
    name: 'Web Dev Bootcamp',
    subject: 'Computer Science',
    description: 'Intensive study group building full-stack web applications',
    members: 12,
    leaders: ['Mike Brown', 'Emma Wilson'],
    createdAt: '2026-01-20',
    meetingSchedule: 'Mondays, Wednesdays, Fridays, 6 PM'
  },
  {
    id: 4,
    name: 'Calculus Support Group',
    subject: 'Mathematics',
    description: 'Peer tutoring and collaborative learning for Calculus III',
    members: 7,
    leaders: ['Priya Patel'],
    createdAt: '2026-02-10',
    meetingSchedule: 'Saturdays, 2 PM'
  }
];

const sessionsData = [
  {
    id: 1,
    groupId: 1,
    groupName: 'Data Structures Study Circle',
    topic: 'Binary Trees & Traversal',
    scheduledAt: '2026-03-28T16:00:00Z',
    duration: 120,
    attendees: ['Alex Johnson', 'John Smith', 'Lisa Cooper'],
    status: 'scheduled'
  },
  {
    id: 2,
    groupId: 1,
    groupName: 'Data Structures Study Circle',
    topic: 'Graph Algorithms - DFS & BFS',
    scheduledAt: '2026-03-25T16:00:00Z',
    duration: 120,
    attendees: ['Alex Johnson', 'John Smith', 'Emma Wilson'],
    status: 'completed'
  },
  {
    id: 3,
    groupId: 2,
    groupName: 'Physics Problem Solving',
    topic: 'Electromagnetic Waves',
    scheduledAt: '2026-03-26T17:00:00Z',
    duration: 90,
    attendees: ['Sarah Smith', 'James Davis', 'Olivia Brown'],
    status: 'completed'
  },
  {
    id: 4,
    groupId: 3,
    groupName: 'Web Dev Bootcamp',
    topic: 'React Hooks & State Management',
    scheduledAt: '2026-03-29T18:00:00Z',
    duration: 180,
    attendees: ['Mike Brown', 'Emma Wilson', 'Alex Johnson'],
    status: 'scheduled'
  },
  {
    id: 5,
    groupId: 4,
    groupName: 'Calculus Support Group',
    topic: 'Multiple Integrals',
    scheduledAt: '2026-03-27T14:00:00Z',
    duration: 120,
    attendees: ['Priya Patel', 'Sarah Chen', 'Michael Lee'],
    status: 'completed'
  },
  {
    id: 6,
    groupId: 3,
    groupName: 'Web Dev Bootcamp',
    topic: 'Database Design & SQL Optimization',
    scheduledAt: '2026-03-23T18:00:00Z',
    duration: 150,
    attendees: ['Mike Brown', 'Emma Wilson', 'John Smith'],
    status: 'completed'
  }
];

const usersData = [
  {
    id: 1,
    name: 'Alex Johnson',
    email: 'alex.johnson@university.edu',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    joinedAt: '2026-01-10'
  },
  {
    id: 2,
    name: 'Priya Patel',
    email: 'priya.patel@university.edu',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
    joinedAt: '2026-01-15'
  },
  {
    id: 3,
    name: 'Mike Brown',
    email: 'mike.brown@university.edu',
    role: 'mentor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
    joinedAt: '2025-12-01'
  }
];

module.exports = {
  analyticsData,
  contentsData,
  groupsData,
  sessionsData,
  usersData
};
