"use client"

import { useState } from 'react'
import { Menu, Bell, X, Wallet, LogOut, LogIn, User } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

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
  const { user, isAuthenticated, signOut } = useAuth()
  const router = useRouter()

  // Robust check: isAuthenticated AND user object must exist
  const showAuth = isAuthenticated && !!user;

  const handleLogout = async () => {
    try {
      await signOut()
      setIsMenuOpen(false)
      // Router push is handled in signOut but safe to add here if needed
    } catch (error) {
      console.error('Logout failed', error)
    }
  }

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

        {isAuthenticated && (
          <div className="flex items-center gap-2">
            {/* Wallet Link Removed */}

            <div className="relative">
              <button
                className="p-2 hover:bg-gray-100 rounded-lg relative"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium min-w-[20px]">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        )}

        {!isAuthenticated && (
          <Link href="/auth/login" className="text-sm font-medium hover:text-primary transition-colors">
            Login
          </Link>
        )}

        {/* Notifications Dropdown */}
        {isNotificationsOpen && showAuth && (
          <div className="absolute right-0 mt-2 w-80 sm:w-96 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-lg border border-gray-200 top-16 right-4 sm:right-8">
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

        {/* Menu Sidebar */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Sidebar */}
            <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-lg animate-in slide-in-from-left duration-200">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-semibold text-lg">Menu</h3>
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 border-b">
                {showAuth && user ? (
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                      ) : (
                        <User className="w-6 h-6 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium truncate max-w-[150px]">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[150px]">{user.email}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-3">Sign in to manage your account</p>
                    <Link
                      href="/auth/login"
                      className="block w-full py-2 px-4 bg-primary text-white rounded-lg text-center font-medium hover:bg-primary/90 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login / Sign Up
                    </Link>
                  </div>
                )}
              </div>

              <nav className="p-4 space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>{item.name}</span>
                  </Link>
                ))}

                {showAuth && (
                  <>
                    <hr className="my-2 border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </>
                )}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  )
} 