'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

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
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkPermission: (permission: string) => boolean;
  isSuper: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if admin is logged in on mount
  useEffect(() => {
    const checkAdmin = async () => {
      const storedAdmin = localStorage.getItem('admin_user');
      if (storedAdmin) {
        setAdmin(JSON.parse(storedAdmin));
      }
      setLoading(false);
    };
    checkAdmin();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Client login attempt:', { email, passwordProvided: !!password });
      
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      console.log('Login success:', data);
      setAdmin(data.admin);
      localStorage.setItem('admin_user', JSON.stringify(data.admin));
      localStorage.setItem('admin_token', data.token);
      
      // Log the login action
      try {
        await fetch('/api/admin/audit', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-admin-token': data.token
          },
          body: JSON.stringify({
            action: 'LOGIN',
            entityType: 'ADMIN_USER',
            entityId: data.admin.id,
          }),
        });
      } catch (auditError) {
        // Don't fail login if audit logging fails
        console.warn('Audit logging failed:', auditError);
      }

      router.push('/admin/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (admin) {
        // Log the logout action
        try {
          const token = localStorage.getItem('admin_token');
          await fetch('/api/admin/audit', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'x-admin-token': token || ''
            },
            body: JSON.stringify({
              action: 'LOGOUT',
              entityType: 'ADMIN_USER',
              entityId: admin.id,
            }),
          });
        } catch (auditError) {
          // Don't fail logout if audit logging fails
          console.warn('Audit logging failed:', auditError);
        }
      }

      setAdmin(null);
      localStorage.removeItem('admin_user');
      localStorage.removeItem('admin_token');
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const checkPermission = (permission: string): boolean => {
    if (!admin) return false;
    if (admin.role === 'SUPER_ADMIN') return true;
    return admin.permissions.includes(permission);
  };

  const isSuper = admin?.role === 'SUPER_ADMIN';

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
