// Skill utilities for profile and preview components
export interface SkillInfo {
  name: string;
  description?: string;
  experience?: string;
  level?: 'Beginner' | 'Intermediate' | 'Expert';
}

// Skill lookup data - maps skill names to detailed information
const SKILL_LOOKUP: Record<string, SkillInfo> = {
  "RH Batsman": {
    name: "RH Batsman",
    description: "Right-handed batsman specializing in top-order batting with solid technique and aggressive stroke play.",
    experience: "5 years",
    level: "Expert"
  },
  "Sidearm Specialist": {
    name: "Sidearm Specialist",
    description: "Expert sidearm bowler with unique delivery angles and deceptive variations.",
    experience: "4 years",
    level: "Expert"
  },
  "Off Spin": {
    name: "Off Spin",
    description: "Skilled off-spin bowler with excellent control, flight, and mystery variations.",
    experience: "3 years",
    level: "Expert"
  },
  "Batting Coach": {
    name: "Batting Coach",
    description: "Professional batting coach with expertise in technique, mental approach, and match situations.",
    experience: "6 years",
    level: "Expert"
  },
  "Analyst": {
    name: "Analyst",
    description: "Cricket performance analyst specializing in match statistics, player metrics, and strategic insights.",
    experience: "2 years",
    level: "Intermediate"
  },
  "Mystery Spin": {
    name: "Mystery Spin",
    description: "Specialist in mystery spin variations including doosra, carrom ball, and other deceptive deliveries.",
    experience: "3 years",
    level: "Expert"
  }
};

/**
 * Get detailed skill information for a skill name
 * @param skillName - The name of the skill (case-insensitive)
 * @returns SkillInfo object or basic info if not found
 */
export function getSkillInfo(skillName: string): SkillInfo {
  const normalizedName = skillName.toLowerCase();

  // Try exact match first
  if (SKILL_LOOKUP[skillName]) {
    return SKILL_LOOKUP[skillName];
  }

  // Try case-insensitive match
  for (const [key, info] of Object.entries(SKILL_LOOKUP)) {
    if (key.toLowerCase() === normalizedName) {
      return info;
    }
  }

  // Try partial match for common variations
  for (const [key, info] of Object.entries(SKILL_LOOKUP)) {
    if (key.toLowerCase().includes(normalizedName) || normalizedName.includes(key.toLowerCase())) {
      return info;
    }
  }

  // Return basic info if not found
  return {
    name: skillName,
    description: "Professional expertise in this area",
    experience: "Experience varies",
    level: "Intermediate"
  };
}

/**
 * Get multiple skill infos for an array of skill names
 * @param skillNames - Array of skill names
 * @returns Array of SkillInfo objects
 */
export function getSkillInfos(skillNames: string[]): SkillInfo[] {
  return skillNames.map(getSkillInfo);
}
