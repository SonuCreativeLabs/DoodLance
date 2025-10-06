export const sidebarCategories = [
  {
    id: 'all',
    name: ['All', 'Services'],
    icon: '✨'
  },
  {
    id: 'playing',
    name: ['Playing', 'Services'],
    icon: '🏏'
  },
  {
    id: 'coaching',
    name: ['Coaching &', 'Training'],
    icon: '👨‍🏫'
  },
  {
    id: 'support',
    name: ['Support', 'Staff'],
    icon: '📊'
  },
  {
    id: 'media',
    name: ['Media &', 'Content'],
    icon: '📷'
  }
]

export const serviceItems = [
  // Playing Services (4)
  {
    id: 'match-player',
    name: 'Match Player',
    category: 'playing',
    providerCount: 45,
    mostBooked: true,
    image: '/images/Bowler & batsman.png',
    icon: '🏏',
    description: 'Professional cricket players available for matches and tournaments'
  },
  {
    id: 'net-bowler',
    name: 'Net Bowler',
    category: 'playing',
    providerCount: 38,
    mostBooked: true,
    image: '/images/Bowler & batsman.png',
    icon: '🎯',
    description: 'Skilled bowlers for net practice sessions and training'
  },
  {
    id: 'net-batsman',
    name: 'Net Batsman',
    category: 'playing',
    providerCount: 32,
    image: '/images/Bowler & batsman.png',
    icon: '🏏',
    description: 'Experienced batsmen for practice sessions and training'
  },
  {
    id: 'sidearm-specialist',
    name: 'Sidearm',
    category: 'playing',
    providerCount: 22,
    image: '/images/women sidearm.png',
    icon: '🎯',
    description: 'Sidearm specialists for realistic bowling simulation'
  },

  // Coaching & Training (3)
  {
    id: 'coach',
    name: 'Coach',
    category: 'coaching',
    providerCount: 35,
    mostBooked: true,
    image: '/images/personal coaching.png',
    icon: '👨‍🏫',
    description: 'Professional cricket coaches for all skill levels'
  },
  {
    id: 'sports-conditioning-trainer',
    name: 'Sports Conditioning Trainer',
    category: 'coaching',
    providerCount: 28,
    image: '/images/Bowler & batsman.png',
    icon: '💪',
    description: 'Specialized trainers for cricket-specific conditioning'
  },
  {
    id: 'fitness-trainer',
    name: 'Fitness Trainer',
    category: 'coaching',
    providerCount: 32,
    image: '/images/Bowler & batsman.png',
    icon: '🏃‍♂️',
    description: 'General fitness trainers with cricket expertise'
  },

  // Support Staff (4)
  {
    id: 'analyst',
    name: 'Analyst',
    category: 'support',
    providerCount: 18,
    image: '/images/Bowler & batsman.png',
    icon: '📊',
    description: 'Cricket analysts for performance and match analysis'
  },
  {
    id: 'physio',
    name: 'Physio',
    category: 'support',
    providerCount: 25,
    image: '/images/Bowler & batsman.png',
    icon: '🏥',
    description: 'Sports physiotherapists specializing in cricket injuries'
  },
  {
    id: 'scorer',
    name: 'Scorer',
    category: 'support',
    providerCount: 15,
    image: '/images/Bowler & batsman.png',
    icon: '📝',
    description: 'Professional cricket scorers for matches and tournaments'
  },
  {
    id: 'umpire',
    name: 'Umpire',
    category: 'support',
    providerCount: 20,
    image: '/images/Bowler & batsman.png',
    icon: '⚖️',
    description: 'Certified cricket umpires for matches and tournaments'
  },

  // Media & Content (3)
  {
    id: 'cricket-photo-videography',
    name: 'Cricket Photo / Videography',
    category: 'media',
    providerCount: 30,
    mostBooked: true,
    image: '/images/Bowler & batsman.png',
    icon: '📷',
    description: 'Professional cricket photography and videography services'
  },
  {
    id: 'cricket-content-creator',
    name: 'Cricket Content Creator',
    category: 'media',
    providerCount: 24,
    image: '/images/Bowler & batsman.png',
    icon: '🎬',
    description: 'Content creators specializing in cricket media and social content'
  },
  {
    id: 'commentator',
    name: 'Commentator',
    category: 'media',
    providerCount: 16,
    image: '/images/Bowler & batsman.png',
    icon: '🎤',
    description: 'Professional cricket commentators for matches and events'
  }
]

// Popular services for home page
export const popularServices = [
  // Top cricket services
  {
    id: 'net-bowler',
    title: 'Net Bowler',
    icon: '🎯',
    providerCount: 38,
    image: '/images/Bowler & batsman.png',
    mostBooked: true
  },
  {
    id: 'sidearm-specialist',
    title: 'Sidearm',
    icon: '🎯',
    providerCount: 22,
    image: '/images/women sidearm.png',
    mostBooked: true
  },
  {
    id: 'coach',
    title: 'Coach',
    icon: '👨‍🏫',
    providerCount: 35,
    image: '/images/personal coaching.png',
    mostBooked: true
  },
  {
    id: 'match-player',
    title: 'Match Player',
    icon: '🏏',
    providerCount: 45,
    image: '/images/Bowler & batsman.png',
    mostBooked: true
  },
  {
    id: 'cricket-photo-videography',
    title: 'Cricket Photo / Videography',
    icon: '📷',
    providerCount: 30,
    image: '/images/Bowler & batsman.png',
    mostBooked: true
  }
]