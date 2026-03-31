/**
 * Campus Life OS database seed data
 * Contains student profiles, tasks, auth, campus resources, and notifications
 */

const studentData = {
  profile: {
    id: 1,
    name: 'Alex Johnson',
    email: 'alex.johnson@university.edu',
    level: 'Junior',
    department: 'Computer Science',
    gpa: 3.7,
    enrolledCourses: ['CS 301', 'CS 305', 'MATH 210', 'PHYS 220']
  },

  stats: [
    { label: 'Pending Tasks', value: 8 },
    { label: 'Skills Shared', value: 5 },
    { label: 'Forms Submitted', value: 12 },
    { label: 'Study Groups Joined', value: 3 }
  ],

  activity: [
    { action: 'Submitted Data Structures assignment', time: '2 hours ago' },
    { action: 'Joined study group for Calculus', time: '5 hours ago' },
    { action: 'Updated GPA: 3.7', time: '1 day ago' }
  ],

  gpaCoursesForGpaCalculator: [
    { id: 1, name: 'Data Structures', credits: 3, grade: 'A' },
    { id: 2, name: 'Algorithms', credits: 4, grade: 'A-' },
    { id: 3, name: 'Database Systems', credits: 3, grade: 'B+' },
    { id: 4, name: 'Web Development', credits: 3, grade: 'A' }
  ],

  attendance: [
    { id: 1, name: 'CS 301: Advanced Programming', attended: 22, totalClasses: 24, percentage: 92 },
    { id: 2, name: 'CS 305: Web Development', attended: 20, totalClasses: 23, percentage: 87 },
    { id: 3, name: 'MATH 210: Calculus III', attended: 19, totalClasses: 24, percentage: 79 },
    { id: 4, name: 'PHYS 220: Physics II', attended: 21, totalClasses: 24, percentage: 88 }
  ],

  mealPlan: {
    mealSwipes: 150,
    mealSwipesUsed: 45,
    diningDollars: 500,
    diningDollarsUsed: 125,
    daysRemaining: 85,
    history: [
      { date: 'Today', location: 'Main Cafeteria', type: 'Meal Swipe', time: '12:30 PM' },
      { date: 'Yesterday', location: 'North Dining', type: 'Meal Swipe', time: '6:45 PM' }
    ]
  }
};

const tasksData = [
  { id: 1, title: 'Data Structures Assignment', dueDate: '2026-04-15', priority: 'high', completed: false },
  { id: 2, title: 'Physics Lab Report', dueDate: '2026-04-10', priority: 'high', completed: false },
  { id: 3, title: 'Semester Fee Payment', dueDate: '2026-03-31', priority: 'critical', completed: false },
  { id: 4, title: 'Calculus Quiz Prep', dueDate: '2026-04-05', priority: 'medium', completed: false }
];

const authData = [
  {
    id: 1,
    email: 'alex.johnson@university.edu',
    password: 'hashed_password_demo',
    role: 'student',
    createdAt: '2026-01-15'
  },
  {
    id: 2,
    email: 'admin@university.edu',
    password: 'hashed_password_admin',
    role: 'admin',
    createdAt: '2025-08-01'
  }
];

const campusData = {
  lostFoundItems: [
    { id: 1, title: 'Blue Water Bottle', description: 'Hydro Flask, left at library', location: 'Main Library', date: '2026-03-25', category: 'found' },
    { id: 2, title: 'TI-84 Calculator', description: 'Silver calculator with case', location: 'Science Building', date: '2026-03-24', category: 'lost' },
    { id: 3, title: 'Red Backpack', description: 'JanSport backpack with laptop pocket', location: 'Student Center', date: '2026-03-23', category: 'found' }
  ],

  rides: [
    { id: 1, driver: 'Sarah Smith', destination: 'City Center', time: '3:00 PM', seats: 3, interested: [] },
    { id: 2, driver: 'Mike Brown', destination: 'Airport', time: '5:30 PM', seats: 2, interested: [] }
  ],

  notes: [
    { id: 1, title: 'Data Structures Notes', subject: 'CS 301', owner: 'Prof. Chen', downloads: 145, shared: '2026-03-20' },
    { id: 2, title: 'Calculus Summary', subject: 'MATH 210', owner: 'Study Group', downloads: 87, shared: '2026-03-18' }
  ],

  marketplaceContacts: [
    { id: 1, name: 'John for Tutoring', email: 'john@university.edu', service: 'Math Tutoring', rate: '$15/hr' },
    { id: 2, name: 'Emma for Design', email: 'emma@university.edu', service: 'Graphic Design', rate: '$20/hr' }
  ],

  directoryContacts: [
    { id: 1, name: 'Dr. James Wilson', title: 'Dean of Students', office: 'Admin Building 201', email: 'jwilson@university.edu' },
    { id: 2, name: 'Ms. Patricia Lee', title: 'Student Services', office: 'Student Center 105', email: 'plee@university.edu' }
  ]
};

module.exports = {
  studentData,
  tasksData,
  authData,
  campusData
};
