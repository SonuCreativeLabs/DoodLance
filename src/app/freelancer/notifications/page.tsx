"use client";
import { CheckCircle, Briefcase, MessageCircle, ArrowLeft, Inbox } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface Notification {
  id: string;
  type: "job" | "message" | "payment" | "system";
  title: string;
  description: string;
  time: string;
  icon: React.ReactNode;
  unread: boolean;
  entityId?: string;
  actionUrl?: string;
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch notifications from API
    const fetchNotifications = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        // In production, fetch from your API
        // const response = await fetch(`/api/notifications?userId=${user.id}`);
        // const data = await response.json();
        
        // For now, set to empty state
        setNotifications([]);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user?.id]);

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="min-h-screen bg-[#111111]">
      {/* Simple Header */}
      <div className="sticky top-0 z-40 bg-[#111111]/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/freelancer"
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-lg transition-all duration-200 focus:ring-2 focus:ring-purple-400/40 focus:outline-none group border border-white/10 hover:border-purple-500/30"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 text-white/80 group-hover:text-purple-400 transition-colors" />
            </Link>
            <h1 className="text-xl font-semibold text-white flex items-center gap-2">
              Notifications
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-gradient-to-r from-purple-600 to-purple-400 text-white text-xs font-bold rounded-full">
                  {unreadCount}
                </span>
              )}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-white/50 text-sm">Loading notifications...</div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Inbox className="w-12 h-12 text-white/20 mb-4" />
            <div className="text-white/50 text-sm">No notifications yet</div>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification: Notification) => (
              <div
                key={notification.id}
                className={`rounded-2xl px-4 py-3 border transition-all duration-200 relative ${
                  notification.unread
                    ? 'bg-gradient-to-br from-[#1E1E1E] to-[#1A1A1A] border-white/5 hover:border-white/10'
                    : 'bg-[#111111] border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {notification.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-[14px] font-semibold leading-tight ${
                          notification.unread ? 'text-white' : 'text-white/90'
                        }`}>
                          {notification.title}
                        </h3>
                      </div>
                      <span className="text-xs text-white/50 flex-shrink-0">{notification.time}</span>
                    </div>
                    <p className={`text-[12px] leading-relaxed ${
                      notification.unread ? 'text-white/80' : 'text-white/70'
                    }`}>
                      {notification.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
