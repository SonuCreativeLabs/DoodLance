// Reviews will be loaded from the server
export const reviews: Array<{
  id: string;
  author: string;
  role: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}> = [];

// Calculate initial rating stats
export function getInitialRatingStats() {
  return {
    averageRating: 0,
    totalRatings: 0,
    ratingCounts: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 }
  };
}
