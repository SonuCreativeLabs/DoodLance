'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminAuthProvider, useAdminAuth } from '@/contexts/AdminAuthContext';
import Link from 'next/link';
import {
    LayoutDashboard, Users, Calendar, CreditCard,
    Briefcase, HeadphonesIcon, FileText, TrendingUp,
    Settings, Shield, LogOut, ChevronRight, Bell,
    Search, Menu, X, Package, Tag, QrCode
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

const sidebarItems = [
    {
        category: 'Main',
        items: [
            { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard', permission: 'dashboard.view' },
            { icon: Users, label: 'Users', href: '/admin/users', permission: 'users.view' },
            { icon: Calendar, label: 'Bookings', href: '/admin/bookings', permission: 'bookings.view' },
        ]
    },
    {
        category: 'Management',
        items: [
            { icon: Briefcase, label: 'Jobs', href: '/admin/jobs', permission: 'jobs.view' },
            { icon: Package, label: 'Services', href: '/admin/services', permission: 'services.view' },
            { icon: CreditCard, label: 'Transactions', href: '/admin/transactions', permission: 'transactions.view' },
        ]
    },
    {
        category: 'Support',
        items: [
            { icon: HeadphonesIcon, label: 'Support Tickets', href: '/admin/support', permission: 'support.view' },
            { icon: FileText, label: 'Reports', href: '/admin/reports', permission: 'reports.view' },
            { icon: Shield, label: 'KYC Verification', href: '/admin/verification', permission: 'verification.view' },
        ]
    },
    {
        category: 'Marketing',
        items: [
            { icon: Tag, label: 'Promo Codes', href: '/admin/promos', permission: 'promos.view' },
            { icon: QrCode, label: 'QR Campaigns', href: '/admin/campaigns', permission: 'promos.view' },
            { icon: Users, label: 'Referrals', href: '/admin/referrals', permission: 'users.view' },
            { icon: TrendingUp, label: 'Analytics', href: '/admin/analytics', permission: 'analytics.view' },
        ]
    },
    {
        category: 'System',
        items: [
            { icon: Settings, label: 'Settings', href: '/admin/settings', permission: 'settings.view' },
        ]
    }
];

function AdminLayoutContent({ children }: { children: ReactNode }) {
    const { admin, loading, logout, checkPermission, isSuper } = useAdminAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false); // Default to closed on desktop
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !admin && pathname !== '/admin/login') {
            router.push('/admin/login');
        }
    }, [admin, loading, pathname, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (!admin) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a]">

            {/* Mobile Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.aside
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        className="fixed left-0 top-0 h-full w-64 bg-[#1a1a1a] border-r border-gray-800 z-40 lg:hidden transition-all duration-300 ease-in-out"
                    >
                        <div className="h-full flex flex-col">
                            {/* Header with Logo and Close Button */}
                            <div className="p-6 pb-0">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center">
                                            <Shield className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold text-white">BAILS</h2>
                                            <p className="text-xs text-gray-400">Admin Panel</p>
                                        </div>
                                    </div>
                                    {/* Close Button - Top Right Corner */}
                                    <Button
                                        onClick={() => setMobileMenuOpen(false)}
                                        variant="ghost"
                                        size="icon"
                                        className="text-gray-400 hover:text-white hover:bg-[#2a2a2a]"
                                    >
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>

                                {/* Admin Info */}
                                <div className="mb-6 p-3 bg-purple-600/10 rounded-lg border border-purple-600/20">
                                    <p className="text-sm font-medium text-white">{admin.name}</p>
                                    <p className="text-xs text-gray-400">{admin.role}</p>
                                </div>

                                {/* Search */}
                                <div className="relative mb-6">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        placeholder="Search..."
                                        className="pl-9 bg-[#2a2a2a] border-gray-700 text-white placeholder:text-gray-500"
                                    />
                                </div>
                            </div>

                            {/* Scrollable Navigation */}
                            <div className="flex-1 overflow-y-auto px-6 pb-6">
                                <nav className="space-y-6">
                                    {sidebarItems.map((section) => (
                                        <div key={section.category}>
                                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                                {section.category}
                                            </h3>
                                            <div className="space-y-1">
                                                {section.items.map((item) => {
                                                    const hasPermission = isSuper || checkPermission(item.permission);
                                                    const isActive = pathname === item.href;

                                                    if (!hasPermission) return null;

                                                    return (
                                                        <Link
                                                            key={item.href}
                                                            href={item.href}
                                                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${isActive
                                                                ? 'bg-purple-600/20 text-purple-400 border-l-2 border-purple-600'
                                                                : 'text-gray-300 hover:bg-[#2a2a2a] hover:text-white'
                                                                }`}
                                                            onClick={() => setMobileMenuOpen(false)}
                                                        >
                                                            <item.icon className="w-5 h-5" />
                                                            <span className="text-sm">{item.label}</span>
                                                            {isActive && (
                                                                <ChevronRight className="w-4 h-4 ml-auto" />
                                                            )}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </nav>
                            </div>

                            {/* Logout Button - Fixed at Bottom */}
                            <div className="p-6 pt-0 mt-auto border-t border-gray-800">
                                <Button
                                    onClick={logout}
                                    variant="ghost"
                                    className="w-full justify-start text-red-400 hover:bg-red-500/10 hover:text-red-300"
                                >
                                    <LogOut className="w-5 h-5 mr-3" />
                                    Logout
                                </Button>
                            </div>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.aside
                        initial={{ width: 0 }}
                        animate={{ width: '16rem' }}
                        exit={{ width: 0 }}
                        className="hidden lg:block fixed left-0 top-0 h-full bg-[#1a1a1a] border-r border-gray-800 z-30 transition-all duration-300 ease-in-out overflow-hidden"
                    >
                        {/* Sidebar content - same as mobile but without mobile-specific elements */}
                        <div className="w-64 h-full flex flex-col">
                            {/* Header with Logo and Toggle */}
                            <div className="p-6 pb-0">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center">
                                            <Shield className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold text-white">BAILS</h2>
                                            <p className="text-xs text-gray-400">Admin Panel</p>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => setSidebarOpen(!sidebarOpen)}
                                        variant="ghost"
                                        size="icon"
                                        className="text-gray-400 hover:text-white"
                                    >
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>

                                {/* Admin Info */}
                                <div className="mb-6 p-3 bg-purple-600/10 rounded-lg border border-purple-600/20">
                                    <p className="text-sm font-medium text-white">{admin.name}</p>
                                    <p className="text-xs text-gray-400">{admin.role}</p>
                                </div>

                                {/* Search */}
                                <div className="relative mb-6">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        placeholder="Search..."
                                        className="pl-9 bg-[#2a2a2a] border-gray-700 text-white placeholder:text-gray-500"
                                    />
                                </div>
                            </div>

                            {/* Scrollable Navigation */}
                            <div className="flex-1 overflow-y-auto px-6 pb-6">
                                <nav className="space-y-6">
                                    {sidebarItems.map((section) => (
                                        <div key={section.category}>
                                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                                {section.category}
                                            </h3>
                                            <div className="space-y-1">
                                                {section.items.map((item) => {
                                                    const hasPermission = isSuper || checkPermission(item.permission);
                                                    const isActive = pathname === item.href;

                                                    if (!hasPermission) return null;

                                                    return (
                                                        <Link
                                                            key={item.href}
                                                            href={item.href}
                                                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${isActive
                                                                ? 'bg-purple-600/20 text-purple-400 border-l-2 border-purple-600'
                                                                : 'text-gray-300 hover:bg-[#2a2a2a] hover:text-white'
                                                                }`}
                                                        >
                                                            <item.icon className="w-5 h-5" />
                                                            <span className="text-sm">{item.label}</span>
                                                            {isActive && (
                                                                <ChevronRight className="w-4 h-4 ml-auto" />
                                                            )}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </nav>
                            </div>

                            {/* Logout Button - Fixed at Bottom */}
                            <div className="p-6 pt-0 mt-auto border-t border-gray-800">
                                <Button
                                    onClick={logout}
                                    variant="ghost"
                                    className="w-full justify-start text-red-400 hover:bg-red-500/10 hover:text-red-300"
                                >
                                    <LogOut className="w-5 h-5 mr-3" />
                                    Logout
                                </Button>
                            </div>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className={`min-h-screen bg-[#0a0a0a] transition-all duration-300 ease-in-out ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'
                } ${mobileMenuOpen ? 'ml-0' : ''}`}>
                {/* Top Bar - Sticky Header */}
                <div className="sticky top-0 z-20 bg-[#1a1a1a] border-b border-gray-800 px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-4">
                            {/* Mobile Hamburger */}
                            <Button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                variant="ghost"
                                size="icon"
                                className="lg:hidden text-gray-400 hover:text-white"
                            >
                                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </Button>

                            {/* Tablet Hamburger */}
                            <Button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                variant="ghost"
                                size="icon"
                                className="hidden md:flex lg:hidden text-gray-400 hover:text-white"
                            >
                                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </Button>

                            {/* Desktop Hamburger */}
                            <Button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                variant="ghost"
                                size="icon"
                                className="hidden lg:flex text-gray-400 hover:text-white"
                            >
                                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </Button>

                            <h1 className="text-lg sm:text-xl font-semibold text-white capitalize truncate">
                                {pathname.split('/').pop()?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Dashboard'}
                            </h1>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-4">
                            {/* Notifications */}
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white relative">
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                            </Button>

                            {/* Admin Profile */}
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <p className="text-sm font-medium text-white">{admin.name}</p>
                                    <p className="text-xs text-gray-400">{admin.role}</p>
                                </div>
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center">
                                    <span className="text-white font-semibold">
                                        {admin.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page Content - Responsive padding */}
                <div className="p-4 sm:p-6 lg:p-8 max-w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default function AdminLayoutClient({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    // Don't apply admin layout to login page
    if (pathname === '/admin/login') {
        return <AdminAuthProvider>{children}</AdminAuthProvider>;
    }

    return (
        <AdminAuthProvider>
            <AdminLayoutContent>{children}</AdminLayoutContent>
        </AdminAuthProvider>
    );
}
