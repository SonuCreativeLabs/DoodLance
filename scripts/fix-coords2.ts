import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';

const prisma = new PrismaClient();
const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || process.env.MAPBOX_ACCESS_TOKEN;

const getGeocode = async (query: string) => {
    if (!mapboxToken || !query) return null;
    // adding proximity bias for Chennai/India to help with heavy typos
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxToken}&limit=1&country=in&proximity=80.2707,13.0827`;
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

    console.log('Fetching ALL freelancer profiles to re-geocode based on precise area...');

    const profilesToUpdate = await prisma.freelancerProfile.findMany({
        include: {
            user: true
        }
    });

    console.log(`Found ${profilesToUpdate.length} profiles to geocode...`);

    let fixedCount = 0;

    for (const profile of profilesToUpdate) {
        const user = profile.user;
        if (!user) continue;

        // Skip if there's absolutely no location data
        if (!user.address && !user.area && !user.city && !user.state && !user.location) {
            continue;
        }

        const fullAddress = [
            user.address,
            user.area,
            user.city,
            user.state,
            user.postalCode
        ].filter(Boolean).join(', ');

        const areaAddress = [
            user.area,
            user.city,
            user.state
        ].filter(Boolean).join(', ');

        const cityAddress = [
            user.city,
            user.state
        ].filter(Boolean).join(', ');

        const genericLocation = [
            user.location
        ].filter(Boolean).join(', ');

        let center = null;
        let queryUsed = "";

        if (fullAddress && fullAddress.length > 3) {
            center = await getGeocode(fullAddress);
            if (center) queryUsed = fullAddress;
        }

        if (!center && areaAddress && areaAddress.length > 3 && areaAddress !== fullAddress) {
            center = await getGeocode(areaAddress);
            if (center) queryUsed = areaAddress;
        }

        if (!center && cityAddress && cityAddress.length > 3 && cityAddress !== fullAddress && cityAddress !== areaAddress) {
            center = await getGeocode(cityAddress);
            if (center) queryUsed = cityAddress;
        }

        if (!center && genericLocation && genericLocation.length > 3) {
            center = await getGeocode(genericLocation);
            if (center) queryUsed = genericLocation;
        }

        if (!center) {
            console.log(`⚠️ Could not geocode ${user.name} for any combination (Full: ${fullAddress}, Area: ${areaAddress}). Keeping existing.`);
            continue;
        }

        const newCoords = JSON.stringify([center[0], center[1]]);

        // Only update if coords actually changed
        if (profile.coords !== newCoords) {
            console.log(`✅ Updated ${user.name} location using query "${queryUsed}"`);
            console.log(`   Old: ${profile.coords} -> New: ${newCoords}`);
            await prisma.freelancerProfile.update({
                where: { id: profile.id },
                data: { coords: newCoords }
            });
            await prisma.user.update({
                where: { id: user.id },
                data: { coords: newCoords }
            });
            fixedCount++;
        } else {
            // Already precise
        }
    }

    console.log(`Successfully precision-geocoded ${fixedCount} profiles.`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
