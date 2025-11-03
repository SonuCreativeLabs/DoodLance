'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, XCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TimelineItem {
  label: string;
  date: string | null;
  completed: boolean;
  icon: any;
  color: string;
}

interface CollapsibleTimelineProps {
  items: TimelineItem[];
  title?: string;
  defaultExpanded?: boolean;
}

// Tooltip content for each timeline event type
const getTimelineTooltipContent = (label: string): string => {
  const tooltipMap: Record<string, string> = {
    '🏏 Session Announced!': 'Client posted the job',
    '🎯 Application Launched!': 'You applied to this job',
    '👀 Client Spotted Your Skills!': 'Client viewed your application',
    '🎉 Victory! You\'re In The Game!': 'Your application was accepted',
    '🏃 Game On - Work Started!': 'Job officially started',
    '🎯 Deal Secured - Job Completed!': 'Job completed and payment processed',
    '⏳ Waiting For The Umpire\'s Call': 'Waiting for client\'s decision',
    '❌ Strike Out - Keep Playing!': 'Your application was rejected',
    '🏃 Walked Away From This One': 'You withdrew your application',
    '❌ Session Cancelled': 'Job was cancelled before completion',
    '❌ Match Called Off': 'Application was cancelled',
    '⏰ Application Timed Out': 'Application expired with no response'
  };

  return tooltipMap[label] || 'Timeline event information';
};

export function CollapsibleTimeline({ items, title = "Timeline", defaultExpanded = false }: CollapsibleTimelineProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Get the latest (most recent) completed item
  const latestItem = items.filter(item => item.completed).pop() || items[0];
  const displayedItems = isExpanded ? items : [latestItem];

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#111111] via-[#0f0f0f] to-[#111111] border border-gray-600/30 shadow-lg">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/5 rounded-full blur-xl"></div>

      {/* Card content */}
      <div className="relative p-5">
        {/* Header with expand/collapse */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
          </div>
          {items.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-white hover:bg-white/5 p-2"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          {displayedItems.map((item, index) => (
            <div key={index} className="relative pl-10">
              {/* Tooltip positioned above timeline item */}
              <div className="absolute z-50 -top-12 left-1/2 transform -translate-x-1/2 px-3 py-2 bg-black border border-gray-600 rounded-lg shadow-xl hidden max-w-xs w-max"
                   style={{ pointerEvents: 'none' }}>
                <div className="text-xs text-gray-300 leading-relaxed text-center whitespace-nowrap">
                  {getTimelineTooltipContent(item.label)}
                </div>
                {/* Arrow pointing down to info icon */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black border-r border-b border-gray-600 rotate-45"></div>
              </div>
              <div className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center ${item.color}`}>
                <item.icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-white">{item.label}</p>
                  <div className="relative inline-block">
                    <Info
                      className="w-3 h-3 text-gray-400 hover:text-white transition-colors cursor-help"
                      onMouseEnter={(e) => {
                        const timelineItem = e.currentTarget.closest('.relative.pl-10') as HTMLElement;
                        const tooltip = timelineItem?.querySelector('div.absolute.z-50') as HTMLElement;
                        if (tooltip) tooltip.style.display = 'block';
                      }}
                      onMouseLeave={(e) => {
                        const timelineItem = e.currentTarget.closest('.relative.pl-10') as HTMLElement;
                        const tooltip = timelineItem?.querySelector('div.absolute.z-50') as HTMLElement;
                        if (tooltip) tooltip.style.display = 'none';
                      }}
                      onClick={(e) => {
                        const timelineItem = e.currentTarget.closest('.relative.pl-10') as HTMLElement;
                        const tooltip = timelineItem?.querySelector('div.absolute.z-50') as HTMLElement;
                        if (tooltip) {
                          const isVisible = tooltip.style.display === 'block';
                          tooltip.style.display = isVisible ? 'none' : 'block';
                        }
                      }}
                      aria-label={`Information about ${item.label}`}
                      role="button"
                      tabIndex={0}
                    />
                  </div>
                </div>
                {item.date ? (
                  <p className="text-xs text-white/60">
                    {new Date(item.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                ) : (
                  <p className="text-xs text-white/40">
                    {item.completed ? 'Completed' : 'Awaiting action'}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Common timeline utility for cricket-themed gamified messages
export const createTimelineItems = (type: 'proposal' | 'job', item: any) => {
  const timelineItems = [];

  if (type === 'proposal') {
    // Proposal timeline
    timelineItems.push({
      label: '🎯 Application Launched!',
      date: item.appliedDate || new Date().toISOString(),
      completed: true,
      icon: CheckCircle,
      color: 'bg-purple-500'
    });

    // Add timeline items based on status
    if (item.status === 'accepted') {
      timelineItems.push(
        {
          label: '👀 Client Spotted Your Skills!',
          date: item.appliedDate ? new Date(new Date(item.appliedDate).getTime() + 3600000).toISOString() : new Date(Date.now() + 3600000).toISOString(),
          completed: true,
          icon: CheckCircle,
          color: 'bg-purple-500'
        },
        {
          label: '🎉 Victory! You\'re In The Game!',
          date: item.appliedDate ? new Date(new Date(item.appliedDate).getTime() + 7200000).toISOString() : new Date(Date.now() + 7200000).toISOString(),
          completed: true,
          icon: CheckCircle,
          color: 'bg-green-500'
        }
      );
    } else if (item.status === 'rejected') {
      timelineItems.push(
        {
          label: '👀 Client Spotted Your Skills!',
          date: item.appliedDate ? new Date(new Date(item.appliedDate).getTime() + 3600000).toISOString() : new Date(Date.now() + 3600000).toISOString(),
          completed: true,
          icon: CheckCircle,
          color: 'bg-purple-500'
        },
        {
          label: '❌ Strike Out - Keep Playing!',
          date: item.appliedDate ? new Date(new Date(item.appliedDate).getTime() + 7200000).toISOString() : new Date(Date.now() + 7200000).toISOString(),
          completed: true,
          icon: XCircle,
          color: 'bg-red-500'
        }
      );
    } else if (item.status === 'withdrawn') {
      timelineItems.push(
        {
          label: '👀 Client Spotted Your Skills!',
          date: item.appliedDate ? new Date(new Date(item.appliedDate).getTime() + 3600000).toISOString() : new Date(Date.now() + 3600000).toISOString(),
          completed: true,
          icon: CheckCircle,
          color: 'bg-purple-500'
        },
        {
          label: '🏃 Walked Away From This One',
          date: item.appliedDate ? new Date(new Date(item.appliedDate).getTime() + 7200000).toISOString() : new Date(Date.now() + 7200000).toISOString(),
          completed: true,
          icon: XCircle,
          color: 'bg-gray-500'
        }
      );
    } else if (item.status === 'completed') {
      timelineItems.push(
        {
          label: '👀 Client Spotted Your Skills!',
          date: item.appliedDate ? new Date(new Date(item.appliedDate).getTime() + 3600000).toISOString() : new Date(Date.now() + 3600000).toISOString(),
          completed: true,
          icon: CheckCircle,
          color: 'bg-purple-500'
        },
        {
          label: '🏏 Session Victory!',
          date: item.appliedDate ? new Date(new Date(item.appliedDate).getTime() + 7200000).toISOString() : new Date(Date.now() + 7200000).toISOString(),
          completed: true,
          icon: CheckCircle,
          color: 'bg-green-500'
        },
        {
          label: '🎯 Deal Secured - Job Completed!',
          date: item.appliedDate ? new Date(new Date(item.appliedDate).getTime() + 86400000).toISOString() : new Date(Date.now() + 86400000).toISOString(),
          completed: true,
          icon: CheckCircle,
          color: 'bg-emerald-500'
        }
      );
    } else {
      // For pending status, show viewed as completed and add waiting for decision
      timelineItems.push(
        {
          label: '👀 Client Spotted Your Skills!',
          date: item.appliedDate ? new Date(new Date(item.appliedDate).getTime() + 3600000).toISOString() : new Date(Date.now() + 3600000).toISOString(),
          completed: true,
          icon: CheckCircle,
          color: 'bg-purple-500'
        },
        {
          label: '⏳ Waiting For The Umpire\'s Call',
          date: null,
          completed: false,
          icon: CheckCircle,
          color: 'bg-white/10'
        }
      );
    }

    // Add final status if applicable
    if (['cancelled', 'expired'].includes(item.status)) {
      const statusLabels = {
        cancelled: '❌ Match Called Off',
        expired: '⏰ Application Timed Out'
      };
      timelineItems.push({
        label: statusLabels[item.status as keyof typeof statusLabels],
        date: new Date().toISOString(),
        completed: true,
        icon: XCircle,
        color: 'bg-red-500'
      });
    }
  } else if (type === 'job') {
    // Job timeline - include complete proposal history if available for continuity
    if (item.proposalHistory) {
      // Include complete proposal stages for continuity
      timelineItems.push({
        label: '🏏 Session Announced!',
        date: item.proposalHistory.postedAt || item.proposalHistory.createdAt || item.date || item.createdAt || item.postedAt || new Date().toISOString(),
        completed: true,
        icon: CheckCircle,
        color: 'bg-blue-500'
      });

      timelineItems.push({
        label: '🎯 Application Launched!',
        date: item.proposalHistory.appliedDate,
        completed: true,
        icon: CheckCircle,
        color: 'bg-purple-500'
      });

      timelineItems.push({
        label: '👀 Client Spotted Your Skills!',
        date: item.proposalHistory.clientSpottedDate || new Date(new Date(item.proposalHistory.appliedDate).getTime() + 3600000).toISOString(),
        completed: true,
        icon: CheckCircle,
        color: 'bg-purple-500'
      });

      timelineItems.push({
        label: '🎉 Victory! You\'re In The Game!',
        date: item.proposalHistory.acceptedDate || new Date(new Date(item.proposalHistory.appliedDate).getTime() + 7200000).toISOString(),
        completed: true,
        icon: CheckCircle,
        color: 'bg-green-500'
      });
    } else {
      // For jobs without proposal history (direct assignments)
      timelineItems.push({
        label: '🏏 Session Announced!',
        date: item.date || item.createdAt || item.postedAt || new Date().toISOString(),
        completed: true,
        icon: CheckCircle,
        color: 'bg-purple-500'
      });
    }

    // Add job-specific timeline items based on status
    if (item.status === 'started' || item.status === 'ongoing') {
      timelineItems.push({
        label: '🏃 Game On - Work Started!',
        date: item.startedAt || (item.date ? new Date(new Date(item.date).getTime() + 7200000).toISOString() : new Date(Date.now() + 7200000).toISOString()),
        completed: true,
        icon: CheckCircle,
        color: 'bg-blue-500'
      });
    } else if (item.status === 'completed') {
      timelineItems.push({
        label: '🏃 Game On - Work Started!',
        date: item.startedAt || (item.date ? new Date(new Date(item.date).getTime() + 7200000).toISOString() : new Date(Date.now() + 7200000).toISOString()),
        completed: true,
        icon: CheckCircle,
        color: 'bg-blue-500'
      });
      timelineItems.push({
        label: '🎯 Deal Secured - Job Completed!',
        date: item.completedAt || new Date().toISOString(),
        completed: true,
        icon: CheckCircle,
        color: 'bg-emerald-500'
      });
    } else if (item.status === 'cancelled') {
      timelineItems.push({
        label: '❌ Session Cancelled',
        date: item.cancelledAt || new Date().toISOString(),
        completed: true,
        icon: XCircle,
        color: 'bg-red-500'
      });
    }
  }

  return timelineItems;
};
