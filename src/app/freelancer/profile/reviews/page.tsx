import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, StarHalf, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data for reviews
const reviews = [
  {
    id: '1',
    author: 'Jane Smith',
    rating: 5,
    comment: 'Excellent work! The website was delivered on time and exceeded my expectations. Communication was smooth throughout the project.',
    date: '2023-05-15',
    avatar: '/placeholder-avatar-1.jpg'
  },
  {
    id: '2',
    author: 'Michael Johnson',
    rating: 4,
    comment: 'Great job on the UI/UX design. The interface is intuitive and user-friendly. Would definitely work with again!',
    date: '2023-04-22',
    avatar: '/placeholder-avatar-2.jpg'
  },
  {
    id: '3',
    author: 'Sarah Williams',
    rating: 5,
    comment: 'Amazing service! The e-commerce site is exactly what I needed. The developer was very responsive to all my requests.',
    date: '2023-03-10',
    avatar: '/placeholder-avatar-3.jpg'
  },
  {
    id: '4',
    author: 'David Brown',
    rating: 4.5,
    comment: 'Good work overall. The project was completed as described. There were a few minor issues, but they were quickly resolved.',
    date: '2023-02-28',
    avatar: '/placeholder-avatar-4.jpg'
  },
  {
    id: '5',
    author: 'Emily Davis',
    rating: 5,
    comment: 'Outstanding developer! Delivered high-quality work ahead of schedule. Will be hiring again for future projects.',
    date: '2023-01-15',
    avatar: '/placeholder-avatar-5.jpg'
  }
];

// Helper function to render star ratings
const renderStars = (rating: number) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />);
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(<StarHalf key={i} className="h-4 w-4 text-yellow-400 fill-current" />);
    } else {
      stars.push(<Star key={i} className="h-4 w-4 text-gray-400 fill-current" />);
    }
  }
  
  return stars;
};

export default function ReviewsPage() {
  // Calculate average rating
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/freelancer/profile" className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Profile
        </Link>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Client Reviews</h1>
            <p className="text-white/60 mt-1">What your clients say about your work</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{averageRating.toFixed(1)}</div>
              <div className="flex justify-center">
                {renderStars(averageRating)}
              </div>
              <div className="text-sm text-white/60 mt-1">{reviews.length} reviews</div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {reviews.map((review) => (
          <Card key={review.id} className="bg-[#1E1E1E] border border-white/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={review.avatar} alt={review.author} />
                  <AvatarFallback className="bg-purple-500/20 text-purple-300">
                    {review.author.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{review.author}</h3>
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                      <span className="ml-1 text-sm text-white/60">{review.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-white/80 mt-1">{review.comment}</p>
                  <div className="flex items-center text-xs text-white/50 mt-2">
                    <MessageSquare className="h-3.5 w-3.5 mr-1" />
                    {new Date(review.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
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
