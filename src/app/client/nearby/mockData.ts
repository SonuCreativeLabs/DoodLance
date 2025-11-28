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
  coverImage?: string; // New field for unique cover images

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
    description?: string;
    skills?: string[];
    url?: string;
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
    location: "T. Nagar",
    responseTime: "Usually responds in 30 mins",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    distance: 1.2,
    price: 800,
    priceUnit: "session",
    coords: [80.2095, 13.0850],
    expertise: ["Pace Bowling", "Yorkers", "Bouncers", "Death Overs", "Line & Length"],
    experience: "8 years",
    coverImage: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&h=400&fit=crop", // Cricket stadium action

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
        price: "₹800",
        deliveryTime: "2 hours",
        features: ["Technique Analysis", "Power Development", "Accuracy Drills", "Video Feedback"],
        category: "Net Bowler"
      },
      {
        id: "2",
        title: "Death Overs Specialist Training",
        description: "Specialized training for death overs bowling with focus on yorkers, bouncers, and pressure situations",
        price: "₹1,200",
        deliveryTime: "2.5 hours",
        features: ["Death Overs Strategy", "Yorker Practice", "Bouncer Control", "Mental Training"],
        category: "Net Bowler"
      },
      {
        id: "3",
        title: "Young Player Development",
        description: "Coaching program for aspiring fast bowlers aged 12-18 with focus on fundamentals and technique",
        price: "₹600",
        deliveryTime: "1.5 hours",
        features: ["Basic Technique", "Fitness Training", "Mental Preparation", "Progress Tracking"],
        category: "Coach"
      }
    ],

    // Portfolio data
    portfolio: [
      {
        id: "1",
        title: "Pace Bowling Workshop",
        image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400&h=300&fit=crop",
        category: "Training Session",
        description: "Comprehensive 3-day pace bowling workshop covering advanced techniques, power development, and death overs strategy. Trained 25+ players with focus on yorkers, bouncers, and line & length accuracy.",
        skills: ["Pace Bowling", "Death Overs", "Yorkers", "Bouncers", "Technique Analysis", "Player Development"]
      },
      {
        id: "2",
        title: "Death Overs Clinic",
        image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop",
        category: "Specialized Training",
        description: "Intensive death overs training program for competitive players. Focus on high-pressure situations, yorker variations, and psychological preparation for crucial overs in matches.",
        skills: ["Death Overs", "Yorkers", "Pressure Performance", "Mental Training", "Match Strategy"]
      },
      {
        id: "3",
        title: "Youth Bowling Camp",
        image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop",
        category: "Youth Development",
        description: "Summer youth development camp for aspiring fast bowlers aged 12-16. Covered fundamental techniques, fitness training, and mental preparation with 98% participant satisfaction rate.",
        skills: ["Youth Coaching", "Basic Technique", "Fitness Training", "Mental Preparation", "Player Development"]
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
        location: "T. Nagar, Chennai",
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
    location: "T. Nagar",
    responseTime: "Usually responds in 1 hour",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
    distance: 2.1,
    price: 1200,
    priceUnit: "session",
    coords: [80.2341, 13.0418],
    expertise: ["Footwork Drills", "Shot Selection", "Mental Training", "Technique Analysis", "Pressure Situations"],
    experience: "10 years",
    coverImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=400&fit=crop", // Cricket training ground

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
        price: "₹1,200",
        deliveryTime: "2 hours",
        features: ["Technique Analysis", "Footwork Drills", "Shot Selection", "Mental Training"],
        category: "Batting Training"
      },
      {
        id: "2",
        title: "Pressure Performance Training",
        description: "Specialized training for performing under pressure situations with mental conditioning and visualization techniques",
        price: "₹1,500",
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
        category: "Training Session",
        description: "Elite batting clinic for professional and semi-professional players. Covered advanced footwork techniques, shot selection strategies, and performance under pressure. Improved players' average by 15-20 runs per innings.",
        skills: ["Batting Technique", "Footwork Drills", "Shot Selection", "Pressure Performance", "Mental Training"]
      },
      {
        id: "2",
        title: "Youth Batting Workshop",
        image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop",
        category: "Youth Development",
        description: "Comprehensive youth development program for young batsmen aged 10-15. Focus on building fundamentals, confidence, and technique. 90% of participants showed significant improvement in their game.",
        skills: ["Youth Coaching", "Basic Technique", "Confidence Building", "Fundamentals", "Player Development"]
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
    name: "Arun Patel",
    service: "Sidearm Specialist",
    rating: 4.8,
    reviews: 189,
    reviewCount: 189,
    completedJobs: 267,
    location: "Mylapore",
    responseTime: "Usually responds in 45 mins",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    distance: 3.4,
    price: 500,
    priceUnit: "match",
    coords: [80.2785, 13.0633],
    expertise: ["Glove Work", "Stumping", "Standing Up to Pace/Spin", "Catching Drills", "Wicket-keeping Technique"],
    experience: "7 years",
    coverImage: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=1200&h=400&fit=crop", // Cricket wicket keeping action

    // Additional profile fields
    bio: "Professional wicket-keeper with 7+ years of experience. Expert in glove work, stumping techniques, and keeping up to both pace and spin bowlers.",
    about: "Professional wicket-keeper with 7+ years of experience. Expert in glove work, stumping techniques, and keeping up to both pace and spin bowlers.",
    cricketRole: "WK-Batsman",
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
        price: "₹700",
        deliveryTime: "2 hours",
        features: ["Glove Work Drills", "Footwork Training", "Catching Practice", "Stumping Technique"],
        category: "Coach"
      },
      {
        id: "2",
        title: "Match Wicket-keeping",
        description: "Professional wicket-keeping services for club and league matches",
        price: "₹900",
        deliveryTime: "Match duration",
        features: ["Match Experience", "Professional Conduct", "Equipment Provided", "Match Statistics"],
        category: "Match Player"
      }
    ],

    // Portfolio data
    portfolio: [
      {
        id: "1",
        title: "Wicket-keeping Clinic",
        image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop",
        category: "Training Session",
        description: "Comprehensive wicket-keeping training program covering glove work, footwork, catching techniques, and stumping. Trained 30+ players with focus on both pace and spin bowling scenarios.",
        skills: ["Wicket-keeping Technique", "Glove Work", "Footwork", "Catching", "Stumping", "Pace/Spin Handling"]
      },
      {
        id: "2",
        title: "Match Day Action",
        image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop",
        category: "Match Coverage",
        description: "Professional wicket-keeping services for competitive matches. Maintained 95% catch success rate and contributed to team's success in multiple tournaments with crucial stumpings.",
        skills: ["Match Wicket-keeping", "High Pressure Performance", "Team Coordination", "Quick Reflexes"]
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
        location: "Mylapore, Chennai",
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
    location: "Kodambakkam",
    responseTime: "Usually responds in 2 hours",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
    distance: 1.8,
    price: 900,
    priceUnit: "session",
    coords: [80.2687, 13.0368],
    expertise: ["Off Spin", "Doosra", "Carrom Ball", "Flight & Drift", "Googly Variations"],
    experience: "9 years",
    coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=400&fit=crop", // Cricket spin bowling

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
        price: "₹900",
        deliveryTime: "2 hours",
        features: ["Off Spin Technique", "Doosra Variations", "Flight & Drift", "Mental Approach"],
        category: "Net Bowler"
      },
      {
        id: "2",
        title: "Youth Spin Development",
        description: "Specialized coaching for young spinners focusing on fundamentals and technique building",
        price: "₹700",
        deliveryTime: "1.5 hours",
        features: ["Basic Technique", "Grip & Release", "Flight Control", "Confidence Building"],
        category: "Coach"
      }
    ],

    // Portfolio data
    portfolio: [
      {
        id: "1",
        title: "Spin Bowling Workshop",
        image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop",
        category: "Training Session",
        description: "Advanced spin bowling workshop covering off-spin, doosra, carrom ball, and various spin variations. Trained 20+ players with emphasis on flight, drift, and deceptive bowling techniques.",
        skills: ["Off Spin", "Doosra", "Carrom Ball", "Flight", "Drift", "Spin Variations"]
      },
      {
        id: "2",
        title: "Doosra Clinic",
        image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop",
        category: "Specialized Training",
        description: "Specialized training program for mastering the doosra delivery. Focus on grip variations, release points, and deception techniques. Helped players develop match-winning variations.",
        skills: ["Doosra", "Deception Techniques", "Grip Variations", "Release Points", "Match Strategy"]
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
    location: "Velachery",
    responseTime: "Usually responds in 1 hour",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
    distance: 2.7,
    price: 1500,
    priceUnit: "analysis",
    coords: [80.2574, 13.0012],
    expertise: ["Performance Analysis", "Video Breakdown", "Statistical Modeling", "Strategy Development", "Player Assessment"],
    experience: "6 years",
    coverImage: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=1200&h=400&fit=crop", // Cricket analysis/statistics

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
        price: "₹1,500",
        deliveryTime: "3-5 days",
        features: ["Video Analysis", "Statistical Report", "Strategy Recommendations", "Performance Insights"],
        category: "Analyst"
      },
      {
        id: "2",
        title: "Match Strategy Planning",
        description: "Strategic planning and opponent analysis for upcoming matches with detailed game plans",
        price: "₹1,800",
        deliveryTime: "2-3 days",
        features: ["Opponent Analysis", "Game Strategy", "Player Roles", "Tactical Planning"],
        category: "Analyst"
      }
    ],

    // Portfolio data
    portfolio: [
      {
        id: "1",
        title: "Tournament Analysis Report",
        image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop",
        category: "Analysis Report",
        description: "Comprehensive performance analysis report for a major inter-state tournament. Included player statistics, team strategies, and performance predictions. Helped teams improve by 25% in subsequent matches.",
        skills: ["Performance Analysis", "Statistical Modeling", "Player Assessment", "Strategic Planning", "Data Visualization"]
      },
      {
        id: "2",
        title: "Player Performance Dashboard",
        image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop",
        category: "Data Visualization",
        description: "Interactive performance dashboard for individual players tracking batting/bowling statistics, consistency metrics, and improvement trends. Used by coaches for player development planning.",
        skills: ["Data Analysis", "Performance Metrics", "Dashboard Design", "Player Development", "Statistics"]
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
    location: "Kodambakkam",
    responseTime: "Usually responds in 3 hours",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    distance: 4.2,
    price: 1500,
    priceUnit: "session",
    coords: [80.2532, 13.0336],
    expertise: ["Injury Prevention", "Rehabilitation", "Sports Massage", "Strength Training", "Recovery Protocols"],
    experience: "5 years",
    coverImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=400&fit=crop", // Sports physiotherapy

    // Additional profile fields
    bio: "Certified sports physiotherapist specializing in cricket injuries, rehabilitation, and performance enhancement for athletes at all levels.",
    about: "Certified sports physiotherapist specializing in cricket injuries, rehabilitation, and performance enhancement for athletes at all levels.",
    cricketRole: "Physiotherapist",
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
        category: "Physio"
      },
      {
        id: "2",
        title: "Injury Rehabilitation Program",
        description: "Structured rehabilitation program for cricket-related injuries with progressive exercises and monitoring",
        price: "₹1,800",
        deliveryTime: "4-6 weeks",
        features: ["Custom Program", "Progress Monitoring", "Strength Training", "Return to Play"],
        category: "Physio"
      }
    ],

    // Portfolio data
    portfolio: [
      {
        id: "1",
        title: "Injury Recovery Case Study",
        image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop",
        category: "Rehabilitation",
        description: "Complex shoulder injury rehabilitation case study. Successfully treated professional cricketer with rotator cuff injury using advanced physiotherapy techniques. Player returned to competitive cricket in 8 weeks.",
        skills: ["Injury Rehabilitation", "Sports Physiotherapy", "Manual Therapy", "Exercise Prescription", "Recovery Protocols"]
      },
      {
        id: "2",
        title: "Sports Massage Session",
        image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop",
        category: "Treatment",
        description: "Specialized sports massage therapy for cricket players. Focus on muscle recovery, injury prevention, and performance enhancement. Served 50+ players with 95% satisfaction rate.",
        skills: ["Sports Massage", "Muscle Recovery", "Injury Prevention", "Performance Enhancement", "Manual Therapy"]
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
    location: "Adyar",
    responseTime: "Usually responds in 30 mins",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    distance: 3.5,
    price: 1800,
    priceUnit: "event",
    coords: [80.2242, 13.0569],
    expertise: ["Live Commentary", "Match Analysis", "Player Insights", "Technical Knowledge", "Event Hosting"],
    experience: "12 years",
    coverImage: "https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=1200&h=400&fit=crop", // Cricket commentary/broadcasting

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
        price: "₹1,800",
        deliveryTime: "Match duration",
        features: ["Live Commentary", "Expert Analysis", "Player Insights", "Engaging Narration"],
        category: "Commentator"
      },
      {
        id: "2",
        title: "Event Hosting & MC",
        description: "Professional hosting for cricket events, tournaments, and award ceremonies",
        price: "₹1,500",
        deliveryTime: "Event duration",
        features: ["Event Hosting", "Ceremony Management", "Audience Engagement", "Professional Presentation"],
        category: "Commentator"
      }
    ],

    // Portfolio data
    portfolio: [
      {
        id: "1",
        title: "Tournament Final Commentary",
        image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop",
        category: "Live Commentary",
        description: "Live commentary for the TNCA Senior Division Final match. Provided expert analysis, player insights, and engaging narration throughout the match. Broadcast reached 10,000+ viewers with 92% viewer satisfaction.",
        skills: ["Live Commentary", "Match Analysis", "Player Insights", "Technical Knowledge", "Broadcasting"]
      },
      {
        id: "2",
        title: "Award Ceremony Hosting",
        image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop",
        category: "Event Hosting",
        description: "Professional hosting for the Chennai Cricket League Awards Ceremony. Managed event flow, presented awards, and engaged with 200+ attendees. Received excellent feedback for presentation and audience engagement.",
        skills: ["Event Hosting", "Ceremony Management", "Audience Engagement", "Professional Presentation", "Public Speaking"]
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
    location: "Anna Nagar",
    responseTime: "Usually responds in 1 hour",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
    distance: 2.9,
    price: 1300,
    priceUnit: "project",
    coords: [80.2707, 13.0524],
    expertise: ["Social Media Content", "Video Editing", "Highlight Reels", "Player Profiles", "Match Coverage"],
    experience: "4 years",
    coverImage: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&h=400&fit=crop", // Digital content creation

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
        price: "₹1,300",
        deliveryTime: "3-5 days",
        features: ["Video Editing", "Music & Effects", "Professional Quality", "Multiple Formats"],
        category: "Cricket Content Creator"
      },
      {
        id: "2",
        title: "Social Media Content Package",
        description: "Complete social media content strategy including posts, stories, and promotional materials",
        price: "₹1,600",
        deliveryTime: "1 week",
        features: ["Content Strategy", "Graphic Design", "Posting Schedule", "Engagement Optimization"],
        category: "Cricket Content Creator"
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
    location: "Tambaram",
    responseTime: "Usually responds in 2 hours",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    distance: 5.1,
    price: 550,
    priceUnit: "match",
    coords: [80.2244, 13.0512],
    expertise: ["Laws of Cricket", "Decision Making", "Match Officiating", "Player Conduct", "Equipment Standards"],
    experience: "15 years",
    coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=400&fit=crop", // Cricket umpiring/officiating

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
        price: "₹550",
        deliveryTime: "Match duration",
        features: ["Accurate Decisions", "Fair Play Enforcement", "Match Management", "Professional Conduct"],
        category: "Umpire"
      },
      {
        id: "2",
        title: "Umpiring Training",
        description: "Training programs for aspiring umpires covering laws of cricket and decision-making skills",
        price: "₹700",
        deliveryTime: "2 hours",
        features: ["Laws of Cricket", "Decision Training", "Practical Sessions", "Certification Guidance"],
        category: "Coach"
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
    location: "Porur",
    responseTime: "Usually responds in 1 hour",
    image: "https://randomuser.me/api/portraits/women/10.jpg",
    distance: 3.8,
    price: 1200,
    priceUnit: "day",
    coords: [80.2707, 12.9941],
    expertise: ["Pitch Preparation", "Outfield Maintenance", "Equipment Setup", "Ground Standards", "Weather Management"],
    experience: "11 years",
    coverImage: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=1200&h=400&fit=crop", // Cricket ground maintenance

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
        category: "Other"
      },
      {
        id: "2",
        title: "Ground Maintenance",
        description: "Complete ground maintenance including outfield care, drainage, and facility upkeep",
        price: "₹800",
        deliveryTime: "Half day",
        features: ["Outfield Maintenance", "Drainage Check", "Equipment Storage", "Facility Upkeep"],
        category: "Other"
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
    price: 700,
    priceUnit: "event",
    coords: [80.2183, 12.9815],
    expertise: ["Action Photography", "Portrait Shoots", "Event Coverage", "Post-Processing", "Sports Photography"],
    experience: "8 years",
    coverImage: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1200&h=400&fit=crop", // Sports photography

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
        price: "₹1,900",
        deliveryTime: "2-3 days",
        features: ["Action Shots", "Portrait Photos", "Team Photos", "High Resolution", "Post-Processing"],
        category: "Cricket Photo / Videography"
      },
      {
        id: "2",
        title: "Player Portrait Session",
        description: "Professional portrait photography for individual players or teams",
        price: "₹1,200",
        deliveryTime: "1-2 days",
        features: ["Studio Setup", "Multiple Looks", "High Resolution", "Professional Editing"],
        category: "Cricket Photo / Videography"
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
    price: 400,
    priceUnit: "match",
    coords: [80.2244, 13.0387],
    expertise: ["Scorekeeping", "Match Statistics", "Digital Scoring", "Rules Compliance", "Data Management"],
    experience: "6 years",
    coverImage: "https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=1200&h=400&fit=crop", // Cricket scoring/statistics

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
        price: "₹400",
        deliveryTime: "Match duration",
        features: ["Accurate Scoring", "Real-time Updates", "Match Statistics", "Score Sheets"],
        category: "Scorer"
      },
      {
        id: "2",
        title: "Tournament Scoring",
        description: "Complete tournament scoring services including statistics compilation and final reports",
        price: "₹600",
        deliveryTime: "Tournament duration",
        features: ["Tournament Stats", "Player Records", "Team Statistics", "Final Reports"],
        category: "Scorer"
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
  },
  // Test profile - User's freelancer account (Sathishraj)
  {
    id: 99,
    name: "Sathishraj",
    service: "All Rounder",
    rating: 4.9,
    reviews: 6,
    reviewCount: 6,
    completedJobs: 45,
    location: "Chennai",
    responseTime: "Usually responds in 15 mins",
    image: "/images/profile-sonu.jpg",
    distance: 0.5,
    price: 500,
    priceUnit: "session",
    coords: [80.2207, 12.9815],
    expertise: ["RH Batsman", "Sidearm Specialist", "Off Spin", "Batting Coach", "Analyst", "Mystery Spin"],
    experience: "9 years",
    coverImage: "/images/cover-pic.JPG",

    // Additional profile fields
    bio: "Professional Cricketer & AI Engineer with a passion for technology and sports. I bring the same dedication and strategic thinking from the cricket field to developing intelligent AI solutions.",
    about: "Professional Cricketer & AI Engineer with a passion for technology and sports. I bring the same dedication and strategic thinking from the cricket field to developing intelligent AI solutions.",
    cricketRole: "All Rounder",
    battingStyle: "Right-handed",
    bowlingStyle: "Right-arm Off Spin",
    languages: "English, Tamil, Hindi",
    completionRate: 98,
    skills: ["RH Batsman", "Sidearm Specialist", "Off Spin", "Batting Coach", "Analyst", "Mystery Spin"],

    // Availability data
    availability: [
      { day: "Mon", available: true },
      { day: "Tue", available: true },
      { day: "Wed", available: true },
      { day: "Thu", available: true },
      { day: "Fri", available: true },
      { day: "Sat", available: true },
      { day: "Sun", available: false }
    ],

    // Services data - Actual services from profile
    services: [
      {
        id: "1",
        title: "Net Bowling Sessions",
        description: "Professional net bowling sessions with personalized coaching",
        price: "₹500",
        deliveryTime: "1 hour",
        features: ["1-hour net session", "Ball analysis", "Technique improvement", "Q&A session"],
        category: "Net Bowler"
      },
      {
        id: "2",
        title: "Match Player",
        description: "Professional match player ready to play for your team per match",
        price: "₹1,500",
        deliveryTime: "Per match",
        features: ["Full match participation", "Team contribution", "Match commitment", "Performance guarantee"],
        category: "Match Player"
      },
      {
        id: "3",
        title: "Match Videography",
        description: "Professional match videography and reel content creation during games",
        price: "₹800",
        deliveryTime: "Same day",
        features: ["Full match recording", "Highlight reel creation", "Social media content", "Priority editing"],
        category: "Cricket Photo / Videography"
      },
      {
        id: "4",
        title: "Sidearm Bowling",
        description: "Professional sidearm bowler delivering 140km/h+ speeds for practice sessions",
        price: "₹1,500",
        deliveryTime: "per hour",
        features: ["140km/h+ sidearm bowling", "Practice session delivery", "Consistent speed & accuracy", "Training session support"],
        category: "Sidearm specialist"
      },
      {
        id: "5",
        title: "Batting Coaching",
        description: "Professional batting technique training and skill development",
        price: "₹1,200",
        deliveryTime: "per hour",
        features: ["Batting technique analysis", "Footwork drills", "Shot selection training", "Mental preparation coaching"],
        category: "Batting coach"
      },
      {
        id: "6",
        title: "Performance Analysis",
        description: "Comprehensive cricket performance analysis and improvement recommendations",
        price: "₹2,000",
        deliveryTime: "2-3 weeks",
        features: ["Match statistics review", "Strength/weakness analysis", "Improvement recommendations", "Progress tracking"],
        category: "Analyst"
      }
    ],

    // Portfolio data - Actual achievements from profile
    portfolio: [
      {
        id: "1",
        title: "3x Division Cricket Champion",
        image: "/images/purple nets.png",
        category: "Cricket Achievement",
        description: "Won the Division Level Cricket Tournament three consecutive years (2020, 2021, 2022) as a top-order batsman and off-spin bowler. Demonstrated exceptional leadership and performance under pressure.",
        skills: ["Cricket", "Leadership", "Batting", "Off-Spin Bowling", "Team Player"]
      },
      {
        id: "2",
        title: "State Level College Champion",
        image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        category: "Cricket Achievement",
        description: "Led college team to victory in the State Level Inter-College Cricket Tournament. Scored 3 consecutive half-centuries in the knockout stages and took crucial wickets in the final match.",
        skills: ["Cricket", "Strategy", "Batting", "Bowling"]
      },
      {
        id: "3",
        title: "Sports Quota Scholar",
        image: "/images/Purple ground.png",
        category: "Academic Achievement",
        description: "Awarded sports scholarship for outstanding cricket performance at the state level. Balanced academic responsibilities with rigorous training schedules while maintaining excellent performance in both areas.",
        skills: ["Cricket", "Time Management", "Academics"]
      },
      {
        id: "4",
        title: "Cricket Performance Analytics",
        image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        category: "Cricket Analytics",
        description: "Developed comprehensive cricket performance analytics tracking player statistics, match data, and performance metrics. Created detailed reports for coaches and players to improve game strategies.",
        skills: ["Cricket Analytics", "Performance Metrics", "Data Analysis", "Strategy"]
      },
      {
        id: "5",
        title: "Live Cricket Scoring System",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        category: "Cricket Technology",
        description: "Built a real-time cricket scoring platform that tracks live match statistics, player performance, and generates comprehensive match reports. Used by local cricket clubs for tournament management.",
        skills: ["Cricket Scoring", "Live Analytics", "Match Management", "Data Visualization"]
      }
    ],

    // Experience data - Actual experience from profile
    experienceDetails: [
      {
        id: "1",
        role: "Cricketer (All-Rounder)",
        company: "Professional Cricket",
        location: "India",
        startDate: "2015",
        isCurrent: true,
        description: "Professional cricketer specializing in top-order batting and off-spin bowling. Experienced in high-pressure matches with a focus on building strong team performances."
      },
      {
        id: "2",
        role: "Cricket Performance Consultant",
        company: "Freelance Cricket Services",
        location: "India",
        startDate: "2020",
        isCurrent: true,
        description: "Providing cricket performance analysis and consulting services. Specializing in match strategy, player development, and team performance optimization."
      },
      {
        id: "3",
        role: "Cricket Coach",
        company: "Local Academy",
        location: "India",
        startDate: "2018",
        endDate: "2020",
        isCurrent: false,
        description: "Coached young cricketers in batting techniques, bowling skills, and match strategies. Helped develop the next generation of cricket talent."
      }
    ],

    // Reviews data - Actual reviews from profile
    reviewsData: [
      {
        id: "1",
        author: "Rahul Sharma",
        role: "U-19 Cricket Team Captain",
        rating: 5,
        comment: "Sonu transformed my batting technique completely. His one-on-one sessions helped me improve my average by 35% in just 3 months. His knowledge of the game is exceptional!",
        date: "2024-05-10"
      },
      {
        id: "2",
        author: "Vikram Singh",
        role: "Cricket Academy Director",
        rating: 5,
        comment: "As a coach, Sonu has a unique ability to identify and correct technical flaws. Our academy players have shown remarkable improvement under his guidance.",
        date: "2024-03-25"
      },
      {
        id: "3",
        author: "Arjun Mehta",
        role: "Professional Cricketer",
        rating: 5,
        comment: "The best off-spin coach I've worked with. His insights into bowling variations and game situations have taken my bowling to the next level.",
        date: "2024-01-30"
      },
      {
        id: "4",
        author: "Karan Patel",
        role: "District Cricket Team Coach",
        rating: 5,
        comment: "Sonu's cricket analytics service helped our team win the district championship. His performance data and strategic insights were crucial in our success.",
        date: "2024-02-15"
      },
      {
        id: "5",
        author: "Priya Sharma",
        role: "Women's Cricket Captain",
        rating: 5,
        comment: "Sonu coached our women's cricket team and the improvement was incredible. His training methods and mental coaching techniques helped us secure the state finals.",
        date: "2023-12-10"
      },
      {
        id: "6",
        author: "Rajesh Kumar",
        role: "Cricket Club President",
        rating: 5,
        comment: "Our club hired Sonu for performance analysis and team development. His live scoring system and match analytics have revolutionized how we prepare for tournaments.",
        date: "2023-11-05"
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