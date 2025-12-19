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
    author: 'Vikram Singh',
    role: 'Cricket Academy Director',
    rating: 5,
    comment: 'As a coach, Sonu has a unique ability to identify and correct technical flaws. Our academy players have shown remarkable improvement under his guidance.',
    date: '2024-03-25',
    avatar: ''
  },
  {
    id: '3',
    author: 'Arjun Mehta',
    role: 'Professional Cricketer',
    rating: 5,
    comment: 'The best off-spin coach I\'ve worked with. His insights into bowling variations and game situations have taken my bowling to the next level.',
    date: '2024-01-30',
    avatar: ''
  },
  {
    id: '4',
    author: 'Karan Patel',
    role: 'District Cricket Team Coach',
    rating: 4.5,
    comment: 'Sonu\'s cricket analytics service helped our team win the district championship. His performance data and strategic insights were crucial in our success. Highly recommended!',
    date: '2024-02-15',
    avatar: ''
  },
  {
    id: '5',
    author: 'Priya Sharma',
    role: 'Women\'s Cricket Captain',
    rating: 5,
    comment: 'Sonu coached our women\'s cricket team and the improvement was incredible. His training methods and mental coaching techniques helped us secure the state finals.',
    date: '2023-12-10',
    avatar: ''
  },
  {
    id: '6',
    author: 'Rajesh Kumar',
    role: 'Cricket Club President',
    rating: 5,
    comment: 'Our club hired Sonu for performance analysis and team development. His live scoring system and match analytics have revolutionized how we prepare for tournaments.',
    date: '2023-11-05',
    avatar: ''
  }
];

// Calculate initial rating stats
export const getInitialRatingStats = () => {
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  const totalReviews = reviews.length;
  return { averageRating, totalReviews };
};
