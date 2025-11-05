import { Job, Application, EarningsData, JobCategory } from './types';

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
    category: 'Coach',
    date: '2024-07-10',
    time: '16:00',
    status: 'confirmed',
    payment: 2500,
    location: 'Mylapore, Chennai',
    description: 'Looking for an experienced cricket coach for our U-16 academy team. Must have prior coaching experience and knowledge of modern cricket techniques.',
    skills: ['Cricket Coaching', 'Batting Techniques', 'Bowling Techniques', 'Fielding Drills', 'Team Management'],
    duration: '2 hours per session',
    experienceLevel: 'Expert',
    otp: '1234', // Test OTP for easy testing
    client: {
      name: 'Rajesh Kumar',
      rating: 4.8,
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      freelancersWorked: 8,
      freelancerAvatars: [
        'https://randomuser.me/api/portraits/men/32.jpg',
        'https://randomuser.me/api/portraits/women/45.jpg',
        'https://randomuser.me/api/portraits/men/67.jpg'
      ]
    },
    // Add proposal history for timeline continuity
    proposalHistory: {
      postedAt: '2024-07-01T10:30:00.000Z', // Original job posting date from feed
      appliedDate: '2024-07-05',
      clientSpottedDate: '2024-07-05T13:00:00.000Z',
      acceptedDate: '2024-07-08T10:30:00.000Z'
    }
  },
  {
    id: 'DLST5678',
    title: 'Sidearm Specialist — Powerplay & Death Overs',
    category: 'Sidearm',
    date: '2024-06-25',
    time: '10:00',
    status: 'completed',
    otp: '1234', // Test OTP for easy testing
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
      baseAmount: 15000,
      tips: 500, // Client gave a tip
      addOnServices: 2000, // Extra video analysis service
      platformCommission: 1750, // 10% commission on subtotal (15000 + 500 + 2000)
      gst: 3150, // 18% GST on subtotal (15000 + 500 + 2000)
      totalEarnings: 13600, // 17500 - 1750 - 3150
      commissionRate: 0.10,
      gstRate: 0.18,
      breakdown: {
        baseAmount: 15000,
        tips: 500,
        addOnServices: [
          { name: 'Video Analysis', amount: 2000 }
        ],
        platformCommission: 1750,
        gst: 3150,
        totalEarnings: 13600
      }
    },
    addOnServices: [
      { name: 'Video Analysis', price: 2000, description: 'Detailed technical breakdown of performance' }
    ],
    clientRating: {
      stars: 5,
      feedback: 'Excellent work! The specialist accurately simulated professional conditions and helped our batsmen adapt to T20 demands. Would definitely hire again.',
      date: '2024-06-26T10:15:00'
    }
  },
  {
    id: 'DLMS9012',
    title: 'Mystery Spin Training — Carrom Ball & Doosra',
    category: 'Net Bowler',
    date: '2024-06-20',
    time: '14:00',
    status: 'completed',
    payment: 2000,
    location: 'Anna Nagar Cricket Club, Chennai',
    description: 'Need a mystery spinner for training sessions with our top-order batsmen. Looking for someone who can bowl carrom balls, doosra, and other variations consistently.',
    skills: ['Mystery Spinner', 'Bowling Techniques', 'Carrom Ball', 'Doosra'],
    duration: '2 hours per session',
    experienceLevel: 'Intermediate',
    otp: '1234', // Test OTP for easy testing
    earnings: {
      baseAmount: 2000,
      tips: 200, // Client gave a tip for good performance
      addOnServices: 500, // Extra session added
      platformCommission: 270, // 10% commission on subtotal (2000 + 200 + 500)
      gst: 486, // 18% GST on subtotal (2000 + 200 + 500)
      totalEarnings: 1944, // 2700 - 270 - 486
      commissionRate: 0.10,
      gstRate: 0.18,
      breakdown: {
        baseAmount: 2000,
        tips: 200,
        addOnServices: [
          { name: 'Extra Training Session', amount: 500 }
        ],
        platformCommission: 270,
        gst: 486,
        totalEarnings: 1944
      }
    },
    addOnServices: [
      { name: 'Extra Training Session', price: 500, description: 'Additional practice session requested by client' }
    ],
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
    },
    // Add proposal history for timeline continuity
    proposalHistory: {
      postedAt: '2024-06-15T14:20:00.000Z', // Original job posting date from feed
      appliedDate: '2024-06-20',
      clientSpottedDate: '2024-06-20T15:30:00.000Z',
      acceptedDate: '2024-06-22T09:15:00.000Z'
    }
  },
  {
    id: 'DLOC1234',
    title: 'Personal Batting Coach — Front-Foot Technique',
    category: 'Coach',
    date: '2024-06-18',
    time: '10:00',
    status: 'cancelled',
    payment: 2000,
    location: 'T Nagar Cricket Academy, Chennai',
    description: 'Looking for a dedicated cricket coach for private one-on-one sessions. Focus on improving batting technique and footwork for a 16-year-old aspiring cricketer.',
    skills: ['One-on-One Coaching', 'Batting Techniques', 'Footwork', 'Cricket Training'],
    duration: '1.5 hours per session',
    experienceLevel: 'Expert',
    otp: '1234', // Test OTP for easy testing
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
    },
    // Add proposal history for timeline continuity
    proposalHistory: {
      postedAt: '2024-06-10T09:15:00.000Z', // Original job posting date from feed
      appliedDate: '2024-06-12',
      clientSpottedDate: '2024-06-12T16:45:00.000Z',
      acceptedDate: '2024-06-14T11:20:00.000Z'
    }
  },
  {
    id: 'DLNB3456',
    title: 'Fast Bowling Practice — 140+ kph Nets',
    category: 'Net Bowler',
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
    experienceLevel: 'Beginner',
    otp: '1234', // Test OTP for easy testing
    cancellationDetails: {
      cancelledBy: 'freelancer',
      cancelledAt: '2024-06-14T16:45:00',
      notes: 'Unable to make it due to injury during previous net session.'
    },
    // Add proposal history for timeline continuity
    proposalHistory: {
      postedAt: '2024-06-08T11:30:00.000Z', // Original job posting date from feed
      appliedDate: '2024-06-10',
      clientSpottedDate: '2024-06-10T14:15:00.000Z',
      acceptedDate: '2024-06-12T09:45:00.000Z'
    }
  },
  {
    id: 'DLCA7890',
    title: 'Match Footage Analysis — Technical Breakdown',
    category: 'Analyst',
    date: '2024-06-28',
    time: '09:00',
    status: 'completed',
    payment: 3500,
    location: 'Velachery Cricket Academy, Chennai',
    description: 'Need a cricket analyst to review and analyze match footage for our academy team. Focus on identifying technical flaws in batting and bowling techniques.',
    skills: ['Cricket Analyst', 'Video Analysis', 'Performance Analysis', 'Cricket Techniques'],
    duration: '4 hours',
    experienceLevel: 'Expert',
    otp: '1234', // Test OTP for easy testing
    earnings: {
      baseAmount: 3500,
      tips: 300, // Client gave a tip for excellent analysis
      addOnServices: 800, // Additional report requested
      platformCommission: 460, // 10% commission on subtotal (3500 + 300 + 800)
      gst: 828, // 18% GST on subtotal (3500 + 300 + 800)
      totalEarnings: 4312, // 4600 - 460 - 828
      commissionRate: 0.10,
      gstRate: 0.18,
      breakdown: {
        baseAmount: 3500,
        tips: 300,
        addOnServices: [
          { name: 'Detailed Performance Report', amount: 800 }
        ],
        platformCommission: 460,
        gst: 828,
        totalEarnings: 4312
      }
    },
    addOnServices: [
      { name: 'Detailed Performance Report', price: 800, description: 'Comprehensive analysis report with recommendations' }
    ],
    // Add proposal history for timeline continuity
    proposalHistory: {
      postedAt: '2024-06-20T08:00:00.000Z', // Original job posting date from feed
      appliedDate: '2024-06-22',
      clientSpottedDate: '2024-06-22T10:30:00.000Z',
      acceptedDate: '2024-06-24T14:15:00.000Z'
    }
  },

  // Cricket-focused jobs continued
  {
    id: 'DLCP1234',
    title: 'Tournament Photography — Action Shots & Highlights',
    category: 'Cricket Photo / Videography',
    date: '2024-07-12',
    time: '09:00',
    status: 'pending',
    payment: 5000,
    location: 'M.A. Chidambaram Stadium, Chennai',
    description: 'Need a professional sports photographer for our local cricket tournament. Must have experience with action shots and sports photography equipment.',
    skills: ['Cricket Photography', 'Sports Photography', 'Action Shots', 'Photo Editing'],
    duration: '8 hours (full match day)',
    experienceLevel: 'Expert',
    otp: '1234', // Test OTP for easy testing
    client: {
      name: 'Chennai Cricket Association',
      rating: 4.8,
      jobsCompleted: 12,
      moneySpent: 85000,
      memberSince: '2021-05-15',
      phoneNumber: '+91 8765432101',
      image: '/images/LOGOS/cca.jpg',
      freelancersWorked: 8,
      freelancerAvatars: [
        'https://randomuser.me/api/portraits/women/31.jpg',
        'https://randomuser.me/api/portraits/men/42.jpg',
        'https://randomuser.me/api/portraits/women/25.jpg'
      ]
    },
    // Mock add-on services and tips for demonstration (would be 0 for pending jobs in real app)
    addOnServices: [
      { name: 'Professional Photo Editing', price: 1200, description: 'Advanced editing and retouching of tournament photos' },
      { name: 'Social Media Package', price: 800, description: 'Ready-to-post content for social media platforms' }
    ],
    // Add proposal history for timeline continuity
    proposalHistory: {
      postedAt: '2024-07-05T07:30:00.000Z', // Original job posting date from feed
      appliedDate: '2024-07-08',
      clientSpottedDate: '2024-07-08T11:45:00.000Z',
      acceptedDate: '2024-07-10T15:20:00.000Z'
    }
  },
  {
    id: 'DLCC3456',
    title: 'Social Media Content — Highlights & Player Profiles',
    category: 'Cricket Content Creator',
    date: '2024-07-08',
    time: '08:00',
    status: 'confirmed',
    payment: 18000,
    location: 'Chepauk, Chennai',
    description: 'Looking for a cricket content creator to produce engaging videos for our social media channels. Need highlights packages, player profiles, and technique analysis videos.',
    skills: ['Cricket Content Creation', 'Video Editing', 'Social Media', 'Cricket Knowledge'],
    duration: 'Project based (15 videos)',
    experienceLevel: 'Intermediate',
    otp: '1234', // Test OTP for easy testing
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
    },
    // Add proposal history for timeline continuity
    proposalHistory: {
      postedAt: '2024-07-01T06:00:00.000Z', // Original job posting date from feed
      appliedDate: '2024-07-03',
      clientSpottedDate: '2024-07-03T09:30:00.000Z',
      acceptedDate: '2024-07-05T14:45:00.000Z'
    }
  },
  {
    id: 'DLCU7890',
    title: 'Tournament Officiating — T20 Weekend Panel',
    category: 'Umpire',
    date: '2024-07-15',
    time: '08:00',
    status: 'pending',
    payment: 8000,
    location: 'Various Grounds, Chennai',
    description: 'Seeking experienced cricket umpires for our local T20 tournament. Knowledge of all cricket rules and good communication skills required.',
    skills: ['Cricket Umpire', 'Rules Knowledge', 'Decision Making', 'Communication'],
    duration: '3 days (weekend tournament)',
    experienceLevel: 'Expert',
    otp: '1234', // Test OTP for easy testing
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
    },
    // Mock add-on services for demonstration
    addOnServices: [
      { name: 'Match Report Documentation', price: 600, description: 'Detailed match reports and scorecards' },
      { name: 'Player Conduct Monitoring', price: 400, description: 'Monitoring and reporting on-field behavior' }
    ],
    // Add proposal history for timeline continuity
    proposalHistory: {
      postedAt: '2024-07-08T10:15:00.000Z', // Original job posting date from feed
      appliedDate: '2024-07-11',
      clientSpottedDate: '2024-07-11T13:20:00.000Z',
      acceptedDate: '2024-07-13T16:30:00.000Z'
    }
  },
  {
    id: 'DLCS2468',
    title: 'Digital Scoring — Weekend T20 Tournament',
    category: 'Scorer',
    date: '2024-07-20',
    time: '08:00',
    status: 'confirmed',
    payment: 5000,
    location: 'Anna Nagar Cricket Ground, Chennai',
    description: 'Looking for experienced cricket scorers for our upcoming weekend tournament. Must be familiar with digital scoring systems and cricket statistics.',
    skills: ['Cricket Scorer', 'Digital Scoring', 'Cricket Statistics', 'Match Analysis'],
    duration: '2 days (weekend)',
    experienceLevel: 'Beginner',
    otp: '1234', // Test OTP for easy testing
    client: {
      name: 'Chennai Cricket Association',
      rating: 4.9,
      jobsCompleted: 14,
      moneySpent: 95000,
      memberSince: '2021-02-10',
      phoneNumber: '+91 9876543212',
      image: '/images/LOGOS/cca.jpg',
      freelancersWorked: 18,
      freelancerAvatars: [
        'https://randomuser.me/api/portraits/women/36.jpg',
        'https://randomuser.me/api/portraits/men/47.jpg',
        'https://randomuser.me/api/portraits/women/24.jpg'
      ]
    },
    // Add proposal history for timeline continuity
    proposalHistory: {
      postedAt: '2024-07-13T07:00:00.000Z', // Original job posting date from feed
      appliedDate: '2024-07-16',
      clientSpottedDate: '2024-07-16T10:45:00.000Z',
      acceptedDate: '2024-07-18T14:30:00.000Z'
    }
  },
  {
    id: 'DLCP1357',
    title: 'Sports Physiotherapy — Injury Prevention Program',
    category: 'Physio',
    date: '2024-07-25',
    time: '10:00',
    status: 'pending',
    payment: 12000,
    location: 'Nungambakkam Cricket Club, Chennai',
    description: 'Seeking a qualified sports physiotherapist for our cricket club team. Focus on injury prevention, treatment, and recovery protocols specific to cricket players.',
    skills: ['Cricket Physio', 'Sports Therapy', 'Injury Management', 'Recovery Techniques'],
    duration: '1 month (thrice weekly)',
    experienceLevel: 'Expert',
    otp: '1234', // Test OTP for easy testing
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
    },
    // Add proposal history for timeline continuity
    proposalHistory: {
      postedAt: '2024-07-18T09:30:00.000Z', // Original job posting date from feed
      appliedDate: '2024-07-21',
      clientSpottedDate: '2024-07-21T12:15:00.000Z',
      acceptedDate: '2024-07-23T16:45:00.000Z'
    }
  },
  {
    id: 'DLNT1111',
    title: 'Net Practice Session — Opening Batsmen',
    category: 'Net Batsman',
    date: '2024-07-30',
    time: '07:00',
    status: 'pending',
    payment: 3000,
    location: 'Adyar Cricket Ground, Chennai',
    description: 'Need opening batsmen for net practice sessions with our academy team. Focus on building partnerships and powerplay batting techniques.',
    skills: ['Opening Batsman', 'Powerplay Batting', 'Partnership Building', 'Net Practice'],
    duration: '3 hours',
    experienceLevel: 'Intermediate',
    otp: '1234', // Test OTP for easy testing
    client: {
      name: 'Adyar Cricket Academy',
      rating: 4.6,
      jobsCompleted: 18,
      moneySpent: 125000,
      memberSince: '2021-03-10',
      phoneNumber: '+91 9876543213',
      image: '/avatars/adyar.jpg',
      freelancersWorked: 15,
      freelancerAvatars: [
        'https://randomuser.me/api/portraits/women/34.jpg',
        'https://randomuser.me/api/portraits/men/26.jpg',
        'https://randomuser.me/api/portraits/women/41.jpg'
      ]
    },
    // Add proposal history for timeline continuity
    proposalHistory: {
      postedAt: '2024-07-23T06:30:00.000Z', // Original job posting date from feed
      appliedDate: '2024-07-26',
      clientSpottedDate: '2024-07-26T08:45:00.000Z',
      acceptedDate: '2024-07-28T11:30:00.000Z'
    }
  },
  {
    id: 'DLWK2222',
    title: 'Wicket Keeping Drills — Advanced Techniques',
    category: 'Match Player',
    date: '2024-08-02',
    time: '09:00',
    status: 'pending',
    payment: 2500,
    location: 'Velachery Cricket Club, Chennai',
    description: 'Looking for a specialist wicket keeper to conduct advanced training sessions. Focus on stumpings, diving catches, and reflex drills.',
    skills: ['Wicket Keeping', 'Diving Catches', 'Reflex Training', 'Stumpings'],
    duration: '2.5 hours',
    experienceLevel: 'Expert',
    otp: '1234', // Test OTP for easy testing
    client: {
      name: 'Velachery Cricket Club',
      rating: 4.7,
      jobsCompleted: 22,
      moneySpent: 95000,
      memberSince: '2020-11-15',
      phoneNumber: '+91 8765432112',
      image: '/avatars/velachery.jpg',
      freelancersWorked: 12,
      freelancerAvatars: [
        'https://randomuser.me/api/portraits/men/33.jpg',
        'https://randomuser.me/api/portraits/women/29.jpg',
        'https://randomuser.me/api/portraits/men/48.jpg'
      ]
    },
    // Add proposal history for timeline continuity
    proposalHistory: {
      postedAt: '2024-07-26T08:00:00.000Z', // Original job posting date from feed
      appliedDate: '2024-07-29',
      clientSpottedDate: '2024-07-29T10:20:00.000Z',
      acceptedDate: '2024-07-31T14:15:00.000Z'
    }
  },
  {
    id: 'DLFB3333',
    title: 'Fielding Specialist — Boundary Catching',
    category: 'Match Player',
    date: '2024-08-05',
    time: '10:00',
    status: 'confirmed',
    payment: 2000,
    location: 'T Nagar Cricket Ground, Chennai',
    description: 'Need a fielding specialist for boundary catching and ground fielding drills. Focus on athletic fielding and preventing boundaries.',
    skills: ['Fielding Specialist', 'Boundary Catching', 'Ground Fielding', 'Athletic Training'],
    duration: '2 hours',
    experienceLevel: 'Beginner',
    otp: '1234', // Test OTP for easy testing
    client: {
      name: 'T Nagar Cricket Academy',
      rating: 4.8,
      jobsCompleted: 16,
      moneySpent: 85000,
      memberSince: '2021-06-20',
      phoneNumber: '+91 7654321099',
      image: '/avatars/tnagar.jpg',
      freelancersWorked: 14,
      freelancerAvatars: [
        'https://randomuser.me/api/portraits/women/36.jpg',
        'https://randomuser.me/api/portraits/men/41.jpg'
      ]
    },
    // Add proposal history for timeline continuity
    proposalHistory: {
      postedAt: '2024-07-29T09:00:00.000Z', // Original job posting date from feed
      appliedDate: '2024-08-01',
      clientSpottedDate: '2024-08-01T11:30:00.000Z',
      acceptedDate: '2024-08-03T15:45:00.000Z'
    }
  },
  {
    id: 'DLSP4444',
    title: 'Sports Psychology — Mental Preparation',
    category: 'Coach',
    date: '2024-08-08',
    time: '14:00',
    status: 'completed',
    payment: 4000,
    location: 'Anna Nagar Sports Center, Chennai',
    description: 'Seeking a sports psychologist for mental preparation and performance enhancement sessions with our competitive cricket team.',
    skills: ['Sports Psychology', 'Mental Training', 'Performance Enhancement', 'Team Building'],
    duration: '4 hours (group session)',
    experienceLevel: 'Expert',
    otp: '1234', // Test OTP for easy testing
    earnings: {
      baseAmount: 4000,
      tips: 400, // Client gave a tip for excellent session
      addOnServices: 1000, // Follow-up consultation added
      platformCommission: 540, // 10% commission on subtotal (4000 + 400 + 1000)
      gst: 972, // 18% GST on subtotal (4000 + 400 + 1000)
      totalEarnings: 5288, // 5400 - 540 - 972
      commissionRate: 0.10,
      gstRate: 0.18,
      breakdown: {
        baseAmount: 4000,
        tips: 400,
        addOnServices: [
          { name: 'Follow-up Consultation', amount: 1000 }
        ],
        platformCommission: 540,
        gst: 972,
        totalEarnings: 5288
      }
    },
    addOnServices: [
      { name: 'Follow-up Consultation', price: 1000, description: 'Additional one-on-one session for individual players' }
    ],
    client: {
      name: 'Chennai Elite Cricket Club',
      rating: 4.9,
      jobsCompleted: 25,
      moneySpent: 200000,
      memberSince: '2020-05-01',
      phoneNumber: '+91 6543210988',
      image: '/avatars/elite.jpg',
      freelancersWorked: 18,
      freelancerAvatars: [
        'https://randomuser.me/api/portraits/men/27.jpg',
        'https://randomuser.me/api/portraits/women/43.jpg',
        'https://randomuser.me/api/portraits/men/52.jpg'
      ]
    },
    // Add proposal history for timeline continuity
    proposalHistory: {
      postedAt: '2024-08-01T13:00:00.000Z', // Original job posting date from feed
      appliedDate: '2024-08-04',
      clientSpottedDate: '2024-08-04T15:30:00.000Z',
      acceptedDate: '2024-08-06T10:15:00.000Z'
    }
  },
  {
    id: 'DLNV5555',
    title: 'Nutrition Consultation — Cricket-Specific Diet',
    category: 'Sports Conditioning Trainer',
    date: '2024-08-10',
    time: '11:00',
    status: 'completed',
    payment: 3500,
    location: 'Nungambakkam Health Center, Chennai',
    description: 'Need a sports nutritionist to design cricket-specific diet plans for our academy players. Focus on energy management and recovery nutrition.',
    skills: ['Sports Nutrition', 'Diet Planning', 'Energy Management', 'Recovery Nutrition'],
    duration: '3 hours (consultation + planning)',
    experienceLevel: 'Intermediate',
    otp: '1234', // Test OTP for easy testing
    earnings: {
      baseAmount: 3500,
      tips: 250, // Client gave a tip for detailed consultation
      addOnServices: 600, // Meal planning service added
      platformCommission: 435, // 10% commission on subtotal (3500 + 250 + 600)
      gst: 783, // 18% GST on subtotal (3500 + 250 + 600)
      totalEarnings: 4132, // 4350 - 435 - 783
      commissionRate: 0.10,
      gstRate: 0.18,
      breakdown: {
        baseAmount: 3500,
        tips: 250,
        addOnServices: [
          { name: 'Personalized Meal Planning', amount: 600 }
        ],
        platformCommission: 435,
        gst: 783,
        totalEarnings: 4132
      }
    },
    addOnServices: [
      { name: 'Personalized Meal Planning', price: 600, description: 'Custom nutrition plan based on individual requirements' }
    ],
    client: {
      name: 'Chennai Sports Nutrition Center',
      rating: 4.7,
      jobsCompleted: 20,
      moneySpent: 150000,
      memberSince: '2021-01-15',
      phoneNumber: '+91 5432109877',
      image: '/avatars/nutrition.jpg',
      freelancersWorked: 16,
      freelancerAvatars: [
        'https://randomuser.me/api/portraits/women/32.jpg',
        'https://randomuser.me/api/portraits/men/39.jpg',
        'https://randomuser.me/api/portraits/women/47.jpg'
      ]
    },
    // Add proposal history for timeline continuity
    proposalHistory: {
      postedAt: '2024-08-03T10:30:00.000Z', // Original job posting date from feed
      appliedDate: '2024-08-06',
      clientSpottedDate: '2024-08-06T12:45:00.000Z',
      acceptedDate: '2024-08-08T09:20:00.000Z'
    }
  },
  {
    id: 'DLTE6666',
    title: 'Technical Equipment Setup — Bowling Machines',
    category: 'Coach',
    date: '2024-08-12',
    time: '08:00',
    status: 'completed',
    payment: 2500,
    location: 'Chepauk Cricket Academy, Chennai',
    description: 'Looking for a technician to set up and calibrate bowling machines for our training sessions. Must have experience with cricket technology.',
    skills: ['Technical Setup', 'Bowling Machines', 'Equipment Calibration', 'Cricket Technology'],
    duration: '4 hours',
    experienceLevel: 'Beginner',
    otp: '1234', // Test OTP for easy testing
    earnings: {
      baseAmount: 2500,
      tips: 150, // Client gave a tip for quick setup
      addOnServices: 400, // Equipment maintenance training added
      platformCommission: 305, // 10% commission on subtotal (2500 + 150 + 400)
      gst: 549, // 18% GST on subtotal (2500 + 150 + 400)
      totalEarnings: 3296, // 3050 - 305 - 549
      commissionRate: 0.10,
      gstRate: 0.18,
      breakdown: {
        baseAmount: 2500,
        tips: 150,
        addOnServices: [
          { name: 'Equipment Maintenance Training', amount: 400 }
        ],
        platformCommission: 305,
        gst: 549,
        totalEarnings: 3296
      }
    },
    addOnServices: [
      { name: 'Equipment Maintenance Training', price: 400, description: 'Training on how to maintain and calibrate equipment' }
    ],
    client: {
      name: 'Chennai Cricket Technology',
      rating: 4.5,
      jobsCompleted: 14,
      moneySpent: 75000,
      memberSince: '2022-02-20',
      phoneNumber: '+91 4321098766',
      image: '/avatars/tech.jpg',
      freelancersWorked: 10,
      freelancerAvatars: [
        'https://randomuser.me/api/portraits/men/31.jpg',
        'https://randomuser.me/api/portraits/women/38.jpg'
      ]
    },
    // Add proposal history for timeline continuity
    proposalHistory: {
      postedAt: '2024-08-05T07:15:00.000Z', // Original job posting date from feed
      appliedDate: '2024-08-08',
      clientSpottedDate: '2024-08-08T09:45:00.000Z',
      acceptedDate: '2024-08-10T11:30:00.000Z'
    }
  },
  {
    id: 'DLMC7777',
    title: 'Match Commentary — Live Streaming',
    category: 'Commentator',
    date: '2024-08-15',
    time: '14:00',
    status: 'confirmed',
    payment: 6000,
    location: 'Mylapore Cricket Ground, Chennai',
    description: 'Need an experienced cricket commentator for live streaming of our local tournament matches. Must have good voice and cricket knowledge.',
    skills: ['Match Commentary', 'Live Streaming', 'Cricket Knowledge', 'Public Speaking'],
    duration: '6 hours per match (2 matches)',
    experienceLevel: 'Expert',
    otp: '1234', // Test OTP for easy testing
    client: {
      name: 'Chennai Sports Broadcasting',
      rating: 4.8,
      jobsCompleted: 28,
      moneySpent: 180000,
      memberSince: '2020-08-10',
      phoneNumber: '+91 3210987655',
      image: '/avatars/broadcast.jpg',
      freelancersWorked: 20,
      freelancerAvatars: [
        'https://randomuser.me/api/portraits/women/25.jpg',
        'https://randomuser.me/api/portraits/men/44.jpg',
        'https://randomuser.me/api/portraits/women/49.jpg'
      ]
    },
    // Add proposal history for timeline continuity
    proposalHistory: {
      postedAt: '2024-08-08T13:30:00.000Z', // Original job posting date from feed
      appliedDate: '2024-08-11',
      clientSpottedDate: '2024-08-11T15:45:00.000Z',
      acceptedDate: '2024-08-13T10:20:00.000Z'
    }
  },
  {
    id: 'DLFT8888',
    title: 'Fitness Training — Cricket-Specific Conditioning',
    category: 'Fitness Trainer',
    date: '2024-08-18',
    time: '06:00',
    status: 'pending',
    payment: 4500,
    location: 'Anna Nagar Fitness Center, Chennai',
    description: 'Seeking a fitness trainer specialized in cricket conditioning. Focus on agility, speed, endurance, and cricket-specific strength training.',
    skills: ['Fitness Training', 'Cricket Conditioning', 'Agility Training', 'Strength Training'],
    duration: '1.5 hours per session (weekly)',
    experienceLevel: 'Expert',
    otp: '1234', // Test OTP for easy testing
    client: {
      name: 'Elite Cricket Fitness',
      rating: 4.9,
      jobsCompleted: 32,
      moneySpent: 250000,
      memberSince: '2019-12-01',
      phoneNumber: '+91 2109876544',
      image: '/avatars/fitness.jpg',
      freelancersWorked: 22,
      freelancerAvatars: [
        'https://randomuser.me/api/portraits/men/28.jpg',
        'https://randomuser.me/api/portraits/women/35.jpg',
        'https://randomuser.me/api/portraits/men/46.jpg'
      ]
    },
    // Add proposal history for timeline continuity
    proposalHistory: {
      postedAt: '2024-08-11T05:45:00.000Z', // Original job posting date from feed
      appliedDate: '2024-08-14',
      clientSpottedDate: '2024-08-14T08:30:00.000Z',
      acceptedDate: '2024-08-16T12:15:00.000Z'
    }
  },
  {
    id: 'DLSS9999',
    title: 'Skill Assessment — Junior Player Evaluation',
    category: 'Coach',
    date: '2024-08-20',
    time: '09:00',
    status: 'confirmed',
    payment: 3000,
    location: 'Teynampet Cricket Academy, Chennai',
    description: 'Need experienced coaches to assess junior players for team selection. Focus on batting, bowling, fielding, and overall potential evaluation.',
    skills: ['Player Assessment', 'Team Selection', 'Technical Evaluation', 'Player Development'],
    duration: '6 hours (full day assessment)',
    experienceLevel: 'Intermediate',
    otp: '1234', // Test OTP for easy testing
    client: {
      name: 'Teynampet Cricket Academy',
      rating: 4.6,
      jobsCompleted: 19,
      moneySpent: 110000,
      memberSince: '2021-09-05',
      phoneNumber: '+91 1098765433',
      image: '/avatars/teynampet.jpg',
      freelancersWorked: 16,
      freelancerAvatars: [
        'https://randomuser.me/api/portraits/women/30.jpg',
        'https://randomuser.me/api/portraits/men/37.jpg',
        'https://randomuser.me/api/portraits/women/42.jpg'
      ]
    },
    // Add proposal history for timeline continuity
    proposalHistory: {
      postedAt: '2024-08-13T08:30:00.000Z', // Original job posting date from feed
      appliedDate: '2024-08-16',
      clientSpottedDate: '2024-08-16T11:00:00.000Z',
      acceptedDate: '2024-08-18T14:45:00.000Z'
    }
  },
  {
    id: 'DLRC0000',
    title: 'Recovery Coaching — Post-Match Recovery',
    category: 'Physio',
    date: '2024-08-22',
    time: '18:00',
    status: 'pending',
    payment: 2800,
    location: 'Velachery Sports Complex, Chennai',
    description: 'Looking for recovery specialists for post-match recovery sessions. Focus on muscle recovery, flexibility, and mental relaxation techniques.',
    skills: ['Recovery Coaching', 'Muscle Recovery', 'Flexibility Training', 'Mental Relaxation'],
    duration: '2 hours per session',
    experienceLevel: 'Beginner',
    otp: '1234', // Test OTP for easy testing
    client: {
      name: 'Chennai Recovery Specialists',
      rating: 4.7,
      jobsCompleted: 21,
      moneySpent: 130000,
      memberSince: '2021-04-20',
      phoneNumber: '+91 0987654322',
      image: '/avatars/recovery.jpg',
      freelancersWorked: 14,
      freelancerAvatars: [
        'https://randomuser.me/api/portraits/men/34.jpg',
        'https://randomuser.me/api/portraits/women/39.jpg'
      ]
    },
    // Add proposal history for timeline continuity
    proposalHistory: {
      postedAt: '2024-08-15T17:00:00.000Z', // Original job posting date from feed
      appliedDate: '2024-08-18',
      clientSpottedDate: '2024-08-18T19:30:00.000Z',
      acceptedDate: '2024-08-20T14:45:00.000Z'
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
    category: 'Sidearm',
    moneySpent: 45000,
    freelancersWorked: 8,
    freelancerAvatars: [
      'https://randomuser.me/api/portraits/men/32.jpg',
      'https://randomuser.me/api/portraits/women/45.jpg',
      'https://randomuser.me/api/portraits/men/67.jpg'
    ],
    experienceLevel: 'Expert',
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
    category: 'Coach',
    moneySpent: 65000,
    freelancersWorked: 10,
    freelancerAvatars: [
      'https://randomuser.me/api/portraits/women/22.jpg',
      'https://randomuser.me/api/portraits/men/18.jpg',
      'https://randomuser.me/api/portraits/women/33.jpg',
      'https://randomuser.me/api/portraits/men/45.jpg',
      'https://randomuser.me/api/portraits/women/12.jpg'
    ],
    experienceLevel: 'Expert',
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
    clientId: 'mehta456',
    category: 'Coach',
    moneySpent: 28000,
    freelancersWorked: 6,
    freelancerAvatars: [
      'https://randomuser.me/api/portraits/women/28.jpg',
      'https://randomuser.me/api/portraits/men/35.jpg',
      'https://randomuser.me/api/portraits/women/19.jpg',
      'https://randomuser.me/api/portraits/men/42.jpg',
      'https://randomuser.me/api/portraits/women/37.jpg',
      'https://randomuser.me/api/portraits/men/23.jpg'
    ],
    experienceLevel: 'Intermediate',
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
    category: 'Scorer',
    moneySpent: 45000,
    freelancersWorked: 12,
    freelancerAvatars: [
      'https://randomuser.me/api/portraits/men/42.jpg',
      'https://randomuser.me/api/portraits/women/37.jpg'
    ],
    experienceLevel: 'Expert',
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
    category: 'Coach',
    moneySpent: 85000,
    freelancersWorked: 14,
    freelancerAvatars: [
      'https://randomuser.me/api/portraits/men/24.jpg',
      'https://randomuser.me/api/portraits/women/17.jpg'
    ],
    experienceLevel: 'Expert',
    proposal: {
      coverLetter: 'Experienced cricket analyst with expertise in technical analysis and performance metrics. I use advanced video analysis software to identify strengths and weaknesses in batting and bowling techniques.',
      proposedRate: 4000,
      estimatedDays: 7,
      skills: ['Cricket Analysis', 'Video Analysis', 'Performance Metrics', 'Technical Feedback'],
      attachments: ['analysis_portfolio.pdf', 'cricket_certifications.pdf']
    },
    // Removed rejectionDetails - not part of Application type
  },
  {
    "#": 'DLWB7890',
    jobTitle: 'Cricket Equipment Manager',
    appliedDate: '2024-06-10',
    status: 'withdrawn',
    clientName: 'Chennai Sports Club',
    budget: { min: 1500, max: 2500 },
    progress: 0,
    clientImage: '/avatars/sportsclub.jpg',
    location: 'Nungambakkam, Chennai',
    postedDate: '2024-06-08',
    description: 'Looking for someone to manage cricket equipment and maintain our sports facilities.',
    clientId: 'csc123',
    category: 'Physio',
    moneySpent: 25000,
    freelancersWorked: 5,
    freelancerAvatars: [
      'https://randomuser.me/api/portraits/men/55.jpg',
      'https://randomuser.me/api/portraits/women/29.jpg'
    ],
    experienceLevel: 'Beginner',
    proposal: {
      coverLetter: 'I have experience managing sports equipment for local cricket clubs and can ensure all gear is properly maintained and organized.',
      proposedRate: 2000,
      estimatedDays: 10,
      skills: ['Equipment Management', 'Sports Facilities', 'Organization', 'Maintenance'],
      attachments: ['equipment_resume.pdf', 'references.pdf']
    }
  }
];

// Function to update application status in mock data (for demo purposes)
export const updateApplicationStatus = (applicationId: string, newStatus: Application['status'], proposalUpdates?: Partial<Application['proposal']>) => {
  const applicationIndex = mockApplications.findIndex(app => app["#"] === applicationId);
  if (applicationIndex !== -1) {
    mockApplications[applicationIndex].status = newStatus;
    if (proposalUpdates && mockApplications[applicationIndex].proposal) {
      Object.assign(mockApplications[applicationIndex].proposal, proposalUpdates);
    }
    console.log(`Updated application ${applicationId} status to ${newStatus}`, proposalUpdates ? 'with proposal updates' : '');
  }
};

// Function to create a new application when user applies to a job
export const createApplication = async (jobId: string, proposalText: string, rate: string, rateType: string, attachments: File[]) => {
  try {
    // Import the Feed's jobs data
    const { jobs: feedJobs } = await import('@/app/freelancer/feed/data/jobs');

    // Find the job data from Feed's jobs
    const job = feedJobs.find((j: any) => j.id === jobId);
    if (!job) {
      console.error('Job not found for application creation');
      return null;
    }

    // Generate a unique application ID
    const applicationId = `DL${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Create the application object
    const newApplication: Application = {
      "#": applicationId,
      jobTitle: job.title,
      appliedDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      status: 'pending',
      clientName: job.clientName,
      budget: { min: job.budget, max: job.budget },
      progress: 0,
      clientImage: job.clientImage,
      location: job.location,
      postedDate: job.postedAt,
      description: job.description,
      clientId: `${job.clientName.toLowerCase().replace(/\s+/g, '')}123`,
      category: job.category,
      experienceLevel: job.experience,
      proposal: {
        coverLetter: proposalText,
        proposedRate: parseInt(rate),
        estimatedDays: 7, // Default estimation
        skills: job.skills,
        attachments: attachments.map(file => file.name) // Store file names
      }
    };

    // Add to mock applications array
    mockApplications.push(newApplication);

    console.log(`Created new application ${applicationId} for job: ${job.title}`);

    return newApplication;
  } catch (error) {
    console.error('Error creating application:', error);
    return null;
  }
};

// Function to check if user has applied to a specific job
export const hasUserAppliedToJob = (jobId: string) => {
  return mockApplications.some(app => {
    // For now, we'll match by job title since we don't have user tracking
    // In a real app, this would check the current user's applications
    const { jobs: feedJobs } = require('@/app/freelancer/feed/data/jobs');
    const job = feedJobs.find((j: any) => j.id === jobId);
    return job && app.jobTitle === job.title;
  });
};
export const acceptProposalAndCreateJob = (applicationId: string) => {
  // Update proposal status to accepted
  updateApplicationStatus(applicationId, 'accepted');

  // Find the application
  const application = mockApplications.find(app => app["#"] === applicationId);
  if (!application) {
    console.error('Application not found for acceptance');
    return null;
  }

  // Import the Feed's jobs data
  const { jobs: feedJobs } = require('@/app/freelancer/feed/data/jobs');

  // Find the original job from Feed's jobs to get complete data
  const originalJob = feedJobs.find((j: any) => j.title === application.jobTitle && j.location === application.location);
  if (!originalJob) {
    console.error('Original job not found for job creation');
    return null;
  }

  // Create a job from the accepted proposal
  const newJobId = `DLJ${Date.now()}`;
  const newJob: Job = {
    id: newJobId,
    title: application.jobTitle,
    category: 'Coach' as JobCategory, // Default category - could be mapped from job title or proposal
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    status: 'confirmed',
    payment: Number(application.proposal.proposedRate),
    location: application.location,
    description: application.description,
    skills: application.proposal.skills,
    duration: `${application.proposal.estimatedDays} days`,
    experienceLevel: 'Expert',
    otp: '1234', // Test OTP for easy testing
    client: {
      name: application.clientName,
      rating: 4.5,
      jobsCompleted: 10,
      memberSince: '2023-01-01',
      phoneNumber: '+91 9876543210',
      image: application.clientImage,
      moneySpent: Number(application.moneySpent),
      location: application.location,
      joinedDate: '2023-01-01',
      freelancersWorked: Number(application.freelancersWorked),
      freelancerAvatars: application.freelancerAvatars
    },
    // Add proposal history for timeline continuity
    proposalHistory: {
      postedAt: application.postedDate, // From the original application postedDate
      appliedDate: application.appliedDate,
      clientSpottedDate: application.clientViewedAt || new Date(new Date(application.appliedDate).getTime() + 3600000).toISOString(),
      acceptedDate: new Date().toISOString()
    }
  };

  // Add to mock jobs
  mockUpcomingJobs.push(newJob);

  console.log(`Accepted proposal ${applicationId} and created job ${newJobId}`);

  return newJob;
};

export const mockFreelancerProfile = {
  name: 'Suresh Kumar',
  profilePicture: '/avatars/suresh.jpg',
  headline: 'Cricket Coach & Analyst',
  location: 'Chennai, India',
  skills: ['Cricket Coaching', 'Video Analysis', 'Batting Technique', 'Bowling Technique', 'Fielding Drills'],
  experience: [
    {
      company: 'Tamil Nadu Cricket Academy',
      role: 'Cricket Coach',
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
  ],
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
