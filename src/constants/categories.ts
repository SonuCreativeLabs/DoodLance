// Common category definitions for the application
export const SERVICE_CATEGORIES = [
  'Match Player',
  'Net Bowler',
  'Net Batsman',
  'Sidearm',
  'Coach',
  'Trainer',
  'Analyst',
  'Physio',
  'Scorer',
  'Umpire',
  'Commentator',
  'Sports Content Creator',
  'Sports Photo / Videography',
  'Other'
] as const;


// Combined categories for when both types are needed
export const ALL_CATEGORIES = [...SERVICE_CATEGORIES];

export type ServiceCategory = typeof SERVICE_CATEGORIES[number];
export type AnyCategory = ServiceCategory;
