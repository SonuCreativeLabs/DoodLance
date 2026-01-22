import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function main() {
    try {
        // Find user by name
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { name: { contains: 'sonuofficials07', mode: 'insensitive' } },
                    { email: { contains: 'sonuofficials07', mode: 'insensitive' } }
                ]
            },
            include: {
                freelancerProfile: true,
                services: true
            }
        });

        if (!user) {
            console.log('User not found');
            return;
        }

        console.log('User found:', user.email);

        const profile = user.freelancerProfile;
        const services = user.services || [];

        // Calculate completion using same logic as API
        const hasName = user.name && user.name.trim().length > 0;
        const bioText = user.bio || profile?.about || '';
        const hasBio = bioText.trim().length > 0;

        let hasLocation = false;
        try {
            if (profile?.coords && profile.coords.trim() !== '') {
                const parsed = JSON.parse(profile.coords);
                if (Array.isArray(parsed) && parsed.length === 2) {
                    hasLocation = true;
                }
            }
        } catch (e) { }

        const hasService = services.length > 0;

        const servicePrices = services.map(s => s.price).filter(p => typeof p === 'number' && p > 0);
        const minPrice = servicePrices.length > 0 ? Math.min(...servicePrices) : 0;
        const finalPrice = minPrice || profile?.hourlyRate || 0;
        const hasPrice = finalPrice > 0;

        let skills = [];
        try {
            if (profile?.skills) {
                if (typeof profile.skills === 'string') {
                    const parsed = JSON.parse(profile.skills);
                    skills = Array.isArray(parsed) ? parsed : [parsed];
                } else if (Array.isArray(profile.skills)) {
                    skills = profile.skills;
                }
            }
        } catch (e) { }
        const hasSkills = skills.length > 0;

        const completionFields = [hasName, hasBio, hasLocation, hasService, hasPrice, hasSkills];
        const completionPercentage = (completionFields.filter(Boolean).length / completionFields.length) * 100;

        console.log('\nProfile Completion Analysis:');
        console.log('----------------------------');
        console.log('Name:', hasName ? '✓' : '✗', user.name || 'N/A');
        console.log('Bio:', hasBio ? '✓' : '✗', bioText ? `(${bioText.length} chars)` : 'N/A');
        console.log('Location:', hasLocation ? '✓' : '✗');
        console.log('Service:', hasService ? '✓' : '✗', `(${services.length} services)`);
        console.log('Price:', hasPrice ? '✓' : '✗', finalPrice > 0 ? `₹${finalPrice}` : 'N/A');
        console.log('Skills:', hasSkills ? '✓' : '✗', `(${skills.length} skills)`);
        console.log('\n----------------------------');
        console.log('COMPLETION:', `${completionPercentage.toFixed(0)}%`);
        console.log('----------------------------');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
