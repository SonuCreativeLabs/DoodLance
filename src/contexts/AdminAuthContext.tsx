'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'SUPPORT' | 'FINANCE' | 'MARKETING';
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
  const supabase = createClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      if (session?.user) {
        // Map session user to AdminUser
        // Check if role is ADMIN
        const user = session.user;
        const metadata = user.user_metadata || {};

        if (metadata.role === 'ADMIN') {
          setAdmin({
            id: user.id,
            email: user.email || '',
            name: metadata.name || 'Admin',
            role: metadata.admin_role || 'SUPER_ADMIN',
            permissions: [], // Load permissions if needed
            avatar: metadata.avatar,
            lastLoginAt: user.last_sign_in_at
          });
        } else {
          // Not an admin, maybe redirect?
          setAdmin(null);
        }
      } else {
        setAdmin(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Supabase login error:', error.message);
      // Throw or return error
      return { error };
    }

    router.push('/admin/dashboard');
    return { error: null };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setAdmin(null);
    router.push('/admin/login');
  };

  const checkPermission = (permission: string): boolean => {
    if (!admin) return false;
    const normalizedRole = admin.role.toUpperCase();
    if (normalizedRole === 'SUPER_ADMIN') return true;
    return admin.permissions?.includes(permission) || false;
  };

  const isSuper = admin?.role?.toUpperCase() === 'SUPER_ADMIN';

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
