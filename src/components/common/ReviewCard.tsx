import { Star, User } from 'lucide-react';

interface Review {
  id: string;
  author: string;
  role?: string;
  rating: number;
  comment: string;
  date: string;
}

interface ReviewCardProps {
  review: Review;
  className?: string;
}

export function ReviewCard({ review, className = '' }: ReviewCardProps) {
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
      />
    ));
  };

  return (
    <div className={`p-5 rounded-3xl border border-white/10 bg-white/5 hover:border-purple-500/30 transition-colors flex flex-col h-full ${className}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0">
            <User className="h-4 w-4 text-white/60" />
          </div>
          <div className="min-w-0">
            <h4 className="font-medium text-white text-sm truncate">{review.author}</h4>
            {review.role && (
              <div className="text-xs text-white/60 truncate">
                {review.role}
              </div>
            )}
          </div>
        </div>
        <span className="text-xs text-white/40 whitespace-nowrap ml-2">
          {new Date(review.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
      </div>
      <div className="flex items-center gap-1 mb-2">
        {renderStars(review.rating)}
      </div>
      <p className="text-sm text-white/80 flex-1">{review.comment}</p>
    </div>
  );
}
