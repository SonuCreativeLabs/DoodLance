export interface ServiceCategory {
  id: string;
  name: string[];
  icon: string;
}

export const sidebarCategories: ServiceCategory[] = [
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
  },
  {
    id: 'other',
    name: ['Other', 'Services'],
    icon: '🔧'
  }
];

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  providerCount: number;
  mostBooked?: boolean;
  image: string;
  icon: string;
  description: string;
}

export const serviceItems: ServiceItem[] = [];

export interface PopularService {
  id: string;
  title: string;
  category: string;
  icon: string;
  providerCount: number;
  image: string;
  mostBooked: boolean;
}

export const popularServices: PopularService[] = [];