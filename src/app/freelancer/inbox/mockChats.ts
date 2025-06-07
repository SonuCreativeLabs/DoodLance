// Function to generate consistent avatar URLs based on name
const getAvatarUrl = (name: string, gender: 'men' | 'women' | 'male' | 'female' = 'men') => {
  const nameHash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const id = nameHash % 100; // Ensure we get a number between 0-99
  return `https://randomuser.me/api/portraits/${gender}/${id}.jpg`;
};

export const mockChats = [
  {
    id: 'DLSP1234',
    name: 'Rahul Sharma',
    avatar: getAvatarUrl('Rahul Sharma', 'men'),
    jobTitle: 'Cricket Coach for U-16 Team',
    online: true,
    lastMessage: 'We train on weekends, 8-10 AM at the City Sports Complex...',
    time: '1h ago',
    budget: '₹2,500',
    status: 'Upcoming',
    unread: true,
    rating: 4.8
  },
  {
    id: 'DLSP5678',
    name: 'Priya Malhotra',
    avatar: getAvatarUrl('Priya Malhotra', 'women'),
    jobTitle: 'Corporate Yoga Instructor',
    online: false,
    lastMessage: 'We\'re looking for 3 sessions per week - Mon, Wed, Fri from 7-8 AM...',
    time: '3h ago',
    budget: '₹3,500',
    status: 'Ongoing',
    unread: false,
    rating: 4.9
  },
  {
    id: 'DLSP9012',
    name: 'Aarav & Ananya',
    avatar: getAvatarUrl('Aarav Patel', 'men'),
    jobTitle: 'Wedding Dance Choreography',
    online: true,
    lastMessage: 'We love Bollywood fusion! There will be 8 of us with mixed experience...',
    time: '5h ago',
    budget: '₹15,000',
    status: 'Upcoming',
    unread: true,
    rating: 4.7
  },
  {
    id: 'DLSP3456',
    name: 'The Kapoor Family',
    avatar: getAvatarUrl('Mrs. Kapoor', 'women'),
    jobTitle: 'Piano Lessons for Kids',
    online: false,
    lastMessage: 'We have a basic keyboard. What materials will we need to purchase?',
    time: '7h ago',
    budget: '₹1,500',
    status: 'Ongoing',
    unread: false,
    rating: 4.9
  },
  {
    id: 'DLSP7890',
    name: 'FitLife Bootcamps',
    avatar: getAvatarUrl('FitLife', 'men'),
    jobTitle: 'Outdoor Fitness Trainer',
    online: false,
    lastMessage: 'It\'s a high-energy outdoor bootcamp, 5 days a week...',
    time: '1d ago',
    budget: '₹40,000',
    status: 'Upcoming',
    unread: true,
    rating: 4.8
  }
];
