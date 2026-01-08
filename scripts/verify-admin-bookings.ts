import { createTokens } from '@/utils/auth-tokens';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

async function verifyBookings() {
    const ADMIN_SECRET = 'fallback-secret-for-dev';

    // 1. Generate Admin Token
    const adminToken = jwt.sign(
        { id: 'admin-123', email: 'admin@doodlance.com', role: 'ADMIN' },
        ADMIN_SECRET,
        { expiresIn: '1h' }
    );

    console.log('Generated Admin Token');

    // 2. Fetch Bookings
    const url = 'http://localhost:3000/api/admin/bookings?limit=5';
    console.log(`Fetching from: ${url}`);

    try {
        const res = await fetch(url, {
            headers: {
                'Cookie': `auth-token=${adminToken}`
            }
        });

        if (!res.ok) {
            console.error(`Status: ${res.status} ${res.statusText}`);
            const text = await res.text();
            console.error('Body:', text);
            process.exit(1);
        }

        const data = await res.json();
        const { bookings, stats } = data;

        console.log('--- Admin Bookings API Verification ---');
        console.log(`\n1. Stats:`);
        console.table(stats);
        console.log(`Global Total Bookings: ${stats.totalBookings}`);
        console.log(`Realized Revenue: ${stats.totalRevenue}`);
        console.log('Stats Breakdown:', {
            Completed: stats.completed,
            Upcoming: stats.confirmed,
            Ongoing: stats.inProgress,
            Cancelled: stats.cancelled
        });

        console.log('\n2. Bookings (First 3):');
        if (bookings && bookings.length > 0) {
            bookings.slice(0, 3).forEach((b: any) => {
                console.log(`- ID: ${b.id}`);
                console.log(`  Service: ${b.serviceTitle}`);
                console.log(`  Status: ${b.status}`);
                console.log(`  Schedule: ${b.scheduledAt} (${b.duration} mins)`);
                console.log(`  Location: ${b.location}`);
                console.log(`  Client: ${b.clientName} (${b.clientEmail})`);
                console.log(`  Freelancer: ${b.freelancerName} (${b.freelancerEmail})`);
                console.log('  ---');
            });
        } else {
            console.log('No bookings found.');
        }

    } catch (error) {
        console.error('Fetch error:', error);
        process.exit(1);
    }
}

verifyBookings();
