import { Job, Application, EarningsData } from './types';

// Your skills that will be matched with jobs
export const mySkills = [
  // Core cricket playing skills
  'Bowler', 'Fast Bowler', 'Medium Pacer', 'Mystery Spinner', 'Leg Spinner', 'Off Spinner',
  'Batsman', 'Opening Batsman', 'Middle Order', 'Power Hitting',
  'Wicket Keeping', 'Fielding Specialist', 'Sidearm Thrower', 'Net Bowler',
  
  // Coaching skills
  'Cricket Coaching', 'One-on-One Coaching', 'Batting Techniques', 'Bowling Techniques', 
  'Fielding Drills', 'Wicket Keeping Techniques', 'Match Strategy', 'Video Analysis',
  
  // Support skills
  'Sports Conditioning', 'Fitness Training', 'Cricket-specific Fitness', 'Injury Prevention',
  'Performance Analysis', 'Cricket Physio', 'Cricket Analyst', 'Cricket Scorer', 'Cricket Umpire',
  
  // Media skills
  'Cricket Photography', 'Cricket Videography', 'Cricket Content Creation'
];

// Function to find matching skills between your skills and job requirements
export const getMatchingSkills = (jobSkills: string[] = []) => {
  return mySkills.filter(skill => 
    jobSkills.some(jobSkill => 
      jobSkill.toLowerCase().includes(skill.toLowerCase()) || 
      skill.toLowerCase().includes(jobSkill.toLowerCase())
    )
  );
};

// Mock data for demonstration
export const mockUpcomingJobs: Job[] = [
  // Original jobs with updated IDs but keeping original details
  {
    id: 'DLSP1234',
    title: 'U-16 Academy Coach',
    category: 'OTHER',
    date: '2024-07-10',
    time: '16:00',
    status: 'confirmed',
    payment: 2500,
    location: 'Mylapore, Chennai',
    description: 'Looking for an experienced cricket coach for our U-16 academy team. Must have prior coaching experience and knowledge of modern cricket techniques.',
    skills: ['Cricket Coaching', 'Batting Techniques', 'Bowling Techniques', 'Fielding Drills', 'Team Management'],
    duration: '2 hours per session',
    experienceLevel: 'Expert',
    client: {
      name: 'Rajesh Kumar',
      rating: 4.8,
      jobsCompleted: 8,
      moneySpent: 85000,
      memberSince: '2022-03-15',
      phoneNumber: '+91 9876543210',
      image: '/avatars/rajesh.jpg',
      freelancersWorked: 8,
      freelancerAvatars: [
        'https://randomuser.me/api/portraits/men/32.jpg',
        'https://randomuser.me/api/portraits/women/45.jpg',
        'https://randomuser.me/api/portraits/men/67.jpg'
      ]
    }
  },
  {
    id: 'DLST5678',
    title: 'Sidearm Specialist — Powerplay & Death Overs',
    category: 'OTHER',
    date: '2024-06-25',
    time: '10:00',
    status: 'completed',
    completedAt: '2024-06-25T15:30:00',
    payment: 15000,
    location: 'Chepauk Cricket Ground, Chennai',
    description: 'Need an experienced sidearm specialist to simulate tournament conditions for our batsmen. Focus on yorkers, bouncers, and variations for T20 prep.',
    skills: ['Sidearm Throwing', 'Death Overs', 'Powerplay Bowling', 'Tournament Simulation'],
    duration: '3 hours (2 sessions)',
    experienceLevel: 'Expert',
    client: {
      name: 'Chennai Super Kings Academy',
      rating: 4.9,
      jobsCompleted: 12,
      moneySpent: 95000,
      memberSince: '2020-05-10',
      phoneNumber: '+91 8765432109',
      image: '/avatars/csk.jpg',
      freelancersWorked: 12,
      freelancerAvatars: [
        'https://randomuser.me/api/portraits/women/22.jpg',
        'https://randomuser.me/api/portraits/men/18.jpg',
        'https://randomuser.me/api/portraits/women/33.jpg'
      ]
    },
    earnings: {
      amount: 15000,
      platformFee: 1500, // 10%
      total: 13500
    },
    clientRating: {
      stars: 5,
      feedback: 'Excellent work! The specialist accurately simulated professional conditions and helped our batsmen adapt to T20 demands. Would definitely hire again.',
      date: '2024-06-26T10:15:00'
    }
  },
  {
    id: 'DLMS9012',
    title: 'Mystery Spin Training — Carrom Ball & Doosra',
    category: 'OTHER',
    date: '2024-06-20',
    time: '14:00',
    status: 'completed',
    payment: 2000,
    location: 'Anna Nagar Cricket Club, Chennai',
    description: 'Need a mystery spinner for training sessions with our top-order batsmen. Looking for someone who can bowl carrom balls, doosra, and other variations consistently.',
    skills: ['Mystery Spinner', 'Bowling Techniques', 'Carrom Ball', 'Doosra'],
    duration: '2 hours per session',
    experienceLevel: 'Expert',
    client: {
      name: 'Anna Nagar Cricket Club',
      rating: 4.7,
      jobsCompleted: 6,
      moneySpent: 32000,
      memberSince: '2023-01-20',
      phoneNumber: '+91 7654321098',
      image: '/avatars/club.jpg',
      freelancersWorked: 5,
      freelancerAvatars: [
        'https://randomuser.me/api/portraits/women/28.jpg',
        'https://randomuser.me/api/portraits/men/35.jpg'
      ]
    }
  },
  {
    id: 'DLOC1234',
    title: 'Personal Batting Coach — Front-Foot Technique',
    category: 'OTHER',
    date: '2024-06-18',
    time: '10:00',
    status: 'cancelled',
    payment: 2000,
    location: 'T Nagar Cricket Academy, Chennai',
    description: 'Looking for a dedicated cricket coach for private one-on-one sessions. Focus on improving batting technique and footwork for a 16-year-old aspiring cricketer.',
    skills: ['One-on-One Coaching', 'Batting Techniques', 'Footwork', 'Cricket Training'],
    duration: '1.5 hours per session',
    experienceLevel: 'Expert',
    client: {
      name: 'Arjun Mehta',
      rating: 4.2,
      jobsCompleted: 5,
      moneySpent: 28000,
      memberSince: '2023-07-10',
      phoneNumber: '+91 6543210987',
      image: '/avatars/arjun.jpg',
      freelancersWorked: 3,
      freelancerAvatars: [
        'https://randomuser.me/api/portraits/men/29.jpg'
      ]
    },
    cancellationDetails: {
      cancelledBy: 'client',
      cancelledAt: '2024-06-16T14:30:00',
      notes: 'Client found another coach with more experience in junior cricket.'
    }
  },
  {
    id: 'DLNB3456',
    title: 'Fast Bowling Practice — 140+ kph Nets',
    category: 'OTHER',
    date: '2024-06-15',
    client: {
      name: 'Tamil Nadu Cricket Academy',
      rating: 4.5,
      jobsCompleted: 9,
      moneySpent: 68000,
      memberSince: '2021-11-05',
      phoneNumber: '+91 9432109876',
      image: '/avatars/tnca.jpg',
      freelancersWorked: 12,
      freelancerAvatars: [
        'https://randomuser.me/api/portraits/men/45.jpg',
        'https://randomuser.me/api/portraits/women/37.jpg',
        'https://randomuser.me/api/portraits/men/22.jpg'
      ]
    },
    time: '11:30',
    status: 'cancelled',
    payment: 1800,
    location: 'Adyar Cricket Ground, Chennai',
    description: 'Need a fast bowler (140+ kph) for our batsmen\'s net practice. Preparing for upcoming state-level tournament. 2-hour session with breaks.',
    skills: ['Fast Bowler', 'Net Bowler', 'Cricket Training', 'Pace Bowling'],
    duration: '2 hours',
    experienceLevel: 'Expert',
    cancellationDetails: {
      cancelledBy: 'freelancer',
      cancelledAt: '2024-06-14T16:45:00',
      notes: 'Unable to make it due to injury during previous net session.'
    }
  },
  {
    id: 'DLCA7890',
    title: 'Match Footage Analysis — Technical Breakdown',
    category: 'OTHER',
    date: '2024-06-28',
    time: '09:00',
    status: 'completed',
    payment: 3500,
    location: 'Velachery Cricket Academy, Chennai',
    description: 'Need a cricket analyst to review and analyze match footage for our academy team. Focus on identifying technical flaws in batting and bowling techniques.',
    skills: ['Cricket Analyst', 'Video Analysis', 'Performance Analysis', 'Cricket Techniques'],
    duration: '4 hours',
    experienceLevel: 'Expert'
  },
  
  // Cricket-focused jobs continued
  {
    id: 'DLCP1234',
    title: 'Tournament Photography — Action Shots & Highlights',
    category: 'OTHER',
    date: '2024-07-12',
    time: '09:00',
    status: 'pending',
    payment: 5000,
    location: 'M.A. Chidambaram Stadium, Chennai',
    description: 'Need a professional sports photographer for our local cricket tournament. Must have experience with action shots and sports photography equipment.',
    skills: ['Cricket Photography', 'Sports Photography', 'Action Shots', 'Photo Editing'],
    duration: '8 hours (full match day)',
    experienceLevel: 'Expert',
    client: {
      name: 'Chennai Cricket Association',
      rating: 4.8,
      jobsCompleted: 12,
      moneySpent: 85000,
      memberSince: '2021-05-15',
      phoneNumber: '+91 8765432101',
      image: '/avatars/cca.jpg',
      freelancersWorked: 8,
      freelancerAvatars: [
        'https://randomuser.me/api/portraits/women/31.jpg',
        'https://randomuser.me/api/portraits/men/42.jpg',
        'https://randomuser.me/api/portraits/women/25.jpg'
      ]
    }
  },
  {
    id: 'DLCC3456',
    title: 'Social Media Content — Highlights & Player Profiles',
    category: 'OTHER',
    date: '2024-07-08',
    time: '08:00',
    status: 'confirmed',
    payment: 18000,
    location: 'Chepauk, Chennai',
    description: 'Looking for a cricket content creator to produce engaging videos for our social media channels. Need highlights packages, player profiles, and technique analysis videos.',
    skills: ['Cricket Content Creation', 'Video Editing', 'Social Media', 'Cricket Knowledge'],
    duration: 'Project based (15 videos)',
    experienceLevel: 'Expert',
    client: {
      name: 'Chennai Super Kings Academy',
      rating: 4.9,
      jobsCompleted: 18,
      moneySpent: 220000,
      memberSince: '2020-10-20',
      phoneNumber: '+91 8765432109',
      image: '/avatars/csk.jpg',
      freelancersWorked: 12,
      freelancerAvatars: [
        'https://randomuser.me/api/portraits/women/22.jpg',
        'https://randomuser.me/api/portraits/men/18.jpg',
        'https://randomuser.me/api/portraits/women/33.jpg'
      ]
    }
  },
  {
    id: 'DLCU7890',
    title: 'Tournament Officiating — T20 Weekend Panel',
    category: 'OTHER',
    date: '2024-07-15',
    time: '08:00',
    status: 'pending',
    payment: 8000,
    location: 'Various Grounds, Chennai',
    description: 'Seeking experienced cricket umpires for our local T20 tournament. Knowledge of all cricket rules and good communication skills required.',
    skills: ['Cricket Umpire', 'Rules Knowledge', 'Decision Making', 'Communication'],
    duration: '3 days (weekend tournament)',
    experienceLevel: 'Expert',
    client: {
      name: 'Chennai Cricket League',
      rating: 4.7,
      jobsCompleted: 12,
      moneySpent: 120000,
      memberSince: '2021-08-10',
      phoneNumber: '+91 7654321098',
      image: '/avatars/ccl.jpg',
      freelancersWorked: 24,
      freelancerAvatars: [
        'https://randomuser.me/api/portraits/women/28.jpg',
        'https://randomuser.me/api/portraits/men/35.jpg'
      ]
    }
  },
  {
    id: 'DLCS2468',
    title: 'Digital Scoring — Weekend T20 Tournament',
    category: 'OTHER',
    date: '2024-07-20',
    time: '08:00',
    status: 'confirmed',
    payment: 5000,
    location: 'Anna Nagar Cricket Ground, Chennai',
    description: 'Looking for experienced cricket scorers for our upcoming weekend tournament. Must be familiar with digital scoring systems and cricket statistics.',
    skills: ['Cricket Scorer', 'Digital Scoring', 'Cricket Statistics', 'Match Analysis'],
    duration: '2 days (weekend)',
    experienceLevel: 'Intermediate',
    client: {
      name: 'Chennai Cricket Association',
      rating: 4.9,
      jobsCompleted: 14,
      moneySpent: 95000,
      memberSince: '2021-02-10',
      phoneNumber: '+91 9876543212',
      image: '/avatars/cca.jpg',
      freelancersWorked: 18,
      freelancerAvatars: [
        'https://randomuser.me/api/portraits/women/36.jpg',
        'https://randomuser.me/api/portraits/men/47.jpg',
        'https://randomuser.me/api/portraits/women/24.jpg'
      ]
    }
  },
  {
    id: 'DLCP1357',
    title: 'Sports Physiotherapy — Injury Prevention Program',
    category: 'OTHER',
    date: '2024-07-25',
    time: '10:00',
    status: 'pending',
    payment: 12000,
    location: 'Nungambakkam Cricket Club, Chennai',
    description: 'Seeking a qualified sports physiotherapist for our cricket club team. Focus on injury prevention, treatment, and recovery protocols specific to cricket players.',
    skills: ['Cricket Physio', 'Sports Therapy', 'Injury Management', 'Recovery Techniques'],
    duration: '1 month (thrice weekly)',
    experienceLevel: 'Expert',
    client: {
      name: 'Nungambakkam Cricket Club',
      rating: 4.8,
      jobsCompleted: 22,
      moneySpent: 180000,
      memberSince: '2020-07-15',
      phoneNumber: '+91 8765432111',
      image: '/avatars/ncc.jpg',
      freelancersWorked: 15,
      freelancerAvatars: [
        'https://randomuser.me/api/portraits/men/38.jpg',
        'https://randomuser.me/api/portraits/women/27.jpg',
        'https://randomuser.me/api/portraits/men/51.jpg'
      ]
    }
  }
];

export const mockApplications: Application[] = [
  {
    "#": 'DLST1234',
    jobTitle: 'Sidearm Thrower for Professional Team',
    appliedDate: '2024-06-28',
    status: 'pending',
    clientName: 'Chennai Super Kings Academy',
    budget: { min: 2000, max: 3500 },
    progress: 0,
    clientImage: '/avatars/csk.jpg',
    location: 'Chepauk, Chennai',
    postedDate: '2024-06-25',
    description: 'Looking for an experienced sidearm specialist who can simulate various bowling actions for our professional batsmen practice sessions.',
    clientId: 'csk123',
    moneySpent: 45000,
    freelancersWorked: 8,
    freelancerAvatars: [
      'https://randomuser.me/api/portraits/men/32.jpg',
      'https://randomuser.me/api/portraits/women/45.jpg',
      'https://randomuser.me/api/portraits/men/67.jpg'
    ],
    proposal: {
      coverLetter: 'I have 3+ years of experience as a sidearm specialist working with state-level teams. I can accurately simulate pace, spin, and variations up to 140 kph.',
      proposedRate: 3000,
      estimatedDays: 20,
      skills: ['Sidearm Throwing', 'Fast Bowling Simulation', 'Spin Bowling Simulation', 'Cricket Training'],
      attachments: ['experience_certificate.pdf', 'testimonials.pdf']
    }
  },
  {
    "#": 'DLMS5678',
    jobTitle: 'Mystery Spinner for Academy Training',
    appliedDate: '2024-06-29',
    status: 'pending',
    clientName: 'Tamil Nadu Cricket Academy',
    budget: { min: 3000, max: 5000 },
    progress: 0,
    clientImage: '/avatars/tnca.jpg',
    location: 'Anna Nagar Cricket Ground, Chennai',
    postedDate: '2024-06-26',
    description: 'Seeking a skilled mystery spinner who can coach our academy batsmen on facing different variations of spin bowling.',
    clientId: 'tnca456',
    moneySpent: 65000,
    freelancersWorked: 10,
    freelancerAvatars: [
      'https://randomuser.me/api/portraits/women/22.jpg',
      'https://randomuser.me/api/portraits/men/18.jpg',
      'https://randomuser.me/api/portraits/women/33.jpg',
      'https://randomuser.me/api/portraits/men/45.jpg',
      'https://randomuser.me/api/portraits/women/12.jpg'
    ],
    proposal: {
      coverLetter: 'I specialize in mystery spin bowling including carrom ball, doosra, and slider variations. I have played state-level cricket and can help batsmen develop techniques against various spin deliveries.',
      proposedRate: 4500,
      estimatedDays: 15,
      skills: ['Mystery Spin', 'Carrom Ball', 'Doosra', 'Spin Coaching', 'Cricket Training'],
      attachments: ['spin_credentials.pdf', 'playing_history.pdf']
    }
  },
  {
    "#": 'DLOC9012',
    jobTitle: 'One-on-One Cricket Coaching for Teenager',
    appliedDate: '2024-06-20',
    status: 'pending',
    clientName: 'Mehta Family',
    budget: { min: 2500, max: 3500 },
    progress: 0,
    clientImage: '/avatars/family.jpg',
    location: 'T Nagar, Chennai',
    postedDate: '2024-06-18',
    description: 'Looking for a personal cricket coach for my 16-year-old son who wants to improve his batting technique and footwork',
    clientId: 'mehta789',
    moneySpent: 35000,
    freelancersWorked: 6,
    freelancerAvatars: [
      'https://randomuser.me/api/portraits/women/28.jpg',
      'https://randomuser.me/api/portraits/men/35.jpg',
      'https://randomuser.me/api/portraits/women/19.jpg',
      'https://randomuser.me/api/portraits/men/42.jpg',
      'https://randomuser.me/api/portraits/women/37.jpg',
      'https://randomuser.me/api/portraits/men/23.jpg'
    ],
    proposal: {
      coverLetter: 'I am a cricket coach with over 7 years of experience specializing in youth development. I have worked with players at both school and academy levels, focusing on developing proper batting technique, footwork, and mental approach to the game.',
      proposedRate: 3000,
      estimatedDays: 30,
      skills: ['One-on-One Coaching', 'Batting Technique', 'Footwork Training', 'Youth Development', 'Video Analysis'],
      attachments: ['coaching_certificate.pdf', 'training_methodology.pdf']
    },
  },
  {
    "#": 'DLCS5678',
    jobTitle: 'Cricket Scorer for Local Tournament',
    appliedDate: '2024-06-19',
    status: 'accepted',
    clientName: 'Chennai Cricket Association',
    budget: { min: 2000, max: 2500 },
    progress: 100,
    clientImage: '/avatars/cca.jpg',
    location: 'Velachery Cricket Ground, Chennai',
    postedDate: '2024-06-15',
    description: 'Need an experienced cricket scorer for our weekend tournament. Must be familiar with digital scoring applications.',
    clientId: 'cca321',
    moneySpent: 45000,
    freelancersWorked: 12,
    freelancerAvatars: [
      'https://randomuser.me/api/portraits/men/42.jpg',
      'https://randomuser.me/api/portraits/women/37.jpg'
    ],
    proposal: {
      coverLetter: 'I have 5+ years of experience as a cricket scorer for various tournaments across Chennai. I am proficient with digital scoring platforms like CricHQ and can provide detailed match statistics.',
      proposedRate: 2200,
      estimatedDays: 4,
      skills: ['Cricket Scoring', 'Digital Scoring', 'Match Statistics', 'Cricket Knowledge'],
      attachments: ['scoring_certificate.pdf', 'tournament_experience.pdf']
    },
    // Removed completionDetails - not part of Application type
  },
  {
    "#": 'DLCA3456',
    jobTitle: 'Cricket Video Analyst',
    appliedDate: '2024-06-21',
    status: 'rejected',
    clientName: 'Tamil Nadu Cricket Academy',
    budget: { min: 3000, max: 4500 },
    progress: 0,
    clientImage: '/avatars/tnca.jpg',
    location: 'Chepauk, Chennai',
    postedDate: '2024-06-18',
    description: 'Need a cricket analyst to review player performances and provide detailed technical feedback for our academy team',
    clientId: 'tnca987',
    moneySpent: 85000,
    freelancersWorked: 14,
    freelancerAvatars: [
      'https://randomuser.me/api/portraits/men/24.jpg',
      'https://randomuser.me/api/portraits/women/17.jpg'
    ],
    proposal: {
      coverLetter: 'Experienced cricket analyst with expertise in technical analysis and performance metrics. I use advanced video analysis software to identify strengths and weaknesses in batting and bowling techniques.',
      proposedRate: 4000,
      estimatedDays: 7,
      skills: ['Cricket Analysis', 'Video Analysis', 'Performance Metrics', 'Technical Feedback'],
      attachments: ['analysis_portfolio.pdf', 'cricket_certifications.pdf']
    },
    // Removed rejectionDetails - not part of Application type
  }
];

export const mockEarnings: EarningsData = {
  totalEarnings: 45600,
  pendingPayouts: 7800,
  completedJobs: 24,
  averageRating: 4.7,
  recentTransactions: [
    {
      id: 'TRX1234',
      amount: 2200,
      date: '2024-06-28T15:00:00',
      jobTitle: 'Cricket Scorer for Tournament',
      client: 'Chennai Cricket Association',
      status: 'completed'
    },
    {
      id: 'TRX5678',
      amount: 4500,
      date: '2024-06-25T12:30:00',
      jobTitle: 'Cricket Video Analysis',
      client: 'Tamil Nadu Cricket Academy',
      status: 'completed'
    },
    {
      id: 'TRX9012',
      amount: 3500,
      date: '2024-06-20T10:45:00',
      jobTitle: 'Sidearm Specialist Session',
      client: 'Chennai Super Kings Academy',
      status: 'completed'
    },
    {
      id: 'TRX3456',
      amount: 3000,
      date: '2024-06-15T16:20:00',
      jobTitle: 'One-on-One Cricket Coaching',
      client: 'Mehta Family',
      status: 'completed'
    }
  ],
  earningsByMonth: [
    { month: 'Jan', earnings: 12000 },
    { month: 'Feb', earnings: 9800 },
    { month: 'Mar', earnings: 14200 },
    { month: 'Apr', earnings: 15600 },
    { month: 'May', earnings: 18900 },
    { month: 'Jun', earnings: 21300 },
  ]
};
