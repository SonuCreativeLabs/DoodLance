import { Card, CardContent } from "@/components/ui/card";
import { Star, StarHalf } from "lucide-react";

export interface Review {
  id: string;
  clientName: string;
  role: string;
  rating: number;
  content: string;
  date: string;
  avatar?: string;
}

interface ClientReviewsProps {
  reviews: Review[];
}

export function ClientReviews({ reviews }: ClientReviewsProps) {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<StarHalf key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-gray-600" />);
      }
    }

    return stars;
  };

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <Card key={review.id} className="border-white/5 bg-[#1E1E1E] hover:border-white/10 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold">
                  {review.clientName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div>
                  <h4 className="font-semibold">{review.clientName}</h4>
                  <p className="text-sm text-white/60">{review.role}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {renderStars(review.rating)}
              </div>
            </div>
            <p className="mt-4 text-white/90">{review.content}</p>
            <p className="mt-3 text-sm text-white/50">{review.date}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
