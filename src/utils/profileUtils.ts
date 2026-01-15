import type { Achievement, Review, Service, Availability } from '@/types/freelancer/profile';

/**
 * Formats a date string to a more readable format
 * @param dateString - The date string to format
 * @returns Formatted date string (e.g., "January 1, 2023")
 */
export const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

/**
 * Formats a time string to 12-hour format with AM/PM
 * @param timeString - The time string to format (HH:MM or HH:MM:SS)
 * @returns Formatted time string (e.g., "9AM", "2:30PM")
 */
export const formatTime = (timeString: string) => {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  const displayMinutes = minutes === '00' ? '' : `:${minutes}`;
  return `${displayHour}${displayMinutes}${ampm}`;
};

/**
 * Calculates the average rating from an array of reviews
 * @param reviews - Array of review objects
 * @returns The average rating, or 0 if no reviews
 */
export const calculateAverageRating = (reviews: Review[]): number => {
  if (!reviews?.length) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return parseFloat((sum / reviews.length).toFixed(1));
};

/**
 * Groups services by their type (online/in-person)
 * @param services - Array of service objects
 * @returns Object with services grouped by type
 */
export const groupServicesByType = (services: Service[]) => {
  return services.reduce<{ online: Service[]; inPerson: Service[] }>(
    (acc, service) => {
      const key = service.type === 'online' ? 'online' : 'inPerson';
      acc[key].push(service);
      return acc;
    },
    { online: [], inPerson: [] }
  );
};

/**
 * Gets a human-readable string representing availability
 * @param availability - Array of availability objects
 * @returns Formatted availability string
 */
export const getAvailabilityText = (availability: Availability[]): string => {
  const availableDays = availability
    .filter(day => day.available)
    .map(day => day.day.substring(0, 3));

  if (availableDays.length === 7) return 'Available every day';
  if (availableDays.length === 5 &&
    !availableDays.includes('Sat') &&
    !availableDays.includes('Sun')) {
    return 'Available weekdays';
  }
  return `Available: ${availableDays.join(', ')}`;
};

/**
 * Formats experience duration in a human-readable format
 * @param startDate - Start date string
 * @param endDate - Optional end date string (defaults to current date if not provided)
 * @returns Formatted duration string (e.g., "2 years 3 months")
 */
export const formatExperienceDuration = (startDate: string, endDate?: string): string => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();

  let months = (end.getFullYear() - start.getFullYear()) * 12;
  months -= start.getMonth();
  months += end.getMonth();

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  const parts = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
  if (remainingMonths > 0) parts.push(`${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`);

  return parts.length > 0 ? parts.join(' ') : 'Less than a month';
};

/**
 * Gets the most recent experiences
 * @param experiences - Array of experience objects
 * @param limit - Maximum number of experiences to return (default: 3)
 * @returns Array of most recent experiences
 */
export const getRecentAchievements = (achievements: Achievement[], limit: number = 3): Achievement[] => {
  // Data is already sorted by API
  return [...achievements].slice(0, limit);
};
