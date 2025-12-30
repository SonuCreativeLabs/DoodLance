import { Activity } from "lucide-react";
import { EmptyState } from '@/components/freelancer/profile/EmptyState';

interface MonthlyActivitiesProps {
  isLoading: boolean;
}

export function MonthlyActivities({ isLoading }: MonthlyActivitiesProps) {
  return (
    <EmptyState
      icon={Activity}
      title="Performance Analytics"
      description="Your activity and earnings analytics will appear here once you start completing jobs on DoodLance."
    />
  );
}
