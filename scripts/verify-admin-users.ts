// Native fetch is already available in global scope

async function verifyAdminUsers() {
    const baseUrl = 'http://localhost:3000/api/admin/users';

    // Generate Admin Token
    try {
        const jwt = require('jsonwebtoken');
        const secret = 'fallback-secret-for-dev';
        const token = jwt.sign({ role: 'ADMIN' }, secret, { expiresIn: '1h' });

        console.log('Generated Admin Token using jsonwebtoken.');

        const res = await fetch(baseUrl, {
            headers: {
                'Cookie': `auth-token=${token}`
            }
        });
        console.log(`Response Status: ${res.status}`);

        const data: any = await res.json();
        console.log('Full Response Data:', JSON.stringify(data, null, 2));

        if (data.error) {
            console.error('API Error:', data.error);
            return;
        }

        console.log('--- Admin Users API Verification ---');
        console.log('1. Stats:');
        console.table(data.stats);

        console.log('\n2. Users (First 3):');
        if (data.users && data.users.length > 0) {
            data.users.slice(0, 3).forEach((u: any) => {
                console.log(`- ${u.name} (Role: ${u.role})`);
                console.log(`  Avatar: ${u.avatar ? 'Yes' : 'No'}`);
                console.log(`  Last Active: ${u.lastActive}`);
                console.log(`  Spent: ${u.totalSpent}, Earnings: ${u.totalEarnings}`);
                console.log(`  Services: ${u.services ? u.services.join(', ') : 'None'}`);
            });
        } else {
            console.log('No users found.');
        }

        // Check for "Both" role
        if (data.users) {
            const dualRoleUser = data.users.find((u: any) => u.role === 'both');
            if (dualRoleUser) {
                console.log(`\n3. Verified "Both" Role User: ${dualRoleUser.name}`);
            } else {
                console.log('\n3. No user with role "both" found in current page.');
            }
        }

    } catch (error) {
        console.error('Verification failed:', error);
    }
}

verifyAdminUsers();
