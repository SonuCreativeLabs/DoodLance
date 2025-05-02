"use client";

import React from "react";
import { Bell, ArrowLeft } from "lucide-react";
import Link from "next/link";

const mockNotifications = [
  { id: 1, message: "Your booking with Priya Lakshmi is confirmed.", time: "2 min ago", unread: true },
  { id: 2, message: "Rajesh Kumar has sent you a new message.", time: "15 min ago", unread: true },
  { id: 3, message: "Your payment for Home Cleaning is complete.", time: "1 hour ago", unread: false },
  { id: 4, message: "Reminder: AC Repair appointment tomorrow at 10:00 AM.", time: "3 hours ago", unread: false },
];

export default function NotificationsPage() {
  const unread = mockNotifications.filter(n => n.unread);
  const read = mockNotifications.filter(n => !n.unread);

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-[#18181b] to-[#2D1B69] flex flex-col">
      <header className="w-full px-4 py-4 flex items-center gap-3 border-b border-white/10 bg-[#18181b] sticky top-0 z-10">
  <Link href="/client" aria-label="Back" className="mr-2">
    <ArrowLeft className="w-6 h-6 text-white hover:text-purple-400 transition" />
  </Link>
  <Bell className="w-7 h-7 text-purple-400" />
  <h1 className="text-2xl font-bold text-white">Notifications</h1>
</header>
      <section className="flex-1 w-full max-w-xl mx-auto px-2 py-4 sm:px-0">
  <ul className="flex flex-col gap-2">
    {mockNotifications.map((notif) => (
      <li key={notif.id} className="flex items-start gap-3 bg-[#232136] rounded-lg px-4 py-3">
        {notif.unread ? (
          <span className="mt-2 w-2 h-2 rounded-full bg-purple-400 inline-block" title="Unread"></span>
        ) : (
          <span className="mt-2 w-2 h-2 rounded-full bg-transparent inline-block" />
        )}
        <div>
          <span className="text-white text-base">{notif.message}</span>
          <span className="block text-xs text-white/40 mt-1">{notif.time}</span>
        </div>
      </li>
    ))}
  </ul>
</section>
    </main>
  );
}
