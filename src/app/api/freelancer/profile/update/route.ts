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
            location,
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
            dateOfBirth,
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
            postalCode
        } = body;

        // 1. Update User Table
        const userUpdates: any = {};
        if (name !== undefined) userUpdates.name = name;
        if (location !== undefined) userUpdates.location = location;
        if (avatarUrl !== undefined) userUpdates.avatar = avatarUrl;
        if (gender !== undefined) userUpdates.gender = gender;
        if (bio !== undefined) userUpdates.bio = bio;
        if (email !== undefined) userUpdates.email = email;
        if (phone !== undefined) userUpdates.phone = phone;
        if (username !== undefined) userUpdates.username = username;

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

        if (Object.keys(addressUpdates).length > 0) {
            await prisma.user.update({
                where: { id: dbUser.id },
                data: addressUpdates
            });
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

            if (Object.keys(data).length > 0) {
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
                    coords: JSON.stringify([0, 0]) // Required by schema
                }
            });
        }

        return NextResponse.json({ success: true });

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
