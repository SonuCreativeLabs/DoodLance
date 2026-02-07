export type SportRole = {
    id: string;
    name: string;
    description?: string;
};

export type SportAttribute = {
    key: string;
    label: string;
    type: 'select' | 'text' | 'number' | 'multi-select';
    options?: string[];
    placeholder?: string;
    required?: boolean;
};

export type SportConfig = {
    name: string;
    icon?: string; // Lucide icon name or path
    roles: SportRole[];
    attributes: SportAttribute[];
    // Legacy mapping for backward compatibility
    legacyRoleMap?: Record<string, string>;
};

export const SPORTS_CONFIG: Record<string, SportConfig> = {
    Cricket: {
        name: 'Cricket',
        roles: [
            { id: 'match_player', name: 'Match Player' },
            { id: 'net_bowler', name: 'Net Bowler' },
            { id: 'net_batsman', name: 'Net Batsman' },
            { id: 'sidearm', name: 'Sidearm Specialist' },
            { id: 'coach', name: 'Coach' },
            { id: 'umpire', name: 'Umpire' },
            { id: 'scorer', name: 'Scorer' },
            { id: 'commentator', name: 'Commentator' },
        ],
        attributes: [
            {
                key: 'cricketRole',
                label: 'Primary Role',
                type: 'select',
                options: ['Batsman', 'Bowler', 'Batting Allrounder', 'Bowling Allrounder', 'Wicket Keeper'],
                required: true
            },
            {
                key: 'battingStyle',
                label: 'Batting Style',
                type: 'select',
                options: ['RH Top Order', 'RH Middle Order', 'RH Lower Order', 'LH Top Order', 'LH Middle Order', 'LH Lower Order'],
                required: false
            },
            {
                key: 'bowlingStyle',
                label: 'Bowling Style',
                type: 'select',
                options: [
                    'Right Arm Fast',
                    'Right Arm Medium',
                    'Right Arm Off Spin',
                    'Right Arm Leg Spin',
                    'Right Arm Googly',
                    'Left Arm Fast',
                    'Left Arm Medium',
                    'Left Arm Orthodox',
                    'Left Arm Chinaman',
                    'Left Arm Wrist Spin',
                    'Mystery Spin',
                    'None'
                ],
                required: false
            }
        ]
    },
    Football: {
        name: 'Football',
        roles: [
            { id: 'striker', name: 'Striker' },
            { id: 'winger', name: 'Winger' },
            { id: 'midfielder', name: 'Midfielder' },
            { id: 'defender', name: 'Defender' },
            { id: 'goalkeeper', name: 'Goalkeeper' },
            { id: 'referee', name: 'Referee' },
            { id: 'coach', name: 'Coach' },
            { id: 'physio', name: 'Sports Physio' },
        ],
        attributes: [
            {
                key: 'position',
                label: 'Primary Position',
                type: 'select',
                options: ['Striker (ST)', 'Winger (RW/LW)', 'Attacking Mid (CAM)', 'Central Mid (CM)', 'Defensive Mid (CDM)', 'Center Back (CB)', 'Full Back (RB/LB)', 'Goalkeeper (GK)'],
                required: true
            },
            {
                key: 'preferredFoot',
                label: 'Preferred Foot',
                type: 'select',
                options: ['Right', 'Left', 'Both'],
                required: true
            }
        ]
    },
    Badminton: {
        name: 'Badminton',
        roles: [
            { id: 'sparring', name: 'Sparring Partner' },
            { id: 'doubles', name: 'Doubles Partner' },
            { id: 'coach', name: 'Coach' },
            { id: 'umpire', name: 'Umpire' },
        ],
        attributes: [
            {
                key: 'category',
                label: 'Category',
                type: 'multi-select',
                options: ['Singles', 'Doubles', 'Mixed Doubles'],
                required: true
            },
            {
                key: 'hand',
                label: 'Playing Hand',
                type: 'select',
                options: ['Right', 'Left'],
                required: true
            }
        ]
    },
    Tennis: {
        name: 'Tennis',
        roles: [
            { id: 'hitting', name: 'Hitting Partner' },
            { id: 'coach', name: 'Coach' },
            { id: 'umpire', name: 'Umpire' },
        ],
        attributes: [
            {
                key: 'hand',
                label: 'Playing Hand',
                type: 'select',
                options: ['Right', 'Left'],
                required: true
            },
            {
                key: 'category',
                label: 'Category',
                type: 'multi-select',
                options: ['Singles', 'Doubles', 'Mixed Doubles'],
                required: true
            },
            {
                key: 'backhand',
                label: 'Backhand Style',
                type: 'select',
                options: ['Single-handed', 'Double-handed'],
                required: false
            }
        ]
    },
    'Table Tennis': {
        name: 'Table Tennis',
        roles: [
            { id: 'match_player', name: 'Match Player' },
            { id: 'practice_partner', name: 'Practice Partner' },
            { id: 'coach', name: 'Coach' },
            { id: 'umpire', name: 'Umpire' },
        ],
        attributes: [
            {
                key: 'playingStyle',
                label: 'Playing Style',
                type: 'select',
                options: ['Offensive', 'Defensive', 'All-Round'],
                required: true
            },
            {
                key: 'gripType',
                label: 'Grip Type',
                type: 'select',
                options: ['Shakehand', 'Penhold']
            }
        ]
    },
    'Combat Sports': {
        name: 'Combat Sports',
        roles: [
            { id: 'fighter', name: 'Fighter' },
            { id: 'sparring_partner', name: 'Sparring Partner' },
            { id: 'coach', name: 'Coach' },
            { id: 'referee', name: 'Referee' },
        ],
        attributes: [
            {
                key: 'discipline',
                label: 'Discipline',
                type: 'select',
                options: ['Boxing', 'MMA', 'Wrestling', 'Judo', 'Karate', 'Taekwondo', 'Muay Thai', 'Kickboxing'],
                required: true
            }
        ]
    },
    Padel: {
        name: 'Padel',
        roles: [
            { id: 'player', name: 'Player' },
            { id: 'coach', name: 'Coach' },
            { id: 'referee', name: 'Referee' },
        ],
        attributes: [
            {
                key: 'hand',
                label: 'Playing Hand',
                type: 'select',
                options: ['Right', 'Left'],
                required: true
            },
            {
                key: 'position',
                label: 'Preferred Position',
                type: 'select',
                options: ['Right Side', 'Left Side', 'Both'],
                required: true
            },
            {
                key: 'playStyle',
                label: 'Play Style',
                type: 'select',
                options: ['Aggressive', 'Defensive', 'Balanced'],
                required: false
            }
        ]
    },
    Pickleball: {
        name: 'Pickleball',
        roles: [
            { id: 'singles', name: 'Singles Player' },
            { id: 'doubles', name: 'Doubles Player' },
            { id: 'coach', name: 'Coach' },
            { id: 'referee', name: 'Referee' },
        ],
        attributes: [
            {
                key: 'hand',
                label: 'Playing Hand',
                type: 'select',
                options: ['Right', 'Left'],
                required: true
            },
            {
                key: 'category',
                label: 'Category',
                type: 'multi-select',
                options: ['Singles', 'Doubles', 'Mixed Doubles'],
                required: true
            }
        ]
    },
    Basketball: {
        name: 'Basketball',
        roles: [
            { id: 'player', name: 'Player' },
            { id: 'coach', name: 'Coach' },
            { id: 'referee', name: 'Referee' },
        ],
        attributes: [
            {
                key: 'position',
                label: 'Primary Position',
                type: 'select',
                options: ['Point Guard (PG)', 'Shooting Guard (SG)', 'Small Forward (SF)', 'Power Forward (PF)', 'Center (C)'],
                required: true
            },
            {
                key: 'hand',
                label: 'Dominant Hand',
                type: 'select',
                options: ['Right', 'Left', 'Both'],
                required: true
            },
            {
                key: 'playStyle',
                label: 'Play Style',
                type: 'multi-select',
                options: ['Shooter', 'Playmaker', 'Defender', 'Rebounder', 'Slasher', 'Post Player'],
                required: false
            }
        ]
    },
    Fitness: {
        name: 'Fitness',
        roles: [
            { id: 'trainer', name: 'Fitness Trainer' },
            { id: 'conditioning', name: 'Strength & Conditioning' },
            { id: 'yoga', name: 'Yoga Instructor' },
            { id: 'crossfit', name: 'Crossfit Coach' },
            { id: 'nutritionist', name: 'Sports Nutritionist' },
            { id: 'physio', name: 'Sports Physio' },
        ],
        attributes: [
            {
                key: 'specialization',
                label: 'Specialization',
                type: 'multi-select',
                options: ['Weight Loss', 'Muscle Gain', 'Endurance', 'Flexibility', 'Rehabilitation', 'Sport Specific'],
                required: true
            }
        ]
    },
    Other: {
        name: 'Other',
        roles: [
            { id: 'player', name: 'Player' },
            { id: 'coach', name: 'Coach' },
            { id: 'official', name: 'Official/Referee' },
            { id: 'other', name: 'Other' },
        ],
        attributes: [
            {
                key: 'manualInfo',
                label: 'Additional Information',
                type: 'text',
                placeholder: 'Add details about your sport/role',
                required: false
            }
        ]
    }
};

export const POPULAR_SPORTS = ['Cricket', 'Football', 'Badminton', 'Tennis', 'Basketball', 'Padel', 'Pickleball', 'Table Tennis', 'Combat Sports', 'Fitness', 'Other'];
