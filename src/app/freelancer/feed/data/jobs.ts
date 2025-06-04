import { Job } from '../types';

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

  // Helper function to generate a job
  // Define job durations and experience levels
  const jobDurations = ['hourly', 'daily', 'weekly', 'monthly'] as const;
  const experienceLevels = ['Entry Level', 'Intermediate', 'Expert'] as const;

  const createJob = ({
    id,
    title,
    description,
    category,
    skills,
    workMode,
    minRate = 300,
    maxRate = 2000
  }: {
    id: string;
    title: string;
    description: string;
    category: string;
    skills: string[];
    workMode: 'remote' | 'onsite' | 'hybrid';
    minRate?: number;
    maxRate?: number;
  }) => {
    // Generate a more realistic rate based on category and experience
    const experience = experienceLevels[Math.floor(Math.random() * experienceLevels.length)];
    
    // Adjust base rate based on experience
    let experienceMultiplier = 1;
    if (experience === 'Intermediate') experienceMultiplier = 1.5;
    if (experience === 'Expert') experienceMultiplier = 2.5;
    
    // Base rate for Chennai freelance work
    const baseRate = Math.floor(Math.random() * (maxRate - minRate)) + minRate;
    const rate = Math.floor(baseRate * experienceMultiplier);
    
    // Generate budget based on duration
    const duration = jobDurations[Math.floor(Math.random() * jobDurations.length)];
    let budget = rate;
    
    switch(duration) {
      case 'hourly':
        budget = rate * (Math.floor(Math.random() * 8) + 1); // 1-8 hours
        break;
      case 'daily':
        budget = rate * 8 * (Math.floor(Math.random() * 3) + 1); // 1-3 days
        break;
      case 'weekly':
        budget = rate * 8 * 5 * (Math.floor(Math.random() * 4) + 1); // 1-4 weeks
        break;
      case 'monthly':
        budget = rate * 8 * 5 * 4 * (Math.floor(Math.random() * 3) + 1); // 1-3 months
        break;
    }
    const { name: location, coords: baseCoords } = getRandomArea();
    const coords = generateNearbyCoords(baseCoords);
    const clientName = clientNames[Math.floor(Math.random() * clientNames.length)];
    const job: Job = {
      id,
      title,
      description,
      category,
      rate,
      budget,
      location: locations[Math.floor(Math.random() * locations.length)],
      coords,
      skills,
      workMode,
      type: 'freelance',
      postedAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
      clientName,
      clientImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(clientName)}&background=6B46C1&color=fff&bold=true`,
      clientRating: (Math.floor(Math.random() * 10) / 2 + 3).toFixed(1),
      clientJobs: Math.floor(Math.random() * 50) + 1,
      proposals: Math.floor(Math.random() * 30),
      duration,
      experience,
      company: clientName,
      companyLogo: `https://ui-avatars.com/api/?name=${encodeURIComponent(clientName)}&background=6B46C1&color=fff&bold=true`
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

  // Generate cricket/sports jobs (10 jobs)
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

  // Shuffle the jobs array to mix online and offline jobs
  for (let i = jobs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [jobs[i], jobs[j]] = [jobs[j], jobs[i]];
  }

  return jobs;
};

export const jobs = generateJobs();
