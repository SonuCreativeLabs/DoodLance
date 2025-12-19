'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Stat {
  label: string;
  value: string;
  trend: 'up' | 'down';
  change: string;
  bgColor: string;
  icon: any;
  iconColor: string;
}

const stats: Stat[] = [
  // Add your stats data here
  {
    label: 'Label 1',
    value: 'Value 1',
    trend: 'up',
    change: '10%',
    bgColor: 'bg-green-500',
    icon: <svg />,
    iconColor: 'text-white',
  },
  // Add more stats data here
];

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard
    router.push('/admin/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-[#1a1a1a] border-gray-800 p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-gray-400 text-xs sm:text-sm">{stat.label}</p>
                <p className="text-xl sm:text-2xl font-bold text-white mt-1 sm:mt-2">{stat.value}</p>
                <div className="flex items-center gap-1 sm:gap-2 mt-2 sm:mt-3">
                  <span className={`text-xs sm:text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {stat.trend === 'up' ? '↑' : '↓'} {stat.change}
                  </span>
                  <span className="text-gray-500 text-xs hidden sm:inline">vs last week</span>
                </div>
              </div>
              <div className={`p-2 sm:p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.iconColor}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
    </div>
  );
}

// You need to define the Card component
function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
