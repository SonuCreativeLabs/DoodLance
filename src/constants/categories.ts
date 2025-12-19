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
  'Cricket Content Creator',
  'Cricket Photo / Videography',
  'Other'
] as const;

export const PORTFOLIO_CATEGORIES = [
  'Cricket Achievement',
  'Academic Achievement',
  'Cricket Analytics',
  'Cricket Technology',
  'Coaching Experience',
  'Match Performance',
  'Training Content',
  'Other'
] as const;

// Combined categories for when both types are needed
export const ALL_CATEGORIES = [...SERVICE_CATEGORIES, ...PORTFOLIO_CATEGORIES.filter(cat => !SERVICE_CATEGORIES.includes(cat as any))];

export type ServiceCategory = typeof SERVICE_CATEGORIES[number];
export type PortfolioCategory = typeof PORTFOLIO_CATEGORIES[number];
export type AnyCategory = ServiceCategory | PortfolioCategory;
