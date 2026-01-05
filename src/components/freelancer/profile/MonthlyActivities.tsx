import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity, Loader2 } from "lucide-react";
import { EmptyState } from '@/components/freelancer/profile/EmptyState';

interface MonthlyStats {
  name: string;
  earnings: number;
  jobs: number;
}

interface MonthlyActivitiesProps {
  isLoading: boolean;
  monthlyStats?: MonthlyStats[];
}

export function MonthlyActivities({ isLoading, monthlyStats }: MonthlyActivitiesProps) {
  if (isLoading) {
    return (
      <div className="bg-[#1E1E1E] rounded-xl border border-white/10 p-6 h-[400px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (!monthlyStats || monthlyStats.length === 0 || monthlyStats.every(m => m.earnings === 0)) {
    return (
      <div className="bg-[#1E1E1E] rounded-xl border border-white/10 p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Monthly Earnings</h3>
        <EmptyState
          icon={Activity}
          title="No earnings yet"
          description="Complete jobs to see your monthly earnings analytics here."
        />
      </div>
    );
  }

  return (
    <div className="bg-[#1E1E1E] rounded-xl border border-white/10 p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Monthly Earnings</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyStats}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#111',
                border: '1px solid #333',
                borderRadius: '8px',
                color: '#fff'
              }}
              cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
              formatter={(value: number) => [`₹${value}`, 'Earnings']}
            />
            <Bar
              dataKey="earnings"
              fill="#8B5CF6"
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
