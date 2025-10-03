import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  progress?: number;
  icon?: React.ReactNode;
}

const StatCard = ({ title, value, description, progress, icon }: StatCardProps) => (
  <Card className="bg-[#1E1E1E] border border-white/5 rounded-lg overflow-hidden hover:border-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5">
    <CardHeader className="pb-2">
      <div className="flex justify-between items-center">
        <CardTitle className="text-sm font-medium text-white/70">{title}</CardTitle>
        {icon && <div className="text-purple-400">{icon}</div>}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-white">{value}</div>
      <p className="text-xs text-white/50 mt-1">{description}</p>
      {progress !== undefined && (
        <div className="mt-3">
          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-purple-600"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-white/50 mt-1">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
      )}
    </CardContent>
  </Card>
);

interface StatsCardsProps {
  completed: number;
  inProgress: number;
  rating: number;
  responseTime: string;
}

export function StatsCards({ completed, inProgress, rating, responseTime }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-6">
      <StatCard 
        title="Completed Jobs" 
        value={completed} 
        description="Total jobs completed"
      />
      <StatCard 
        title="In Progress" 
        value={inProgress} 
        description="Active projects"
      />
      <StatCard 
        title="Rating" 
        value={rating.toFixed(1)} 
        description="Average rating"
      />
      <StatCard 
        title="Avg. Response Time" 
        value={responseTime} 
        description="Time to first response"
      />
    </div>
  );
}
