/**
 * Normalize date string to ensure consistent format for Date constructor
 * @param dateString - Date string in various formats
 * @returns Normalized date string or original if already valid
 */
function normalizeDateString(dateString: string): string {
  // If already in YYYY-MM-DD format, return as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }

  // If in DD/MM/YYYY format, convert to YYYY-MM-DD
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  // Return original for other formats (let Date constructor handle it)
  return dateString;
}

/**
 * Calculate age from date of birth
 * @param dateOfBirth - Date of birth in YYYY-MM-DD, DD/MM/YYYY, or Date object
 * @returns Age in years
 */
export function calculateAge(dateOfBirth: string | Date): number {
  const normalizedDate = typeof dateOfBirth === 'string' ? normalizeDateString(dateOfBirth) : dateOfBirth;
  const birthDate = typeof normalizedDate === 'string' ? new Date(normalizedDate) : normalizedDate;
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

/**
 * Get personal info from localStorage
 * @returns Personal info object or null if not found
 */
export function getPersonalInfo(): { fullName: string; jobTitle: string; gender: string; dateOfBirth: string; bio: string } | null {
  if (typeof window === 'undefined') return null;

  try {
    const saved = localStorage.getItem('personalInfo');
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Failed to parse personal info:', error);
    return null;
  }
}
