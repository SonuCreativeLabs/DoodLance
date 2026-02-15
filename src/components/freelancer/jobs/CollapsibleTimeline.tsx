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
    'Job marked completed by freelancer': 'Freelancer submitted work for client approval',
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
    <div className="relative overflow-hidden rounded-xl bg-[#111111] border border-gray-600/30 shadow-lg">

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
            <div key={index} className="relative pl-4">
              {/* Tooltip positioned above timeline item */}
              <div className="absolute z-50 -top-12 left-1/2 transform -translate-x-1/2 px-3 py-2 bg-black border border-gray-600 rounded-lg shadow-xl hidden max-w-xs w-max"
                style={{ pointerEvents: 'none' }}>
                <div className="text-xs text-gray-300 leading-relaxed text-center whitespace-nowrap">
                  {getTimelineTooltipContent(item.label)}
                </div>
                {/* Arrow pointing down to info icon */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black border-r border-b border-gray-600 rotate-45"></div>
              </div>
              {/* No icon - clean timeline */}
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-white">{item.label}</p>
                  <div className="relative inline-block">
                    <Info
                      className="w-3 h-3 text-gray-400 hover:text-white transition-colors cursor-help"
                      onMouseEnter={(e) => {
                        const timelineItem = e.currentTarget.closest('.relative.pl-4') as HTMLElement;
                        const tooltip = timelineItem?.querySelector('div.absolute.z-50') as HTMLElement;
                        if (tooltip) tooltip.style.display = 'block';
                      }}
                      onMouseLeave={(e) => {
                        const timelineItem = e.currentTarget.closest('.relative.pl-4') as HTMLElement;
                        const tooltip = timelineItem?.querySelector('div.absolute.z-50') as HTMLElement;
                        if (tooltip) tooltip.style.display = 'none';
                      }}
                      onClick={(e) => {
                        const timelineItem = e.currentTarget.closest('.relative.pl-4') as HTMLElement;
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
                    {new Date(item.date).toLocaleString('en-IN', {
                      timeZone: 'Asia/Kolkata',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
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
// Helper to safely get a valid ISO string from a date input
const getSafeIsoDate = (dateInfo: any, fallbackDelay = 0): string => {
  try {
    if (dateInfo && dateInfo !== 'TBD') {
      const d = new Date(dateInfo);
      if (!isNaN(d.getTime())) {
        return new Date(d.getTime() + fallbackDelay).toISOString();
      }
    }
  } catch (e) {
    // Ignore error
  }
  return new Date(Date.now() + fallbackDelay).toISOString();
};

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
          date: item.appliedDate ? getSafeIsoDate(item.appliedDate, 3600000) : getSafeIsoDate(Date.now(), 3600000),
          completed: true,
          icon: CheckCircle,
          color: 'bg-purple-500'
        },
        {
          label: '🎉 Victory! You\'re In The Game!',
          date: item.appliedDate ? getSafeIsoDate(item.appliedDate, 7200000) : getSafeIsoDate(Date.now(), 7200000),
          completed: true,
          icon: CheckCircle,
          color: 'bg-green-500'
        }
      );
    } else if (item.status === 'rejected') {
      timelineItems.push(
        {
          label: '👀 Client Spotted Your Skills!',
          date: item.appliedDate ? getSafeIsoDate(item.appliedDate, 3600000) : getSafeIsoDate(Date.now(), 3600000),
          completed: true,
          icon: CheckCircle,
          color: 'bg-purple-500'
        },
        {
          label: '❌ Strike Out - Keep Playing!',
          date: item.appliedDate ? getSafeIsoDate(item.appliedDate, 7200000) : getSafeIsoDate(Date.now(), 7200000),
          completed: true,
          icon: XCircle,
          color: 'bg-red-500'
        }
      );
    } else if (item.status === 'withdrawn') {
      timelineItems.push(
        {
          label: '👀 Client Spotted Your Skills!',
          date: item.appliedDate ? getSafeIsoDate(item.appliedDate, 3600000) : getSafeIsoDate(Date.now(), 3600000),
          completed: true,
          icon: CheckCircle,
          color: 'bg-purple-500'
        },
        {
          label: '🏃 Walked Away From This One',
          date: item.appliedDate ? getSafeIsoDate(item.appliedDate, 7200000) : getSafeIsoDate(Date.now(), 7200000),
          completed: true,
          icon: XCircle,
          color: 'bg-gray-500'
        }
      );
    } else if (item.status === 'completed') {
      timelineItems.push(
        {
          label: '👀 Client Spotted Your Skills!',
          date: item.appliedDate ? getSafeIsoDate(item.appliedDate, 3600000) : getSafeIsoDate(Date.now(), 3600000),
          completed: true,
          icon: CheckCircle,
          color: 'bg-purple-500'
        },
        {
          label: '🏏 Session Victory!',
          date: item.appliedDate ? getSafeIsoDate(item.appliedDate, 7200000) : getSafeIsoDate(Date.now(), 7200000),
          completed: true,
          icon: CheckCircle,
          color: 'bg-green-500'
        },
        {
          label: '🎯 Deal Secured - Job Completed!',
          date: item.appliedDate ? getSafeIsoDate(item.appliedDate, 86400000) : getSafeIsoDate(Date.now(), 86400000),
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
          date: item.appliedDate ? getSafeIsoDate(item.appliedDate, 3600000) : getSafeIsoDate(Date.now(), 3600000),
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
        date: item.proposalHistory.clientSpottedDate || getSafeIsoDate(item.proposalHistory.appliedDate, 3600000),
        completed: true,
        icon: CheckCircle,
        color: 'bg-purple-500'
      });

      timelineItems.push({
        label: '🎉 Victory! You\'re In The Game!',
        date: item.proposalHistory.acceptedDate || getSafeIsoDate(item.proposalHistory.appliedDate, 7200000),
        completed: true,
        icon: CheckCircle,
        color: 'bg-green-500'
      });
    } else {
      // For jobs without proposal history (direct assignments)
      timelineItems.push({
        label: item.isDirectHire ? '📅 Booking Confirmed' : '🏏 Session Announced!',
        date: item.createdAt || new Date().toISOString(), // Strictly use booking creation time
        completed: true,
        icon: CheckCircle,
        color: 'bg-purple-500' // Changed to purple-500 for consistency
      });
    }

    // Add job-specific timeline items based on status
    if (item.status === 'started' || item.status === 'ongoing' || item.status === 'completed' || item.status === 'delivered' || item.status === 'completed_by_freelancer' || item.status === 'completed_by_client') {
      // ONLY show if startedAt exists or status implies it has started
      // User requested: "start job time will show the time when the freelancer start the job... not the scheduled time"
      const startTime = item.startedAt;

      if (startTime) {
        timelineItems.push({
          label: '🏃 Game On - Work Started!',
          date: startTime,
          completed: true,
          icon: CheckCircle,
          color: 'bg-blue-500'
        });
      } else if (item.status !== 'pending' && item.status !== 'confirmed') {
        // Fallback only if status implies start but no timestamp (migration case)
        // But user wants strictness. Let's keep it safe but prioritize startedAt.
        // If no startedAt, we might default to scheduledAt? User said NO.
        // "not the scheduled time, the time hwen they actually start the session."
        // If data is missing (old jobs), maybe don't show or show "Started" without date?
        // Let's show it if status is started/beyond, but date might be fallback if needed, or null.
        // Re-reading: "start job time will show the time when the freelancer start the job... not the scheduled time"
        // This implies if they haven't started (no OTP), don't show it?
        // Or if they have, show the actual time.
        // If we don't have stored time for old jobs, we might have to fallback or show "Time not recorded".
        // Let's stick to item.startedAt if available.
        // If status is 'started' but no date, it's an edge case.
        timelineItems.push({
          label: '🏃 Game On - Work Started!',
          date: item.startedAt || null, // Don't fallback to scheduledAt
          completed: true,
          icon: CheckCircle,
          color: 'bg-blue-500'
        });
      }
    }

    // Determine sequence of completion
    // Case 1: Client marked complete (either partially or fully)
    if (item.status === 'completed_by_client' || ((item as any).clientConfirmedAt && item.status === 'completed')) {
      timelineItems.push({
        label: '☝️ Umpire\'s Signal - Client Marked Complete',
        date: (item as any).clientConfirmedAt || null, // Strict
        completed: true,
        icon: CheckCircle,
        color: 'bg-amber-500'
      });

      // If NOT fully completed yet, show waiting message
      if (item.status !== 'completed') {
        timelineItems.push({
          label: '⏳ Waiting for You to Confirm',
          date: null,
          completed: false,
          icon: CheckCircle,
          color: 'bg-white/10'
        });
      }
    }

    // Case 2: Freelancer marked complete (either partially or fully)
    if (item.status === 'delivered' || item.status === 'completed_by_freelancer' || (item.deliveredAt && item.status === 'completed')) {
      // If client finished first, this label might change or we keep 'Work Delivered'
      // But usually Freelancer delivers -> Client confirms.
      // If Client confirms first -> Freelancer confirms (finishes).

      // Use a flag to avoid duplication if logic overlaps
      const isDuplicate = timelineItems.some(t => t.label === '📝 Work Delivered');
      if (!isDuplicate) {
        timelineItems.push({
          label: '📝 Work Delivered',
          date: item.deliveredAt || null, // Strict
          completed: true,
          icon: CheckCircle,
          color: 'bg-indigo-500'
        });
      }

      // If NOT fully completed AND client hasn't confirmed yet (this is the only action so far)
      if (item.status !== 'completed' && !item.clientConfirmedAt) {
        timelineItems.push({
          label: '⏳ Waiting for Client Approval',
          date: null,
          completed: false,
          icon: CheckCircle,
          color: 'bg-white/10'
        });
      }
    }

    if (item.status === 'completed') {
      timelineItems.push({
        label: '🎯 Deal Secured - Job Fully Completed!',
        date: item.completedAt || new Date().toISOString(), // Final completion time
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
