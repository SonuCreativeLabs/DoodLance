const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkProfile() {
    const user = await prisma.user.findFirst({
        where: { email: { contains: 'sonuofficials07' } },
        include: {
            freelancerProfile: {
                include: {
                    achievements: true
                }
            },
            services: true,
            bankAccount: true
        }
    });

    if (!user) {
        console.log('User not found');
        return;
    }

    console.log('User Data:');
    console.log('- Name:', user.name || 'MISSING');
    console.log('- Email:', user.email);
    console.log('- Phone:', user.phone || 'MISSING');
    console.log('- Username:', user.username || 'MISSING');
    console.log('- DOB:', user.dateOfBirth || 'MISSING');
    console.log('- Gender:', user.gender || 'MISSING');
    console.log('- Bio:', user.bio ? `${user.bio.substring(0, 30)}...` : 'MISSING');
    console.log('- Address:', user.address || 'MISSING');
    console.log('- Area:', user.area || 'MISSING');
    console.log('- City:', user.city || 'MISSING');
    console.log('- State:', user.state || 'MISSING');
    console.log('- PostalCode:', user.postalCode || 'MISSING');
    console.log('- Avatar:', user.avatar || 'MISSING');

    const profile = user.freelancerProfile;
    if (profile) {
        console.log('\nFreelancer Profile:');
        console.log('- Cricket Role:', profile.cricketRole || 'MISSING');
        console.log('- Batting Style:', profile.battingStyle || 'MISSING');
        console.log('- Bowling Style:', profile.bowlingStyle || 'MISSING');
        console.log('- Availability:', profile.availability || 'MISSING');
        console.log('- Cover Image:', profile.coverImage || 'MISSING');
        console.log('- Skills:', profile.skills || 'MISSING');
        console.log('- Achievements:', profile.achievements.length);
    }

    console.log('\nServices:', user.services.length);
    console.log('Bank Account:', user.bankAccount ? 'YES' : 'NO');

    // Calculate weighted completion
    const weights = {
        services: 20, availability: 15, publicProfile: 15,
        profilePic: 8, personalInfo: 8, location: 8, contactInfo: 8, cricketInfo: 8,
        skills: 3, bankAccount: 3, achievements: 2, coverImage: 2
    };

    let percentage = 0;
    const completed = [];
    const missing = [];

    // Personal Info (DOB, gender, name, bio)
    if (user.dateOfBirth && user.gender && user.name && user.bio) {
        percentage += weights.personalInfo;
        completed.push('Personal Info (8%)');
    } else missing.push('Personal Info (8%)');

    // Contact Info
    if (user.email && user.phone) {
        percentage += weights.contactInfo;
        completed.push('Contact Info (8%)');
    } else missing.push('Contact Info (8%)');

    // Location
    if (user.area && user.address && user.city && user.state && user.postalCode) {
        percentage += weights.location;
        completed.push('Location (8%)');
    } else missing.push('Location (8%)');

    // Public Profile
    if (user.username) {
        percentage += weights.publicProfile;
        completed.push('Public Profile (15%)');
    } else missing.push('Public Profile (15%)');

    // Cricket Info
    if (profile?.cricketRole && profile?.battingStyle && profile?.bowlingStyle) {
        percentage += weights.cricketInfo;
        completed.push('Cricket Info (8%)');
    } else missing.push('Cricket Info (8%)');

    // Services
    if (user.services.length > 0) {
        percentage += weights.services;
        completed.push('Services (20%)');
    } else missing.push('Services (20%)');

    // Skills
    const skills = profile?.skills ? JSON.parse(profile.skills) : [];
    if (skills.length > 0) {
        percentage += weights.skills;
        completed.push('Skills (3%)');
    } else missing.push('Skills (3%)');

    // Achievements
    if (profile?.achievements.length > 0) {
        percentage += weights.achievements;
        completed.push('Achievements (2%)');
    } else missing.push('Achievements (2%)');

    // Availability
    if (profile?.availability) {
        percentage += weights.availability;
        completed.push('Availability (15%)');
    } else missing.push('Availability (15%)');

    // Bank Account
    if (user.bankAccount) {
        percentage += weights.bankAccount;
        completed.push('Bank Account (3%)');
    } else missing.push('Bank Account (3%)');

    // Profile Pic
    if (user.avatar && user.avatar !== '/placeholder-user.jpg') {
        percentage += weights.profilePic;
        completed.push('Profile Pic (8%)');
    } else missing.push('Profile Pic (8%)');

    // Cover Image
    if (profile?.coverImage) {
        percentage += weights.coverImage;
        completed.push('Cover Image (2%)');
    } else missing.push('Cover Image (2%)');

    console.log('\n=== COMPLETION ANALYSIS ===');
    console.log('TOTAL:', percentage + '%');
    console.log('\nCOMPLETED:');
    completed.forEach(c => console.log('✓', c));
    console.log('\nMISSING:');
    missing.forEach(m => console.log('✗', m));

    await prisma.$disconnect();
}

checkProfile();
