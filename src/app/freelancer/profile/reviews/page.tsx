import { ArrowLeft, Star, StarHalf, MessageSquare, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    <div className="container mx-auto px-4 py-8 pb-24 max-w-5xl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <Link 
            href="/freelancer/profile" 
            className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200 group"
            aria-label="Back to profile"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors duration-200">
              <ArrowLeft className="h-4 w-4" />
            </div>
            <span className="ml-2 hidden sm:inline-block">Back to Profile</span>
          </Link>
          <div className="ml-2">
            <h1 className="text-3xl font-bold text-white">
              Client Reviews
            </h1>
            <p className="text-white/60 text-sm mt-1">What my clients say about working with me</p>
          </div>
        </div>
        
        {/* Simple Rating Summary */}
        <div className="flex items-center justify-between w-full py-4">
          <div>
            <p className="text-white/70 text-sm mb-1">Average Rating</p>
            <div className="flex items-center">
              <span className="text-3xl font-bold text-white mr-3">{averageRating.toFixed(1)}</span>
              <div className="flex">
                {renderStars(averageRating)}
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white/70 text-sm">Based on</p>
            <p className="text-lg font-medium text-white">
              {totalReviews} {totalReviews === 1 ? 'Review' : 'Reviews'}
            </p>
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 gap-5">
        {reviews.map((review) => (
          <Card 
            key={review.id} 
            className="border-white/5 bg-[#1A1A1A] hover:border-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/5 overflow-hidden"
          >
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={review.avatar} alt={review.author} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-500 text-white font-medium">
                        {review.author.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="space-y-1.5">
                        <h4 className="font-semibold text-lg text-white leading-tight">{review.author}</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {review.role.split(',').map((role, idx) => (
                            <span 
                              key={idx}
                              className="inline-flex items-center h-5 text-[11px] font-medium px-2.5 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-purple-300 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-200"
                            >
                              {role.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="flex items-center mb-2">
                    {renderStars(review.rating)}
                    <span className="ml-1.5 text-sm font-medium text-white/70">
                      {review.rating.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-white/90 leading-relaxed italic mb-3">"{review.comment}"</p>
                  <div className="flex items-center justify-between pt-1">
                    <div className="text-xs text-white/40">
                      {new Date(review.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center space-x-2">
                    <button 
                      className="flex items-center text-xs text-white/60 hover:text-purple-400 hover:bg-white/5 transition-colors px-3 py-1.5 rounded-full"
                      aria-label="Reply to review"
                    >
                      <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                      <span>Reply</span>
                    </button>
                    <button 
                      className="flex items-center text-xs text-white/60 hover:text-purple-400 hover:bg-white/5 transition-colors px-3 py-1.5 rounded-full"
                      aria-label="Share review"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
                        <circle cx="18" cy="5" r="3"></circle>
                        <circle cx="6" cy="12" r="3"></circle>
                        <circle cx="18" cy="19" r="3"></circle>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                      </svg>
                      <span>Share</span>
                    </button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
