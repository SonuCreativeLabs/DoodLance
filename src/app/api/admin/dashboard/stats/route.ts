export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';

// Mock data - In production, fetch from database
const generateStats = () => {
  const now = new Date();
  const todayStart = new Date(now.setHours(0, 0, 0, 0));

  return {
    users: {
      total: 523,
      active: 412,
      new: 23,
      verified: 389,
      growth: 12.5
    },
    bookings: {
      total: 1456,
      today: 45,
      pending: 12,
      inProgress: 23,
      completed: 1398,
      cancelled: 23,
      revenue: 827500
    },
    revenue: {
      total: 827500,
      today: 45600,
      platformFees: 124125,
      pending: 23400,
      growth: 15.3
    },
    services: {
      total: 234,
      active: 198,
      pending: 12,
      avgRating: 4.6
    },
    support: {
      totalTickets: 89,
      open: 5,
      resolved: 78,
      avgResponseTime: '2.5 hours'
    }
  };
};

const generateChartData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map(month => ({
    month,
    revenue: Math.floor(Math.random() * 100000) + 50000,
    bookings: Math.floor(Math.random() * 200) + 100,
    users: Math.floor(Math.random() * 50) + 20
  }));
};

const generateCategoryPerformance = () => {
  const categories = [
    'Net Bowler', 'Coach', 'Match Player', 'Physio',
    'Analyst', 'Cricket Photo/Videography'
  ];

  return categories.map(name => ({
    name,
    bookings: Math.floor(Math.random() * 100) + 20,
    revenue: Math.floor(Math.random() * 50000) + 10000,
    growth: (Math.random() * 30 - 10).toFixed(1)
  }));
};

const generateRecentActivity = () => {
  const activities = [
    { type: 'new_user', message: 'New user registered', user: 'Rahul Sharma' },
    { type: 'booking', message: 'New booking created', id: 'BK1234' },
    { type: 'payment', message: 'Payment received', amount: 2500 },
    { type: 'service', message: 'New service approved', service: 'Net Bowling Session' },
    { type: 'withdrawal', message: 'Withdrawal request', amount: 15000 },
  ];

  return activities.map((activity: any, i: number) => ({
    ...activity,
    timestamp: new Date(Date.now() - i * 3600000).toISOString(),
    id: `ACT${1000 + i}`
  }));
};

export async function GET(request: NextRequest) {
  try {
    // Check for admin authentication (simplified for demo)
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const stats = generateStats();
    const chartData = generateChartData();
    const categoryPerformance = generateCategoryPerformance();
    const recentActivity = generateRecentActivity();

    return NextResponse.json({
      stats,
      chartData,
      categoryPerformance,
      recentActivity,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
