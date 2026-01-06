/**
 * Migration Script: Geocode Existing Freelancer Addresses
 * 
 * This script fetches all freelancer profiles with addresses but no coordinates,
 * geocodes their addresses using Mapbox API, and saves the coordinates to the database.
 * 
 * Usage: npx tsx scripts/geocode-freelancers.ts
 */

import prisma from '../src/lib/db';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

async function geocodeAddress(address: string): Promise<[number, number] | null> {
    try {
        const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_TOKEN}&limit=1`;
        const response = await fetch(geocodeUrl);
        const data = await response.json();

        if (data.features && data.features.length > 0) {
            const [lng, lat] = data.features[0].center;
            return [lng, lat];
        }
        return null;
    } catch (error) {
        console.error(`Error geocoding "${address}":`, error);
        return null;
    }
}

async function main() {
    if (!MAPBOX_TOKEN) {
        console.error('❌ NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN is not set');
        process.exit(1);
    }

    console.log('🗺️  Starting freelancer address geocoding...\n');

    // Get all freelancer profiles
    const profiles = await prisma.freelancerProfile.findMany({
        include: {
            user: {
                select: {
                    address: true,
                    city: true,
                    state: true,
                    postalCode: true
                }
            }
        }
    });

    console.log(`Found ${profiles.length} freelancer profiles\n`);

    let geocoded = 0;
    let skipped = 0;
    let failed = 0;

    for (const profile of profiles) {
        const fullAddress = [
            profile.user.address,
            profile.user.city,
            profile.user.state,
            profile.user.postalCode
        ].filter(Boolean).join(', ');

        if (!fullAddress) {
            console.log(`⏭️  Skipping profile ${profile.id} - no address`);
            skipped++;
            continue;
        }

        // Check if already has coords
        if (profile.coords && profile.coords !== JSON.stringify([0, 0]) && profile.coords !== JSON.stringify([80.2707, 13.0827])) {
            console.log(`✓ Profile ${profile.id} already has coordinates`);
            skipped++;
            continue;
        }

        console.log(`📍 Geocoding: ${fullAddress}...`);
        const coords = await geocodeAddress(fullAddress);

        if (coords) {
            // Update profile with coordinates
            await prisma.freelancerProfile.update({
                where: { id: profile.id },
                data: {
                    coords: JSON.stringify(coords)
                }
            });
            console.log(`✅ Updated profile ${profile.id} with coords: ${coords}\n`);
            geocoded++;

            // Add delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 200));
        } else {
            console.log(`❌ Failed to geocode: ${fullAddress}\n`);
            failed++;
        }
    }

    console.log('\n📊 Summary:');
    console.log(`   ✅ Successfully geocoded: ${geocoded}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   📍 Total processed: ${profiles.length}`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
        console.log('\n✨ Done!');
    })
    .catch(async (e) => {
        console.error('Error:', e);
        await prisma.$disconnect();
        process.exit(1);
    });
