/**
 * Calculate age from date of birth
 * @param dateOfBirth - Date of birth in YYYY-MM-DD format or Date object
 * @returns Age in years
 */
export function calculateAge(dateOfBirth: string | Date): number {
  const birthDate = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
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
