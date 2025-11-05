// Client Testimonials Data
export const reviews = [
  {
    id: '1',
    author: 'Rahul Sharma',
    role: 'U-19 Cricket Team Captain',
    rating: 5,
    comment: 'Sonu transformed my batting technique completely. His one-on-one sessions helped me improve my average by 35% in just 3 months. His knowledge of the game is exceptional!',
    date: '2024-05-10',
    avatar: ''
  },
  {
    id: '2',
    author: 'Neha Patel',
    role: 'Startup Founder',
    rating: 5,
    comment: 'The AI solution developed by Sonu automated our customer service, reducing response time by 80%. His technical expertise and problem-solving skills are top-notch!',
    date: '2024-04-18',
    avatar: ''
  },
  {
    id: '3',
    author: 'Vikram Singh',
    role: 'Cricket Academy Director',
    rating: 5,
    comment: 'As a coach, Sonu has a unique ability to identify and correct technical flaws. Our academy players have shown remarkable improvement under his guidance.',
    date: '2024-03-25',
    avatar: ''
  },
  {
    id: '4',
    author: 'Ananya Gupta',
    role: 'Tech Entrepreneur',
    rating: 4.5,
    comment: 'Worked with Sonu on a complex AI project. His understanding of machine learning models and their practical implementation is impressive. Delivered beyond expectations!',
    date: '2024-02-15',
    avatar: ''
  },
  {
    id: '5',
    author: 'Arjun Mehta',
    role: 'Professional Cricketer',
    rating: 5,
    comment: 'The best off-spin coach I\'ve worked with. His insights into bowling variations and game situations have taken my bowling to the next level.',
    date: '2024-01-30',
    avatar: ''
  },
  {
    id: '6',
    author: 'Priya Desai',
    role: 'Product Manager',
    rating: 5,
    comment: 'Sonu developed a custom AI tool that saved our team 20+ hours of work per week. His ability to understand business needs and translate them into technical solutions is remarkable.',
    date: '2023-12-10',
    avatar: ''
  }
];

// Calculate initial rating stats
export const getInitialRatingStats = () => {
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  const totalReviews = reviews.length;
  return { averageRating, totalReviews };
};
