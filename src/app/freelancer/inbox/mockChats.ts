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
    lastMessage: 'We train on weekends, 8-10 AM at the City Sports Complex. Can you focus on batting technique this week?',
    time: '1h ago',
    budget: '₹2,500',
    status: 'Upcoming',
    unread: true,
    rating: 4.8
  },
  {
    id: 'DLSP5678',
    name: 'Chennai Super Kings Academy',
    avatar: getAvatarUrl('CSK Academy', 'men'),
    jobTitle: 'Sidearm Specialist',
    online: false,
    lastMessage: 'We need you for 3 sessions this week - Mon, Wed, Fri from 7-9 AM. Focus on yorkers and bouncers.',
    time: '3h ago',
    budget: '₹3,500',
    status: 'Cancelled',
    unread: false,
    rating: 4.9
  },
  {
    id: 'DLSP9012',
    name: 'Tamil Nadu Cricket Club',
    avatar: getAvatarUrl('TNCC', 'men'),
    jobTitle: 'Mystery spin workshop — doosra & carrom ball reading',
    online: true,
    lastMessage: 'Our top order needs work against mystery spin. Can you do a 2-hour session at Anna Nagar nets this evening?',
    time: '5h ago',
    budget: '₹4,500',
    status: 'Upcoming',
    unread: true,
    rating: 4.7
  },
  {
    id: 'DLSP3456',
    name: 'Mehta Family',
    avatar: getAvatarUrl('Mehta Family', 'women'),
    jobTitle: 'One-on-one batting — front-foot play vs hard length',
    online: false,
    lastMessage: 'We are in T Nagar. What kit should we get for the first batting session?',
    time: '7h ago',
    budget: '₹3,000',
    status: 'Cancelled',
    unread: false,
    rating: 4.9
  },
  {
    id: 'DLSP7890',
    name: 'Chennai Cricket League',
    avatar: getAvatarUrl('CCL', 'men'),
    jobTitle: 'Umpire panel — district T20 weekend fixtures',
    online: false,
    lastMessage: 'Looking for experienced umpires for our weekend T20 series. 3-day tournament starting Friday.',
    time: '1d ago',
    budget: '₹8,000',
    status: 'Upcoming',
    unread: true,
    rating: 4.8
  }
];
