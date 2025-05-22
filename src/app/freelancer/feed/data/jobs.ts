import { Job } from '../types';

// Helper function to generate random coordinates near a point
const generateNearbyCoords = (baseCoords: [number, number], radiusKm = 5): [number, number] => {
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

// Base coordinates for Chennai
const chennaiCoords: [number, number] = [80.2707, 13.0827];

// Common skills
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

  // Helper function to generate a job
  const createJob = ({
    id,
    title,
    description,
    category,
    skills,
    workMode,
    minRate = 500,
    maxRate = 2500
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
    const rate = Math.floor(Math.random() * (maxRate - minRate)) + minRate;
    const budget = rate * Math.floor(Math.random() * 100) + 50;
    const coords = generateNearbyCoords(chennaiCoords);
    
    return {
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
      type: jobTypes[Math.floor(Math.random() * jobTypes.length)],
      postedAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
      clientRating: (Math.random() * 2 + 3).toFixed(1),
      clientJobs: Math.floor(Math.random() * 50) + 1,
      proposals: Math.floor(Math.random() * 30),
      duration: `${Math.floor(Math.random() * 6) + 1} months`
    };
  };

  // Generate offline service jobs (30 jobs)
  Object.entries(jobCategories.offline).forEach(([category, titles]) => {
    titles.forEach((title, index) => {
      const skills = offlineServiceSkills[Math.floor(Math.random() * offlineServiceSkills.length)];
      const description = `Looking for an experienced ${title.toLowerCase()} for local service. Must be available for on-site work in the specified location.`;
      
      jobs.push(createJob({
        id: `offline-${category}-${index + 1}`,
        title,
        description,
        category: category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' '),
        skills,
        workMode: 'onsite',
        minRate: 800,
        maxRate: 3000
      }));
    });
  });

  // Generate tech jobs (15 jobs)
  Object.entries(jobCategories.tech).forEach(([category, titles]) => {
    titles.forEach((title, index) => {
      const skills = devSkills[Math.floor(Math.random() * devSkills.length)];
      const description = `Looking for an experienced ${title.toLowerCase()} with strong expertise in ${skills.slice(0, -1).join(', ')} and ${skills[skills.length - 1]}.`;
      
      jobs.push(createJob({
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
    
    jobs.push(createJob({
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
