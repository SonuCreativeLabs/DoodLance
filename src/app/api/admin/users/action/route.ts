import { NextRequest, NextResponse } from 'next/server';

// Mock user database (shared with main users route)
let mockUsers = [
  {
    id: 'USR001',
    name: 'Rohit Sharma',
    email: user.email,
    phone: '+91 98765 43210',
    role: 'freelancer',
    status: 'active',
    isVerified: true,
    kycStatus: 'verified',
    joinedAt: '2024-01-15',
    lastActive: '2 hours ago',
    location: 'Mumbai',
    earnings: 125000,
    spending: 0,
    completedJobs: 45,
    rating: 4.8,
    profileCompletion: 95,
    walletBalance: 12500
  },
  {
    id: 'USR004',
    name: 'Ananya Reddy',
    email: user.email,
    phone: '+91 65432 10987',
    role: 'freelancer',
    status: 'suspended',
    isVerified: false,
    kycStatus: 'unverified',
    joinedAt: '2024-03-01',
    lastActive: '1 week ago',
    location: 'Chennai',
    earnings: 12000,
    spending: 500,
    completedJobs: 8,
    rating: 4.2,
    profileCompletion: 60,
    walletBalance: 1200
  },
];

// POST /api/admin/users/action - Perform user actions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, action, reason } = body;

    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    switch (action) {
      case 'suspend':
        mockUsers[userIndex].status = 'suspended';
        break;
      case 'activate':
        mockUsers[userIndex].status = 'active';
        break;
      case 'verify':
        mockUsers[userIndex].isVerified = true;
        mockUsers[userIndex].kycStatus = 'verified';
        break;
      case 'unverify':
        mockUsers[userIndex].isVerified = false;
        mockUsers[userIndex].kycStatus = 'unverified';
        break;
      case 'delete':
        mockUsers = mockUsers.filter(u => u.id !== userId);
        return NextResponse.json({ success: true, message: 'User deleted' });
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    // Log audit action
    console.log(`User action performed: ${action} on ${userId}. Reason: ${reason}`);

    return NextResponse.json({
      success: true,
      user: mockUsers[userIndex],
      message: `User ${action} successful`
    });
  } catch (error) {
    console.error('User action error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
