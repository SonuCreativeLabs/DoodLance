
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function trimUsernames() {
    const users = await prisma.user.findMany({
        where: {
            username: {
                not: null
            }
        },
        select: {
            id: true,
            username: true
        }
    });

    for (const user of users) {
        if (user.username) {
            let sanitized = user.username.trim().toLowerCase();

            // 1. Replace hyphens with underscores
            sanitized = sanitized.replace(/-/g, '_');

            // 2. Remove any non-alphanumeric and non-underscore characters
            sanitized = sanitized.replace(/[^a-z0-9_]/g, '');

            // 3. Collapse multiple underscores
            sanitized = sanitized.replace(/_+/g, '_');

            // 4. Trim underscores from start and end
            sanitized = sanitized.replace(/^_+|_+$/g, '');

            // 5. Ensure minimum length (fallback) - if empty or too short, maybe add random? 
            // For now, if it becomes empty string, let's keep it null or handle specifically.
            if (sanitized.length < 3) {
                // If sanitization made it too short, keep original but just lowercase/trim as best effort,
                // or maybe append random ID if it's really broken. 
                // Let's assume most are fine, but append random string if too short.
                sanitized = `${sanitized}_user_${Date.now().toString().slice(-4)}`;
            }

            // Only update if different
            if (user.username !== sanitized) {
                console.log(`Sanitizing: "${user.username}" -> "${sanitized}" (ID: ${user.id})...`);

                try {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { username: sanitized }
                    });
                    console.log('✅ Fixed.');
                } catch (e: any) {
                    // Handle collision by appending random number
                    if (e.code === 'P2002') {
                        const uniqueSuffix = Math.floor(1000 + Math.random() * 9000);
                        const newUnique = `${sanitized}_${uniqueSuffix}`;
                        console.log(`⚠️ Collision! Trying: "${newUnique}"`);
                        try {
                            await prisma.user.update({
                                where: { id: user.id },
                                data: { username: newUnique }
                            });
                            console.log('✅ Fixed with suffix.');
                        } catch (retryErr) {
                            console.error(`❌ Failed to fix ${user.username}.`);
                        }
                    } else {
                        console.error(`❌ Error updating ${user.username}:`, e.message);
                    }
                }
            }
        }
    }
    console.log('Done trimming usernames.');
}

trimUsernames();
