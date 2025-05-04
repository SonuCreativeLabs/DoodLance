"use client";
import { Bell, CheckCircle, Briefcase, MessageCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

const notifications = [
  {
    id: 1,
    type: "job",
    title: "New Job Posted",
    description: "A new plumbing job is available near you.",
    time: "2 min ago",
    icon: <Briefcase className="w-5 h-5 text-purple-400" />,
  },
  {
    id: 2,
    type: "message",
    title: "New Message",
    description: "Client John Doe sent you a message.",
    time: "10 min ago",
    icon: <MessageCircle className="w-5 h-5 text-green-400" />,
  },
  {
    id: 3,
    type: "job",
    title: "Job Completed",
    description: "You have successfully completed the electrical job.",
    time: "1 hour ago",
    icon: <CheckCircle className="w-5 h-5 text-amber-400" />,
  },
];

export default function NotificationsPage() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="flex items-center gap-2 mb-6">
        <Link
          href="/freelancer"
          className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-purple-700/80 to-purple-400/70 shadow-md hover:from-purple-600 hover:to-purple-500 border border-purple-500/30 hover:border-purple-400/60 transition-all duration-200 focus:ring-2 focus:ring-purple-400/40 focus:outline-none group"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5 text-white group-hover:text-purple-100 transition-colors" />
        </Link>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Bell className="w-6 h-6 text-purple-400" /> Notifications
        </h1>
      </div>
      <div className="space-y-4">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-purple-600/10 to-purple-400/10 border border-purple-500/20 hover:border-purple-500/40 transition-colors"
          >
            <div>{n.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-white text-base truncate">{n.title}</h2>
                <span className="text-xs text-white/50 ml-2 whitespace-nowrap">{n.time}</span>
              </div>
              <p className="text-sm text-white/70 truncate">{n.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
