import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';

const prisma = new PrismaClient();
const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || process.env.MAPBOX_ACCESS_TOKEN;

const getGeocode = async (query: string) => {
    if (!mapboxToken || !query) return null;
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxToken}&limit=1`;
    try {
        const res = await fetch(url);
        const data = await (res as any).json();
        if (data.features && data.features.length > 0) {
            return data.features[0].center; // [lng, lat]
        }
    } catch (err) {
        console.error('Geocoding fetch error:', err);
    }
    return null;
};

async function main() {
    if (!mapboxToken) {
        console.error('Missing Mapbox token in environment variables');
        process.exit(1);
    }

    console.log('Fetching users with [0,0] coordinates...');

    // Find Freelancer Profiles where coords is [0,0] or similar
    const profilesToUpdate = await prisma.freelancerProfile.findMany({
        where: {
            OR: [
                { coords: '[0,0]' },
                { coords: '[0, 0]' },
                { coords: { equals: '["0","0"]' } }
            ]
        },
        include: {
            user: true
        }
    });

    console.log(`Found ${profilesToUpdate.length} profiles to fix...`);

    let fixedCount = 0;

    for (const profile of profilesToUpdate) {
        const user = profile.user;
        if (!user) continue;

        const fullAddress = [
            user.address,
            user.area,
            user.city,
            user.state,
            user.postalCode
        ].filter(Boolean).join(', ');

        const simpleAddress = [
            user.area,
            user.city,
            user.state
        ].filter(Boolean).join(', ');

        const cityAddress = [
            user.city,
            user.state
        ].filter(Boolean).join(', ');

        let center = await getGeocode(fullAddress);
        if (!center && simpleAddress && simpleAddress !== fullAddress) center = await getGeocode(simpleAddress);
        if (!center && cityAddress && cityAddress !== fullAddress && cityAddress !== simpleAddress) center = await getGeocode(cityAddress);

        // If all else fails, use Chennai default
        if (!center) {
            center = [80.2707, 13.0827];
            console.log(`⚠️ Could not geocode ${user.name} (${fullAddress || "No Address"}), defaulting to Chennai.`);
        } else {
            console.log(`✅ Fixed ${user.name} location via Mapbox.`);
        }

        const newCoords = JSON.stringify([center[0], center[1]]);

        // Update Freelancer Profile
        await prisma.freelancerProfile.update({
            where: { id: profile.id },
            data: { coords: newCoords }
        });

        // Update User
        await prisma.user.update({
            where: { id: user.id },
            data: { coords: newCoords }
        });

        fixedCount++;
    }

    // Also check Users table for any non-freelancers trapped at [0,0]
    const usersToUpdate = await prisma.user.findMany({
        where: {
            OR: [
                { coords: '[0,0]' },
                { coords: '[0, 0]' }
            ]
        }
    });

    for (const user of usersToUpdate) {
        await prisma.user.update({
            where: { id: user.id },
            data: { coords: '[80.2707, 13.0827]' }
        });
    }

    console.log(`Successfully fixed ${fixedCount + usersToUpdate.length} coordinates.`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
