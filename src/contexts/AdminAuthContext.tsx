'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'SUPPORT' | 'FINANCE' | 'MARKETING' | 'ADMIN';
  permissions: string[];
  avatar?: string;
  lastLoginAt?: string;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: any | null }>;
  logout: () => Promise<void>;
  checkPermission: (permission: string) => boolean;
  isSuper: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check session on mount
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/admin/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.admin) {
            setAdmin(data.admin);
          }
        }
      } catch (err) {
        console.error('Session check failed', err);
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    console.log('🔐 Attempting Admin Login (Custom) for:', email);
    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('❌ Login error:', data.error);
        return { error: { message: data.error || 'Login failed' } };
      }

      if (data.admin) {
        console.log('👤 Admin Login Success:', data.admin);
        setAdmin(data.admin);
        router.push('/admin/dashboard');
        return { error: null };
      }

    } catch (err: any) {
      console.error('❌ Network login error:', err);
      return { error: { message: err.message || 'Connection failed' } };
    }

    return { error: { message: 'Unexpected login failure' } };
  };

  const logout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout error', e);
    }
    setAdmin(null);
    router.push('/admin/login');
  };

  const checkPermission = (permission: string): boolean => {
    if (!admin) return false;
    const normalizedRole = admin.role.toUpperCase();
    if (normalizedRole === 'SUPER_ADMIN' || normalizedRole === 'ADMIN') return true;
    return admin.permissions?.includes(permission) || false;
  };

  const isSuper = admin?.role?.toUpperCase() === 'SUPER_ADMIN' || admin?.role?.toUpperCase() === 'ADMIN';

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout, checkPermission, isSuper }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
}
