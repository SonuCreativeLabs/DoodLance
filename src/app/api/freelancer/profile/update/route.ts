import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db';


async function getDbUser(supabaseUserId: string, email?: string) {
    if (!supabaseUserId) return null;
    let dbUser = await prisma.user.findUnique({ where: { supabaseUid: supabaseUserId } });
    if (!dbUser) {
        dbUser = await prisma.user.findUnique({ where: { id: supabaseUserId } });
    }
    if (!dbUser && email) {
        dbUser = await prisma.user.findUnique({ where: { email } });
    }
    return dbUser;
}

export async function PATCH(request: NextRequest) {
    try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            console.error("Auth Error in Profile Update:", authError);
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const dbUser = await getDbUser(user.id, user.email);

        if (!dbUser) {
            // Logic to auto-create user if missing (fallback for legacy/race conditions)
            console.log(`User ${user.email} missing in DB. Auto-creating...`);
            try {
                // ... (existing auto-create logic could go here, but with getDbUser it's safer to assume we found them or fail, 
                // but let's keep the safeguard if we really want, or just return error. 
                // For now, let's keep it simple: if getDbUser fails, we probably shouldn't auto-create blindly unless we are sure.
                // But relying on existing flow:

                // Re-implement basic creation if absolutely needed, but usually getDbUser finds them.
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            } catch (e) {
                return NextResponse.json({ error: 'User sync failed' }, { status: 500 });
            }
        }

        const body = await request.json();
        const {
            // User fields
            name,
            firstName,
            lastName,
            location,
            dateOfBirth,
            avatarUrl,
            gender,
            bio, // bio is on User table in schema now
            email,
            phone,
            username, // Special handling

            // FreelancerProfile fields
            title,
            about,
            cricketRole,
            battingStyle,
            bowlingStyle,
            online,
            readyToWork,
            hourlyRate,
            skills,
            specializations,
            coverImageUrl, // Add this

            // Address fields (stored on User table)
            address,
            city,
            state,
            postalCode,
            area,

            // Multi-Sport fields
            mainSport,
            otherSports,
            sportsDetails
        } = body;

        // 1. Update User Table
        const userUpdates: any = {};
        if (name !== undefined) {
            userUpdates.name = name;
        } else if (firstName !== undefined || lastName !== undefined) {
            // If individual fields provided but no full name, we might need to fetch current name to merge? 
            // Or assume frontend sends both if it sends one. 
            // For simplify, if we receive parts, we try to use them.
            // But we need the OTHER part if only one is sent.
            // Best practice: Frontend sends combined name OR we fetch DB user first (which we have in dbUser).

            const currentName = dbUser.name || "";
            const currentFirst = currentName.split(' ')[0] || "";
            const currentLast = currentName.split(' ').slice(1).join(' ') || "";

            const newFirst = firstName !== undefined ? firstName : currentFirst;
            const newLast = lastName !== undefined ? lastName : currentLast;

            userUpdates.name = `${newFirst} ${newLast}`.trim();
        }

        if (location !== undefined) userUpdates.location = location;
        if (dateOfBirth !== undefined) userUpdates.dateOfBirth = dateOfBirth;
        if (avatarUrl !== undefined) userUpdates.avatar = avatarUrl;
        if (gender !== undefined) userUpdates.gender = gender;
        if (bio !== undefined) userUpdates.bio = bio;
        if (email !== undefined) userUpdates.email = email;
        if (phone !== undefined) userUpdates.phone = phone;
        if (username !== undefined) userUpdates.username = username;
        if (area !== undefined) userUpdates.area = area;

        if (Object.keys(userUpdates).length > 0) {
            await prisma.user.update({
                where: { id: dbUser.id },
                data: userUpdates
            });
        }

        // 1b. Update address fields on User table
        const addressUpdates: any = {};
        if (address !== undefined) addressUpdates.address = address;
        if (city !== undefined) addressUpdates.city = city;
        if (state !== undefined) addressUpdates.state = state;
        if (postalCode !== undefined) addressUpdates.postalCode = postalCode;
        if (area !== undefined) addressUpdates.area = area;

        // Geocode address to coordinates for map display
        let coords: string | undefined;
        if (Object.keys(addressUpdates).length > 0) {
            await prisma.user.update({
                where: { id: dbUser.id },
                data: addressUpdates
            });

            // After updating address, geocode it to get coordinates
            try {
                // Build full address string from updates or existing data
                const currentUser = await prisma.user.findUnique({ where: { id: dbUser.id } });
                const fullAddress = [
                    addressUpdates.address || currentUser?.address,
                    addressUpdates.area || currentUser?.area,
                    addressUpdates.city || currentUser?.city,
                    addressUpdates.state || currentUser?.state,
                    addressUpdates.postalCode || currentUser?.postalCode
                ].filter(Boolean).join(', ');

                if (fullAddress) {
                    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
                    if (mapboxToken) {
                        const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(fullAddress)}.json?access_token=${mapboxToken}&limit=1`;
                        const geocodeResponse = await fetch(geocodeUrl);
                        const geocodeData = await geocodeResponse.json();

                        if (geocodeData.features && geocodeData.features.length > 0) {
                            const [lng, lat] = geocodeData.features[0].center;
                            coords = JSON.stringify([lng, lat]);
                            console.log(`✅ Geocoded address "${fullAddress}" to coordinates:`, coords);
                        }
                    }
                }
            } catch (geocodeError) {
                console.error('Error geocoding address:', geocodeError);
                // Don't fail the entire update if geocoding fails
            }
        }

        // 2. Update Freelancer Profile
        const profileUpdates: any = {};
        if (title !== undefined) profileUpdates.title = title;
        if (about !== undefined) profileUpdates.about = about;
        if (cricketRole !== undefined) profileUpdates.cricketRole = cricketRole;
        if (battingStyle !== undefined) profileUpdates.battingStyle = battingStyle;
        if (bowlingStyle !== undefined) profileUpdates.bowlingStyle = bowlingStyle;
        if (online !== undefined) profileUpdates.isOnline = online; // map online -> isOnline
        if (coverImageUrl !== undefined) {
            console.log("Updating cover image for", dbUser.id, "to", coverImageUrl);
            profileUpdates.coverImage = coverImageUrl; // map coverImageUrl -> coverImage
        }

        // Multi-Sport fields update
        if (mainSport !== undefined) profileUpdates.mainSport = mainSport;
        if (otherSports !== undefined) profileUpdates.otherSports = otherSports;
        if (sportsDetails !== undefined) profileUpdates.sportsDetails = sportsDetails;

        const profile = await prisma.freelancerProfile.findUnique({
            where: { userId: dbUser.id }
        });

        if (profile) {
            // Update existing profile
            const data: any = { ...profileUpdates };
            if (dateOfBirth !== undefined && dateOfBirth !== "") {
                data.dateOfBirth = new Date(dateOfBirth);
            }
            if (hourlyRate !== undefined) data.hourlyRate = hourlyRate;
            if (skills !== undefined) {
                data.skills = typeof skills === 'string' ? skills : JSON.stringify(skills);
            }
            if (specializations !== undefined) {
                data.specializations = typeof specializations === 'string' ? specializations : JSON.stringify(specializations);
            }

            if (Object.keys(data).length > 0 || coords) {
                if (coords) {
                    data.coords = coords;
                }
                await prisma.freelancerProfile.update({
                    where: { userId: dbUser.id },
                    data
                });
            }
        } else {
            // Create new profile
            console.log("Creating new freelancer profile for user", dbUser.id);
            await prisma.freelancerProfile.create({
                data: {
                    userId: dbUser.id,
                    title: title || '',
                    about: about || '',
                    cricketRole: cricketRole || '',
                    battingStyle: battingStyle || '',
                    bowlingStyle: bowlingStyle || '',
                    hourlyRate: hourlyRate || 30, // Default
                    isOnline: online ?? true,
                    skills: Array.isArray(skills) ? JSON.stringify(skills) : (skills || "[]"),
                    specializations: Array.isArray(specializations) ? JSON.stringify(specializations) : (specializations || "[]"),
                    availability: "[]", // Default empty JSON string, NOT array
                    // Add other required fields with defaults
                    rating: 0,
                    reviewCount: 0,
                    completedJobs: 0,
                    responseTime: '1 hour',
                    deliveryTime: '1 day',
                    completionRate: 100,
                    repeatClientRate: 0,
                    totalEarnings: 0,
                    thisMonthEarnings: 0,
                    avgProjectValue: 0,
                    dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                    coverImage: coverImageUrl || null,
                    coords: JSON.stringify([0, 0]), // Required by schema

                    // Multi-Sport fields for creation
                    mainSport: mainSport || 'Cricket',
                    otherSports: otherSports || [],
                    sportsDetails: sportsDetails || {}
                }
            });

            // PERMANENT ROLE UPGRADE:
            // If the user's main role is 'client', upgrade it to 'freelancer' permanently.
            // This grants them dual capabilities.
            if (dbUser.role === 'client') {
                await prisma.user.update({
                    where: { id: dbUser.id },
                    data: {
                        role: 'freelancer',
                        currentRole: 'freelancer' // Switch them to freelancer view immediately
                    }
                });
            }
        }

        // Fetch the latest user data to return
        const finalDbUser = await prisma.user.findUnique({
            where: { id: dbUser.id },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                avatar: true,
                location: true,
                bio: true,
                gender: true,
                username: true,
                displayId: true,
                address: true,
                area: true,
                city: true,
                state: true,
                postalCode: true,
                role: true,
                currentRole: true,
                isVerified: true,
                phoneVerified: true,
                createdAt: true,
            }
        });

        return NextResponse.json({ success: true, user: finalDbUser });

    } catch (error: any) {
        console.error('SERVER ERROR in Profile Update:', error);
        console.error('Error Stack:', error.stack);
        // Log inner error if Prisma
        if (error.code) console.error('Prisma Error Code:', error.code);
        if (error.meta) console.error('Prisma Error Meta:', error.meta);

        return NextResponse.json(
            { error: 'Failed to update profile: ' + error.message },
            { status: 500 }
        );
    }
}
