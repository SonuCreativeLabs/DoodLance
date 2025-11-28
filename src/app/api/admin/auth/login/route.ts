import { NextRequest, NextResponse } from 'next/server';

// Mock admin users - In production, fetch from database
const mockAdmins = [
  {
    id: 'admin-1',
    email: 'admin@doodlance.com',
    password: '$2a$10$YourHashedPasswordHere', // admin123
    name: 'Super Admin',
    role: 'SUPER_ADMIN',
    permissions: [],
    avatar: null,
    lastLoginAt: null,
  },
  {
    id: 'admin-2',
    email: 'support@doodlance.com',
    password: '$2a$10$YourHashedPasswordHere', // support123
    name: 'Support Team',
    role: 'SUPPORT',
    permissions: ['users.view', 'bookings.view', 'support.view', 'support.manage'],
    avatar: null,
    lastLoginAt: null,
  },
  {
    id: 'admin-3',
    email: 'finance@doodlance.com',
    password: '$2a$10$YourHashedPasswordHere', // finance123
    name: 'Finance Team',
    role: 'FINANCE',
    permissions: ['transactions.view', 'transactions.manage', 'reports.view', 'reports.export'],
    avatar: null,
    lastLoginAt: null,
  }
];

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find admin by email
    const admin = mockAdmins.find(a => a.email === email);

    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // For demo purposes, accept specific passwords
    const validPasswords: Record<string, string> = {
      'admin@doodlance.com': 'admin123',
      'support@doodlance.com': 'support123',
      'finance@doodlance.com': 'finance123'
    };

    if (validPasswords[email] !== password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate a simple token (in production, use JWT)
    const token = Buffer.from(`${admin.id}:${Date.now()}`).toString('base64');

    // Update last login
    admin.lastLoginAt = new Date().toISOString();

    // Return admin data without password
    const { password: _, ...adminData } = admin;

    return NextResponse.json({
      success: true,
      admin: adminData,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
