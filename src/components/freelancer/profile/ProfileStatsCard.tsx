import { ArrowRight } from 'lucide-react';

interface StatItemProps {
  label: string;
  value: string | number;
  color: string;
  onViewDetails?: () => void;
}

const StatItem = ({ label, value, color, onViewDetails }: StatItemProps) => {
  const baseColor = color.split('from-')[1].split(' ')[0];
  const gradientClass = `bg-gradient-to-br ${color} to-${baseColor}/20`;
  
  return (
    <div className={`relative p-5 rounded-2xl ${gradientClass} h-full`}>
      <div className="absolute inset-0 bg-black/30 rounded-2xl" />
      <div className="relative z-10 h-full">
        <div className="flex justify-between">
          <div className="pt-1">
            <p className="text-sm font-medium text-white/80">{label}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
          </div>
          <div className="flex items-center">
            <button 
              onClick={onViewDetails}
              className="text-xs font-medium text-white/80 hover:text-white flex items-center gap-1"
            >
              View details
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ProfileStatsCardProps {
  completed: number;
  inProgress: number;
  responseTime: string;
  totalEarnings: string;
  pendingJobs?: number;
}

export function ProfileStatsCard({ 
  completed, 
  inProgress, 
  responseTime,
  totalEarnings,
  pendingJobs = 3
}: ProfileStatsCardProps) {
  const handleViewDetails = (section: string) => {
    // You can replace this with your navigation logic or modal opening
    console.log(`Viewing details for ${section}`);
    // Example: router.push(`/freelancer/stats/${section.toLowerCase().replace(/\s+/g, '-')}`);
  };

  return (
    <div className="space-y-4 mb-8">
      <h3 className="text-lg font-semibold text-white">Performance Overview</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatItem 
          label="Completed Jobs"
          value={completed}
          color="from-[#FF8A3D]"
          onViewDetails={() => handleViewDetails('Completed Jobs')}
        />
        
        <StatItem 
          label="Avg. Response"
          value={responseTime}
          color="from-[#6B46C1]"
          onViewDetails={() => handleViewDetails('Response Time')}
        />
        
        <StatItem 
          label="Total Earnings"
          value={totalEarnings}
          color="from-[#38B2AC]"
          onViewDetails={() => handleViewDetails('Earnings')}
        />
        
        <StatItem 
          label="Pending Jobs"
          value={pendingJobs}
          color="from-[#4299E1]"
          onViewDetails={() => handleViewDetails('Pending Jobs')}
        />
      </div>
    </div>
  );
}

export default ProfileStatsCard;
