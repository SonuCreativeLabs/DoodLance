import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db';

export async function PATCH(request: NextRequest) {
    try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
            languages,
            online,
            readyToWork,
            hourlyRate,
            skills,
            specializations,
            coverImageUrl // Add this
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
                where: { id: user.id },
                data: userUpdates
            });
        }

        // 2. Update Freelancer Profile
        const profileUpdates: any = {};
        if (title !== undefined) profileUpdates.title = title;
        if (about !== undefined) profileUpdates.about = about;
        if (cricketRole !== undefined) profileUpdates.cricketRole = cricketRole;
        if (battingStyle !== undefined) profileUpdates.battingStyle = battingStyle;
        if (bowlingStyle !== undefined) profileUpdates.bowlingStyle = bowlingStyle;
        if (languages !== undefined) profileUpdates.languages = languages;
        if (online !== undefined) profileUpdates.isOnline = online; // map online -> isOnline
        if (coverImageUrl !== undefined) profileUpdates.coverImage = coverImageUrl; // map coverImageUrl -> coverImage

        const profile = await prisma.freelancerProfile.findUnique({
            where: { userId: user.id }
        });

        if (profile) {
            // Update existing profile
            const data: any = { ...profileUpdates };
            if (dateOfBirth !== undefined) data.dateOfBirth = dateOfBirth;
            if (hourlyRate !== undefined) data.hourlyRate = hourlyRate;
            if (skills !== undefined) {
                data.skills = typeof skills === 'string' ? skills : JSON.stringify(skills);
            }
            if (specializations !== undefined) {
                data.specializations = typeof specializations === 'string' ? specializations : JSON.stringify(specializations);
            }

            if (Object.keys(data).length > 0) {
                await prisma.freelancerProfile.update({
                    where: { userId: user.id },
                    data
                });
            }
        } else {
            // Create new profile
            console.log("Creating new freelancer profile for user", user.id);
            await prisma.freelancerProfile.create({
                data: {
                    userId: user.id,
                    title: title || '',
                    about: about || '',
                    cricketRole: cricketRole || '',
                    battingStyle: battingStyle || '',
                    bowlingStyle: bowlingStyle || '',
                    languages: languages || '',
                    hourlyRate: hourlyRate || 30, // Default
                    isOnline: online ?? true,
                    // ready_to_work removed as it is not in schema
                    skills: Array.isArray(skills) ? JSON.stringify(skills) : (skills || "[]"),
                    specializations: Array.isArray(specializations) ? JSON.stringify(specializations) : (specializations || "[]"),
                    availability: [], // Default empty
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
                    avgProjectValue: 0
                }
            });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Profile update error:', error);
        return NextResponse.json(
            { error: 'Failed to update profile' },
            { status: 500 }
        );
    }
}
