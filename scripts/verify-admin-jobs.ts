import jwt from 'jsonwebtoken';

async function verifyJobs() {
    const ADMIN_SECRET = 'fallback-secret-for-dev';

    // 1. Generate Admin Token
    const adminToken = jwt.sign(
        { id: 'admin-123', email: 'admin@doodlance.com', role: 'ADMIN' },
        ADMIN_SECRET,
        { expiresIn: '1h' }
    );

    console.log('Generated Admin Token');

    // 2. Fetch Jobs
    const url = 'http://localhost:3000/api/admin/jobs?limit=5';
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
        const { jobs, stats } = data;

        console.log('--- Admin Jobs API Verification ---');
        console.log(`\n1. Stats:`);
        console.log(`Global Total Jobs: ${stats.totalJobs}`);
        console.log(`Active Jobs (OPEN): ${stats.activeJobs}`);
        console.log(`Total Applications: ${stats.totalApplications}`);
        console.log(`Avg Budget: ${stats.avgBudget}`);

        console.log('\n2. Jobs (First 3):');
        if (jobs && jobs.length > 0) {
            jobs.slice(0, 3).forEach((j: any) => {
                console.log(`- ID: ${j.id}`);
                console.log(`  Title: ${j.title}`);
                console.log(`  Client: ${j.client}`);
                console.log(`  Status: ${j.status}`);
                console.log(`  Apps: ${j.applications}`);
                console.log(`  Budget: ${j.budget}`);
                console.log('  ---');
            });
        } else {
            console.log('No jobs found.');
        }

    } catch (error) {
        console.error('Fetch error:', error);
        process.exit(1);
    }
}

verifyJobs();
