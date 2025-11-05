import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedData() {
  console.log('🌱 Seeding database with initial data...')
  
  try {
    await prisma.$connect()
    console.log('✅ Connected to MongoDB')
    
    // 1. Create Categories
    console.log('\n📂 Creating categories...')
    const categories = [
      { name: 'Playing Services', slug: 'playing', description: 'Cricket playing services including match players, net bowlers, and specialists', icon: '🏏' },
      { name: 'Coaching & Training', slug: 'coaching', description: 'Professional cricket coaching and training services', icon: '👨‍🏫' },
      { name: 'Support Staff', slug: 'support', description: 'Cricket support services like analysts, physios, and scorers', icon: '📊' },
      { name: 'Media & Content', slug: 'media', description: 'Cricket photography, videography, and content creation', icon: '📷' },
    ]
    
    for (const category of categories) {
      await prisma.category.upsert({
        where: { name: category.name },
        update: {},
        create: category,
      })
    }
    console.log(`✅ Created ${categories.length} categories`)
    
    // 2. Create Sample Users
    console.log('\n👥 Creating sample users...')
    const client1 = await prisma.user.upsert({
      where: { email: 'client@doodlance.com' },
      update: {},
      create: {
        email: 'client@doodlance.com',
        name: 'Rajesh Kumar',
        role: 'client',
        currentRole: 'client',
        phone: '+91 9876543210',
        location: 'Chennai, Tamil Nadu',
        coords: [80.2707, 13.0338],
        bio: 'Cricket enthusiast and academy owner',
        referralCode: 'RAJESH2024',
        isVerified: true,
      },
    })
    
    const freelancer1 = await prisma.user.upsert({
      where: { email: 'freelancer@doodlance.com' },
      update: {},
      create: {
        email: 'freelancer@doodlance.com',
        name: 'Sathish Sonu',
        role: 'freelancer',
        currentRole: 'freelancer',
        phone: '+91 9876543211',
        location: 'Chennai, Tamil Nadu',
        coords: [80.2279, 13.0418],
        bio: 'Professional Cricketer and AI Engineer with a passion for both sports and technology.',
        referralCode: 'SONU2024',
        isVerified: true,
      },
    })
    
    const freelancer2 = await prisma.user.upsert({
      where: { email: 'bowler@doodlance.com' },
      update: {},
      create: {
        email: 'bowler@doodlance.com',
        name: 'Arjun Singh',
        role: 'freelancer',
        currentRole: 'freelancer',
        phone: '+91 9876543212',
        location: 'Chennai, Tamil Nadu',
        coords: [80.2095, 13.0850],
        bio: 'Fast bowler with state-level experience',
        referralCode: 'ARJUN2024',
        isVerified: true,
      },
    })
    console.log('✅ Created 3 sample users')
    
    // 3. Create Freelancer Profiles
    console.log('\n💼 Creating freelancer profiles...')
    const profile1 = await prisma.freelancerProfile.upsert({
      where: { userId: freelancer1.id },
      update: {},
      create: {
        userId: freelancer1.id,
        title: 'Cricket All-Rounder',
        about: 'Professional Cricketer and AI Engineer with a passion for both sports and technology. I bring the same dedication and strategic thinking from the cricket field to developing intelligent AI solutions.',
        hourlyRate: 25000,
        skills: ['RH Batsman', 'Sidearm Specialist', 'Off Spin', 'Coach', 'Analyst', 'Mystery Spin'],
        specializations: ['AI Development', 'Cricket Coaching', 'Match Analysis'],
        languages: ['English', 'Tamil', 'Hindi'],
        rating: 4.9,
        reviewCount: 42,
        completedJobs: 120,
        responseTime: '1-2 hours',
        deliveryTime: '1 week',
        completionRate: 100.0,
        repeatClientRate: 85.0,
        coords: [80.2279, 13.0418], // T Nagar, Chennai
        serviceRadius: 50.0,
        isOnline: true,
        isVerified: true,
        verifiedAt: new Date(),
        totalEarnings: 450000,
        thisMonthEarnings: 75000,
        avgProjectValue: 3750,
        availability: {
          monday: { available: true, slots: ['09:00-12:00', '16:00-19:00'] },
          tuesday: { available: true, slots: ['09:00-12:00', '16:00-19:00'] },
          wednesday: { available: true, slots: ['09:00-12:00', '16:00-19:00'] },
          thursday: { available: true, slots: ['09:00-12:00', '16:00-19:00'] },
          friday: { available: true, slots: ['09:00-12:00', '16:00-19:00'] },
          saturday: { available: true, slots: ['08:00-14:00'] },
          sunday: { available: false, slots: [] },
        },
      },
    })
    
    const profile2 = await prisma.freelancerProfile.upsert({
      where: { userId: freelancer2.id },
      update: {},
      create: {
        userId: freelancer2.id,
        title: 'Fast Bowler & Net Specialist',
        about: 'State-level fast bowler available for net practice sessions. Can bowl consistently at 135+ kph with excellent variations.',
        hourlyRate: 2500,
        skills: ['Fast Bowling', 'Net Bowling', 'Pace Variations', 'Death Overs'],
        specializations: ['Express Pace', 'Yorkers', 'Bouncers'],
        languages: ['English', 'Hindi', 'Punjabi'],
        rating: 4.7,
        reviewCount: 32,
        completedJobs: 85,
        responseTime: '30 mins',
        deliveryTime: '2 hours',
        completionRate: 96.0,
        repeatClientRate: 78.0,
        coords: [80.2095, 13.0850], // Chepauk, Chennai
        serviceRadius: 30.0,
        isOnline: true,
        isVerified: true,
        verifiedAt: new Date(),
        totalEarnings: 212500,
        thisMonthEarnings: 35000,
        avgProjectValue: 2500,
        availability: {
          monday: { available: true, slots: ['06:00-09:00', '17:00-20:00'] },
          tuesday: { available: true, slots: ['06:00-09:00', '17:00-20:00'] },
          wednesday: { available: true, slots: ['06:00-09:00', '17:00-20:00'] },
          thursday: { available: true, slots: ['06:00-09:00', '17:00-20:00'] },
          friday: { available: true, slots: ['06:00-09:00', '17:00-20:00'] },
          saturday: { available: true, slots: ['06:00-12:00'] },
          sunday: { available: true, slots: ['06:00-12:00'] },
        },
      },
    })
    
    // Create wallets for users
    console.log('\n💰 Creating wallets...')
    await prisma.wallet.create({
      data: {
        userId: client1.id,
        balance: 50000,
        coins: 1000,
      },
    })
    
    await prisma.wallet.create({
      data: {
        userId: freelancer1.id,
        balance: 25000,
        coins: 500,
      },
    })
    
    await prisma.wallet.create({
      data: {
        userId: freelancer2.id,
        balance: 15000,
        coins: 300,
      },
    })
    
    // Create client profiles
    console.log('\n👤 Creating client profiles...')
    await prisma.clientProfile.create({
      data: {
        userId: client1.id,
        company: 'Chennai Cricket Academy',
        industry: 'Sports & Recreation',
        totalSpent: 85000,
        projectsPosted: 8,
        hireRate: 87.5,
        avgRating: 4.8,
        preferredSkills: ['Cricket Coaching', 'Fast Bowling', 'Batting Techniques'],
        isVerified: true,
        verifiedAt: new Date(),
      },
    })
    
    console.log('✅ Created 2 freelancer profiles, 3 wallets, and 1 client profile')
    
    // 4. Add Experience
    console.log('\n📚 Adding experience records...')
    await prisma.experience.create({
      data: {
        profileId: profile1.id,
        role: 'Head Coach',
        company: 'Chennai Cricket Academy',
        location: 'Chennai, TN',
        startDate: '2018-01',
        endDate: '2023-12',
        isCurrent: false,
        description: 'Led coaching programs for U-16 and U-19 teams. Developed training modules for batting and fielding.',
      },
    })
    
    await prisma.experience.create({
      data: {
        profileId: profile2.id,
        role: 'Net Bowler',
        company: 'Tamil Nadu Cricket Association',
        location: 'Chennai, TN',
        startDate: '2020-06',
        isCurrent: true,
        description: 'Regular net bowler for state team practice sessions. Specialized in pace bowling and variations.',
      },
    })
    console.log('✅ Added 2 experience records')
    
    // 5. Add Portfolio Items
    console.log('\n🎨 Adding portfolio items...')
    await prisma.portfolio.create({
      data: {
        profileId: profile1.id,
        title: 'U-19 State Championship Training',
        category: 'Coaching',
        description: 'Comprehensive training program for U-19 state team',
        images: ['/images/portfolio/coaching1.jpg'],
        skills: ['Batting Techniques', 'Mental Training', 'Match Strategy'],
        clientName: 'Tamil Nadu Cricket Association',
        completedAt: new Date('2023-06-15'),
      },
    })
    
    await prisma.portfolio.create({
      data: {
        profileId: profile2.id,
        title: 'Professional Team Net Sessions',
        category: 'Playing Services',
        description: 'Regular net bowling sessions for professional cricket team',
        images: ['/images/portfolio/bowling1.jpg'],
        skills: ['Fast Bowling', 'Pace Variations', 'Death Overs'],
        clientName: 'Chennai Super Kings Academy',
        completedAt: new Date('2024-01-20'),
      },
    })
    console.log('✅ Added 2 portfolio items')
    
    // 6. Add Reviews
    console.log('\n⭐ Adding reviews...')
    await prisma.review.create({
      data: {
        profileId: profile1.id,
        clientId: client1.id,
        clientName: 'Rahul Sharma',
        clientRole: 'U-19 Cricket Team Captain',
        clientAvatar: '/avatars/rahul.jpg',
        rating: 5,
        comment: 'Sonu transformed my batting technique completely. His one-on-one sessions helped me improve my average by 35% in just 3 months. His knowledge of the game is exceptional!',
        communicationRating: 5,
        qualityRating: 5,
        timelinessRating: 5,
        isVerified: true,
      },
    })
    
    await prisma.review.create({
      data: {
        profileId: profile2.id,
        clientId: client1.id,
        clientName: 'Neha Patel',
        clientRole: 'Startup Founder',
        clientAvatar: '/avatars/neha.jpg',
        rating: 5,
        comment: 'The best off-spin coach I\'ve worked with. His insights into bowling variations and game situations have taken my bowling to the next level.',
        communicationRating: 5,
        qualityRating: 5,
        timelinessRating: 4,
        isVerified: true,
      },
    })
    console.log('✅ Added 2 reviews')
    
    // 7. Create Sample Services
    console.log('\n🎯 Creating sample services...')
    const coachingCategory = await prisma.category.findFirst({ where: { name: 'Coaching & Training' } })
    const playingCategory = await prisma.category.findFirst({ where: { name: 'Playing Services' } })
    
    if (coachingCategory) {
      await prisma.service.create({
        data: {
          title: 'AI Development Consultation',
          description: 'Expert guidance on AI implementation for your business needs',
          price: 25000,
          duration: 60, // 1 hour
          categoryId: coachingCategory.id,
          providerId: freelancer1.id,
          images: ['/images/services/ai-consultation.jpg'],
          tags: ['AI', 'Consultation', 'Machine Learning', 'Technology'],
          location: 'Chennai, Tamil Nadu',
          coords: [80.2279, 13.0418],
          serviceType: 'online',
          deliveryTime: '1 week',
          revisions: 1,
          requirements: ['Technical requirements document', 'Business objectives'],
          packages: {
            basic: { price: 25000, features: ['1-hour consultation', 'Technical analysis', 'Implementation roadmap'] },
            standard: { price: 45000, features: ['2-hour consultation', 'Detailed analysis', 'Custom solution design'] },
            premium: { price: 75000, features: ['3-hour consultation', 'Full technical audit', 'Complete implementation plan'] }
          },
          isActive: true,
          rating: 4.9,
          reviewCount: 42,
          totalOrders: 120,
        },
      })
      
      await prisma.service.create({
        data: {
          title: 'Cricket Coaching (Batting)',
          description: 'Personalized batting coaching sessions with technical skill assessment and video analysis',
          price: 2000,
          duration: 120, // 2 hours
          categoryId: coachingCategory.id,
          providerId: freelancer1.id,
          images: ['/images/services/batting-coaching.jpg'],
          tags: ['Batting', 'Coaching', 'Technique', 'Video Analysis'],
          location: 'Chennai, Tamil Nadu',
          coords: [80.2279, 13.0418],
          serviceType: 'in-person',
          deliveryTime: '2 hours',
          requirements: ['Cricket gear', 'Practice ground access'],
          isActive: true,
          rating: 4.9,
          reviewCount: 35,
          totalOrders: 85,
        },
      })
    }
    
    if (playingCategory) {
      await prisma.service.create({
        data: {
          title: 'Fast Bowling Net Practice',
          description: 'Professional fast bowling services for net practice. Consistent pace at 135+ kph with variations.',
          price: 2500,
          duration: 120, // 2 hours
          categoryId: playingCategory.id,
          providerId: freelancer2.id,
          images: ['/images/services/bowling.jpg'],
          tags: ['Fast Bowling', 'Net Practice', 'Pace', 'Training'],
          location: 'Chepauk, Chennai',
          coords: [80.2095, 13.0850],
          serviceType: 'in-person',
          deliveryTime: '2 hours',
          requirements: ['Cricket ground', 'Safety equipment'],
          isActive: true,
          rating: 4.7,
          reviewCount: 32,
          totalOrders: 85,
        },
      })
    }
    console.log('✅ Created 3 sample services')
    
    // 8. Create Sample Job Posting
    console.log('\n💼 Creating sample job posting...')
    await prisma.job.create({
      data: {
        title: 'Cricket Coach Needed for U-16 Academy',
        description: 'Looking for an experienced cricket coach for our U-16 academy team. Must have prior coaching experience and knowledge of modern cricket techniques.',
        category: 'Coaching & Training',
        budget: 2500,
        budgetMin: 2000,
        budgetMax: 3500,
        location: 'Mylapore, Chennai',
        coords: [80.2707, 13.0338],
        skills: ['Cricket Coaching', 'Batting Techniques', 'Bowling Techniques', 'Fielding Drills'],
        workMode: 'onsite',
        type: 'part-time',
        duration: 'monthly',
        experience: 'Expert',
        clientId: client1.id,
        isActive: true,
        proposals: 0,
      },
    })
    console.log('✅ Created 1 sample job posting')
    
    // 9. Create sample notifications
    console.log('\n🔔 Creating sample notifications...')
    await prisma.notification.create({
      data: {
        userId: freelancer1.id,
        title: 'New Booking Request',
        message: 'You have received a new booking request for AI Development Consultation',
        type: 'BOOKING_REQUEST',
        entityId: 'booking123',
        entityType: 'booking',
        actionUrl: '/freelancer/bookings',
      },
    })
    
    await prisma.notification.create({
      data: {
        userId: client1.id,
        title: 'Profile Verified',
        message: 'Your client profile has been successfully verified',
        type: 'PROFILE_VERIFIED',
        isRead: true,
        readAt: new Date(),
      },
    })
    console.log('✅ Created 2 sample notifications')
    
    console.log('\n🎉 Database seeding complete!')
    console.log('\n📊 Summary:')
    console.log(`   - ${categories.length} categories`)
    console.log('   - 3 users (1 client, 2 freelancers)')
    console.log('   - 2 freelancer profiles')
    console.log('   - 1 client profile')
    console.log('   - 3 wallets')
    console.log('   - 2 experience records')
    console.log('   - 2 portfolio items')
    console.log('   - 2 reviews')
    console.log('   - 3 services')
    console.log('   - 1 job posting')
    console.log('   - 2 notifications')
    
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seedData()
