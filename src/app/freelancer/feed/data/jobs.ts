import { Job, ExperienceLevel } from '../types';

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

const devSkills = [
  ['React', 'TypeScript', 'Redux', 'Frontend Development'],
  ['Node.js', 'Express', 'MongoDB', 'Backend Development'],
  ['React Native', 'Mobile Development', 'Firebase'],
  ['Python', 'Django', 'REST APIs', 'AWS']
];

const cricketSkills = [
  ['Cricket Coaching', 'Batting Coach', 'Bowling Coach', 'Fielding Coach'],
  ['Fitness Training', 'Sports Nutrition', 'Injury Prevention'],
  ['Team Management', 'Match Strategy', 'Video Analysis']
];

const offlineServiceSkills = [
  ['Plumbing', 'Pipe Fitting', 'Leak Repair', 'Water Heater Installation'],
  ['Electrical Work', 'Wiring', 'Circuit Installation', 'Safety Inspection'],
  ['Carpentry', 'Woodworking', 'Furniture Assembly', 'Cabinet Making'],
  ['Painting', 'Wall Preparation', 'Interior Finishing', 'Exterior Painting'],
  ['House Cleaning', 'Deep Cleaning', 'Sanitization', 'Organizing'],
  ['Gardening', 'Landscaping', 'Plant Care', 'Lawn Maintenance'],
  ['AC Repair', 'HVAC Maintenance', 'Cooling System', 'Installation'],
  ['Home Tutoring', 'Math', 'Science', 'English', 'Test Prep'],
  ['Fitness Training', 'Personal Training', 'Yoga', 'Zumba'],
  ['Cooking', 'Meal Prep', 'Catering', 'Baking']
];

const otherSkills = [
  ['Content Writing', 'Blogging', 'SEO'],
  ['Graphic Design', 'UI/UX', 'Figma'],
  ['Digital Marketing', 'Social Media', 'PPC'],
  ['Data Entry', 'Excel', 'Google Sheets']
];

// Job categories and titles
const jobCategories = {
  offline: {
    plumbing: ['Emergency Plumber', 'Plumbing Maintenance Expert', 'Water System Specialist'],
    electrical: ['Residential Electrician', 'Electrical Repair Specialist', 'Electrical Safety Inspector'],
    carpentry: ['Custom Furniture Maker', 'Home Repair Carpenter', 'Cabinet Installation Expert'],
    painting: ['House Painter', 'Interior Paint Specialist', 'Commercial Painting Contractor'],
    cleaning: ['Professional House Cleaner', 'Deep Cleaning Specialist', 'Move-in/out Cleaning Expert'],
    gardening: ['Garden Maintenance Expert', 'Landscape Designer', 'Plant Care Specialist'],
    ac_repair: ['AC Repair Technician', 'HVAC Maintenance Expert', 'Cooling System Specialist'],
    tutoring: ['Math & Science Tutor', 'English Language Tutor', 'Test Prep Coach'],
    fitness: ['Personal Fitness Trainer', 'Yoga Instructor', 'Zumba Instructor'],
    cooking: ['Personal Chef', 'Meal Prep Specialist', 'Catering Service Provider']
  },
  tech: {
    frontend: ['Frontend Developer', 'React Developer', 'UI Developer'],
    backend: ['Backend Developer', 'Node.js Developer', 'API Specialist'],
    mobile: ['Mobile App Developer', 'React Native Developer', 'iOS/Android Developer'],
    fullstack: ['Full Stack Developer', 'MERN Stack Developer', 'Web Application Developer']
  }
};

// Generate jobs
const generateJobs = (): Job[] => {
  const jobs: Job[] = [];
  const locations = [
    'Velachery', 'Anna Nagar', 'T Nagar', 'Adyar', 'Thiruvanmiyur',
    'Nungambakkam', 'Mylapore', 'Besant Nagar', 'Porur', 'Guindy',
    'Kodambakkam', 'Vadapalani', 'Chromepet', 'Tambaram', 'Pallavaram'
  ];
  const workModes: Array<'remote' | 'onsite' | 'hybrid'> = ['remote', 'onsite', 'hybrid'];
  const jobTypes: Array<'full-time' | 'part-time' | 'contract'> = ['full-time', 'part-time', 'contract'];

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
    // Tech jobs
    frontend: { 
      min: 800, 
      max: 5000, 
      unit: 'project',
      periods: [
        { type: 'project', min: 2000, max: 5000, multiplier: 1 },
        { type: 'monthly', min: 3000, max: 5000, multiplier: 1 },
        { type: 'hourly', min: 500, max: 1500, multiplier: 1 }
      ]
    },
    backend: { 
      min: 1000, 
      max: 5000, 
      unit: 'month',
      periods: [
        { type: 'monthly', min: 2500, max: 5000, multiplier: 1 },
        { type: 'project', min: 3000, max: 5000, multiplier: 1 },
        { type: 'hourly', min: 600, max: 1800, multiplier: 1 }
      ]
    },
    mobile: { 
      min: 1000, 
      max: 5000, 
      unit: 'project',
      periods: [
        { type: 'project', min: 3000, max: 5000, multiplier: 1 },
        { type: 'monthly', min: 3500, max: 5000, multiplier: 1 },
        { type: 'hourly', min: 700, max: 2000, multiplier: 1 }
      ]
    },
    
    // Offline services
    plumbing: { 
      min: 500, 
      max: 5000, 
      unit: 'job',
      periods: [
        { type: 'fixed', min: 500, max: 3000, multiplier: 1 },
        { type: 'emergency', min: 2000, max: 5000, multiplier: 1.5 },
        { type: 'visit', min: 800, max: 2500, multiplier: 1 }
      ]
    },
    electrical: { 
      min: 800, 
      max: 5000, 
      unit: 'visit',
      periods: [
        { type: 'visit', min: 1000, max: 3500, multiplier: 1 },
        { type: 'fixed', min: 1500, max: 4500, multiplier: 1 },
        { type: 'emergency', min: 2500, max: 5000, multiplier: 1.5 }
      ]
    },
    
    // Creative services
    design: { 
      min: 1000, 
      max: 5000, 
      unit: 'project',
      periods: [
        { type: 'project', min: 2000, max: 5000, multiplier: 1 },
        { type: 'monthly', min: 3000, max: 5000, multiplier: 1 },
        { type: 'hourly', min: 600, max: 2000, multiplier: 1 }
      ]
    },
    
    // Tutoring and education
    tutoring: { 
      min: 500, 
      max: 5000, 
      unit: 'month',
      periods: [
        { type: 'monthly', min: 2000, max: 5000, multiplier: 1 },
        { type: 'session', min: 500, max: 2500, multiplier: 1 },
        { type: 'hourly', min: 500, max: 1500, multiplier: 1 }
      ]
    },
    
    // Fitness and wellness
    fitness: { 
      min: 800, 
      max: 5000, 
      unit: 'package',
      periods: [
        { type: 'package', min: 2000, max: 5000, multiplier: 1 },
        { type: 'session', min: 800, max: 3000, multiplier: 1 },
        { type: 'monthly', min: 2500, max: 5000, multiplier: 1 }
      ]
    },
    
    // Marketing and business
    marketing: { 
      min: 1000, 
      max: 5000, 
      unit: 'month',
      periods: [
        { type: 'monthly', min: 3000, max: 5000, multiplier: 1 },
        { type: 'project', min: 2000, max: 5000, multiplier: 1 },
        { type: 'hourly', min: 700, max: 2000, multiplier: 1 }
      ]
    }
  };

  // Define job durations and experience levels
  const experienceLevels = ['Entry Level', 'Intermediate', 'Expert'] as const;
  const workModeMultipliers = {
    'onsite': 1,
    'hybrid': 1.2,
    'remote': 1.5
  };

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
    workMode: 'remote' | 'onsite' | 'hybrid';
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
    const periods = rateInfo.periods || [
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
    
    // Ensure budget doesn't exceed 5000
    budget = Math.min(Math.round(budget), 5000);
    const { name: location, coords: baseCoords } = getRandomArea();
    const coords = generateNearbyCoords(baseCoords);
    const clientName = clientNames[Math.floor(Math.random() * clientNames.length)];
    // Set default company info (simplified for demo)
    const company = 'DoodLance';
    const companyLogo = '/images/logo.png';
    
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
      company,
      companyLogo,
      clientName,
      clientImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(clientName)}&background=6B46C1&color=fff&bold=true`,
      clientRating: (Math.floor(Math.random() * 10) / 2 + 3).toFixed(1),
      clientJobs: Math.floor(Math.random() * 50) + 1,
      proposals: Math.floor(Math.random() * 30),
      duration: 'one-time',
      experience: experience as ExperienceLevel,
      client: {
        name: clientName,
        image: `https://ui-avatars.com/api/?name=${encodeURIComponent(clientName)}&background=6B46C1&color=fff&bold=true`,
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
    const clientName = clientNames[Math.floor(Math.random() * clientNames.length)];
    const job = createJob({
      ...jobData,
      clientName,
      clientImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(clientName)}&background=6B46C1&color=fff&bold=true`
    });
    return job;
  };

  // Generate offline service jobs (30 jobs)
  Object.entries(jobCategories.offline).forEach(([category, titles]) => {
    titles.forEach((title, index) => {
      const skills = offlineServiceSkills[Math.floor(Math.random() * offlineServiceSkills.length)];
      const description = `Looking for an experienced ${title.toLowerCase()} for local service. Must be available for on-site work in the specified location.`;
      
      jobs.push(createJobWithClient({
        id: `offline-${category}-${index + 1}`,
        title,
        description,
        category: category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' '),
        skills,
        workMode: 'hybrid',
        minRate: 350,
        maxRate: 18000
      }));
    });
  });

  // Generate tech jobs (15 jobs)
  Object.entries(jobCategories.tech).forEach(([category, titles]) => {
    titles.forEach((title, index) => {
      const skills = devSkills[Math.floor(Math.random() * devSkills.length)];
      const description = `Looking for an experienced ${title.toLowerCase()} with strong expertise in ${skills.slice(0, -1).join(', ')} and ${skills[skills.length - 1]}.`;
      
      jobs.push(createJobWithClient({
        id: `tech-${category}-${index + 1}`,
        title,
        description,
        category: 'Development',
        skills,
        workMode: workModes[Math.floor(Math.random() * workModes.length)],
        minRate: 1500,
        maxRate: 5000
      }));
    });
  });

  // Generate cricket/sports jobs (9 jobs)
  cricketSkills.forEach((skills, index) => {
    const title = `Cricket ${skills[0]}`;
    const description = `Looking for an experienced cricket coach specializing in ${skills[1]} and ${skills[2]}. Local candidates preferred.`;
    
    jobs.push(createJobWithClient({
      id: `cricket-${index + 1}`,
      title,
      description,
      category: 'Sports & Fitness',
      skills,
      workMode: 'onsite',
      minRate: 800,
      maxRate: 2500
    }));
  });

  // Add 3 more unique jobs to reach 45
  const additionalJobs = [
    {
      title: 'Event Photographer',
      description: 'Need a professional photographer for a corporate event. Must have own equipment and portfolio.',
      category: 'Photography',
      skills: ['Event Photography', 'Portrait Photography', 'Photo Editing'],
      workMode: 'onsite',
      minRate: 2000,
      maxRate: 8000
    },
    {
      title: 'Video Editor',
      description: 'Looking for a skilled video editor for YouTube content. Experience with Premiere Pro required.',
      category: 'Video Production',
      skills: ['Video Editing', 'Color Grading', 'Motion Graphics'],
      workMode: 'remote',
      minRate: 1500,
      maxRate: 6000
    },
    {
      title: 'Interior Designer',
      description: 'Need an interior designer for a 2BHK apartment. Space planning and 3D visualization skills required.',
      category: 'Interior Design',
      skills: ['Space Planning', '3D Visualization', 'Material Selection'],
      workMode: 'hybrid',
      minRate: 3000,
      maxRate: 9000
    }
  ];

  additionalJobs.forEach((job, index) => {
    jobs.push(createJobWithClient({
      id: `additional-${index + 1}`,
      ...job
    }));
  });

  // Shuffle the jobs array to mix online and offline jobs
  for (let i = jobs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [jobs[i], jobs[j]] = [jobs[j], jobs[i]];
  }

  return jobs;
};

export const jobs = generateJobs();
