/**
 * Category and Location Code Mappings for ID Generation
 * Format: {Type}{Category}{City}{Area}{Sequence}
 * Example: JPLCHVE001 (Job, Playing, Chennai, Velachery, #001)
 */

// Category Codes (2 letters)
export const CATEGORY_CODES: Record<string, string> = {
    // Main categories
    'playing': 'PL',
    'coaching': 'CO',
    'support': 'SU',
    'media': 'ME',

    // Subcategories mapped to parent
    'match player': 'PL',
    'net bowler': 'PL',
    'net batsman': 'PL',
    'sidearm': 'PL',

    'coach': 'CO',
    'sports conditioning trainer': 'CO',
    'fitness trainer': 'CO',

    'analyst': 'SU',
    'physio': 'SU',
    'scorer': 'SU',
    'umpire': 'SU',

    'cricket photo/videography': 'ME',
    'cricket content creator': 'ME',
    'commentator': 'ME',
};

// City Codes (2 letters)
export const CITY_CODES: Record<string, string> = {
    // Major Indian cities
    'chennai': 'CH',
    'bangalore': 'BA',
    'mumbai': 'MU',
    'delhi': 'DE',
    'hyderabad': 'HY',
    'kolkata': 'KO',
    'pune': 'PU',
    'ahmedabad': 'AH',
    'jaipur': 'JA',
    'lucknow': 'LU',
    'kanpur': 'KA',
    'nagpur': 'NA',
    'indore': 'IN',
    'bhopal': 'BH',
    'visakhapatnam': 'VI',
    'patna': 'PA',
    'vadodara': 'VA',
    'ghaziabad': 'GH',
    'ludhiana': 'LD',
    'agra': 'AG',
    'nashik': 'NS',
    'faridabad': 'FA',
    'meerut': 'ME',
    'rajkot': 'RA',
    'varanasi': 'VR',
    'srinagar': 'SR',
    'aurangabad': 'AU',
    'dhanbad': 'DH',
    'amritsar': 'AM',
    'allahabad': 'AL',
    'ranchi': 'RN',
    'gwalior': 'GW',
    'chandigarh': 'CD',
    'vijayawada': 'VJ',
    'jodhpur': 'JO',
    'madurai': 'MA',
    'raipur': 'RP',
    'kota': 'KT',
    'guwahati': 'GU',
    'coimbatore': 'CO',
    'tiruppur': 'TI',
    'salem': 'SA',
    'erode': 'ER',
    'thrissur': 'TH',
    'thiruvananthapuram': 'TV',
    'kochi': 'KC',
};

/**
 * Get category code from category name
 */
export function getCategoryCode(category: string): string {
    const normalized = category.toLowerCase().trim();
    const code = CATEGORY_CODES[normalized];

    if (!code) {
        console.warn(`Unknown category: ${category}, using fallback 'PL'`);
        return 'PL'; // Default to Playing
    }

    return code;
}

/**
 * Get city code from city name
 */
export function getCityCode(city: string): string {
    const normalized = city.toLowerCase().trim();
    const code = CITY_CODES[normalized];

    if (code) {
        return code;
    }

    // Fallback: use first 2 letters of city name
    const fallback = normalized.substring(0, 2).toUpperCase();
    console.warn(`Unknown city: ${city}, using fallback '${fallback}'`);
    return fallback;
}

/**
 * Get area code from area name (always uses first 2 letters)
 */
export function getAreaCode(area: string): string {
    const normalized = area.toLowerCase().trim();

    // Extract first 2 letters
    const code = normalized.substring(0, 2).toUpperCase();

    return code;
}

/**
 * Parse location string into city and area
 * Supports formats:
 * - "Chennai, Velachery"
 * - "Chennai Velachery"
 * - "Velachery, Chennai" (tries to detect city)
 */
export function parseLocation(location: string): { city: string; area: string } {
    // Split by comma or by space
    const parts = location.includes(',')
        ? location.split(',').map(s => s.trim())
        : location.split(/\s+/).filter(Boolean);

    if (parts.length === 0) {
        return { city: 'Unknown', area: 'Unknown' };
    }

    if (parts.length === 1) {
        // Only one part, assume it's the area and city is same
        return { city: parts[0], area: parts[0] };
    }

    // Check which part is a known city
    const firstIsCity = CITY_CODES[parts[0].toLowerCase()];
    const secondIsCity = CITY_CODES[parts[1].toLowerCase()];

    if (firstIsCity) {
        return { city: parts[0], area: parts[1] };
    } else if (secondIsCity) {
        return { city: parts[1], area: parts[0] };
    }

    // Default: first part is city, second is area
    return { city: parts[0], area: parts[1] };
}

/**
 * Reverse lookup: get category name from code
 */
export function getCategoryFromCode(code: string): string {
    const entries = Object.entries(CATEGORY_CODES);
    for (const [name, categoryCode] of entries) {
        if (categoryCode === code) {
            return name;
        }
    }
    return 'unknown';
}

/**
 * Reverse lookup: get city name from code
 */
export function getCityFromCode(code: string): string {
    const entries = Object.entries(CITY_CODES);
    for (const [name, cityCode] of entries) {
        if (cityCode === code) {
            return name;
        }
    }
    return 'unknown';
}
