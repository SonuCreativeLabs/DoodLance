import { NextRequest, NextResponse } from 'next/server';

// Mock user database
let mockUsers = [
  {
    id: 'USR001',
    name: 'Rohit Sharma',
    email: 'rohit@example.com',
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
    id: 'USR002',
    name: 'Priya Patel',
    email: 'priya@example.com',
    phone: '+91 87654 32109',
    role: 'client',
    status: 'active',
    isVerified: true,
    kycStatus: 'pending',
    joinedAt: '2024-02-10',
    lastActive: '1 day ago',
    location: 'Delhi',
    earnings: 0,
    spending: 45600,
    completedJobs: 12,
    rating: 4.9,
    profileCompletion: 80,
    walletBalance: 5000
  },
  {
    id: 'USR003',
    name: 'Virat Singh',
    email: 'virat@example.com',
    phone: '+91 76543 21098',
    role: 'freelancer',
    status: 'active',
    isVerified: true,
    kycStatus: 'verified',
    joinedAt: '2023-12-20',
    lastActive: '5 minutes ago',
    location: 'Bangalore',
    earnings: 234500,
    spending: 2300,
    completedJobs: 156,
    rating: 4.9,
    profileCompletion: 100,
    walletBalance: 23450
  },
  {
    id: 'USR004',
    name: 'Ananya Reddy',
    email: 'ananya@example.com',
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
  {
    id: 'USR005',
    name: 'Amit Kumar',
    email: 'amit@example.com',
    phone: '+91 54321 09876',
    role: 'client',
    status: 'active',
    isVerified: true,
    kycStatus: 'verified',
    joinedAt: '2024-01-20',
    lastActive: '3 days ago',
    location: 'Pune',
    earnings: 0,
    spending: 78900,
    completedJobs: 23,
    rating: 4.7,
    profileCompletion: 90,
    walletBalance: 8900
  }
];

// GET /api/admin/users - Get all users with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || 'all';
    const status = searchParams.get('status') || 'all';
    const verified = searchParams.get('verified') || 'all';

    // Filter users
    let filteredUsers = [...mockUsers];
    
    if (search) {
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.phone.includes(search)
      );
    }
    
    if (role !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.role === role);
    }
    
    if (status !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.status === status);
    }
    
    if (verified !== 'all') {
      filteredUsers = filteredUsers.filter(user => 
        verified === 'verified' ? user.isVerified : !user.isVerified
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return NextResponse.json({
      users: paginatedUsers,
      total: filteredUsers.length,
      page,
      totalPages: Math.ceil(filteredUsers.length / limit),
      stats: {
        total: mockUsers.length,
        active: mockUsers.filter(u => u.status === 'active').length,
        suspended: mockUsers.filter(u => u.status === 'suspended').length,
        verified: mockUsers.filter(u => u.isVerified).length,
        freelancers: mockUsers.filter(u => u.role === 'freelancer').length,
        clients: mockUsers.filter(u => u.role === 'client').length
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/users - Update user
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, updates } = body;

    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };

    // Log audit action
    console.log(`User ${userId} updated:`, updates);

    return NextResponse.json({
      success: true,
      user: mockUsers[userIndex]
    });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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
