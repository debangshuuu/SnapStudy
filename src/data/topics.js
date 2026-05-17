/**
 * SnapStudy — Study Content
 * Populate this array with your syllabus topics.
 * 
 * Note: `questions` are now generated dynamically by the AI quiz engine.
 */

export const topics = [
  // ─── DSA TOPICS ─────────────────────────────────────────────────────────────
  {
    id: 'dsa-1',
    title: 'Problem Solving and Implementation',
    subject: 'DSA',
    difficulty: 'Beginner',
    estimatedMins: 5,
    icon: '🧩'
  },
  {
    id: 'dsa-2',
    title: 'Brute Force Approach',
    subject: 'DSA',
    difficulty: 'Beginner',
    estimatedMins: 5,
    icon: '🔨'
  },
  {
    id: 'dsa-3',
    title: 'Time & Space Complexity',
    subject: 'DSA',
    difficulty: 'Intermediate',
    estimatedMins: 10,
    icon: '⏱️'
  },
  {
    id: 'dsa-4',
    title: 'Time Complexity Practice',
    subject: 'DSA',
    difficulty: 'Intermediate',
    estimatedMins: 8,
    icon: '📝'
  },
  {
    id: 'dsa-5',
    title: 'Space Complexity',
    subject: 'DSA',
    difficulty: 'Intermediate',
    estimatedMins: 5,
    icon: '💾'
  },
  {
    id: 'dsa-6',
    title: 'Complete Search',
    subject: 'DSA',
    difficulty: 'Advanced',
    estimatedMins: 8,
    icon: '🔍'
  },
  {
    id: 'dsa-7',
    title: 'Sorting Algorithms',
    subject: 'DSA',
    difficulty: 'Intermediate',
    estimatedMins: 10,
    icon: '🗂️'
  },
  {
    id: 'dsa-8',
    title: 'Binary Search',
    subject: 'DSA',
    difficulty: 'Advanced',
    estimatedMins: 8,
    icon: '✂️'
  },
  {
    id: 'dsa-9',
    title: 'Recursion',
    subject: 'DSA',
    difficulty: 'Advanced',
    estimatedMins: 12,
    icon: '🔁'
  },

  // ─── WAP TOPICS ─────────────────────────────────────────────────────────────
  {
    id: 'wap-1',
    title: 'Javascript Data Types',
    subject: 'WAP',
    difficulty: 'Beginner',
    estimatedMins: 8,
    icon: '🔤'
  },
  {
    id: 'wap-2',
    title: 'Javascript Condition & loops',
    subject: 'WAP',
    difficulty: 'Beginner',
    estimatedMins: 10,
    icon: '🔀'
  },
  {
    id: 'wap-3',
    title: 'Javascript Argument',
    subject: 'WAP',
    difficulty: 'Intermediate',
    estimatedMins: 5,
    icon: '📥'
  },
  {
    id: 'wap-4',
    title: 'Javascript Array',
    subject: 'WAP',
    difficulty: 'Intermediate',
    estimatedMins: 7,
    icon: '📚'
  },
  {
    id: 'wap-5',
    title: 'Array Method',
    subject: 'WAP',
    difficulty: 'Intermediate',
    estimatedMins: 12,
    icon: '🛠️'
  },
  {
    id: 'wap-6',
    title: 'Javascript Object',
    subject: 'WAP',
    difficulty: 'Intermediate',
    estimatedMins: 10,
    icon: '📦'
  },
  {
    id: 'wap-7',
    title: 'Nested Object',
    subject: 'WAP',
    difficulty: 'Advanced',
    estimatedMins: 6,
    icon: '🪆'
  },
  {
    id: 'wap-8',
    title: 'JS Operator',
    subject: 'WAP',
    difficulty: 'Intermediate',
    estimatedMins: 8,
    icon: '✨'
  },
  {
    id: 'wap-9',
    title: 'Callback',
    subject: 'WAP',
    difficulty: 'Advanced',
    estimatedMins: 7,
    icon: '📞'
  },
  {
    id: 'wap-10',
    title: 'HOF',
    subject: 'WAP',
    difficulty: 'Advanced',
    estimatedMins: 12,
    icon: '🚀'
  },

  // ─── MATH TOPICS ─────────────────────────────────────────────────────────────
  {
    id: 'math-1',
    title: 'Counting & Combinatorics',
    subject: 'Mathematics (IA-1)',
    difficulty: 'Hard',
    estimatedMins: 15,
    icon: '🔢'
  },
  {
    id: 'math-2',
    title: 'Set Theory & Probability Basics',
    subject: 'Mathematics (IA-1)',
    difficulty: 'Intermediate',
    estimatedMins: 10,
    icon: '📊'
  },
  {
    id: 'math-3',
    title: 'Conditional Probability & Bayes Theorem',
    subject: 'Mathematics (IA-1)',
    difficulty: 'Hard',
    estimatedMins: 15,
    icon: '🎲'
  },
  {
    id: 'math-4',
    title: 'Calculus Revision',
    subject: 'Mathematics (IA-1)',
    difficulty: 'Intermediate',
    estimatedMins: 10,
    icon: '📈'
  },
  {
    id: 'math-5',
    title: 'Random Variables & Statistics',
    subject: 'Mathematics (IA-1)',
    difficulty: 'Intermediate',
    estimatedMins: 12,
    icon: '📉'
  },

  // ─── APPLIED CHEMISTRY TOPICS ─────────────────────────────────────────────────────────────
  {
    id: 'chem-1',
    title: 'Memory Devices & Organic Semiconductors',
    subject: 'Applied Chemistry',
    difficulty: 'Intermediate',
    estimatedMins: 10,
    icon: '🔋'
  },
  {
    id: 'chem-2',
    title: 'Display Systems (LED, OLED, QLED)',
    subject: 'Applied Chemistry',
    difficulty: 'Intermediate',
    estimatedMins: 12,
    icon: '📺'
  },
  {
    id: 'chem-3',
    title: 'Quantum Dots & Solar Cells',
    subject: 'Applied Chemistry',
    difficulty: 'Advanced',
    estimatedMins: 15,
    icon: '☀️'
  },
  {
    id: 'chem-4',
    title: 'Polymers (Molecular Weight & Structure)',
    subject: 'Applied Chemistry',
    difficulty: 'Intermediate',
    estimatedMins: 10,
    icon: '🔗'
  },
  {
    id: 'chem-5',
    title: 'Conducting Polymers & Polyaniline',
    subject: 'Applied Chemistry',
    difficulty: 'Advanced',
    estimatedMins: 8,
    icon: '⚡'
  },

  // ─── ENGLISH & COMMUNICATION TOPICS ─────────────────────────────────────────────────────────────
  {
    id: 'eng-1',
    title: 'Introduction to Sentence Structure and Tenses',
    subject: 'English & Communication',
    difficulty: 'Beginner',
    estimatedMins: 10,
    icon: '✏️'
  },
  {
    id: 'eng-2',
    title: 'Complex Sentences & Conjunctions',
    subject: 'English & Communication',
    difficulty: 'Beginner',
    estimatedMins: 8,
    icon: '🔗'
  },
  {
    id: 'eng-3',
    title: 'Mock Interview Session',
    subject: 'English & Communication',
    difficulty: 'Intermediate',
    estimatedMins: 15,
    icon: '👔'
  }
];

export const getTopicById = (id) => topics.find((t) => t.id === id);
