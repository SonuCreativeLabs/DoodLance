// import { Freelancer } from './types'; // Commented out - unused

interface Professional {
  id: number;
  name: string;
  service: string;
  rating: number;
  reviews: number;
  reviewCount: number;
  completedJobs: number;
  location: string;
  responseTime: string;
  image: string;
  avatar?: string;
  distance: number;
  price: number;
  budget?: number;
  priceUnit: string;
  coords: [number, number]; // [longitude, latitude]
  expertise: string[];
  experience: string;
  description?: string;

  // Additional profile fields for detailed view
  bio?: string;
  about?: string;
  cricketRole?: string;
  battingStyle?: string;
  bowlingStyle?: string;
  languages?: string;
  completionRate?: number;
  skills?: string[];

  // Availability data
  availability?: {
    day: string;
    available: boolean;
  }[];

  // Services data
  services?: {
    id: string;
    title: string;
    description: string;
    price: number | string;
    deliveryTime: string;
    features?: string[];
    category?: string;
  }[];

  // Portfolio data
  portfolio?: {
    id: string;
    title: string;
    image: string;
    category: string;
  }[];

  // Experience data
  experienceDetails?: {
    id: string;
    role: string;
    company: string;
    location: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
    description?: string;
  }[];

  // Reviews data
  reviewsData?: {
    id: string;
    author: string;
    role?: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}

export const professionals: Professional[] = [
  {
    id: 1,
    name: "Rajesh Kumar",
    service: "Fast Bowler",
    rating: 4.9,
    reviews: 245,
    reviewCount: 245,
    completedJobs: 320,
    location: "Chepauk Stadium Area",
    responseTime: "Usually responds in 30 mins",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    distance: 1.2,
    price: 2500,
    priceUnit: "session",
    coords: [80.2095, 13.0850],
    expertise: ["Pace Bowling", "Yorkers", "Bouncers", "Death Overs", "Line & Length"],
    experience: "8 years",

    // Additional profile fields
    bio: "Professional cricketer and pace bowler with 8+ years of experience. Specialized in fast bowling techniques, death overs, and mentoring young talent.",
    about: "Professional cricketer and pace bowler with 8+ years of experience. Specialized in fast bowling techniques, death overs, and mentoring young talent.",
    cricketRole: "Pace Bowler",
    battingStyle: "Right-handed",
    bowlingStyle: "Right-arm Fast",
    languages: "English, Hindi, Tamil",
    completionRate: 98,
    skills: ["Fast Bowling", "Death Overs", "Yorkers", "Bouncers", "Line & Length", "Player Development"],

    // Availability data
    availability: [
      { day: "Mon", available: true },
      { day: "Tue", available: true },
      { day: "Wed", available: true },
      { day: "Thu", available: false },
      { day: "Fri", available: true },
      { day: "Sat", available: true },
      { day: "Sun", available: true }
    ],

    // Services data
    services: [
      {
        id: "1",
        title: "Fast Bowling Training Session",
        description: "Comprehensive pace bowling training session focusing on technique, accuracy, and power delivery",
        price: "₹2,500",
        deliveryTime: "2 hours",
        features: ["Technique Analysis", "Power Development", "Accuracy Drills", "Video Feedback"],
        category: "Bowling Training"
      },
      {
        id: "2",
        title: "Death Overs Specialist Training",
        description: "Specialized training for death overs bowling with focus on yorkers, bouncers, and pressure situations",
        price: "₹3,200",
        deliveryTime: "2.5 hours",
        features: ["Death Overs Strategy", "Yorker Practice", "Bouncer Control", "Mental Training"],
        category: "Bowling Training"
      },
      {
        id: "3",
        title: "Young Player Development",
        description: "Coaching program for aspiring fast bowlers aged 12-18 with focus on fundamentals and technique",
        price: "₹2,000",
        deliveryTime: "1.5 hours",
        features: ["Basic Technique", "Fitness Training", "Mental Preparation", "Progress Tracking"],
        category: "Youth Coaching"
      }
    ],

    // Portfolio data
    portfolio: [
      {
        id: "1",
        title: "Pace Bowling Workshop",
        image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400&h=300&fit=crop",
        category: "Training Session"
      },
      {
        id: "2",
        title: "Death Overs Clinic",
        image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop",
        category: "Specialized Training"
      },
      {
        id: "3",
        title: "Youth Bowling Camp",
        image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop",
        category: "Youth Development"
      }
    ],

    // Experience data
    experienceDetails: [
      {
        id: "1",
        role: "Professional Fast Bowler",
        company: "Chennai Cricket Academy",
        location: "Chennai, India",
        startDate: "2016",
        isCurrent: true,
        description: "Lead pace bowling coach specializing in technique development and performance enhancement for competitive players."
      },
      {
        id: "2",
        role: "Club Cricketer",
        company: "Chepauk Cricket Club",
        location: "Chennai, India",
        startDate: "2014",
        endDate: "2016",
        isCurrent: false,
        description: "Played competitive cricket while developing coaching skills and understanding of the game at professional level."
      },
      {
        id: "3",
        role: "Youth Bowling Coach",
        company: "Tamil Nadu Cricket Association",
        location: "Chennai, India",
        startDate: "2012",
        endDate: "2014",
        isCurrent: false,
        description: "Coached young bowlers aged 12-16, focusing on fundamentals and building confidence in the sport."
      }
    ],

    // Reviews data
    reviewsData: [
      {
        id: "1",
        author: "Arun Sharma",
        role: "Club Player",
        rating: 5,
        comment: "Rajesh is an exceptional fast bowling coach. His attention to detail and technical knowledge helped me improve my yorker accuracy significantly. Highly recommended!",
        date: "2 weeks ago"
      },
      {
        id: "2",
        author: "Priya Patel",
        role: "Parent",
        rating: 5,
        comment: "My son has been training with Rajesh for 6 months now. His technique has improved tremendously and he enjoys every session. Professional and patient coach.",
        date: "1 month ago"
      },
      {
        id: "3",
        author: "Vikram Singh",
        role: "Semi-professional",
        rating: 4,
        comment: "Great pace bowling specialist. The death overs training was particularly helpful for my game. Would definitely recommend for serious players.",
        date: "6 weeks ago"
      }
    ]
  },
  {
    id: 2,
    name: "Priya Sharma",
    service: "Batting Coach",
    rating: 5.0,
    reviews: 312,
    reviewCount: 312,
    completedJobs: 450,
    location: "T Nagar Cricket Ground",
    responseTime: "Usually responds in 1 hour",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
    distance: 2.1,
    price: 3000,
    priceUnit: "session",
    coords: [80.2341, 13.0418],
    expertise: ["Footwork Drills", "Shot Selection", "Mental Training", "Technique Analysis", "Pressure Situations"],
    experience: "10 years",

    // Additional profile fields
    bio: "Elite batting coach with 10+ years of experience mentoring players at all levels. Specializes in technique refinement, mental training, and performance under pressure.",
    about: "Elite batting coach with 10+ years of experience mentoring players at all levels. Specializes in technique refinement, mental training, and performance under pressure.",
    cricketRole: "Batting Coach",
    battingStyle: "Left-handed",
    bowlingStyle: "Right-arm Off Spin",
    languages: "English, Hindi",
    completionRate: 100,
    skills: ["Batting Technique", "Shot Selection", "Mental Training", "Footwork", "Pressure Performance"],

    // Availability data
    availability: [
      { day: "Mon", available: true },
      { day: "Tue", available: true },
      { day: "Wed", available: false },
      { day: "Thu", available: true },
      { day: "Fri", available: true },
      { day: "Sat", available: true },
      { day: "Sun", available: true }
    ],

    // Services data
    services: [
      {
        id: "1",
        title: "Elite Batting Coaching",
        description: "Comprehensive batting training focusing on technique, footwork, and shot selection for competitive players",
        price: "₹3,000",
        deliveryTime: "2 hours",
        features: ["Technique Analysis", "Footwork Drills", "Shot Selection", "Mental Training"],
        category: "Batting Training"
      },
      {
        id: "2",
        title: "Pressure Performance Training",
        description: "Specialized training for performing under pressure situations with mental conditioning and visualization techniques",
        price: "₹3,500",
        deliveryTime: "2.5 hours",
        features: ["Mental Conditioning", "Pressure Scenarios", "Visualization", "Performance Psychology"],
        category: "Mental Training"
      }
    ],

    // Portfolio data
    portfolio: [
      {
        id: "1",
        title: "Professional Batting Clinic",
        image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop",
        category: "Training Session"
      },
      {
        id: "2",
        title: "Youth Batting Workshop",
        image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop",
        category: "Youth Development"
      }
    ],

    // Experience data
    experienceDetails: [
      {
        id: "1",
        role: "Elite Batting Coach",
        company: "Tamil Nadu Cricket Association",
        location: "Chennai, India",
        startDate: "2014",
        isCurrent: true,
        description: "Lead batting coach for elite players, focusing on technique refinement and performance enhancement."
      },
      {
        id: "2",
        role: "Senior Batting Coach",
        company: "Chennai Cricket Academy",
        location: "Chennai, India",
        startDate: "2010",
        endDate: "2014",
        isCurrent: false,
        description: "Developed training programs and coached competitive players at various skill levels."
      }
    ],

    // Reviews data
    reviewsData: [
      {
        id: "1",
        author: "Rahul Kumar",
        role: "Professional Player",
        rating: 5,
        comment: "Priya is an outstanding batting coach. Her attention to detail and ability to break down complex techniques into simple steps is remarkable.",
        date: "1 week ago"
      },
      {
        id: "2",
        author: "Meera Patel",
        role: "Parent",
        rating: 5,
        comment: "My daughter has improved tremendously under Priya's coaching. Her mental training techniques are particularly effective.",
        date: "2 weeks ago"
      }
    ]
  },
  {
    id: 3,
    name: "Arjun Singh",
    service: "Wicket Keeper",
    rating: 4.8,
    reviews: 198,
    reviewCount: 198,
    completedJobs: 280,
    location: "M.A. Chidambaram Stadium",
    responseTime: "Usually responds in 45 mins",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    distance: 3.1,
    price: 2000,
    priceUnit: "match",
    coords: [80.2785, 13.0633],
    expertise: ["Glove Work", "Stumping", "Standing Up to Pace/Spin", "Catching Drills", "Wicket-keeping Technique"],
    experience: "7 years",

    // Additional profile fields
    bio: "Professional wicket-keeper with 7+ years of experience. Expert in glove work, stumping techniques, and keeping up to both pace and spin bowlers.",
    about: "Professional wicket-keeper with 7+ years of experience. Expert in glove work, stumping techniques, and keeping up to both pace and spin bowlers.",
    cricketRole: "Wicket Keeper",
    battingStyle: "Right-handed",
    bowlingStyle: "Right-arm Medium",
    languages: "English, Hindi, Punjabi",
    completionRate: 96,
    skills: ["Glove Work", "Stumping", "Catching", "Standing Up", "Wicket-keeping Technique"],

    // Availability data
    availability: [
      { day: "Mon", available: true },
      { day: "Tue", available: true },
      { day: "Wed", available: true },
      { day: "Thu", available: false },
      { day: "Fri", available: true },
      { day: "Sat", available: true },
      { day: "Sun", available: true }
    ],

    // Services data
    services: [
      {
        id: "1",
        title: "Wicket-keeping Training",
        description: "Comprehensive wicket-keeping training covering glove work, footwork, and catching techniques",
        price: "₹2,000",
        deliveryTime: "2 hours",
        features: ["Glove Work Drills", "Footwork Training", "Catching Practice", "Stumping Technique"],
        category: "Wicket-keeping Training"
      },
      {
        id: "2",
        title: "Match Wicket-keeping",
        description: "Professional wicket-keeping services for club and league matches",
        price: "₹2,500",
        deliveryTime: "Match duration",
        features: ["Match Experience", "Professional Conduct", "Equipment Provided", "Match Statistics"],
        category: "Match Services"
      }
    ],

    // Portfolio data
    portfolio: [
      {
        id: "1",
        title: "Wicket-keeping Clinic",
        image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop",
        category: "Training Session"
      },
      {
        id: "2",
        title: "Match Day Action",
        image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop",
        category: "Match Coverage"
      }
    ],

    // Experience data
    experienceDetails: [
      {
        id: "1",
        role: "Professional Wicket Keeper",
        company: "Chennai Super Kings Academy",
        location: "Chennai, India",
        startDate: "2017",
        isCurrent: true,
        description: "Lead wicket-keeping coach and match wicket-keeper for various cricket clubs and academies."
      },
      {
        id: "2",
        role: "Club Wicket Keeper",
        company: "M.A. Chidambaram Cricket Club",
        location: "Chennai, India",
        startDate: "2015",
        endDate: "2017",
        isCurrent: false,
        description: "Regular wicket-keeper for club matches and training sessions."
      }
    ],

    // Reviews data
    reviewsData: [
      {
        id: "1",
        author: "Suresh Kumar",
        role: "Club Captain",
        rating: 5,
        comment: "Arjun is an excellent wicket-keeper. His glove work is outstanding and he has great match awareness.",
        date: "3 weeks ago"
      },
      {
        id: "2",
        author: "Priya Menon",
        role: "Cricket Coach",
        rating: 5,
        comment: "Great wicket-keeping coach. My students have improved significantly under his guidance.",
        date: "1 month ago"
      }
    ]
  },
  {
    id: 4,
    name: "Kavita Reddy",
    service: "Spin Bowler",
    rating: 4.9,
    reviews: 189,
    reviewCount: 189,
    completedJobs: 210,
    location: "Jawaharlal Nehru Stadium",
    responseTime: "Usually responds in 2 hours",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
    distance: 1.8,
    price: 2800,
    priceUnit: "session",
    coords: [80.2687, 13.0368],
    expertise: ["Off Spin", "Doosra", "Carrom Ball", "Flight & Drift", "Googly Variations"],
    experience: "9 years",

    // Additional profile fields
    bio: "Experienced spin bowler with 9+ years of expertise in off-spin, doosra, and various spin variations. Known for flight, drift, and deceptive bowling.",
    about: "Experienced spin bowler with 9+ years of expertise in off-spin, doosra, and various spin variations. Known for flight, drift, and deceptive bowling.",
    cricketRole: "Spin Bowler",
    battingStyle: "Right-handed",
    bowlingStyle: "Right-arm Off Spin",
    languages: "English, Hindi, Telugu",
    completionRate: 98,
    skills: ["Off Spin", "Doosra", "Carrom Ball", "Flight", "Drift", "Googly"],

    // Availability data
    availability: [
      { day: "Mon", available: true },
      { day: "Tue", available: false },
      { day: "Wed", available: true },
      { day: "Thu", available: true },
      { day: "Fri", available: true },
      { day: "Sat", available: true },
      { day: "Sun", available: true }
    ],

    // Services data
    services: [
      {
        id: "1",
        title: "Spin Bowling Mastery",
        description: "Advanced spin bowling training covering off-spin, doosra, and various deceptive deliveries",
        price: "₹2,800",
        deliveryTime: "2 hours",
        features: ["Off Spin Technique", "Doosra Variations", "Flight & Drift", "Mental Approach"],
        category: "Bowling Training"
      },
      {
        id: "2",
        title: "Youth Spin Development",
        description: "Specialized coaching for young spinners focusing on fundamentals and technique building",
        price: "₹2,200",
        deliveryTime: "1.5 hours",
        features: ["Basic Technique", "Grip & Release", "Flight Control", "Confidence Building"],
        category: "Youth Coaching"
      }
    ],

    // Portfolio data
    portfolio: [
      {
        id: "1",
        title: "Spin Bowling Workshop",
        image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop",
        category: "Training Session"
      },
      {
        id: "2",
        title: "Doosra Clinic",
        image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop",
        category: "Specialized Training"
      }
    ],

    // Experience data
    experienceDetails: [
      {
        id: "1",
        role: "Senior Spin Bowling Coach",
        company: "Jawaharlal Nehru Cricket Academy",
        location: "Chennai, India",
        startDate: "2015",
        isCurrent: true,
        description: "Lead spin bowling coach specializing in advanced techniques and youth development."
      },
      {
        id: "2",
        role: "Professional Spin Bowler",
        company: "Tamil Nadu Women's Cricket Team",
        location: "Chennai, India",
        startDate: "2010",
        endDate: "2015",
        isCurrent: false,
        description: "Competitive spin bowler with experience in domestic cricket and various tournaments."
      }
    ],

    // Reviews data
    reviewsData: [
      {
        id: "1",
        author: "Ravi Sharma",
        role: "Club Player",
        rating: 5,
        comment: "Kavita's spin bowling coaching is exceptional. Her doosra variations are deadly and her teaching is very clear.",
        date: "2 weeks ago"
      },
      {
        id: "2",
        author: "Anjali Kumar",
        role: "Parent",
        rating: 5,
        comment: "My son loves learning spin bowling from Kavita. She's patient and explains everything so well.",
        date: "1 month ago"
      }
    ]
  },
  {
    id: 5,
    name: "Vikram Patel",
    service: "Cricket Analyst",
    rating: 4.8,
    reviews: 267,
    reviewCount: 267,
    completedJobs: 380,
    location: "DY Patil Stadium",
    responseTime: "Usually responds in 1 hour",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
    distance: 2.7,
    price: 3500,
    priceUnit: "analysis",
    coords: [80.2574, 13.0012],
    expertise: ["Performance Analysis", "Video Breakdown", "Statistical Modeling", "Strategy Development", "Player Assessment"],
    experience: "6 years",

    // Additional profile fields
    bio: "Professional cricket analyst with 6+ years of experience in performance analysis, video breakdown, and strategic planning for teams and individual players.",
    about: "Professional cricket analyst with 6+ years of experience in performance analysis, video breakdown, and strategic planning for teams and individual players.",
    cricketRole: "Cricket Analyst",
    battingStyle: "Left-handed",
    bowlingStyle: "Left-arm Orthodox",
    languages: "English, Hindi, Gujarati",
    completionRate: 97,
    skills: ["Performance Analysis", "Video Analysis", "Statistics", "Strategy", "Player Assessment"],

    // Availability data
    availability: [
      { day: "Mon", available: true },
      { day: "Tue", available: true },
      { day: "Wed", available: true },
      { day: "Thu", available: true },
      { day: "Fri", available: false },
      { day: "Sat", available: true },
      { day: "Sun", available: true }
    ],

    // Services data
    services: [
      {
        id: "1",
        title: "Performance Analysis",
        description: "Comprehensive performance analysis including video breakdown, statistical modeling, and strategic recommendations",
        price: "₹3,500",
        deliveryTime: "3-5 days",
        features: ["Video Analysis", "Statistical Report", "Strategy Recommendations", "Performance Insights"],
        category: "Analysis Services"
      },
      {
        id: "2",
        title: "Match Strategy Planning",
        description: "Strategic planning and opponent analysis for upcoming matches with detailed game plans",
        price: "₹4,000",
        deliveryTime: "2-3 days",
        features: ["Opponent Analysis", "Game Strategy", "Player Roles", "Tactical Planning"],
        category: "Strategy Services"
      }
    ],

    // Portfolio data
    portfolio: [
      {
        id: "1",
        title: "Tournament Analysis Report",
        image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop",
        category: "Analysis Report"
      },
      {
        id: "2",
        title: "Player Performance Dashboard",
        image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop",
        category: "Data Visualization"
      }
    ],

    // Experience data
    experienceDetails: [
      {
        id: "1",
        role: "Senior Cricket Analyst",
        company: "DY Patil Cricket Academy",
        location: "Chennai, India",
        startDate: "2018",
        isCurrent: true,
        description: "Lead analyst providing performance analysis and strategic planning for competitive teams and individual players."
      },
      {
        id: "2",
        role: "Data Analyst",
        company: "Chennai Cricket League",
        location: "Chennai, India",
        startDate: "2016",
        endDate: "2018",
        isCurrent: false,
        description: "Analyzed match data and provided statistical insights for league teams and players."
      }
    ],

    // Reviews data
    reviewsData: [
      {
        id: "1",
        author: "Rohit Sharma",
        role: "Team Captain",
        rating: 5,
        comment: "Vikram's analysis is incredibly detailed and insightful. His strategic recommendations have helped our team immensely.",
        date: "1 week ago"
      },
      {
        id: "2",
        author: "Priya Singh",
        role: "Coach",
        rating: 5,
        comment: "Excellent analyst with great attention to detail. His video breakdowns are very helpful for player development.",
        date: "3 weeks ago"
      }
    ]
  },
  {
    id: 6,
    name: "Ananya Krishnan",
    service: "Sports Physiotherapist",
    rating: 4.7,
    reviews: 156,
    reviewCount: 156,
    completedJobs: 220,
    location: "Nehru Stadium",
    responseTime: "Usually responds in 3 hours",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    distance: 4.2,
    price: 1500,
    priceUnit: "session",
    coords: [80.2532, 13.0336],
    expertise: ["Injury Prevention", "Rehabilitation", "Sports Massage", "Strength Training", "Recovery Protocols"],
    experience: "5 years",

    // Additional profile fields
    bio: "Certified sports physiotherapist specializing in cricket injuries, rehabilitation, and performance enhancement for athletes at all levels.",
    about: "Certified sports physiotherapist specializing in cricket injuries, rehabilitation, and performance enhancement for athletes at all levels.",
    cricketRole: "Sports Physiotherapist",
    battingStyle: "Right-handed",
    bowlingStyle: "Right-arm Medium",
    languages: "English, Hindi, Tamil",
    completionRate: 99,
    skills: ["Injury Rehabilitation", "Sports Massage", "Strength Training", "Recovery Protocols", "Injury Prevention"],

    // Availability data
    availability: [
      { day: "Mon", available: true },
      { day: "Tue", available: true },
      { day: "Wed", available: false },
      { day: "Thu", available: true },
      { day: "Fri", available: true },
      { day: "Sat", available: true },
      { day: "Sun", available: true }
    ],

    // Services data
    services: [
      {
        id: "1",
        title: "Sports Physiotherapy Session",
        description: "Comprehensive physiotherapy session including assessment, treatment, and rehabilitation exercises",
        price: "₹1,500",
        deliveryTime: "1 hour",
        features: ["Injury Assessment", "Manual Therapy", "Exercise Prescription", "Recovery Plan"],
        category: "Physiotherapy"
      },
      {
        id: "2",
        title: "Injury Rehabilitation Program",
        description: "Structured rehabilitation program for cricket-related injuries with progressive exercises and monitoring",
        price: "₹2,500",
        deliveryTime: "4-6 weeks",
        features: ["Custom Program", "Progress Monitoring", "Strength Training", "Return to Play"],
        category: "Rehabilitation"
      }
    ],

    // Portfolio data
    portfolio: [
      {
        id: "1",
        title: "Injury Recovery Case Study",
        image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop",
        category: "Rehabilitation"
      },
      {
        id: "2",
        title: "Sports Massage Session",
        image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop",
        category: "Treatment"
      }
    ],

    // Experience data
    experienceDetails: [
      {
        id: "1",
        role: "Sports Physiotherapist",
        company: "Nehru Stadium Sports Clinic",
        location: "Chennai, India",
        startDate: "2019",
        isCurrent: true,
        description: "Specialized physiotherapy for cricket players, focusing on injury prevention and performance enhancement."
      },
      {
        id: "2",
        role: "Sports Medicine Assistant",
        company: "Chennai Cricket Association",
        location: "Chennai, India",
        startDate: "2017",
        endDate: "2019",
        isCurrent: false,
        description: "Assisted in sports medicine for competitive cricket teams and individual athletes."
      }
    ],

    // Reviews data
    reviewsData: [
      {
        id: "1",
        author: "Vikram Singh",
        role: "Professional Player",
        rating: 5,
        comment: "Ananya helped me recover from a serious shoulder injury. Her expertise and care are outstanding.",
        date: "2 weeks ago"
      },
      {
        id: "2",
        author: "Meera Patel",
        role: "Coach",
        rating: 5,
        comment: "Excellent physiotherapist. My players always recover faster under her care.",
        date: "1 month ago"
      }
    ]
  },
  {
    id: 7,
    name: "Rohit Verma",
    service: "Cricket Commentator",
    rating: 4.8,
    reviews: 198,
    reviewCount: 198,
    completedJobs: 280,
    location: "Eden Gardens Area",
    responseTime: "Usually responds in 30 mins",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    distance: 3.5,
    price: 4000,
    priceUnit: "event",
    coords: [80.2242, 13.0569],
    expertise: ["Live Commentary", "Match Analysis", "Player Insights", "Technical Knowledge", "Event Hosting"],
    experience: "12 years",

    // Additional profile fields
    bio: "Experienced cricket commentator with 12+ years in live broadcasting, match analysis, and cricket journalism.",
    about: "Experienced cricket commentator with 12+ years in live broadcasting, match analysis, and cricket journalism.",
    cricketRole: "Cricket Commentator",
    battingStyle: "Right-handed",
    bowlingStyle: "Right-arm Medium",
    languages: "English, Hindi, Bengali",
    completionRate: 98,
    skills: ["Live Commentary", "Match Analysis", "Technical Knowledge", "Event Hosting", "Journalism"],

    // Availability data
    availability: [
      { day: "Mon", available: true },
      { day: "Tue", available: true },
      { day: "Wed", available: true },
      { day: "Thu", available: true },
      { day: "Fri", available: true },
      { day: "Sat", available: true },
      { day: "Sun", available: true }
    ],

    // Services data
    services: [
      {
        id: "1",
        title: "Live Match Commentary",
        description: "Professional live commentary for cricket matches with expert analysis and insights",
        price: "₹4,000",
        deliveryTime: "Match duration",
        features: ["Live Commentary", "Expert Analysis", "Player Insights", "Engaging Narration"],
        category: "Broadcasting"
      },
      {
        id: "2",
        title: "Event Hosting & MC",
        description: "Professional hosting for cricket events, tournaments, and award ceremonies",
        price: "₹3,500",
        deliveryTime: "Event duration",
        features: ["Event Hosting", "Ceremony Management", "Audience Engagement", "Professional Presentation"],
        category: "Event Services"
      }
    ],

    // Portfolio data
    portfolio: [
      {
        id: "1",
        title: "Tournament Final Commentary",
        image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop",
        category: "Live Commentary"
      },
      {
        id: "2",
        title: "Award Ceremony Hosting",
        image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop",
        category: "Event Hosting"
      }
    ],

    // Experience data
    experienceDetails: [
      {
        id: "1",
        role: "Senior Cricket Commentator",
        company: "Sports Broadcasting Network",
        location: "Chennai, India",
        startDate: "2012",
        isCurrent: true,
        description: "Lead commentator for major cricket tournaments and events with extensive broadcasting experience."
      },
      {
        id: "2",
        role: "Cricket Journalist",
        company: "Cricket Times",
        location: "Chennai, India",
        startDate: "2008",
        endDate: "2012",
        isCurrent: false,
        description: "Sports journalist covering cricket matches, player interviews, and tournament analysis."
      }
    ],

    // Reviews data
    reviewsData: [
      {
        id: "1",
        author: "Tournament Director",
        role: "Event Organizer",
        rating: 5,
        comment: "Rohit's commentary brought the tournament to life. His insights and energy were perfect.",
        date: "1 week ago"
      },
      {
        id: "2",
        author: "Team Manager",
        role: "Club Official",
        rating: 5,
        comment: "Excellent commentator with deep knowledge of the game. Highly professional and engaging.",
        date: "2 weeks ago"
      }
    ]
  },
  {
    id: 8,
    name: "Sneha Gupta",
    service: "Cricket Content Creator",
    rating: 4.9,
    reviews: 234,
    reviewCount: 234,
    completedJobs: 350,
    location: "Brabourne Stadium",
    responseTime: "Usually responds in 1 hour",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
    distance: 2.9,
    price: 2500,
    priceUnit: "project",
    coords: [80.2707, 13.0524],
    expertise: ["Social Media Content", "Video Editing", "Highlight Reels", "Player Profiles", "Match Coverage"],
    experience: "4 years",

    // Additional profile fields
    bio: "Creative content creator specializing in cricket media, social media content, and digital storytelling for cricket brands and players.",
    about: "Creative content creator specializing in cricket media, social media content, and digital storytelling for cricket brands and players.",
    cricketRole: "Content Creator",
    battingStyle: "Right-handed",
    bowlingStyle: "Right-arm Leg Spin",
    languages: "English, Hindi",
    completionRate: 97,
    skills: ["Video Editing", "Content Creation", "Social Media", "Photography", "Digital Marketing"],

    // Availability data
    availability: [
      { day: "Mon", available: true },
      { day: "Tue", available: true },
      { day: "Wed", available: false },
      { day: "Thu", available: true },
      { day: "Fri", available: true },
      { day: "Sat", available: true },
      { day: "Sun", available: true }
    ],

    // Services data
    services: [
      {
        id: "1",
        title: "Highlight Reel Creation",
        description: "Professional highlight reels and video content for matches, players, and cricket events",
        price: "₹2,500",
        deliveryTime: "3-5 days",
        features: ["Video Editing", "Music & Effects", "Professional Quality", "Multiple Formats"],
        category: "Video Production"
      },
      {
        id: "2",
        title: "Social Media Content Package",
        description: "Complete social media content strategy including posts, stories, and promotional materials",
        price: "₹3,000",
        deliveryTime: "1 week",
        features: ["Content Strategy", "Graphic Design", "Posting Schedule", "Engagement Optimization"],
        category: "Social Media"
      }
    ],

    // Portfolio data
    portfolio: [
      {
        id: "1",
        title: "Tournament Highlight Reel",
        image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop",
        category: "Video Content"
      },
      {
        id: "2",
        title: "Player Profile Series",
        image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop",
        category: "Content Creation"
      }
    ],

    // Experience data
    experienceDetails: [
      {
        id: "1",
        role: "Digital Content Creator",
        company: "Cricket Media Productions",
        location: "Chennai, India",
        startDate: "2020",
        isCurrent: true,
        description: "Creating engaging cricket content for social media, websites, and digital platforms."
      },
      {
        id: "2",
        role: "Video Editor",
        company: "Sports Network India",
        location: "Chennai, India",
        startDate: "2018",
        endDate: "2020",
        isCurrent: false,
        description: "Edited sports content and created promotional videos for cricket tournaments and events."
      }
    ],

    // Reviews data
    reviewsData: [
      {
        id: "1",
        author: "Club Marketing Manager",
        role: "Marketing Professional",
        rating: 5,
        comment: "Sneha's content is always creative and engaging. Her highlight reels are absolutely stunning.",
        date: "1 week ago"
      },
      {
        id: "2",
        author: "Professional Player",
        role: "Cricketer",
        rating: 5,
        comment: "Love working with Sneha. She captures the essence of the game perfectly in her content.",
        date: "2 weeks ago"
      }
    ]
  },
  {
    id: 9,
    name: "Amitabh Singh",
    service: "Umpire",
    rating: 4.9,
    reviews: 178,
    reviewCount: 178,
    completedJobs: 200,
    location: "Wankhede Stadium Area",
    responseTime: "Usually responds in 2 hours",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    distance: 5.1,
    price: 1800,
    priceUnit: "match",
    coords: [80.2244, 13.0512],
    expertise: ["Laws of Cricket", "Decision Making", "Match Officiating", "Player Conduct", "Equipment Standards"],
    experience: "15 years",

    // Additional profile fields
    bio: "Certified cricket umpire with 15+ years of experience in officiating matches at all levels, from club cricket to professional tournaments.",
    about: "Certified cricket umpire with 15+ years of experience in officiating matches at all levels, from club cricket to professional tournaments.",
    cricketRole: "Cricket Umpire",
    battingStyle: "Right-handed",
    bowlingStyle: "Right-arm Medium",
    languages: "English, Hindi",
    completionRate: 99,
    skills: ["Match Officiating", "Laws of Cricket", "Decision Making", "Player Management", "Equipment Standards"],

    // Availability data
    availability: [
      { day: "Mon", available: true },
      { day: "Tue", available: true },
      { day: "Wed", available: true },
      { day: "Thu", available: true },
      { day: "Fri", available: false },
      { day: "Sat", available: true },
      { day: "Sun", available: true }
    ],

    // Services data
    services: [
      {
        id: "1",
        title: "Match Officiating",
        description: "Professional umpiring services for cricket matches with accurate decisions and fair play enforcement",
        price: "₹1,800",
        deliveryTime: "Match duration",
        features: ["Accurate Decisions", "Fair Play Enforcement", "Match Management", "Professional Conduct"],
        category: "Officiating"
      },
      {
        id: "2",
        title: "Umpiring Training",
        description: "Training programs for aspiring umpires covering laws of cricket and decision-making skills",
        price: "₹2,200",
        deliveryTime: "2 hours",
        features: ["Laws of Cricket", "Decision Training", "Practical Sessions", "Certification Guidance"],
        category: "Training"
      }
    ],

    // Portfolio data
    portfolio: [
      {
        id: "1",
        title: "Tournament Officiating",
        image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop",
        category: "Match Officiating"
      },
      {
        id: "2",
        title: "Umpiring Workshop",
        image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop",
        category: "Training"
      }
    ],

    // Experience data
    experienceDetails: [
      {
        id: "1",
        role: "Senior Cricket Umpire",
        company: "Tamil Nadu Cricket Association",
        location: "Chennai, India",
        startDate: "2009",
        isCurrent: true,
        description: "Certified umpire officiating matches at various levels including professional tournaments."
      },
      {
        id: "2",
        role: "Club Cricket Umpire",
        company: "Chennai District Cricket Association",
        location: "Chennai, India",
        startDate: "2005",
        endDate: "2009",
        isCurrent: false,
        description: "Officiated club and league matches while building experience in cricket officiating."
      }
    ],

    // Reviews data
    reviewsData: [
      {
        id: "1",
        author: "Tournament Organizer",
        role: "Event Coordinator",
        rating: 5,
        comment: "Amitabh is one of the most reliable umpires. His decisions are always fair and accurate.",
        date: "1 week ago"
      },
      {
        id: "2",
        author: "Team Captain",
        role: "Player",
        rating: 5,
        comment: "Excellent umpire with great knowledge of the laws. Always maintains professional standards.",
        date: "3 weeks ago"
      }
    ]
  },
  {
    id: 10,
    name: "Meera Iyer",
    service: "Groundsman",
    rating: 4.8,
    reviews: 145,
    reviewCount: 145,
    completedJobs: 180,
    location: "Chinnaswamy Stadium",
    responseTime: "Usually responds in 1 hour",
    image: "https://randomuser.me/api/portraits/women/10.jpg",
    distance: 3.8,
    price: 1200,
    priceUnit: "day",
    coords: [80.2707, 12.9941],
    expertise: ["Pitch Preparation", "Outfield Maintenance", "Equipment Setup", "Ground Standards", "Weather Management"],
    experience: "11 years",

    // Additional profile fields
    bio: "Experienced groundsman with 11+ years in cricket pitch preparation, ground maintenance, and facility management.",
    about: "Experienced groundsman with 11+ years in cricket pitch preparation, ground maintenance, and facility management.",
    cricketRole: "Groundsman",
    battingStyle: "Left-handed",
    bowlingStyle: "Left-arm Orthodox",
    languages: "English, Hindi, Tamil",
    completionRate: 96,
    skills: ["Pitch Preparation", "Ground Maintenance", "Equipment Setup", "Weather Management", "Facility Management"],

    // Availability data
    availability: [
      { day: "Mon", available: true },
      { day: "Tue", available: true },
      { day: "Wed", available: true },
      { day: "Thu", available: true },
      { day: "Fri", available: true },
      { day: "Sat", available: true },
      { day: "Sun", available: true }
    ],

    // Services data
    services: [
      {
        id: "1",
        title: "Pitch Preparation",
        description: "Professional pitch preparation for cricket matches including rolling, mowing, and final presentation",
        price: "₹1,200",
        deliveryTime: "Full day",
        features: ["Pitch Rolling", "Grass Cutting", "Line Marking", "Final Preparation"],
        category: "Ground Preparation"
      },
      {
        id: "2",
        title: "Ground Maintenance",
        description: "Complete ground maintenance including outfield care, drainage, and facility upkeep",
        price: "₹800",
        deliveryTime: "Half day",
        features: ["Outfield Maintenance", "Drainage Check", "Equipment Storage", "Facility Upkeep"],
        category: "Maintenance"
      }
    ],

    // Portfolio data
    portfolio: [
      {
        id: "1",
        title: "Tournament Pitch Preparation",
        image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop",
        category: "Pitch Work"
      },
      {
        id: "2",
        title: "Ground Maintenance",
        image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop",
        category: "Facility Care"
      }
    ],

    // Experience data
    experienceDetails: [
      {
        id: "1",
        role: "Head Groundsman",
        company: "Chinnaswamy Cricket Ground",
        location: "Chennai, India",
        startDate: "2013",
        isCurrent: true,
        description: "Responsible for pitch preparation and ground maintenance for competitive cricket matches."
      },
      {
        id: "2",
        role: "Groundsman",
        company: "Nehru Stadium",
        location: "Chennai, India",
        startDate: "2009",
        endDate: "2013",
        isCurrent: false,
        description: "Maintained cricket grounds and assisted in pitch preparation for various tournaments."
      }
    ],

    // Reviews data
    reviewsData: [
      {
        id: "1",
        author: "Club Secretary",
        role: "Club Official",
        rating: 5,
        comment: "Meera's pitch preparation is outstanding. The wickets are always perfect for our matches.",
        date: "2 weeks ago"
      },
      {
        id: "2",
        author: "Tournament Director",
        role: "Event Organizer",
        rating: 5,
        comment: "Reliable and professional groundsman. Her attention to detail ensures excellent playing conditions.",
        date: "1 month ago"
      }
    ]
  },
  {
    id: 11,
    name: "Suresh Menon",
    service: "Cricket Photographer",
    rating: 4.7,
    reviews: 167,
    reviewCount: 167,
    completedJobs: 190,
    location: "Feroz Shah Kotla",
    responseTime: "Usually responds in 45 mins",
    image: "https://randomuser.me/api/portraits/men/11.jpg",
    distance: 4.5,
    price: 2200,
    priceUnit: "event",
    coords: [80.2183, 12.9815],
    expertise: ["Action Photography", "Portrait Shoots", "Event Coverage", "Post-Processing", "Sports Photography"],
    experience: "8 years",

    // Additional profile fields
    bio: "Professional sports photographer specializing in cricket action shots, player portraits, and event photography with 8+ years of experience.",
    about: "Professional sports photographer specializing in cricket action shots, player portraits, and event photography with 8+ years of experience.",
    cricketRole: "Cricket Photographer",
    battingStyle: "Right-handed",
    bowlingStyle: "Right-arm Medium",
    languages: "English, Hindi, Malayalam",
    completionRate: 95,
    skills: ["Action Photography", "Portrait Photography", "Event Coverage", "Photo Editing", "Sports Photography"],

    // Availability data
    availability: [
      { day: "Mon", available: true },
      { day: "Tue", available: true },
      { day: "Wed", available: true },
      { day: "Thu", available: true },
      { day: "Fri", available: false },
      { day: "Sat", available: true },
      { day: "Sun", available: true }
    ],

    // Services data
    services: [
      {
        id: "1",
        title: "Match Photography",
        description: "Complete match photography coverage including action shots, portraits, and team photos",
        price: "₹2,200",
        deliveryTime: "2-3 days",
        features: ["Action Shots", "Portrait Photos", "Team Photos", "High Resolution", "Post-Processing"],
        category: "Event Photography"
      },
      {
        id: "2",
        title: "Player Portrait Session",
        description: "Professional portrait photography for individual players or teams",
        price: "₹1,500",
        deliveryTime: "1-2 days",
        features: ["Studio Setup", "Multiple Looks", "High Resolution", "Professional Editing"],
        category: "Portrait Photography"
      }
    ],

    // Portfolio data
    portfolio: [
      {
        id: "1",
        title: "Tournament Action Shots",
        image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop",
        category: "Action Photography"
      },
      {
        id: "2",
        title: "Player Portraits",
        image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop",
        category: "Portrait Photography"
      }
    ],

    // Experience data
    experienceDetails: [
      {
        id: "1",
        role: "Sports Photographer",
        company: "Cricket Photography Studio",
        location: "Chennai, India",
        startDate: "2016",
        isCurrent: true,
        description: "Professional sports photographer covering cricket matches, tournaments, and player photography."
      },
      {
        id: "2",
        role: "Event Photographer",
        company: "Sports Media Network",
        location: "Chennai, India",
        startDate: "2012",
        endDate: "2016",
        isCurrent: false,
        description: "Covered various sports events and provided photography services for cricket tournaments."
      }
    ],

    // Reviews data
    reviewsData: [
      {
        id: "1",
        author: "Tournament Organizer",
        role: "Event Coordinator",
        rating: 5,
        comment: "Suresh captured amazing action shots during our tournament. The quality is outstanding.",
        date: "1 week ago"
      },
      {
        id: "2",
        author: "Professional Player",
        role: "Cricketer",
        rating: 5,
        comment: "Great photographer. My portraits turned out amazing and captured my personality perfectly.",
        date: "2 weeks ago"
      }
    ]
  },
  {
    id: 12,
    name: "Deepika Nair",
    service: "Scorer",
    rating: 4.9,
    reviews: 210,
    reviewCount: 210,
    completedJobs: 245,
    location: "Green Park Stadium",
    responseTime: "Usually responds in 2 hours",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
    distance: 3.2,
    price: 800,
    priceUnit: "match",
    coords: [80.2244, 13.0387],
    expertise: ["Scorekeeping", "Match Statistics", "Digital Scoring", "Rules Compliance", "Data Management"],
    experience: "6 years",

    // Additional profile fields
    bio: "Professional cricket scorer with 6+ years of experience in accurate scorekeeping, match statistics, and digital scoring systems.",
    about: "Professional cricket scorer with 6+ years of experience in accurate scorekeeping, match statistics, and digital scoring systems.",
    cricketRole: "Cricket Scorer",
    battingStyle: "Right-handed",
    bowlingStyle: "Right-arm Medium",
    languages: "English, Hindi, Malayalam",
    completionRate: 99,
    skills: ["Scorekeeping", "Digital Scoring", "Match Statistics", "Data Management", "Rules Compliance"],

    // Availability data
    availability: [
      { day: "Mon", available: true },
      { day: "Tue", available: true },
      { day: "Wed", available: true },
      { day: "Thu", available: true },
      { day: "Fri", available: true },
      { day: "Sat", available: true },
      { day: "Sun", available: true }
    ],

    // Services data
    services: [
      {
        id: "1",
        title: "Match Scoring",
        description: "Professional match scoring service with accurate record-keeping and real-time statistics",
        price: "₹800",
        deliveryTime: "Match duration",
        features: ["Accurate Scoring", "Real-time Updates", "Match Statistics", "Score Sheets"],
        category: "Scoring Services"
      },
      {
        id: "2",
        title: "Tournament Scoring",
        description: "Complete tournament scoring services including statistics compilation and final reports",
        price: "₹1,200",
        deliveryTime: "Tournament duration",
        features: ["Tournament Stats", "Player Records", "Team Statistics", "Final Reports"],
        category: "Tournament Services"
      }
    ],

    // Portfolio data
    portfolio: [
      {
        id: "1",
        title: "Tournament Statistics",
        image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop",
        category: "Statistics"
      },
      {
        id: "2",
        title: "Match Score Sheets",
        image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop",
        category: "Scorekeeping"
      }
    ],

    // Experience data
    experienceDetails: [
      {
        id: "1",
        role: "Professional Scorer",
        company: "Green Park Cricket Club",
        location: "Chennai, India",
        startDate: "2018",
        isCurrent: true,
        description: "Lead scorer for competitive matches and tournaments with expertise in digital scoring systems."
      },
      {
        id: "2",
        role: "Match Scorer",
        company: "Chennai District Cricket Association",
        location: "Chennai, India",
        startDate: "2016",
        endDate: "2018",
        isCurrent: false,
        description: "Provided scoring services for club matches and assisted in tournament organization."
      }
    ],

    // Reviews data
    reviewsData: [
      {
        id: "1",
        author: "Tournament Director",
        role: "Event Organizer",
        rating: 5,
        comment: "Deepika's scoring is always 100% accurate. Her attention to detail is remarkable.",
        date: "1 week ago"
      },
      {
        id: "2",
        author: "Team Manager",
        role: "Club Official",
        rating: 5,
        comment: "Reliable and professional scorer. Her statistics reports are comprehensive and accurate.",
        date: "2 weeks ago"
      }
    ]
  }
];

// Add coordinates for map markers
export const professionalCoordinates = professionals.map(pro => ({
  id: pro.id,
  name: pro.name,
  service: pro.service,
  coords: [
    // Chennai area coordinates
    80.2707 + (Math.random() - 0.5) * 0.1, // Longitude
    13.0827 + (Math.random() - 0.5) * 0.1  // Latitude
  ] as [number, number]
})); 