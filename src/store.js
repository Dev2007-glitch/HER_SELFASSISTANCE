/**
 * BECOMING — State Store & Data Persistence Layer
 * Implements Senti-inspired design system state, LocalStorage persistence, and design.doc specifications.
 */

const STORAGE_KEY = 'becoming_app_data_v3';

// Seed data aligned with design.doc
const defaultState = {
  user: {
    name: 'Anna',
    email: 'anna.editorial@becoming.life',
    tagline: 'Become the woman you are building. One ordinary day at a time.',
    occupation: 'Creative Technologist & Writer',
    location: 'New York City, NY',
    birthday: '2001-04-18',
    phone: '+1 (555) 234-5678',
    theme: 'noir',
    joinedDate: '2026-08-15',
    isOnboarded: true,
    timeDedication: '2 hours',
    wakeTime: '07:00',
    sleepTime: '22:30'
  },
  
  // 1. BECOME: Identity System (Section 7 of design.doc)
  identity: {
    todayMantra: 'Today is another chance to become her.',
    selectedTraits: ['Disciplined', 'Confident', 'Healthy', 'Curious'],
    allAvailableTraits: [
      'Disciplined', 'Confident', 'Healthy', 'Curious', 'Calm', 'Independent',
      'Organized', 'Creative', 'Social', 'Ambitious', 'Financially responsible', 'Consistent'
    ],
    statements: [
      { id: 'stmt-1', trait: 'DISCIPLINED', text: 'I do what I said I would do.' },
      { id: 'stmt-2', trait: 'CONFIDENT', text: 'I trust myself to handle difficult things.' },
      { id: 'stmt-3', trait: 'HEALTHY', text: 'I take care of my body with nourishment and sleep.' },
      { id: 'stmt-4', trait: 'CURIOUS', text: 'I keep learning and exploring.' }
    ],
    behaviorMapping: [
      {
        trait: 'CONFIDENT',
        behaviors: [
          'Speak up in meetings and classes',
          'Exercise 4x weekly without hesitation',
          'Try new cultural experiences and solo dates',
          'Keep small daily promises to herself'
        ]
      },
      {
        trait: 'DISCIPLINED',
        behaviors: [
          'Complete planned 2-hour deep study block',
          'Phone stays across the room during focus time',
          'Show up on days when motivation is low'
        ]
      },
      {
        trait: 'HEALTHY',
        behaviors: [
          'Drink 2L fresh water daily',
          'Sleep consistently before 10:30 PM',
          'Nourishing whole food meals and daily walk'
        ]
      },
      {
        trait: 'CURIOUS',
        behaviors: [
          'Read 10+ pages before bed every night',
          'Learn new concepts in programming & design',
          'Write observations in private journal'
        ]
      }
    ]
  },

  // 2. DAILY DASHBOARD (Section 6 of design.doc)
  daily: {
    date: new Date().toISOString().split('T')[0],
    promise: {
      text: 'I keep promises to myself.',
      status: 'pending' // 'pending' | 'yes' | 'partial' | 'not_today'
    },
    top3: [
      { id: 'top-1', title: 'Deep Study for 2 hours (Machine Learning)', completed: false, category: 'Mind' },
      { id: 'top-2', title: '30-minute Pilates & core movement', completed: false, category: 'Body' },
      { id: 'top-3', title: 'Read 10 pages of "Atomic Habits" & Journal', completed: false, category: 'Mind' }
    ],
    metrics: {
      mind: 0,
      body: 0,
      future: 0
    },
    checklist: {
      mind: [
        { id: 'c-m1', text: 'Read 10 pages', completed: false },
        { id: 'c-m2', text: 'Evening 5-minute Journal reflection', completed: false },
        { id: 'c-m3', text: '10-minute quiet meditation', completed: false }
      ],
      body: [
        { id: 'c-b1', text: 'Pilates / Movement workout', completed: false },
        { id: 'c-b2', text: 'Drink 2L Water (8 glasses)', completed: false },
        { id: 'c-b3', text: '20-minute morning fresh air walk', completed: false }
      ],
      future: [
        { id: 'c-f1', text: 'Deep Study block (2 hours)', completed: false },
        { id: 'c-f2', text: 'Review portfolio design project', completed: false },
        { id: 'c-f3', text: 'Plan weekly budget & goals', completed: false }
      ],
      self: [
        { id: 'c-s1', text: 'Morning & evening skincare ritual', completed: false },
        { id: 'c-s2', text: '10-minute desk and bedroom reset', completed: false },
        { id: 'c-s3', text: 'Phone offline 45 minutes before sleep', completed: false }
      ]
    },
    liveActivity: {
      id: 'live-today',
      title: 'Iced matcha and notebook session at the corner bakery',
      category: 'Explore',
      completed: false
    }
  },

  // 3. GOALS (Section 8 of design.doc: Life stories, not Jira tickets)
  goals: [
    {
      id: 'g-1',
      title: 'BECOME A BETTER STUDENT & MASTER TECH',
      vision: 'Master CS fundamentals and graduate with high distinction & confidence.',
      timeframe: '90-Day Vision',
      monthlyTarget: 'Maintain 30 hours of deep study per month',
      weeklyTarget: '8 hours focused study weekly',
      todayAction: 'Complete 2-hour Machine Learning assignment',
      category: 'Education',
      progress: 0,
      status: 'Active',
      targetDate: '2026-11-30',
      milestones: [
        { text: 'Study consistently every morning', done: false },
        { text: 'Improve assignment grades to distinction', done: false },
        { text: 'Read 3 foundational computer science texts', done: false },
        { text: 'Build better sustained deep focus', done: false }
      ]
    },
    {
      id: 'g-2',
      title: 'BUILD A STRONG, ENERGETIC & NOURISHED BODY',
      vision: 'Feel vibrant, grounded, and physically confident in my own skin.',
      timeframe: '90-Day Vision',
      monthlyTarget: '16 mindful workouts per month',
      weeklyTarget: '4 workouts & 10k daily steps',
      todayAction: '30-minute Pilates movement session',
      category: 'Fitness',
      progress: 0,
      status: 'Active',
      targetDate: '2026-12-15',
      milestones: [
        { text: 'Establish 4x weekly movement rhythm', done: false },
        { text: 'Drink 2L fresh water daily', done: false },
        { text: 'Run 5km outdoor morning trail', done: false }
      ]
    },
    {
      id: 'g-3',
      title: 'CULTIVATE EMOTIONAL CALMNESS & SELF-TRUST',
      vision: 'Become unshakeably calm, unhurried, and keep promises to myself.',
      timeframe: '90-Day Vision',
      monthlyTarget: '20 daily journal entries & consistent sleep',
      weeklyTarget: 'Sunday reflection & 10:30 PM sleep wind-down',
      todayAction: '5-minute evening reflection in private journal',
      category: 'Mind',
      progress: 0,
      status: 'Active',
      targetDate: '2026-10-31',
      milestones: [
        { text: 'Zero phone usage 30 mins before sleep', done: false },
        { text: 'Weekly reflection completed 3 consecutive weeks', done: false },
        { text: 'Read 2 philosophy and mindfulness books', done: false }
      ]
    }
  ],

  // 4. ROUTINES (Section 9 of design.doc: Timeline layout)
  routines: {
    morning: [
      { id: 'rm-1', time: '07:00', name: 'Wake up peacefully & open curtains', duration: '10 min', completed: false },
      { id: 'rm-2', time: '07:10', name: 'Hydrate (big glass of water) + Skincare', duration: '20 min', completed: false },
      { id: 'rm-3', time: '07:30', name: 'Morning fresh air walk', duration: '30 min', completed: false },
      { id: 'rm-4', time: '08:00', name: 'Nourishing protein breakfast & tea', duration: '30 min', completed: false },
      { id: 'rm-5', time: '08:30', name: 'Get ready & set Today\'s Top 3', duration: '15 min', completed: false }
    ],
    evening: [
      { id: 're-1', time: '18:00', name: 'Movement / Workout & shower', duration: '60 min', completed: false },
      { id: 're-2', time: '19:00', name: 'Peaceful dinner with loved ones', duration: '60 min', completed: false },
      { id: 're-3', time: '20:00', name: 'Focused study / creative block', duration: '90 min', completed: false },
      { id: 're-4', time: '21:30', name: '10 pages reading & chamomile tea', duration: '60 min', completed: false },
      { id: 're-5', time: '22:30', name: 'Journal reflection & restful wind down', duration: '15 min', completed: false }
    ]
  },

  // 5. HABITS & CONSISTENCY (Grace System)
  habits: [
    {
      id: 'h-1',
      name: 'Workout or Pilates Movement',
      category: 'Fitness',
      frequency: '4x per week',
      target: '16 / month',
      completedDaysThisMonth: 14,
      totalDaysTracked: 18,
      consistencyScore: 82,
      history7Days: [false, false, false, false, false, false, false]
    },
    {
      id: 'h-2',
      name: 'Study 2+ Hours with Deep Focus',
      category: 'Education',
      frequency: 'Daily',
      target: '30 / month',
      completedDaysThisMonth: 23,
      totalDaysTracked: 27,
      consistencyScore: 85,
      history7Days: [false, false, false, false, false, false, false]
    },
    {
      id: 'h-3',
      name: 'Read 10+ Pages',
      category: 'Mind',
      frequency: 'Daily',
      target: '30 / month',
      completedDaysThisMonth: 21,
      totalDaysTracked: 27,
      consistencyScore: 78,
      history7Days: [false, false, false, false, false, false, false]
    },
    {
      id: 'h-4',
      name: 'Sleep before 10:30 PM',
      category: 'Health',
      frequency: 'Daily',
      target: '30 / month',
      completedDaysThisMonth: 20,
      totalDaysTracked: 27,
      consistencyScore: 74,
      history7Days: [false, false, false, false, false, false, false]
    }
  ],

  // 6. GROW: Progress & Timeline (Section 11 of design.doc)
  grow: {
    daysShowedUp: '23 days',
    overallConsistency: 78,
    goalsCompleted: 12,
    habitsMaintained: 4,
    categories: [
      { name: 'Mind & Focus', score: 72 },
      { name: 'Body & Movement', score: 84 },
      { name: 'Future & Study', score: 61 },
      { name: 'Self & Life', score: 88 }
    ],
    heatmap: [
      'completed', 'completed', 'completed', 'rest', 'completed', 'partial', 'completed',
      'completed', 'completed', 'rest', 'completed', 'completed', 'partial', 'completed',
      'completed', 'rest', 'completed', 'completed', 'completed', 'partial', 'completed',
      'completed', 'completed', 'rest', 'completed', 'completed', 'completed', 'completed',
      'partial', 'completed'
    ],
    timeline: {
      past30Days: 'You were struggling to stay consistent and overwhelmed by phone scrolling.',
      today: 'You\'re building a routine you can actually maintain and keeping promises to yourself.',
      next30Days: 'Deepen emotional calmness, graduate semester with honors, and unshakeable self-trust.'
    }
  },

  calendarPresence: {},

  // 7. LIVE: Lifestyle Magazine & Pinterest Cards (Section 10 of design.doc)
  live: {
    cards: [
      {
        id: 'lc-1',
        title: 'Try a new café',
        tag: '☕ Explore',
        desc: 'Spend an unhurried morning with iced matcha & a fresh notebook.',
        image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
        done: false
      },
      {
        id: 'lc-2',
        title: 'Watch the sunset',
        tag: '🌅 Serenity',
        desc: 'Pause at 6:30 PM to watch the golden light paint the sky.',
        image: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=600&q=80',
        done: false
      },
      {
        id: 'lc-3',
        title: 'Make something',
        tag: '🎨 Creative',
        desc: 'Pottery, watercolours, baking sourdough, or writing poetry.',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
        done: false
      },
      {
        id: 'lc-4',
        title: 'See your friends',
        tag: '👯 Connection',
        desc: 'Candlelight pasta night with loud laughter and zero phone distractions.',
        image: 'https://images.unsplash.com/photo-1517256673644-36ad11246d21?auto=format&fit=crop&w=600&q=80',
        done: false
      },
      {
        id: 'lc-5',
        title: 'Movie night',
        tag: '🎬 Rest',
        desc: 'Cozy blanket, herbal tea, and your favorite nostalgic film.',
        image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
        done: false
      },
      {
        id: 'lc-6',
        title: 'Take yourself somewhere',
        tag: '🌿 Solo Date',
        desc: 'Visit a museum or botanical greenhouse in complete peace.',
        image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=600&q=80',
        done: false
      }
    ]
  },

  // 8. JOURNAL & PRIVATE DIARY (Interactive Book of Days)
  journal: {
    entries: [
      {
        id: 'diary-1',
        title: 'Midnight reflections over the East River skyline',
        date: 'Friday, September 11, 2026',
        time: '11:30 PM',
        mood: '✨ Inspired',
        weather: 'NYC Sunset Glow • 68°F',
        content: `Today felt different in the best possible way. I woke up at 7:00 AM, resisted the urge to immediately check notifications, and let the morning light in while making warm coffee.\n\nCompleted my 2-hour Machine Learning deep focus block without a single distraction. It's strange how much easier discipline feels when you stop negotiating with yourself and just treat commitments like non-negotiable appointments with your future self.\n\nTonight looking out at the bridge lights reminded me: growth isn't loud. It compounds in the quiet ordinary moments where you choose who you want to become.`,
        tags: ['Discipline', 'Deep Work', 'Peace'],
        wordCount: 104
      },
      {
        id: 'diary-2',
        title: 'Quiet breakthroughs & keeping promises',
        date: 'Thursday, September 10, 2026',
        time: '10:15 PM',
        mood: '🌿 Grounded',
        weather: 'Brooklyn Dusk • 66°F',
        content: `Took myself on a solo date to the corner bakery with my notebook this afternoon. Ordered an iced matcha and just sat with my thoughts for an hour without rushing.\n\nI used to feel guilty for resting or taking time for myself, thinking productivity meant working until exhaustion. But true life design is about sustainable discipline without burnout. Proud of keeping my promises this week.`,
        tags: ['Self-Trust', 'Solo Date', 'Mindfulness'],
        wordCount: 78
      }
    ],
    prompts: [
      {
        title: '🌿 Freeform Stream of Consciousness',
        template: 'Dear Diary,\n\nTonight, my mind is sitting with...\n\nWhat felt genuine today was...'
      },
      {
        title: '☀️ Morning Intention & Gratitude',
        template: 'Dear Diary — Morning Intention:\n\n1. Who I am practicing being today:\n2. The one promise I will protect:\n3. Three things I am grateful for right now:\n   • \n   • \n   • \n4. How I want my evening self to feel:'
      },
      {
        title: '🌙 Evening Synthesis & Brain Dump',
        template: 'Dear Diary — Evening Reflection:\n\n• What went exceptionally well today:\n• What challenged my patience or focus:\n• One boundary or habit I honored:\n• What I am letting go of before sleep:'
      },
      {
        title: '⚡ Identity & Discipline Check-in',
        template: 'Dear Diary — Identity Alignment:\n\n• Am I acting like the woman I am building?\n• Evidence I showed up today:\n• One small adjustment for tomorrow:'
      }
    ]
  }
};

/**
 * Creates a pristine, clean-slate state with all metrics and progress set to 0
 * for new user registrations or new account logins.
 */
export function createFreshState(userData = {}) {
  const name = userData.name || 'User';
  const email = userData.email || '';
  const nowIso = new Date().toISOString();

  return {
    user: {
      name,
      email,
      tagline: 'Become the woman you are building. One ordinary day at a time.',
      occupation: userData.occupation || '',
      location: userData.location || '',
      birthday: userData.birthday || '',
      phone: userData.phone || '',
      theme: 'noir',
      joinedDate: nowIso,
      isOnboarded: true,
      timeDedication: '2 hours',
      wakeTime: '07:00',
      sleepTime: '22:30'
    },
    
    // 1. BECOME: Identity System
    identity: {
      todayMantra: 'Today is another chance to become her.',
      selectedTraits: ['Disciplined', 'Confident', 'Healthy', 'Curious'],
      allAvailableTraits: [
        'Disciplined', 'Confident', 'Healthy', 'Curious', 'Calm', 'Independent',
        'Organized', 'Creative', 'Social', 'Ambitious', 'Financially responsible', 'Consistent'
      ],
      statements: [
        { id: 'stmt-1', trait: 'DISCIPLINED', text: 'I do what I said I would do.' },
        { id: 'stmt-2', trait: 'CONFIDENT', text: 'I trust myself to handle difficult things.' },
        { id: 'stmt-3', trait: 'HEALTHY', text: 'I take care of my body with nourishment and sleep.' },
        { id: 'stmt-4', trait: 'CURIOUS', text: 'I keep learning and exploring.' }
      ],
      behaviorMapping: [
        {
          trait: 'CONFIDENT',
          behaviors: [
            'Speak up in meetings and classes',
            'Exercise 4x weekly without hesitation',
            'Try new cultural experiences and solo dates',
            'Keep small daily promises to herself'
          ]
        },
        {
          trait: 'DISCIPLINED',
          behaviors: [
            'Complete planned 2-hour deep study block',
            'Phone stays across the room during focus time',
            'Show up on days when motivation is low'
          ]
        },
        {
          trait: 'HEALTHY',
          behaviors: [
            'Drink 2L fresh water daily',
            'Sleep consistently before 10:30 PM',
            'Nourishing whole food meals and daily walk'
          ]
        },
        {
          trait: 'CURIOUS',
          behaviors: [
            'Read 10+ pages before bed every night',
            'Learn new concepts in programming & design',
            'Write observations in private journal'
          ]
        }
      ]
    },

    // 2. DAILY DASHBOARD - All 0% metrics and unticked
    daily: {
      date: nowIso.split('T')[0],
      promise: {
        text: 'I keep promises to myself.',
        status: 'pending'
      },
      top3: [
        { id: 'top-1', title: 'Deep Study for 2 hours', completed: false, category: 'Mind' },
        { id: 'top-2', title: '30-minute Pilates & core movement', completed: false, category: 'Body' },
        { id: 'top-3', title: 'Read 10 pages & Journal reflection', completed: false, category: 'Mind' }
      ],
      metrics: {
        mind: 0,
        body: 0,
        future: 0
      },
      presenceScore: 0,
      checklist: {
        mind: [
          { id: 'c-m1', text: 'Read 10 pages', completed: false },
          { id: 'c-m2', text: 'Evening 5-minute Journal reflection', completed: false },
          { id: 'c-m3', text: '10-minute quiet meditation', completed: false }
        ],
        body: [
          { id: 'c-b1', text: 'Pilates / Movement workout', completed: false },
          { id: 'c-b2', text: 'Drink 2L Water (8 glasses)', completed: false },
          { id: 'c-b3', text: '20-minute morning fresh air walk', completed: false }
        ],
        future: [
          { id: 'c-f1', text: 'Deep Study block (2 hours)', completed: false },
          { id: 'c-f2', text: 'Review portfolio design project', completed: false },
          { id: 'c-f3', text: 'Plan weekly budget & goals', completed: false }
        ],
        self: [
          { id: 'c-s1', text: 'Morning & evening skincare ritual', completed: false },
          { id: 'c-s2', text: '10-minute desk and bedroom reset', completed: false },
          { id: 'c-s3', text: 'Phone offline 45 minutes before sleep', completed: false }
        ]
      },
      liveActivity: {
        id: 'live-today',
        title: 'Iced matcha and notebook session at the corner bakery',
        category: 'Explore',
        completed: false
      }
    },

    // 3. GOALS - 0% progress and all milestones unticked
    goals: [
      {
        id: 'g-1',
        title: 'BECOME A BETTER STUDENT & MASTER TECH',
        vision: 'Master CS fundamentals and graduate with high distinction & confidence.',
        timeframe: '90-Day Vision',
        monthlyTarget: 'Maintain 30 hours of deep study per month',
        weeklyTarget: '8 hours focused study weekly',
        todayAction: 'Complete 2-hour Machine Learning assignment',
        category: 'Education',
        progress: 0,
        status: 'Active',
        targetDate: '2026-11-30',
        milestones: [
          { text: 'Study consistently every morning', done: false },
          { text: 'Improve assignment grades to distinction', done: false },
          { text: 'Read 3 foundational computer science texts', done: false },
          { text: 'Build better sustained deep focus', done: false }
        ]
      },
      {
        id: 'g-2',
        title: 'BUILD A STRONG, ENERGETIC & NOURISHED BODY',
        vision: 'Feel vibrant, grounded, and physically confident in my own skin.',
        timeframe: '90-Day Vision',
        monthlyTarget: '16 mindful workouts per month',
        weeklyTarget: '4 workouts & 10k daily steps',
        todayAction: '30-minute Pilates movement session',
        category: 'Fitness',
        progress: 0,
        status: 'Active',
        targetDate: '2026-12-15',
        milestones: [
          { text: 'Establish 4x weekly movement rhythm', done: false },
          { text: 'Drink 2L fresh water daily', done: false },
          { text: 'Run 5km outdoor morning trail', done: false }
        ]
      },
      {
        id: 'g-3',
        title: 'CULTIVATE EMOTIONAL CALMNESS & SELF-TRUST',
        vision: 'Become unshakeably calm, unhurried, and keep promises to myself.',
        timeframe: '90-Day Vision',
        monthlyTarget: '20 daily journal entries & consistent sleep',
        weeklyTarget: 'Sunday reflection & 10:30 PM sleep wind-down',
        todayAction: '5-minute evening reflection in private journal',
        category: 'Mind',
        progress: 0,
        status: 'Active',
        targetDate: '2026-10-31',
        milestones: [
          { text: 'Zero phone usage 30 mins before sleep', done: false },
          { text: 'Weekly reflection completed 3 consecutive weeks', done: false },
          { text: 'Read 2 philosophy and mindfulness books', done: false }
        ]
      }
    ],

    // 4. ROUTINES - All tasks unticked
    routines: {
      morning: [
        { id: 'rm-1', time: '07:00', name: 'Wake up peacefully & open curtains', duration: '10 min', completed: false },
        { id: 'rm-2', time: '07:10', name: 'Hydrate (big glass of water) + Skincare', duration: '20 min', completed: false },
        { id: 'rm-3', time: '07:30', name: 'Morning fresh air walk', duration: '30 min', completed: false },
        { id: 'rm-4', time: '08:00', name: 'Nourishing protein breakfast & tea', duration: '30 min', completed: false },
        { id: 'rm-5', time: '08:30', name: 'Get ready & set Today\'s Top 3', duration: '15 min', completed: false }
      ],
      evening: [
        { id: 're-1', time: '18:00', name: 'Movement / Workout & shower', duration: '60 min', completed: false },
        { id: 're-2', time: '19:00', name: 'Peaceful dinner with loved ones', duration: '60 min', completed: false },
        { id: 're-3', time: '20:00', name: 'Focused study / creative block', duration: '90 min', completed: false },
        { id: 're-4', time: '21:30', name: '10 pages reading & chamomile tea', duration: '60 min', completed: false },
        { id: 're-5', time: '22:30', name: 'Journal reflection & restful wind down', duration: '15 min', completed: false }
      ]
    },

    // 5. HABITS & CONSISTENCY - All 0 stats, 0% score, 0 days tracked
    habits: [
      {
        id: 'h-1',
        name: 'Workout or Pilates Movement',
        category: 'Fitness',
        frequency: '4x per week',
        target: '16 / month',
        completedDaysThisMonth: 0,
        totalDaysTracked: 0,
        consistencyScore: 0,
        history7Days: [false, false, false, false, false, false, false]
      },
      {
        id: 'h-2',
        name: 'Study 2+ Hours with Deep Focus',
        category: 'Education',
        frequency: 'Daily',
        target: '30 / month',
        completedDaysThisMonth: 0,
        totalDaysTracked: 0,
        consistencyScore: 0,
        history7Days: [false, false, false, false, false, false, false]
      },
      {
        id: 'h-3',
        name: 'Read 10+ Pages',
        category: 'Mind',
        frequency: 'Daily',
        target: '30 / month',
        completedDaysThisMonth: 0,
        totalDaysTracked: 0,
        consistencyScore: 0,
        history7Days: [false, false, false, false, false, false, false]
      },
      {
        id: 'h-4',
        name: 'Sleep before 10:30 PM',
        category: 'Health',
        frequency: 'Daily',
        target: '30 / month',
        completedDaysThisMonth: 0,
        totalDaysTracked: 0,
        consistencyScore: 0,
        history7Days: [false, false, false, false, false, false, false]
      }
    ],

    // 6. GROW - All 0 stats, fresh heatmap & empty calendar presence
    grow: {
      daysShowedUp: '0 days',
      overallConsistency: 0,
      goalsCompleted: 0,
      habitsMaintained: 0,
      categories: [
        { name: 'Mind & Focus', score: 0 },
        { name: 'Body & Movement', score: 0 },
        { name: 'Future & Study', score: 0 },
        { name: 'Self & Life', score: 0 }
      ],
      heatmap: [],
      timeline: {
        past30Days: 'Starting fresh. Day one of your personal transformation.',
        today: 'You are beginning your journey with a clean slate and open mind.',
        next30Days: 'Build steady daily discipline, honor your promises, and cultivate quiet confidence.'
      }
    },

    calendarPresence: {},

    // 7. LIVE - All cards untouched (done: false)
    live: {
      cards: [
        {
          id: 'lc-1',
          title: 'Try a new café',
          tag: '☕ Explore',
          desc: 'Spend an unhurried morning with iced matcha & a fresh notebook.',
          image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
          done: false
        },
        {
          id: 'lc-2',
          title: 'Watch the sunset',
          tag: '🌅 Serenity',
          desc: 'Pause at 6:30 PM to watch the golden light paint the sky.',
          image: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=600&q=80',
          done: false
        },
        {
          id: 'lc-3',
          title: 'Make something',
          tag: '🎨 Creative',
          desc: 'Pottery, watercolours, baking sourdough, or writing poetry.',
          image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
          done: false
        },
        {
          id: 'lc-4',
          title: 'See your friends',
          tag: '👯 Connection',
          desc: 'Candlelight pasta night with loud laughter and zero phone distractions.',
          image: 'https://images.unsplash.com/photo-1517256673644-36ad11246d21?auto=format&fit=crop&w=600&q=80',
          done: false
        },
        {
          id: 'lc-5',
          title: 'Movie night',
          tag: '🎬 Rest',
          desc: 'Cozy blanket, herbal tea, and your favorite nostalgic film.',
          image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
          done: false
        },
        {
          id: 'lc-6',
          title: 'Take yourself somewhere',
          tag: '🌿 Solo Date',
          desc: 'Visit a museum or botanical greenhouse in complete peace.',
          image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=600&q=80',
          done: false
        }
      ]
    },

    // 8. JOURNAL - Empty entries array for a brand new clean personal diary
    journal: {
      entries: [],
      prompts: [
        {
          title: '🌿 Freeform Stream of Consciousness',
          template: 'Dear Diary,\n\nTonight, my mind is sitting with...\n\nWhat felt genuine today was...'
        },
        {
          title: '☀️ Morning Intention & Gratitude',
          template: 'Dear Diary — Morning Intention:\n\n1. Who I am practicing being today:\n2. The one promise I will protect:\n3. Three things I am grateful for right now:\n   • \n   • \n   • \n4. How I want my evening self to feel:'
        },
        {
          title: '🌙 Evening Synthesis & Brain Dump',
          template: 'Dear Diary — Evening Reflection:\n\n• What went exceptionally well today:\n• What challenged my patience or focus:\n• One boundary or habit I honored:\n• What I am letting go of before sleep:'
        },
        {
          title: '⚡ Identity & Discipline Check-in',
          template: 'Dear Diary — Identity Alignment:\n\n• Am I acting like the woman I am building?\n• Evidence I showed up today:\n• One small adjustment for tomorrow:'
        }
      ]
    }
  };
}

class Store {
  constructor() {
    this.state = this.loadState();
    this.listeners = [];
    this.recalculateMetrics();
  }

  recalculateMetrics() {
    if (!this.state || !this.state.daily) return;
    const checklist = this.state.daily.checklist;
    if (!checklist) return;

    const calcPct = (items = []) => {
      if (!items || items.length === 0) return 0;
      const done = items.filter(i => i.completed).length;
      return Math.round((done / items.length) * 100);
    };

    if (!this.state.daily.metrics) {
      this.state.daily.metrics = { mind: 0, body: 0, future: 0 };
    }

    this.state.daily.metrics.mind = calcPct(checklist.mind);
    this.state.daily.metrics.body = calcPct(checklist.body);
    this.state.daily.metrics.future = calcPct(checklist.future);

    const allItems = [
      ...(checklist.mind || []),
      ...(checklist.body || []),
      ...(checklist.future || []),
      ...(checklist.self || [])
    ];
    if (allItems.length > 0) {
      const totalDone = allItems.filter(i => i.completed).length;
      this.state.daily.presenceScore = Math.round((totalDone / allItems.length) * 100);
    }
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultState,
          ...parsed,
          user: {
            ...defaultState.user,
            ...(parsed.user || {})
          }
        };
      }
    } catch (e) {
      console.warn('Failed to parse state from localStorage, using defaults:', e);
    }
    return JSON.parse(JSON.stringify(defaultState));
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      this.notify();
    } catch (e) {
      console.error('Error saving state:', e);
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this.state));
  }

  // Actions
  registerNewAccount({ name, email }) {
    this.state = createFreshState({ name, email });
    this.recalculateMetrics();
    this.saveState();
  }

  loginWithAccount({ name, email, isNew = false }) {
    // If it's a new account, or new email different from Anna's demo, start fresh with 0 data
    if (isNew || (email && !email.toLowerCase().includes('anna@becoming.life') && !email.toLowerCase().includes('anna.editorial@becoming.life'))) {
      this.state = createFreshState({ name, email });
      this.recalculateMetrics();
      this.saveState();
    } else {
      this.updateUserProfile({ name, email });
    }
  }

  updateUserProfile(userData) {
    this.state.user = {
      ...this.state.user,
      ...userData
    };
    this.saveState();
  }

  setTheme(themeName) {
    this.state.user.theme = themeName;
    document.documentElement.setAttribute('data-theme', themeName);
    this.saveState();
  }

  setPromiseText(text) {
    this.state.daily.promise.text = text;
    this.saveState();
  }

  setPromiseStatus(status) {
    this.state.daily.promise.status = status;
    this.saveState();
  }

  toggleTop3(id) {
    const item = this.state.daily.top3.find(t => t.id === id);
    if (item) {
      item.completed = !item.completed;
      this.saveState();
    }
  }

  addTop3(title, category = 'Mind') {
    const newItem = {
      id: 'top-' + Date.now(),
      title,
      completed: false,
      category
    };
    this.state.daily.top3.push(newItem);
    this.saveState();
  }

  toggleChecklist(category, id) {
    if (this.state.daily.checklist && this.state.daily.checklist[category]) {
      const item = this.state.daily.checklist[category].find(i => i.id === id);
      if (item) {
        item.completed = !item.completed;
        this.recalculateMetrics();
        this.saveState();
      }
    }
  }

  toggleRoutineTask(period, id) {
    if (this.state.routines[period]) {
      const task = this.state.routines[period].find(t => t.id === id);
      if (task) {
        task.completed = !task.completed;
        this.saveState();
      }
    }
  }

  toggleGoalMilestone(goalId, milestoneIndex) {
    const goal = this.state.goals.find(g => g.id === goalId);
    if (goal && goal.milestones && goal.milestones[milestoneIndex]) {
      goal.milestones[milestoneIndex].done = !goal.milestones[milestoneIndex].done;
      const doneCount = goal.milestones.filter(m => m.done).length;
      goal.progress = Math.round((doneCount / goal.milestones.length) * 100);
      this.saveState();
    }
  }

  toggleLiveCard(id) {
    const card = this.state.live.cards.find(c => c.id === id);
    if (card) {
      card.done = !card.done;
      this.saveState();
    }
  }

  toggleTrait(trait) {
    if (this.state.identity.selectedTraits.includes(trait)) {
      this.state.identity.selectedTraits = this.state.identity.selectedTraits.filter(t => t !== trait);
    } else {
      this.state.identity.selectedTraits.push(trait);
    }
    this.saveState();
  }

  saveDailyJournal(journalData) {
    this.state.journal.currentDaily = { ...this.state.journal.currentDaily, ...journalData };
    this.saveState();
  }

  addDiaryEntry(entry) {
    if (!this.state.journal.entries) this.state.journal.entries = [];
    const newEntry = {
      id: 'diary-' + Date.now(),
      date: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      title: entry.title || 'Untitled Diary Entry',
      content: entry.content || '',
      mood: entry.mood || '✨ Inspired',
      weather: entry.weather || 'NYC Evening • 68°F',
      tags: entry.tags || ['Reflection'],
      wordCount: (entry.content || '').trim().split(/\s+/).filter(Boolean).length
    };
    this.state.journal.entries.unshift(newEntry);
    this.saveState();
    return newEntry;
  }

  updateDiaryEntry(id, fields) {
    const entry = (this.state.journal.entries || []).find(e => e.id === id);
    if (entry) {
      Object.assign(entry, fields);
      if (fields.content) {
        entry.wordCount = fields.content.trim().split(/\s+/).filter(Boolean).length;
      }
      this.saveState();
    }
  }

  deleteDiaryEntry(id) {
    this.state.journal.entries = (this.state.journal.entries || []).filter(e => e.id !== id);
    this.saveState();
  }

  getDatePresence(dateKey, defaultDayIdx = 0) {
    if (this.state.calendarPresence && this.state.calendarPresence[dateKey]) {
      return this.state.calendarPresence[dateKey];
    }

    // Compare dateKey (YYYY-MM-DD) with today's real local date
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    // Future days that haven't arrived yet should NEVER show as showed up!
    if (dateKey > todayKey) {
      return 'upcoming';
    }

    // For new accounts with empty heatmap:
    const heatmap = this.state.grow?.heatmap || [];
    if (heatmap.length === 0) {
      return 'upcoming';
    }

    return heatmap[defaultDayIdx % heatmap.length] || 'upcoming';
  }

  toggleDatePresence(dateKey, defaultDayIdx = 0) {
    if (!this.state.calendarPresence) {
      this.state.calendarPresence = {};
    }
    const statuses = ['completed', 'partial', 'rest', 'missed', 'upcoming'];
    const current = this.getDatePresence(dateKey, defaultDayIdx);
    const nextIdx = (statuses.indexOf(current) + 1) % statuses.length;
    const nextStatus = statuses[nextIdx];
    this.state.calendarPresence[dateKey] = nextStatus;
    this.saveState();
    return nextStatus;
  }

  apply1DayReset() {
    this.state.daily.checklist = {
      mind: [
        { id: 'rst-1', text: 'Drink warm water with lemon or tea', completed: false },
        { id: 'rst-2', text: '15-minute quiet walk outside in fresh air', completed: false }
      ],
      body: [
        { id: 'rst-3', text: 'Nourishing simple meal', completed: false },
        { id: 'rst-4', text: 'Long refreshing shower & skincare', completed: false }
      ],
      future: [
        { id: 'rst-5', text: '20-minute focus session on ONE thing', completed: false },
        { id: 'rst-6', text: 'Prepare space & clothes for tomorrow', completed: false }
      ],
      self: [
        { id: 'rst-7', text: 'Make bed & reset personal desk', completed: false },
        { id: 'rst-8', text: 'Sleep on time before 10:30 PM with zero guilt', completed: false }
      ]
    };
    this.state.daily.promise = {
      text: 'I\'m showing up again with kindness. One good day is enough.',
      status: 'pending'
    };
    this.state.daily.top3 = [
      { id: 'rst-top1', title: 'Make bed & reset personal space', completed: false, category: 'Self' },
      { id: 'rst-top2', title: '20-minute focus session on single priority', completed: false, category: 'Mind' },
      { id: 'rst-top3', title: 'Sleep on time at 10:30 PM with peace', completed: false, category: 'Body' }
    ];
    this.saveState();
  }

  resetAllData() {
    localStorage.removeItem(STORAGE_KEY);
    this.state = JSON.parse(JSON.stringify(defaultState));
    this.saveState();
  }
}

export const store = new Store();
