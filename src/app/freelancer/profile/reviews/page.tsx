import { ArrowLeft, Star, StarHalf, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

// Client Testimonials
const reviews = [
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

export default function ReviewsPage() {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<StarHalf key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="h-5 w-5 text-gray-600" />);
      }
    }
    return stars;
  };

  // Calculate average rating
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  const totalReviews = reviews.length;

  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <Link 
            href="/freelancer/profile" 
            className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200 group"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors duration-200">
              <ArrowLeft className="h-4 w-4" />
            </div>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Client Testimonials</h1>
            <p className="text-white/60 text-sm mt-1">What my clients say about working with me</p>
          </div>
        </div>
        <div className="bg-[#1E1E1E] border border-white/5 rounded-lg p-4 w-full md:w-auto">
          <div className="flex items-center space-x-2">
            <div className="text-3xl font-bold text-yellow-400">{averageRating.toFixed(1)}</div>
            <div className="flex flex-col">
              <div className="flex">
                {renderStars(averageRating)}
              </div>
              <div className="text-sm text-white/60">
                Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {reviews.map((review) => (
          <Card key={review.id} className="border-white/5 bg-[#1E1E1E] hover:border-white/10 transition-all duration-300 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                    {review.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{review.author}</h4>
                    <p className="text-sm text-purple-400">{review.role}</p>
                    <div className="flex items-center mt-1">
                      {renderStars(review.rating)}
                      <span className="ml-2 text-sm text-white/60">
                        {review.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-white/50 sm:text-right">
                  {new Date(review.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
              
              <div className="mt-4 pl-2 border-l-2 border-purple-500/30">
                <p className="text-white/90 leading-relaxed">"{review.comment}"</p>
              </div>
              
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center text-sm text-purple-400">
                <MessageSquare className="h-4 w-4 mr-2" />
                Verified Review
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
