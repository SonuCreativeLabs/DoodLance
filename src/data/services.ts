export const sidebarCategories = [
  {
    id: 'all',
    name: ['All', ''],
    icon: '🏛️'
  },
  {
    id: 'home-repair',
    name: ['Home &', 'Repair'],
    icon: '🛠️'
  },
  {
    id: 'beauty',
    name: ['Beauty &', 'Spa'],
    icon: '💆‍♀️'
  },
  {
    id: 'education',
    name: ['Education', 'Services'],
    icon: '👨‍🏫'
  },
  {
    id: 'sports',
    name: ['Sports &', 'Fitness'],
    icon: '🏏'
  },
  {
    id: 'pet-care',
    name: ['Pet', 'Care'],
    icon: '🐕'
  },
  {
    id: 'cleaning',
    name: ['Home', 'Cleaning'],
    icon: '🧽'
  },
  {
    id: 'electrical',
    name: ['Electrical', 'Services'],
    icon: '👨‍🔧'
  },
  {
    id: 'plumbing',
    name: ['Plumbing', 'Services'],
    icon: '🚿'
  },
  {
    id: 'painting',
    name: ['Painting', 'Services'],
    icon: '🖌️'
  },
  {
    id: 'gardening',
    name: ['Garden', 'Services'],
    icon: '🌺'
  },
  {
    id: 'moving',
    name: ['Moving', 'Services'],
    icon: '🚛'
  },
  {
    id: 'tech-support',
    name: ['Tech', 'Support'],
    icon: '👨‍💻'
  }
]

export const serviceItems = [
  // Home & Repair Services
  {
    id: 'general-repair',
    name: 'General Home Repair',
    category: 'home-repair',
    providerCount: 62,
    mostBooked: true,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    icon: '🔧'
  },
  {
    id: 'furniture-repair',
    name: 'Furniture Assembly & Repair',
    category: 'home-repair',
    providerCount: 45,
    discount: '15% Off',
    image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=800&q=80',
    icon: '🪑'
  },
  // ... rest of the service items
]

// Popular services for home page
export const popularServices = [
  {
    id: 'plumbing',
    title: 'Plumbing',
    icon: '🔧',
    providerCount: 32,
    image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=800&q=80',
    discount: '10% Off'
  },
  {
    id: 'education',
    title: 'Tutoring',
    icon: '📚',
    providerCount: 45,
    image: 'https://images.unsplash.com/photo-1560785496-3c9d27877182?auto=format&fit=crop&w=800&q=80',
    discount: '10% Off'
  },
  {
    id: 'pet-care',
    title: 'Pet Care',
    icon: '🐾',
    providerCount: 28,
    image: 'https://images.unsplash.com/photo-1587764379873-97837921fd44?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cleaning',
    title: 'Cleaning',
    icon: '🧹',
    providerCount: 48,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    discount: '15% Off'
  }
] 