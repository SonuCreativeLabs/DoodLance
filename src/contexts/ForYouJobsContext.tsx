import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { useSkills } from './SkillsContext';
// Re-import mock jobs for reference
import { jobs as mockJobs } from '@/app/freelancer/feed/data/jobs';
import type { Job } from '@/app/freelancer/feed/types';

interface ForYouJobsContextType {
  forYouJobs: Job[];
  refreshForYouJobs: () => Promise<void>;
}

const ForYouJobsContext = createContext<ForYouJobsContextType | undefined>(undefined);

export function ForYouJobsProvider({ children }: { children: ReactNode }) {
  let skills: any[] = [];
  try {
    const skillsContext = useSkills();
    skills = skillsContext.skills;
  } catch (error) {
    // Skills context not available yet, use empty array
    console.warn('Skills context not available, using empty skills array');
    skills = [];
  }
  const [forYouJobs, setForYouJobs] = useState<Job[]>([]);

  // Create stable dependency for skills changes
  const skillsDependency = useMemo(() => {
    return skills.map(skill => skill.name).join(',');
  }, [skills]);

  const filterForYouJobs = async () => {
    try {
      // Don't filter if skills are not available yet
      if (!skills || skills.length === 0) {
        setForYouJobs([]);
        return;
      }
      
      // Fetch jobs from API
      let apiJobs: Job[] = [];
      try {
        const response = await fetch('/api/jobs');
        if (response.ok) {
          apiJobs = await response.json();
        }
      } catch (apiError) {
        console.warn('Failed to fetch API jobs, using mock jobs only:', apiError);
      }

      // Combine API jobs with mock jobs, avoiding duplicates by ID
      const combinedJobs = [...mockJobs];
      
      // Add API jobs that don't already exist in mock jobs
      apiJobs.forEach(apiJob => {
        if (!combinedJobs.some(mockJob => mockJob.id === apiJob.id)) {
          combinedJobs.push(apiJob);
        }
      });
      
      // Get user skills
      const userSkills = skills.map(skill => skill.name);

      // Filter jobs based on cricket-specific skill matching
      const filteredJobs = combinedJobs.filter(job => {
        // Get user skills (normalized to lowercase)
        const userSkills = skills.map(skill => skill.name.toLowerCase());

        // Cricket skill hierarchy and interchangeability rules - expanded for all 14 categories
        const cricketSkillHierarchy = {
          // Base skills (anyone can do these)
          base: ['net bowler', 'coach', 'analyst', 'scorer', 'umpire', 'physio', 'trainer'],

          // Playing Services
          playing: {
            batsman: ['rh batsman', 'lh batsman', 'opener', 'middle order', 'wicketkeeper batsman'],
            bowler: ['fast bowler', 'pace bowler', 'seam bowler', 'medium pacer', 'swing bowler'],
            allrounder: ['all-rounder', 'batting all-rounder', 'bowling all-rounder'],
            specialist: ['wicket keeper', 'wicketkeeping', 'slip fielder', 'cover fielder']
          },

          // Coaching & Training (expanded)
          coaching: ['coach', 'batting coach', 'bowling coach', 'fielding coach', 'wicket-keeping coach',
                    'all-round coach', 'youth coach', 'junior coach', 'senior coach', 'mental skills coach',
                    'tactical coach', 'strategy coach', 'cricket coach', 'fitness trainer', 'sports conditioning trainer'],

          // Bowling skills hierarchy
          bowling: {
            fast: ['fast bowler', 'pace bowler', 'seam bowler', 'left-arm seam'],
            medium: ['medium pacer', 'swing bowler', 'hard length'],
            spin: {
              basic: ['spin bowler', 'off spin', 'leg spin', 'left-arm orthodox', 'right-arm leg spin'],
              advanced: ['mystery spin', 'doosra', 'carrom ball', 'teesra', 'googly', 'slider', 'top spinner']
            },
            specialty: ['sidearm specialist', 'sidearm', 'chinese cutter', 'slower ball specialist']
          },

          // Batting skills
          batting: ['rh batsman', 'lh batsman', 'opener', 'middle order batsman', 'finisher', 'power hitter'],

          // Support Staff
          support: ['physio', 'sports physio', 'masseur', 'trainer', 'strength coach', 'nutritionist'],

          // Media & Content
          media: ['commentator', 'cricket commentator', 'content creator', 'video editor', 'photographer', 'sports photographer'],

          // Administration
          admin: ['scorer', 'umpire', 'match referee', 'ground staff', 'ball boy', 'groundsman'],

          // Cricket Support Roles (expanded for Other category)
          cricketSupport: ['groundsman', 'ground staff', 'ball boy', 'ball girl', 'equipment manager',
                          'kit manager', 'team manager', 'cricket administrator', 'cricket journalist',
                          'cricket statistician', 'cricket historian', 'cricket curator', 'pitch curator',
                          'cricket psychologist', 'sports psychologist', 'cricket nutritionist',
                          'cricket equipment supplier', 'venue manager', 'stadium manager',
                          'event coordinator', 'tournament coordinator', 'cricket event manager',
                          'cricket academy manager', 'cricket club secretary', 'match secretary',
                          'cricket scorer assistant', 'umpire assistant', 'third umpire assistant',
                          'cricket photographer assistant', 'video technician', 'broadcast assistant',
                          'cricket content assistant', 'social media manager', 'cricket marketing',
                          'sponsorship coordinator', 'cricket merchandise', 'fan engagement officer'],

          // Analysis
          analysis: ['analyst', 'performance analyst', 'video analyst', 'stats analyst', 'scouting']
        };

        // Function to check if user has compatible skill for job requirements
        const hasCompatibleSkill = (jobCategory: string, jobTitle: string, jobDescription: string, jobSkills: string[]): boolean => {
          const jobCatLower = jobCategory.toLowerCase();
          const jobTitleLower = jobTitle.toLowerCase();
          const jobDescLower = jobDescription.toLowerCase();
          const jobSkillsLower = jobSkills.map(s => s.toLowerCase());

          // Check each user skill against job requirements
          for (const userSkill of userSkills.map(s => s.toLowerCase())) {
            // Direct skill match in job skills array
            if (jobSkillsLower.some(jobSkill => jobSkill.includes(userSkill) || userSkill.includes(jobSkill))) {
              return true;
            }

            // Category-specific matching logic for all 14 cricket service categories

            // 1. MATCH PLAYER - Playing services
            if (jobCatLower.includes('match player')) {
              if (userSkill.includes('batsman') || userSkill.includes('bowler') || userSkill.includes('all-rounder') ||
                  userSkill.includes('wicket') || userSkill.includes('fielder') || userSkill.includes('keeper')) {
                return true;
              }
            }

            // 2. NET BOWLER - Any bowling skill
            if (jobCatLower.includes('net bowler')) {
              if (userSkill.includes('spin') || userSkill.includes('fast') || userSkill.includes('pace') ||
                  userSkill.includes('medium') || userSkill.includes('seam') || userSkill.includes('bowling') ||
                  userSkill.includes('sidearm') || userSkill.includes('mystery')) {
                return true;
              }
            }

            // 3. NET BATSMAN - Batting skills
            if (jobCatLower.includes('net batsman')) {
              if (userSkill.includes('batsman') || userSkill.includes('batting') || userSkill.includes('rh') ||
                  userSkill.includes('lh') || userSkill.includes('opener') || userSkill.includes('middle order')) {
                return true;
              }
            }

            // 4. SIDEARM - Sidearm specialty
            if (jobCatLower.includes('sidearm')) {
              if (userSkill.includes('sidearm') || userSkill.includes('yorker') || userSkill.includes('death over') ||
                  userSkill.includes('powerplay')) {
                return true;
              }
            }

            // 5. COACH - Comprehensive coaching skills (expanded)
            if (jobCatLower.includes('coach')) {
              if (userSkill.includes('coach') || userSkill.includes('training') || userSkill.includes('analyst') ||
                  userSkill.includes('batting coach') || userSkill.includes('bowling coach') ||
                  userSkill.includes('fielding coach') || userSkill.includes('wicket-keeping coach') ||
                  userSkill.includes('wicketkeeping coach') || userSkill.includes('all-round coach') ||
                  userSkill.includes('youth coach') || userSkill.includes('junior coach') ||
                  userSkill.includes('senior coach') || userSkill.includes('mental skills coach') ||
                  userSkill.includes('tactical coach') || userSkill.includes('strategy coach') ||
                  userSkill.includes('cricket coach') || userSkill.includes('coaching')) {
                return true;
              }
            }

            // 6. TRAINER - Training and conditioning
            if (jobCatLower.includes('trainer')) {
              if (userSkill.includes('trainer') || userSkill.includes('conditioning') || userSkill.includes('fitness') ||
                  userSkill.includes('strength') || userSkill.includes('physio') || userSkill.includes('nutrition')) {
                return true;
              }
            }

            // 7. ANALYST - Analysis skills
            if (jobCatLower.includes('analyst')) {
              if (userSkill.includes('analyst') || userSkill.includes('analysis') || userSkill.includes('video') ||
                  userSkill.includes('stats') || userSkill.includes('performance') || userSkill.includes('scouting')) {
                return true;
              }
            }

            // 8. PHYSIO - Physiotherapy and medical
            if (jobCatLower.includes('physio')) {
              if (userSkill.includes('physio') || userSkill.includes('sports physio') || userSkill.includes('masseur') ||
                  userSkill.includes('injury') || userSkill.includes('recovery') || userSkill.includes('conditioning')) {
                return true;
              }
            }

            // 9. SCORER - Scoring and administration
            if (jobCatLower.includes('scorer')) {
              if (userSkill.includes('scorer') || userSkill.includes('scoring') || userSkill.includes('stats') ||
                  userSkill.includes('record') || userSkill.includes('match admin')) {
                return true;
              }
            }

            // 10. UMPIRE - Umpiring and officiating
            if (jobCatLower.includes('umpire')) {
              if (userSkill.includes('umpire') || userSkill.includes('umpiring') || userSkill.includes('referee') ||
                  userSkill.includes('officiating') || userSkill.includes('rules')) {
                return true;
              }
            }

            // 11. COMMENTATOR - Broadcasting and commentary
            if (jobCatLower.includes('commentator')) {
              if (userSkill.includes('commentator') || userSkill.includes('commentary') || userSkill.includes('broadcasting') ||
                  userSkill.includes('presentation') || userSkill.includes('voice over')) {
                return true;
              }
            }

            // 12. CRICKET CONTENT CREATOR - Content creation
            if (jobCatLower.includes('content creator')) {
              if (userSkill.includes('content creator') || userSkill.includes('video editing') || userSkill.includes('social media') ||
                  userSkill.includes('content') || userSkill.includes('creator') || userSkill.includes('editing')) {
                return true;
              }
            }

            // 13. CRICKET PHOTO / VIDEOGRAPHY - Photography and videography
            if (jobCatLower.includes('photo') || jobCatLower.includes('videography')) {
              if (userSkill.includes('photographer') || userSkill.includes('videography') || userSkill.includes('camera') ||
                  userSkill.includes('sports photography') || userSkill.includes('video') || userSkill.includes('content')) {
                return true;
              }
            }

            // 14. OTHER - Cricket support roles + Non-cricket jobs (expanded)
            if (jobCatLower.includes('other')) {
              // Cricket support roles that don't fit other categories
              const cricketSupportRoles = [
                'groundsman', 'ground staff', 'ball boy', 'ball girl', 'equipment manager',
                'kit manager', 'team manager', 'cricket administrator', 'cricket journalist',
                'cricket statistician', 'cricket historian', 'cricket curator', 'pitch curator',
                'cricket psychologist', 'sports psychologist', 'cricket nutritionist',
                'cricket equipment supplier', 'venue manager', 'stadium manager',
                'event coordinator', 'tournament coordinator', 'cricket event manager',
                'cricket academy manager', 'cricket club secretary', 'match secretary',
                'cricket scorer assistant', 'umpire assistant', 'third umpire assistant',
                'cricket photographer assistant', 'video technician', 'broadcast assistant',
                'cricket content assistant', 'social media manager', 'cricket marketing',
                'sponsorship coordinator', 'cricket merchandise', 'fan engagement officer'
              ];

              // Check for cricket support roles
              if (cricketSupportRoles.some(role => userSkill.includes(role) || jobTitleLower.includes(role) || jobDescLower.includes(role))) {
                return true;
              }

              // Non-cricket jobs (be more permissive for jobs that might be added)
              // Allow general skills for non-cricket work like maintenance, administration, etc.
              const generalSkills = ['maintenance', 'administration', 'management', 'coordination', 'assistant', 'support'];
              if (generalSkills.some(skill => userSkill.includes(skill))) {
                return true;
              }

              // For "Other" category, be more flexible - allow any user to see these jobs
              // since they represent miscellaneous roles that might need various skill sets
              return true;
            }

            // Skill interchangeability rules (expanded)

            // Mystery spin can do off spin jobs, but not vice versa
            if (userSkill === 'mystery spin' &&
                (jobCatLower.includes('off spin') || jobCatLower.includes('spin') || jobCatLower.includes('bowling') || jobCatLower.includes('net bowler'))) {
              return true;
            }

            // Sidearm specialist can do general bowling jobs
            if (userSkill === 'sidearm specialist' &&
                (jobCatLower.includes('bowling') || jobCatLower.includes('net bowler') || jobCatLower.includes('sidearm'))) {
              return true;
            }

            // Batting coach can do batting-related jobs
            if (userSkill === 'batting coach' &&
                (jobTitleLower.includes('batting') || jobDescLower.includes('batting') || jobCatLower.includes('net batsman'))) {
              return true;
            }

            // Coaches can do training jobs
            if (userSkill.includes('coach') && jobCatLower.includes('trainer')) {
              return true;
            }

            // Trainers can do physio-related work
            if (userSkill.includes('trainer') && jobCatLower.includes('physio')) {
              return true;
            }

            // Check job title and description for skill mentions
            const combinedJobText = `${jobTitleLower} ${jobDescLower}`;
            if (combinedJobText.includes(userSkill)) {
              return true;
            }

            // Cricket-specific keyword matching (expanded)
            const cricketKeywords = {
              'off spin': ['off spin', 'finger spin', 'orthodox', 'spinner', 'spin bowling', 'right-arm off spin'],
              'mystery spin': ['mystery spin', 'doosra', 'carrom ball', 'teesra', 'deception', 'variation', 'wrong \'un'],
              'sidearm specialist': ['sidearm', 'yorker', 'death overs', 'powerplay', 'slower ball', 'back of hand'],
              'batting coach': ['batting technique', 'stroke play', 'coaching', 'training', 'batting practice', 'batting fundamentals'],
              'bowling coach': ['bowling technique', 'action correction', 'run-up', 'follow-through', 'bowling coaching'],
              'fielding coach': ['fielding drills', 'catching practice', 'ground fielding', 'throwing technique', 'fielding coaching'],
              'wicket-keeping coach': ['wicket-keeping', 'keeping technique', 'glove work', 'stumping practice', 'wicketkeeping coaching'],
              'analyst': ['analysis', 'statistics', 'metrics', 'performance', 'video analysis', 'data analysis', 'match analysis'],
              'rh batsman': ['right-handed', 'batting', 'opener', 'middle order', 'classical batting', 'right-hand batsman'],
              'physio': ['physiotherapy', 'sports medicine', 'injury prevention', 'recovery', 'rehabilitation', 'sports physio'],
              'trainer': ['conditioning', 'fitness training', 'strength training', 'sports science', 'performance training', 'athletic training'],
              'scorer': ['scoring', 'match scoring', 'statistics', 'record keeping', 'scorebook', 'match scorer'],
              'umpire': ['umpiring', 'decision making', 'rules interpretation', 'match officiating', 'cricket umpire'],
              'commentator': ['commentary', 'broadcasting', 'cricket commentary', 'match description', 'live commentary'],
              'content creator': ['content creation', 'video content', 'social media content', 'cricket content', 'digital content'],
              'photographer': ['sports photography', 'cricket photography', 'action shots', 'match photography', 'cricket photos'],
              'groundsman': ['ground maintenance', 'pitch preparation', 'outfield care', 'equipment setup', 'pitch curator'],
              'ball boy': ['ball retrieval', 'equipment management', 'court maintenance', 'match support', 'ball girl'],
              'team manager': ['team management', 'player coordination', 'match logistics', 'team administration'],
              'equipment manager': ['kit management', 'equipment maintenance', 'gear setup', 'sports equipment'],
              'cricket administrator': ['cricket administration', 'league management', 'tournament organization', 'cricket governance'],
              'cricket journalist': ['cricket journalism', 'sports writing', 'match reporting', 'cricket news'],
              'cricket psychologist': ['sports psychology', 'mental skills', 'performance psychology', 'cricket psychology'],
              'venue manager': ['venue management', 'stadium operations', 'facility management', 'event management']
            };

            const userSkillKeywords = cricketKeywords[userSkill as keyof typeof cricketKeywords] || [userSkill];
            if (userSkillKeywords.some(keyword => combinedJobText.includes(keyword))) {
              return true;
            }
          }

          return false;
        };

        // Check if this job matches user's skills
        return hasCompatibleSkill(job.category, job.title, job.description, job.skills || []);
      });

      // Filter out jobs user has already applied to (same as feed page)
      const { hasUserAppliedToJob } = await import('@/components/freelancer/jobs/mock-data');
      const finalJobs = filteredJobs.filter(job => !hasUserAppliedToJob(job.id));

      console.log(`📊 For You Jobs: Found ${finalJobs.length} jobs after filtering ${combinedJobs.length} total jobs`);
      console.log(`   User skills: ${userSkills.join(', ')}`);
      console.log(`   Combined jobs:`, combinedJobs.map(j => ({ id: j.id, title: j.title, skills: j.skills, category: j.category })));

      setForYouJobs(finalJobs);
    } catch (error) {
      console.error('Error fetching and filtering jobs:', error);
      setForYouJobs([]);
    }
  };

  const refreshForYouJobs = async () => {
    await filterForYouJobs();
  };

  useEffect(() => {
    filterForYouJobs();
  }, [skillsDependency]); // Use stable skills dependency

  // Listen for application creation events and refresh jobs
  useEffect(() => {
    const handleApplicationCreated = (event: CustomEvent) => {
      refreshForYouJobs();
    };

    const handleJobPosted = (event: CustomEvent) => {
      refreshForYouJobs();
    };

    window.addEventListener('applicationCreated', handleApplicationCreated as EventListener);
    window.addEventListener('jobPosted', handleJobPosted as EventListener);

    return () => {
      window.removeEventListener('applicationCreated', handleApplicationCreated as EventListener);
      window.removeEventListener('jobPosted', handleJobPosted as EventListener);
    };
  }, []);

  const value: ForYouJobsContextType = {
    forYouJobs,
    refreshForYouJobs,
  };

  return (
    <ForYouJobsContext.Provider value={value}>
      {children}
    </ForYouJobsContext.Provider>
  );
}

export function useForYouJobs() {
  const context = useContext(ForYouJobsContext);
  if (context === undefined) {
    throw new Error('useForYouJobs must be used within a ForYouJobsProvider');
  }
  return context;
}
