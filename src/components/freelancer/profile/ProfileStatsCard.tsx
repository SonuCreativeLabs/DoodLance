
interface ProfileStatsCardProps {
  completed: number;
  inProgress: number;
  totalWorkingHours: string;
  totalEarnings: string;
  pendingJobs?: number;
}

const StatRow = ({ label, value, border = true }: { label: string; value: string | number; border?: boolean }) => (
  <div className={`flex justify-between items-center py-2.5 ${border ? 'border-b border-white/5' : ''}`}>
    <span className="text-sm text-white/80">{label}</span>
    <span className="text-white font-medium">{value}</span>
  </div>
);

export function ProfileStatsCard({ 
  completed, 
  inProgress, 
  totalWorkingHours,
  totalEarnings,
  pendingJobs = 3
}: ProfileStatsCardProps) {
  const activeJobs = inProgress + (pendingJobs || 0);
  
  const stats = [
    { label: 'Completed Jobs', value: completed },
    { label: 'Active Jobs', value: activeJobs },
    { label: 'Total Working Hours', value: totalWorkingHours },
    { label: 'Total Earnings', value: totalEarnings, border: false }
  ];

  return (
    <div className="space-y-4">
      {stats.map((stat, index) => (
        <StatRow 
          key={stat.label}
          label={stat.label}
          value={stat.value}
          border={index !== stats.length - 1}
        />
      ))}
    </div>
  );
}

export default ProfileStatsCard;
