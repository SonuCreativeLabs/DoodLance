import jwt from 'jsonwebtoken';

async function verifyServices() {
    const ADMIN_SECRET = 'fallback-secret-for-dev';

    // 1. Generate Admin Token
    const adminToken = jwt.sign(
        { id: 'admin-123', email: 'admin@doodlance.com', role: 'ADMIN' },
        ADMIN_SECRET,
        { expiresIn: '1h' }
    );

    console.log('Generated Admin Token');

    // 2. Fetch Services
    const url = 'http://localhost:3000/api/admin/services?limit=10&page=1&search=&category=all&active=all';
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
        const { services, stats } = data;

        console.log('--- Admin Services API Verification ---');
        console.log(`\n1. Stats:`);
        console.log(`Total Services: ${stats.totalServices}`);
        console.log(`Active Services (isActive=true): ${stats.activeServices}`);
        console.log(`Pending Approval: ${stats.pendingApproval}`);
        console.log(`Total Revenue: ${stats.totalRevenue}`);
        console.log(`Avg Rating: ${stats.avgRating}`);
        console.log(`Total Orders: ${stats.totalOrders}`);

        console.log('\n2. Services (First 3):');
        if (services && services.length > 0) {
            services.slice(0, 3).forEach((s: any) => {
                console.log(`- ID: ${s.id}`);
                console.log(`  Title: ${s.title}`);
                console.log(`  Provider: ${s.providerName} (ID: ${s.providerId})`);
                console.log(`  Status: ${s.status}`);
                console.log(`  Orders: ${s.totalOrders}`);
                console.log(`  Category: ${s.category} (ID: ${s.categoryId})`);
                console.log('  ---');
            });
        } else {
            console.log('No services found.');
        }

    } catch (error) {
        console.error('Fetch error:', error);
        process.exit(1);
    }
}

verifyServices();
