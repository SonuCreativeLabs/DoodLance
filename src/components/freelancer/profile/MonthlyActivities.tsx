import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Calendar, ArrowUpRight } from "lucide-react";

interface ActivityData {
  month: string;
  value: number;
}

const MonthlyBarChart = ({ data }: { data: ActivityData[] }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <div className="mt-6">
      <div className="flex items-end justify-between h-40">
        {data.map((item, index) => {
          const height = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
          const isCurrentMonth = index === data.length - 1;
          
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="w-full flex justify-center">
                <div 
                  className={`w-3/4 rounded-t-sm ${
                    isCurrentMonth 
                      ? 'bg-gradient-to-t from-purple-500 to-purple-600' 
                      : 'bg-white/10'
                  }`}
                  style={{ height: `${height}%` }}
                />
              </div>
              <span className="text-xs mt-2 text-white/60">
                {item.month}
              </span>
              <span className={`text-xs mt-1 ${
                isCurrentMonth ? 'text-purple-400 font-medium' : 'text-white/40'
              }`}>
                {item.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export function MonthlyActivities() {
  const activityData: ActivityData[] = [
    { month: 'Jan', value: 12 },
    { month: 'Feb', value: 8 },
    { month: 'Mar', value: 15 },
    { month: 'Apr', value: 10 },
    { month: 'May', value: 18 },
    { month: 'Jun', value: 23 },
  ];

  const totalActivities = activityData.reduce((sum, item) => sum + item.value, 0);
  const percentChange = 42; // Example percentage change

  return (
    <Card className="border border-white/5 bg-[#1E1E1E] rounded-xl overflow-hidden hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Monthly Activities</CardTitle>
        <Calendar className="h-5 w-5 text-purple-400" />
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold">{totalActivities}</p>
            <p className="text-sm text-white/60">Total Activities</p>
          </div>
          <div className="text-right">
            <div className="flex items-center text-green-400 text-sm">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              {percentChange}% from last month
            </div>
            <p className="text-xs text-white/60">Keep up the good work!</p>
          </div>
        </div>
        
        <MonthlyBarChart data={activityData} />
        
        <div className="mt-6 flex items-center justify-between text-xs text-white/60">
          <span>Jan 1</span>
          <span>Jun 30</span>
        </div>
      </CardContent>
    </Card>
  );
}
