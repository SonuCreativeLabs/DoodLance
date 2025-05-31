import { Job, Application, EarningsData } from './types';

// Your skills that will be matched with jobs
export const mySkills = [
  'House Cleaning', 'Deep Cleaning', 'Organization', 'AC Repair', 'Maintenance',
  'Wall Painting', 'Color Mixing', 'Office Maintenance', 'Sanitization',
  'Organic Gardening', 'Landscape Design', 'Plant Care',
  'React', 'Node.js', 'JavaScript', 'TypeScript', 'MongoDB', 'Git',
  'Cricket Coaching', 'Batting Techniques', 'Bowling Techniques', 'Team Management'
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
    title: 'Cricket Coach for U-16 Team',
    category: 'OTHER',
    date: '2024-07-10',
    time: '16:00',
    status: 'upcoming',
    payment: 2500,
    location: 'Mylapore, Chennai',
    description: 'Looking for an experienced cricket coach for our U-16 academy team. Must have prior coaching experience and knowledge of modern cricket techniques.',
    skills: ['Cricket Coaching', 'Batting Techniques', 'Bowling Techniques', 'Fielding Drills', 'Team Management'],
    duration: '2 hours per session',
    experienceLevel: 'Expert'
  },
  {
    id: 'DLWD5678',
    title: 'Full Stack Web Developer',
    category: 'DESIGN',
    date: '2024-06-25',
    time: '10:00',
    status: 'completed',
    completedAt: '2024-06-25T15:30:00',
    payment: 15000,
    location: 'Remote',
    description: 'Need an experienced Full Stack Developer to build and maintain web applications. Must be proficient in React, Node.js, and have experience with databases.',
    skills: ['React', 'Node.js', 'MongoDB', 'REST APIs', 'JavaScript', 'TypeScript', 'Git'],
    duration: '3 months',
    experienceLevel: 'Expert',
    earnings: {
      amount: 15000,
      platformFee: 1500, // 10%
      total: 13500
    },
    clientRating: {
      stars: 5,
      feedback: 'Excellent work! The developer delivered high-quality code and was very professional throughout the project. Would definitely hire again.',
      date: '2024-06-26T10:15:00'
    }
  },
  {
    id: 'DLCL9012',
    title: 'House Cleaning',
    category: 'OTHER',
    date: '2024-06-20',
    time: '14:00',
    status: 'completed',
    payment: 1500,
    location: 'Anna Nagar, Chennai',
    description: 'Deep cleaning of 2BHK apartment including kitchen and bathroom. Need someone with attention to detail and own cleaning supplies.',
    skills: ['House Cleaning', 'Deep Cleaning', 'Organization'],
    duration: '3-4 hours',
    experienceLevel: 'Intermediate'
  },
  {
    id: 'DLGD6789',
    title: 'Garden Maintenance',
    category: 'OTHER',
    date: '2024-06-18',
    time: '10:00',
    status: 'cancelled',
    payment: 800,
    location: 'T Nagar, Chennai',
    description: 'Weekly garden maintenance including mowing, pruning, and weeding. Must have experience with both manual and power tools.',
    skills: ['Lawn Mowing', 'Pruning', 'Landscaping'],
    duration: '2-3 hours',
    experienceLevel: 'Beginner',
    cancellationDetails: {
      cancelledBy: 'client',
      cancelledAt: '2024-06-16T14:30:00',
      notes: 'Client found another service provider with a lower rate.'
    }
  },
  {
    id: 'DLAC3456',
    title: 'AC Service Technician',
    category: 'OTHER',
    date: '2024-06-15',
    time: '11:30',
    status: 'cancelled',
    payment: 1200,
    location: 'Adyar, Chennai',
    description: 'Annual maintenance service for 2 split AC units. Must be certified and provide service report.',
    skills: ['AC Repair', 'Maintenance', 'HVAC'],
    duration: '2 hours',
    experienceLevel: 'Expert',
    cancellationDetails: {
      cancelledBy: 'freelancer',
      cancelledAt: '2024-06-14T16:45:00',
      notes: 'Unable to service this model of AC unit.'
    }
  },
  {
    id: 'DLPT7890',
    title: 'Interior Painting Work',
    category: 'OTHER',
    date: '2024-06-28',
    time: '09:00',
    status: 'completed',
    payment: 3500,
    location: 'Velachery, Chennai',
    description: 'Interior painting for living room (400 sq ft). Must provide all materials and clean up after completion.',
    skills: ['Wall Painting', 'Color Mixing', 'Surface Prep'],
    duration: '6-8 hours',
    experienceLevel: 'Intermediate'
  },
  
  // New jobs with the updated format
  {
    id: 'DLPH1234',
    title: 'Professional Photo Shoot',
    category: 'PHOTO',
    date: '2024-07-12',
    time: '09:00',
    status: 'pending',
    payment: 3500,
    location: 'Adyar, Chennai',
    description: 'Need a professional photographer for a product photoshoot. Must have experience with product photography and lighting.',
    skills: ['Product Photography', 'Lighting', 'Editing'],
    duration: '6 hours',
    experienceLevel: 'Intermediate'
  },
  {
    id: 'DLVD3456',
    title: 'Wedding Videography',
    category: 'VIDEO',
    date: '2024-07-08',
    time: '08:00',
    status: 'confirmed',
    payment: 20000,
    location: 'Bessy, Chennai',
    description: 'Looking for a professional videographer for a wedding event. Must have experience in wedding cinematography and editing.',
    skills: ['Videography', 'Editing', 'Storytelling'],
    duration: 'Full day',
    experienceLevel: 'Expert'
  },
  {
    id: 'DLMS7890',
    title: 'Live Band Performance',
    category: 'MUSIC',
    date: '2024-07-15',
    time: '19:00',
    status: 'pending',
    payment: 15000,
    location: 'Velachery, Chennai',
    description: 'Looking for a live band for a corporate event. Must have experience performing at corporate functions.',
    skills: ['Live Performance', 'Music', 'Entertainment'],
    duration: '3 hours',
    experienceLevel: 'Expert'
  },
  {
    id: 'DLDN2468',
    title: 'Dance Performance',
    category: 'DANCE',
    date: '2024-07-20',
    time: '18:00',
    status: 'confirmed',
    payment: 12000,
    location: 'Anna Nagar, Chennai',
    description: 'Looking for professional dancers for a cultural event. Various dance styles welcome.',
    skills: ['Dance', 'Choreography', 'Performance'],
    duration: '2 hours',
    experienceLevel: 'Expert'
  },
  {
    id: 'DLEV1357',
    title: 'Corporate Event Planning',
    category: 'EVENT',
    date: '2024-07-25',
    time: '10:00',
    status: 'pending',
    payment: 25000,
    location: 'Nungambakkam, Chennai',
    description: 'Need an event manager for a corporate conference. Must have experience in managing large-scale events.',
    skills: ['Event Planning', 'Vendor Management', 'Logistics'],
    duration: 'Full day',
    experienceLevel: 'Expert'
  }
];

export const mockApplications: Application[] = [
  {
    id: 'cricket-proposal',
    jobTitle: 'Cricket Coach for School Team',
    appliedDate: '2024-06-28',
    status: 'pending',
    clientName: 'Chennai Public School',
    budget: { min: 2000, max: 3000 },
    progress: 0,
    clientImage: '/avatars/school.jpg',
    location: 'Nungambakkam, Chennai',
    postedDate: '2024-06-25',
    description: 'Looking for a part-time cricket coach for our school team. Must have experience coaching children aged 10-14.',
    clientId: 'school123',
    proposal: {
      coverLetter: 'I have 5+ years of experience coaching young cricketers and have helped teams win district-level tournaments. I focus on both technical skills and team building.',
      proposedRate: 2500,
      estimatedDays: 30,
      skills: ['Cricket Coaching', 'Batting Techniques', 'Bowling Techniques', 'Team Management', 'Youth Development'],
      attachments: ['coaching_certificate.pdf', 'resume.pdf']
    }
  },
  {
    id: 'dev-proposal',
    jobTitle: 'Frontend Developer for E-commerce Site',
    appliedDate: '2024-06-29',
    status: 'pending',
    clientName: 'TechStart Inc',
    budget: { min: 15000, max: 25000 },
    progress: 0,
    clientImage: '/avatars/company2.jpg',
    location: 'Remote',
    postedDate: '2024-06-26',
    description: 'Need a skilled frontend developer to build a responsive e-commerce site using React and TypeScript.',
    clientId: 'techstart456',
    proposal: {
      coverLetter: 'I am a full-stack developer with 3+ years of experience in React and TypeScript. I have built multiple e-commerce platforms and can ensure a smooth, responsive user experience.',
      proposedRate: 20000,
      estimatedDays: 45,
      skills: ['React', 'TypeScript', 'Redux', 'Responsive Design', 'UI/UX'],
      attachments: ['portfolio.pdf', 'resume_dev.pdf']
    }
  },
  {
    id: '1',
    jobTitle: 'Office Cleaning',
    appliedDate: '2024-06-20',
    status: 'pending',
    clientName: 'TechCorp Ltd',
    budget: { min: 1800, max: 2000 },
    progress: 0,
    clientImage: '/avatars/company1.jpg',
    location: 'Tidel Park, Chennai',
    postedDate: '2024-06-18',
    description: 'Daily cleaning for 2000 sq ft office space',
    clientId: 'client1',
    proposal: {
      coverLetter: 'I have 5+ years of experience in commercial cleaning and can ensure your office space is spotless. I have all necessary equipment and can work during your preferred hours.',
      proposedRate: 2000,
      estimatedDays: 3,
      skills: ['Deep Cleaning', 'Office Maintenance', 'Sanitization'],
      attachments: ['Resume.pdf', 'Certification.pdf']
    }
  },
  {
    id: '2',
    jobTitle: 'Home Gardening',
    appliedDate: '2024-06-19',
    status: 'accepted',
    clientName: 'Meera R',
    budget: { min: 800, max: 1000 },
    progress: 0,
    clientImage: '/avatars/avatar5.jpg',
    location: 'Besant Nagar, Chennai',
    postedDate: '2024-06-17',
    description: 'Monthly maintenance for small garden with native plants',
    clientId: 'client2',
    proposal: {
      coverLetter: 'As a certified horticulturist with expertise in native plants, I can help maintain your garden with organic methods. I specialize in sustainable gardening practices.',
      proposedRate: 900,
      estimatedDays: 1,
      skills: ['Organic Gardening', 'Landscape Design', 'Plant Care'],
      attachments: ['Portfolio.pdf', 'Certification.pdf']
    }
  },
  {
    id: '3',
    jobTitle: 'Plumbing Repair',
    appliedDate: '2024-06-21',
    status: 'rejected',
    clientName: 'Rahul K',
    budget: { min: 1200, max: 1800 },
    progress: 0,
    clientImage: '/avatars/avatar6.jpg',
    location: 'Nungambakkam, Chennai',
    postedDate: '2024-06-20',
    description: 'Fix leaking pipes in kitchen and bathroom',
    clientId: 'client3',
    proposal: {
      coverLetter: 'Licensed plumber with 8 years of experience in residential repairs. I can diagnose and fix your leaking pipes efficiently with minimal disruption.',
      proposedRate: 1500,
      estimatedDays: 1,
      skills: ['Pipe Repair', 'Leak Detection', 'Bathroom Plumbing'],
      attachments: ['License.pdf', 'References.pdf']
    }
  }
];

export const mockEarnings: EarningsData = {
  totalEarnings: 45600,
  pendingPayouts: 7800,
  completedJobs: 24,
  averageRating: 4.7,
  recentTransactions: [
    {
      id: '1',
      amount: 2500,
      status: 'completed',
      date: '2024-06-20',
      jobTitle: 'Office Deep Cleaning',
      client: 'TechWave Solutions',
      type: 'credit',
      paymentMethod: 'UPI'
    },
    {
      id: '2',
      amount: 1800,
      status: 'pending',
      date: '2024-06-21',
      jobTitle: 'Garden Maintenance',
      client: 'Green Spaces Ltd',
      type: 'credit',
      paymentMethod: 'Cash'
    },
    {
      id: '3',
      amount: 1200,
      status: 'completed',
      date: '2024-06-19',
      jobTitle: 'AC Service',
      client: 'Cool Air Systems',
      type: 'credit',
      paymentMethod: 'UPI'
    },
    {
      id: '4',
      amount: 500,
      status: 'completed',
      date: '2024-06-18',
      jobTitle: 'Plumbing Repair',
      client: 'HomeServe Connect',
      type: 'credit',
      paymentMethod: 'Cash'
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
