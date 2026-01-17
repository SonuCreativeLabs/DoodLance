import { Job, ExperienceLevel, JobDuration } from '../types';

// Helper function to generate random coordinates near a point
const generateNearbyCoords = (baseCoords: [number, number], radiusKm = 0.5): [number, number] => {
  // Convert km to degrees (approximate)
  const radiusInDegrees = radiusKm / 111.32;
  const u = Math.random();
  const v = Math.random();
  const w = radiusInDegrees * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const x = w * Math.cos(t);
  const y = w * Math.sin(t);

  // Adjust the x-coordinate for the shrinking of the east-west distances
  const newX = x / Math.cos(baseCoords[1] * Math.PI / 180);

  return [
    parseFloat((baseCoords[0] + newX).toFixed(6)),
    parseFloat((baseCoords[1] + y).toFixed(6))
  ] as [number, number];
};

// Chennai area coordinates
const areaCoords = {
  velachery: [80.2174, 12.9815],
  pallikaranai: [80.2198, 12.9350],
  madipakkam: [80.1991, 12.9627],
  medavakkam: [80.1924, 12.9187],
  tambaram: [80.1270, 12.9249],
  chrompet: [80.1444, 12.9516],
  thoraipakkam: [80.2311, 12.9515],
  perungudi: [80.2418, 12.9697],
  sholinganallur: [80.2279, 12.8996]
} as const;

const areas = Object.keys(areaCoords) as (keyof typeof areaCoords)[];

// Helper function to generate consistent image ID from client name
const getClientImageId = (clientName: string): number => {
  let hash = 0;
  for (let i = 0; i < clientName.length; i++) {
    const char = clientName.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash) % 70 + 1; // Ensure it's between 1-70
};

// Common skills
const clientNames = [
  'Priya Sharma',
  'Raj Kumar',
  'Aisha Patel',
  'Vikram Singh',
  'Meera Reddy',
  'Arjun Nair',
  'Divya Menon',
  'Karthik Iyer',
  'Ananya Gupta',
  'Suresh Kumar'
];

// Generate jobs
const generateJobs = (): Job[] => {
  const jobs: Job[] = [];
  const locations = [
    'Velachery', 'Anna Nagar', 'T Nagar', 'Adyar', 'Thiruvanmiyur',
    'Nungambakkam', 'Mylapore', 'Besant Nagar', 'Porur', 'Guindy',
    'Kodambakkam', 'Vadapalani', 'Chromepet', 'Tambaram', 'Pallavaram'
  ];

  // Helper function to get random area
  const getRandomArea = () => {
    const area = areas[Math.floor(Math.random() * areas.length)];
    return {
      name: area.charAt(0).toUpperCase() + area.slice(1),
      coords: [...areaCoords[area]] as [number, number]
    };
  };

  // Define job categories with mixed pricing units (₹500-5,000)
  const categoryRates = {
    // Cricket coaching and training
    cricket: {
      min: 500,
      max: 15000,
      unit: 'session',
      periods: [
        { type: 'session', min: 500, max: 5000, multiplier: 1 },
        { type: 'package', min: 3000, max: 15000, multiplier: 1 },
        { type: 'monthly', min: 8000, max: 30000, multiplier: 1 }
      ]
    },
    sports: {
      min: 300,
      max: 10000,
      unit: 'session',
      periods: [
        { type: 'session', min: 300, max: 3000, multiplier: 1 },
        { type: 'package', min: 2000, max: 10000, multiplier: 1 },
        { type: 'monthly', min: 5000, max: 20000, multiplier: 1 }
      ]
    }
  };

  // Define job durations and experience levels
  const experienceLevels = ['Entry Level', 'Intermediate', 'Expert'] as const;
  const workModeMultipliers = {
    'onsite': 1,
    'remote': 1.5
  };

  const cricketSkills = [
    ['Cricket Coaching', 'Batting Coach', 'Bowling Coach', 'Fielding Coach'],
    ['Fitness Training', 'Sports Nutrition', 'Injury Prevention'],
    ['Team Management', 'Match Strategy', 'Video Analysis'],
    ['Spin Bowling Specialist', 'Leg Spin', 'Off Spin', 'Googly'],
    ['Wicket Keeping Coach', 'Glove Work', 'Stance', 'Reflex Training']
  ];

  const createJob = ({
    id,
    title,
    description,
    category,
    skills,
    workMode,
  }: {
    id: string;
    title: string;
    description: string;
    category: string;
    skills: string[];
    workMode: 'remote' | 'onsite';
  }) => {
    // Determine category and get base rate
    const categoryKey = Object.keys(categoryRates).find(key =>
      category.toLowerCase().includes(key)
    ) || 'data';

    const rateInfo = categoryRates[categoryKey as keyof typeof categoryRates] || { min: 300, max: 2000, unit: 'hour' };

    // Generate a more realistic rate based on experience
    const experience = experienceLevels[Math.floor(Math.random() * experienceLevels.length)];

    // Adjust base rate based on experience
    let experienceMultiplier = 1;
    if (experience === 'Intermediate') experienceMultiplier = 1.5;
    if (experience === 'Expert') experienceMultiplier = 2.5;

    // Apply work mode multiplier (remote work often pays more)
    const workModeMultiplier = workModeMultipliers[workMode] || 1;

    // Select a random pricing period for this job
    const periods = (rateInfo as any).periods || [
      { type: 'fixed', min: rateInfo.min, max: rateInfo.max, multiplier: 1 }
    ];
    const period = periods[Math.floor(Math.random() * periods.length)];

    // Calculate base rate with all multipliers
    const baseRate = Math.floor(
      (Math.random() * (period.max - period.min) + period.min) *
      (period.multiplier || 1) *
      experienceMultiplier *
      workModeMultiplier
    );

    // Round to nearest 50 for non-hourly rates
    const rate = period.type === 'hourly' ? baseRate : Math.round(baseRate / 50) * 50;

    // Set price unit based on category
    const priceUnit = rateInfo.unit;

    // Calculate budget based on the unit
    let budget = rate;
    if (priceUnit === 'job' || priceUnit === 'service' || priceUnit === 'event' || priceUnit === 'room' || priceUnit === 'project') {
      // For one-time jobs, use the rate as is (already within 500-5000 range)
      budget = rate;
    } else if (priceUnit === 'hour') {
      // For hourly work, calculate a small project budget (5-10 hours)
      budget = rate * (Math.floor(Math.random() * 6) + 5);
    } else if (priceUnit === 'day') {
      // For daily work, calculate a weekly budget (2-4 days)
      budget = rate * (Math.floor(Math.random() * 3) + 2);
    } else if (priceUnit === 'week') {
      // For weekly work, calculate a monthly budget (2-3 weeks)
      budget = rate * (Math.floor(Math.random() * 2) + 2);
    } else if (priceUnit === 'month' || priceUnit === 'session' || priceUnit === 'package') {
      // For monthly or session-based work, keep as is
      budget = rate;
    }

    // Ensure budget is reasonable for the category
    const maxBudget = rateInfo.max || 50000; // Use category max or default to 50,000
    budget = Math.min(Math.round(budget), maxBudget);
    const { name: location, coords: baseCoords } = getRandomArea();
    const coords = generateNearbyCoords(baseCoords);
    // Assign client consistently based on job ID for deterministic client-job assignment
    const clientIndex = id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0) % clientNames.length;
    const clientName = clientNames[clientIndex];
    // Set default company info (simplified for demo)
    const company = 'BAILS';
    const companyLogo = '/images/logo.png';

    // Determine specific duration based on job characteristics
    let duration: JobDuration = 'hourly';

    // Check title for specific duration hints first
    const titleLower = title.toLowerCase();
    if (titleLower.includes('90-minute') || titleLower.includes('90 minute')) {
      duration = 'hourly'; // Will be displayed as "90 minutes" by getJobDurationLabel
    } else if (titleLower.includes('2-hour') || titleLower.includes('2 hour')) {
      duration = 'hourly'; // Will be displayed as "2 hours"
    } else if (titleLower.includes('1-hour') || titleLower.includes('1 hour')) {
      duration = 'hourly'; // Will be displayed as "1 hour"
    } else {
      // Duration based on category
      const categoryLower = category.toLowerCase();
      if (categoryLower.includes('photography') || categoryLower.includes('videography') || categoryLower.includes('content creator')) {
        duration = 'hourly'; // "3 hours", "4 hours" for events
      } else if (categoryLower.includes('analyst') || categoryLower.includes('analysis')) {
        duration = 'hourly'; // "2 hours", "per match"
      } else if (categoryLower.includes('physio') || categoryLower.includes('conditioning') || categoryLower.includes('fitness')) {
        duration = 'hourly'; // "1 hour", "1.5 hours"
      } else if (categoryLower.includes('scorer') || categoryLower.includes('umpire')) {
        duration = 'one-time'; // "per match", "full day"
      } else if (categoryLower.includes('sidearm') || categoryLower.includes('net bowler')) {
        duration = 'hourly'; // "1.5 hours", "90 minutes"
      } else if (categoryLower.includes('coach') || categoryLower.includes('coaching')) {
        duration = 'hourly'; // "1 hour", "2 hours", "per session"
      } else {
        duration = 'hourly'; // Default to hourly for most cricket services
      }
    }

    const job: Job = {
      id,
      title,
      description,
      category,
      rate,
      budget,
      priceUnit,
      location: locations[Math.floor(Math.random() * locations.length)],
      coords,
      skills,
      workMode,
      type: 'freelance',
      postedAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
      scheduledAt: new Date(Date.now() + Math.floor(Math.random() * 14 * 24 * 60 * 60 * 1000)).toISOString(), // 0-14 days from now
      company,
      companyLogo,
      clientName,
      clientImage: `https://i.pravatar.cc/150?img=${getClientImageId(clientName)}`,
      clientRating: {
        stars: Math.floor(Math.random() * 5) + 1,
        feedback: "Great freelancer to work with!",
        feedbackChips: ["Professional", "Skilled", "Punctual"]
      },
      clientJobs: Math.floor(Math.random() * 50) + 1,
      proposals: Math.floor(Math.random() * 30),
      duration,
      experience: experience as ExperienceLevel,
      client: {
        name: clientName,
        image: `https://i.pravatar.cc/150?img=${getClientImageId(clientName)}`,
        memberSince: new Date(Date.now() - Math.floor(Math.random() * 3 * 365 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        freelancerAvatars: Array(3).fill(0).map((_, i) => `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`),
        freelancersWorked: Math.floor(Math.random() * 50) + 5,
        moneySpent: Math.floor(Math.random() * 50000) + 5000,
        rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
        jobsCompleted: Math.floor(Math.random() * 100) + 10,
        location: locations[Math.floor(Math.random() * locations.length)],
        phoneNumber: `+91 ${Math.floor(7000000000 + Math.random() * 3000000000)}`
      }
    };
    return job;
  };

  // Helper function to create a job with client info
  const createJobWithClient = (jobData: any) => {
    // Assign client consistently based on job ID for deterministic client-job assignment
    const jobId = jobData.id || 'default';
    const clientIndex = jobId.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0) % clientNames.length;
    const clientName = clientNames[clientIndex];

    const job = createJob({
      ...jobData,
      clientName,
      clientImage: `https://i.pravatar.cc/150?img=${getClientImageId(clientName)}`
    });
    return job;
  };

  // Generate cricket coaching jobs (5 jobs)
  cricketSkills.forEach((skills, index) => {
    const jobType = skills[0].includes('Coach') ? 'Coach' : 'Fitness Trainer';
    const title = `Cricket ${jobType} - ${skills[1]}`;
    const description = `Professional cricket ${jobType.toLowerCase()} with expertise in ${skills.slice(1, 3).join(' and ')}. ${skills[3] ? `Specializes in ${skills[3]}.` : ''} Local candidates preferred.`;

    jobs.push(createJobWithClient({
      id: `cricket-${index + 1}`,
      title,
      description,
      category: jobType as any,
      skills: Array.from(new Set([...skills, 'Cricket'])),
      workMode: 'onsite',
      minRate: 500,
      maxRate: 3000
    }));
  });

  // Add 3 more unique jobs to reach 45
  const additionalJobs = [
    {
      title: 'Event Photographer',
      description: 'Need a professional photographer for a corporate event. Must have own equipment and portfolio.',
      category: 'Cricket Photo / Videography',
      skills: ['Cricket Photography', 'Sports Photography', 'Action Shots', 'Photo Editing'],
      workMode: 'onsite',
      minRate: 2000,
      maxRate: 8000
    },
    {
      title: 'Video Editor',
      description: 'Looking for a skilled video editor for YouTube content. Experience with Premiere Pro required.',
      category: 'Cricket Content Creator',
      skills: ['Video Editing', 'Color Grading', 'Motion Graphics'],
      workMode: 'remote',
      minRate: 1500,
      maxRate: 6000
    }
  ];

  additionalJobs.forEach((job, index) => {
    jobs.push(createJobWithClient({
      id: `additional-${index + 1}`,
      ...job
    }));
  });

  // Curated cricket-only jobs with realistic titles/descriptions
  const curated = [
    createJobWithClient({
      id: 'crk-sidearm-1',
      title: 'Sidearm for extended net — yorker/bouncer mix',
      description: 'Simulate powerplay and death overs. Consistent yorkers and short balls for top-order prep. 2-hour session with interval blocks.',
      category: 'Sidearm',
      skills: ['Sidearm', 'Batting Practice', 'Death Overs', 'Yorker Control', 'Sidearm Specialist'],
      workMode: 'onsite',
      minRate: 800,
      maxRate: 3000
    }),
    createJobWithClient({
      id: 'crk-netbowler-1',
      title: 'Net bowler — left-arm angle for right-handers',
      description: 'Left-arm seam focusing on hard length and wobble seam to RH batters. Red-ball preparation. 90-minute session.',
      category: 'Net Bowler',
      skills: ['Left-arm Seam', 'Hard Length', 'Swing Bowling', 'bowling'],
      workMode: 'onsite',
      minRate: 700,
      maxRate: 2500
    }),
    createJobWithClient({
      id: 'crk-batting-1',
      title: 'One-on-one batting — front-foot play vs hard length',
      description: 'Contact point and weight transfer drills. Strike-rotation focus with throwdowns and sidearm. Includes short video feedback.',
      category: 'Coach',
      skills: ['Batting Technique', 'Front-foot Play', 'Strike Rotation', 'Video Analysis', 'batting', 'coaching', 'Coach'],
      workMode: 'onsite',
      minRate: 1200,
      maxRate: 4000
    }),
    createJobWithClient({
      id: 'crk-mystery-1',
      title: 'Mystery spin workshop — doosra & carrom ball reading',
      description: 'Picking cues out of the hand and off the pitch. Tempo, trigger movement, and sweep options. Group session welcome.',
      category: 'Net Bowler',
      skills: ['Mystery Spin', 'Carrom Ball', 'Doosra', 'Reading Cues', 'mystery spin', 'bowling', 'Mystery Spin'],
      workMode: 'onsite',
      minRate: 1500,
      maxRate: 4500
    }),
    createJobWithClient({
      id: 'crk-keeping-1',
      title: 'Wicketkeeping — glove work and standing-up skills',
      description: 'Glove technique and quick glove skills. Standing-up to pace and spin. Basic stumping practice. 60-minute session.',
      category: 'Match Player',
      skills: ['Wicket Keeping', 'Glove Work', 'Standing Up', 'Stumping'],
      workMode: 'onsite',
      minRate: 600,
      maxRate: 2000
    }),
    createJobWithClient({
      id: 'crk-analyst-1',
      title: 'Match video breakdown — shot selection heatmaps',
      description: 'Analyze match footage and create heatmaps. Focus on shot selection, footwork, and decision-making. Post-session report.',
      category: 'Analyst',
      skills: ['Video Analysis', 'Performance Analysis', 'Heatmaps', 'Decision Making', 'analysis', 'Analyst'],
      workMode: 'remote',
      minRate: 2500,
      maxRate: 6000
    }),
    // Additional jobs that match user skills
    createJobWithClient({
      id: 'crk-batting-2',
      title: 'RH Batsman Training — Cover drive and off-side mastery',
      description: 'Specialized right-handed batsman training focusing on off-side shots, cover drives, and classical technique. For intermediate players.',
      category: 'Coach',
      skills: ['Batting Technique', 'Cover Drive', 'Off-side Play', 'batting', 'coaching', 'Coach', 'RH Batsman'],
      workMode: 'onsite',
      minRate: 1800,
      maxRate: 4500
    }),
    createJobWithClient({
      id: 'crk-offspin-1',
      title: 'Off Spin Coaching — Flight and turn variations',
      description: 'Master the art of off spin with focus on flight, turn, and arm ball. Perfect for spinners looking to add variations.',
      category: 'Coach',
      skills: ['Off Spin', 'Flight Control', 'Arm Ball', 'Spin Bowling', 'coaching', 'Coach'],
      workMode: 'onsite',
      minRate: 2000,
      maxRate: 5000
    }),
    createJobWithClient({
      id: 'crk-analyst-2',
      title: 'Performance Analysis — Batting metrics and insights',
      description: 'Comprehensive batting analysis using video footage and metrics. Identify strengths, weaknesses, and improvement areas.',
      category: 'Analyst',
      skills: ['Performance Analysis', 'Batting Analysis', 'Video Analysis', 'Metrics', 'analysis', 'Analyst'],
      workMode: 'remote',
      minRate: 3000,
      maxRate: 7000
    }),
    createJobWithClient({
      id: 'crk-sidearm-2',
      title: 'Sidearm Specialist — Death overs simulation',
      description: 'Professional sidearm specialist for death overs practice. Simulate tournament pressure with yorkers and slower balls.',
      category: 'Sidearm',
      skills: ['Sidearm Specialist', 'Death Overs', 'Yorker Specialist', 'Pressure Bowling', 'Sidearm'],
      workMode: 'onsite',
      minRate: 2500,
      maxRate: 6000
    }),
    createJobWithClient({
      id: 'crk-coach-1',
      title: 'Cricket Coach — All-round skill development',
      description: 'Comprehensive cricket coaching for players aged 12-18. Covering batting, bowling, fielding, and match strategy.',
      category: 'Coach',
      skills: ['Cricket Coaching', 'Batting Technique', 'Bowling Technique', 'Fielding', 'Match Strategy', 'coaching', 'Coach'],
      workMode: 'onsite',
      minRate: 1500,
      maxRate: 4000
    })
  ];

  jobs.push(...curated);

  return jobs;
};

export const jobs = generateJobs();
