"use client";

import React, { useEffect, useState } from "react";
import { Bell, ArrowLeft, CheckCircle, Calendar, MessageSquare, Info } from "lucide-react";
import { useNavbar } from "@/contexts/NavbarContext";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  entityId?: string;
  entityType?: string;
  actionUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const { setNavbarVisibility } = useNavbar();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setNavbarVisibility(false);
    return () => setNavbarVisibility(true);
  }, [setNavbarVisibility]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/notifications`);
        if (response.ok) {
          const data = await response.json();
          setNotifications(data.notifications || []);
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user?.id]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'BOOKING_CREATED':
      case 'BOOKING_CONFIRMED':
        return <Calendar className="w-5 h-5 text-purple-400" />;
      case 'PAYMENT_RECEIVED':
      case 'REFERRAL_REWARD':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'MESSAGE':
        return <MessageSquare className="w-5 h-5 text-blue-400" />;
      default:
        return <Info className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTimeAgo = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="min-h-screen bg-[#111111]">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 w-full z-30 bg-gradient-to-br from-[#6B46C1] via-[#4C1D95] to-[#2D1B69] border-b border-white/10 shadow-md">
        <div className="container mx-auto px-4 h-16 flex items-center relative">
          <Link href="/client" aria-label="Back to Dashboard" className="relative z-10">
            <button className="flex items-center justify-center text-white/80 hover:text-white/100 p-2 -ml-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400/40" aria-label="Back">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>

          {/* Absolute centered title */}
          <div className="absolute left-0 right-0 flex justify-center pointer-events-none">
            <span className="text-lg font-bold text-white">Notifications</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 pb-8 px-4 max-w-2xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-white/50 text-sm">Loading notifications...</div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Bell className="w-12 h-12 text-white/20 mb-4" />
            <div className="text-white/50 text-sm">No notifications yet</div>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif: Notification) => {
              const Content = (
                <div className="bg-[#18181b] rounded-xl p-4 border border-white/10 hover:border-white/20 transition-colors active:scale-[0.99]">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 bg-white/5 p-2 rounded-full">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium text-sm mb-1">{notif.title}</h4>
                      <p className="text-white/70 text-sm leading-relaxed mb-2">{notif.message}</p>
                      <p className="text-white/40 text-xs">{getTimeAgo(notif.createdAt)}</p>
                    </div>
                    {!notif.isRead && (
                      <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                    )}
                  </div>
                </div>
              );

              return notif.actionUrl ? (
                <Link href={notif.actionUrl} key={notif.id} className="block">
                  {Content}
                </Link>
              ) : (
                <div key={notif.id}>{Content}</div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
