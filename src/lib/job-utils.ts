// Utility functions for job-related operations
import type { JobCategory } from '@/components/freelancer/jobs/types';

// Map of category to two-letter codes
const CATEGORY_CODES: Record<JobCategory, string> = {
  'Match Player': 'MP',
  'Net Bowler': 'NB',
  'Net Batsman': 'NT',
  'Sidearm': 'SA',
  'Coach': 'CO',
  'Sports Conditioning Trainer': 'SC',
  'Fitness Trainer': 'FT',
  'Analyst': 'AN',
  'Physio': 'PH',
  'Scorer': 'SR',
  'Umpire': 'UM',
  'Sports Photo / Videography': 'PV',
  'Sports Content Creator': 'CC',
  'Commentator': 'CT',
  'OTHER': 'OT'
};

export function generateJobId(category: JobCategory = 'OTHER'): string {
  // Ensure we have a valid category from the enum
  const validCategory = category in CATEGORY_CODES ? category : 'OTHER';
  const categoryCode = CATEGORY_CODES[validCategory];

  // Generate a 4-digit random number
  const randomNum = Math.floor(1000 + Math.random() * 9000);

  // Format: DL + category code + random number (e.g., DLPH1234)
  return `DL${categoryCode}${randomNum}`;
}

// Helper to extract job ID from URL or generate new
export function getJobId(category?: JobCategory, existingId?: string): string {
  return existingId || generateJobId(category);
}
