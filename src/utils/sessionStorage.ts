// Types for session storage keys
type SessionStorageKey = 'scrollToPortfolio' | 'fromPortfolio' | 'lastVisitedSection' | 'returnToProfilePreview';

/**
 * Safely gets an item from session storage
 */
export const getSessionItem = (key: SessionStorageKey): string | null => {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(key);
};

/**
 * Safely sets an item in session storage
 */
export const setSessionItem = (key: SessionStorageKey, value: string): void => {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(key, value);
};

/**
 * Safely removes an item from session storage
 */
export const removeSessionItem = (key: SessionStorageKey): void => {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(key);
};

/**
 * Checks if a boolean flag is set in session storage
 */
export const getSessionFlag = (key: SessionStorageKey): boolean => {
  return getSessionItem(key) === 'true';
};

/**
 * Sets a boolean flag in session storage
 */
export const setSessionFlag = (key: SessionStorageKey, value: boolean): void => {
  setSessionItem(key, String(value));
};
