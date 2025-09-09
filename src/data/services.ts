export const sidebarCategories = [
  {
    id: 'all',
    name: ['All', ''],
    icon: '✨'
  },
  {
    id: 'content',
    name: ['Content', 'Creation'],
    icon: '🎬'
  },
  {
    id: 'photography',
    name: ['Photo &', 'Product'],
    icon: '📷'
  },
  {
    id: 'sports-fitness',
    name: ['Sports &', 'Fitness'],
    icon: '🏋️'
  },
  {
    id: 'ai-services',
    name: ['AI', 'Services'],
    icon: '🤖'
  },
  {
    id: 'professional-services',
    name: ['Professional', 'Services'],
    icon: '💼'
  },
  {
    id: 'podcasting',
    name: ['Podcast', 'Studio'],
    icon: '🎙️'
  },
  {
    id: 'streaming',
    name: ['Streaming', 'Setup'],
    icon: '📡'
  }
]

export const serviceItems = [
  // Content Creation
  {
    id: 'content-shoots',
    name: 'Content Shoots',
    category: 'content',
    providerCount: 40,
    mostBooked: true,
    image: '/images/professional shoots.jpeg',
    icon: '🎬'
  },
  {
    id: 'event-content-creator',
    name: 'Event Content Creator',
    category: 'content',
    providerCount: 26,
    image: '/images/Event production.jpeg',
    icon: '📹'
  },

  // Photography / Product
  {
    id: 'product-photography',
    name: 'Product Photography',
    category: 'photography',
    providerCount: 35,
    discount: '10% Off',
    image: '/images/professional shoots.jpeg',
    icon: '📦'
  },
  {
    id: 'drone-photography',
    name: 'Drone Photography',
    category: 'photography',
    providerCount: 18,
    image: '/images/drone.jpeg',
    icon: '🚁',
    mostBooked: true
  },
  {
    id: 'fashion-photography',
    name: 'Fashion Photography',
    category: 'photography',
    providerCount: 29,
    image: '/images/modeling.jpeg',
    icon: '👗',
    mostBooked: true
  },
  {
    id: 'sports-photo-videography',
    name: 'Sports Photo & Videography',
    category: 'sports-media',
    providerCount: 22,
    image: '/images/Bowler & batsman.png',
    icon: '🏏',
    mostBooked: true
  },

  // Podcasting
  {
    id: 'podcast-editing',
    name: 'Podcast Editing',
    category: 'podcasting',
    providerCount: 29,
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80',
    icon: '🎧'
  },
  {
    id: 'podcast-shooting',
    name: 'Podcast Shooting',
    category: 'podcasting',
    providerCount: 18,
    image: 'https://images.unsplash.com/photo-1589985270826-4b76a6363a4b?auto=format&fit=crop&w=800&q=80',
    icon: '🎙️'
  },

  // Streaming & Setup
  {
    id: 'streaming-setup-consultant',
    name: 'Streaming Setup Consultant',
    category: 'streaming',
    providerCount: 21,
    image: 'https://images.unsplash.com/photo-1585580490138-c1844a2b8d5c?auto=format&fit=crop&w=800&q=80',
    icon: '📡'
  },

  // AI Services
  {
    id: 'ai-agent-builders',
    name: 'AI Agent Builders',
    category: 'ai-services',
    providerCount: 16,
    image: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=800&q=80',
    icon: '🤖'
  },
  {
    id: 'ai-video-generator',
    name: 'AI Video Generator',
    category: 'ai-services',
    providerCount: 24,
    mostBooked: true,
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    icon: '🎞️'
  },
  {
    id: 'ai-ad-campaigns',
    name: 'AI Ad Campaigns',
    category: 'ai-services',
    providerCount: 20,
    image: 'https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?auto=format&fit=crop&w=800&q=80',
    icon: '📣'
  },
  {
    id: 'product-mockups',
    name: 'Product Mockups',
    category: 'ai-services',
    providerCount: 27,
    image: 'https://images.unsplash.com/photo-1475965894430-b05c9d142f9d?auto=format&fit=crop&w=800&q=80',
    icon: '🧪'
  }
]

// Popular services for home page
export const popularServices = [
  // Top services with updated local images
  {
    id: 'cricket-net-bowler-sidearmer',
    title: 'Cricket Net Bowler / Sidearmer',
    icon: '🏏',
    providerCount: 15,
    image: '/images/Bowler & batsman.png',
    mostBooked: true
  },
  {
    id: 'reels-shorts-video-editor',
    title: 'Reels / Shorts Video Editor',
    icon: '🎬',
    providerCount: 38,
    image: '/images/reels & podcast editor.jpeg',
    mostBooked: true
  },
  {
    id: 'ai-reels-shorts-creator',
    title: 'AI Reels / Shorts Creator',
    icon: '🎞️',
    providerCount: 22,
    image: '/images/AI Ad campaigns.jpeg',
    mostBooked: true
  },
  // Additional popular picks
  {
    id: 'product-photography',
    title: 'Product Photography',
    icon: '📷',
    providerCount: 35,
    image: '/images/professional shoots.jpeg',
    discount: '10% Off',
    mostBooked: true
  },
  {
    id: 'quick-cash-gigs',
    title: 'Quick Cash Gigs',
    icon: '💰',
    providerCount: 42,
    image: '/images/quick cash gigs.png',
    mostBooked: true
  }
]