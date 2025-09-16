"use client"

import { useState } from 'react'
import { Menu, Bell, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const notifications = [
  {
    id: 1,
    title: 'New Application',
    message: 'John applied for your plumbing job',
    time: '5m ago',
  },
  {
    id: 2,
    title: 'Booking Confirmed',
    message: 'Your tutoring session is confirmed for tomorrow',
    time: '1h ago',
  },
  {
    id: 3,
    title: 'Payment Received',
    message: 'You received $75 for the plumbing service',
    time: '2h ago',
  },
]

const menuItems = [
  { name: 'Settings', href: '/settings' },
  { name: 'Help & Support', href: '/help' },
  { name: 'Terms & Conditions', href: '/terms' },
  { name: 'Privacy Policy', href: '/privacy' },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(3)

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <button
          className="p-2 hover:bg-gray-100 rounded-lg"
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex-1"></div>

        <div className="relative">
          <button
            className="p-2 hover:bg-gray-100 rounded-lg relative"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          >
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Notifications Dropdown */}
        {isNotificationsOpen && (
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Notifications</h3>
                  <button
                    className="text-sm text-primary"
                    onClick={() => setUnreadCount(0)}
                  >
                    Mark all as read
                  </button>
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-4 border-b last:border-b-0 hover:bg-gray-50"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{notification.title}</h4>
                        <p className="text-sm text-gray-600">
                          {notification.message}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {notification.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Menu Sidebar */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
            <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-lg">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Menu</h3>
                  <button
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <nav className="p-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block py-2 text-gray-600 hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  )
} 