import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanupAndReseed() {
  console.log('🧹 Cleaning up database...')
  
  try {
    await prisma.$connect()
    console.log('✅ Connected to MongoDB')
    
    // Delete all data from collections
    console.log('\n🗑️  Deleting existing data...')
    try {
      await prisma.review.deleteMany({})
      await prisma.portfolio.deleteMany({})
      await prisma.experience.deleteMany({})
      await prisma.freelancerProfile.deleteMany({})
      await prisma.clientProfile.deleteMany({})
      await prisma.notification.deleteMany({})
      await prisma.message.deleteMany({})
      await prisma.conversation.deleteMany({})
      await prisma.application.deleteMany({})
      await prisma.job.deleteMany({})
      await prisma.transaction.deleteMany({})
      await prisma.wallet.deleteMany({})
      await prisma.booking.deleteMany({})
      await prisma.service.deleteMany({})
      await prisma.category.deleteMany({})
      await prisma.session.deleteMany({})
      await prisma.user.deleteMany({})
      console.log('✅ Deleted all existing data')
    } catch (error: any) {
      if (error.code === 'P2010') {
        console.log('⚠️  Skipping transaction-based deletion (not supported in this deployment)')
        // Try deleting without transactions
        const collections = [
          'review', 'portfolio', 'experience', 'freelancerProfile', 'clientProfile',
          'notification', 'message', 'conversation', 'application', 'job',
          'transaction', 'wallet', 'booking', 'service', 'category', 'session', 'user'
        ]
        for (const collection of collections) {
          try {
            await (prisma as any)[collection].deleteMany({})
          } catch (e) {
            console.log(`  Skipped ${collection}`)
          }
        }
        console.log('✅ Deleted existing data')
      } else {
        throw error
      }
    }
    
    // Create the 4 main categories
    console.log('\n📂 Creating 4 main categories...')
    const categories = [
      { 
        name: 'Playing Services',
        slug: 'playing',
        description: 'Professional cricket playing services including bowlers, batsmen, and specialists', 
        icon: '🏏' 
      },
      { 
        name: 'Coaching & Training',
        slug: 'coaching',
        description: 'Expert coaching and training services for cricket', 
        icon: '👨‍🏫' 
      },
      { 
        name: 'Support Staff',
        slug: 'support',
        description: 'Cricket support services including analysts, physios, scorers, and umpires', 
        icon: '📊' 
      },
      { 
        name: 'Media & Content',
        slug: 'media',
        description: 'Cricket photography, videography, content creation, and commentary', 
        icon: '📷' 
      },
    ]
    
    for (const category of categories) {
      await prisma.category.create({ data: category })
    }
    console.log(`✅ Created ${categories.length} categories`)
    
    // Get category IDs
    const playingServices = await prisma.category.findFirst({ where: { name: 'Playing Services' } })
    const coachingTraining = await prisma.category.findFirst({ where: { name: 'Coaching & Training' } })
    const supportStaff = await prisma.category.findFirst({ where: { name: 'Support Staff' } })
    const mediaContent = await prisma.category.findFirst({ where: { name: 'Media & Content' } })
    
    // Create sample users
    console.log('\n👥 Creating sample users...')
    const client1 = await prisma.user.create({
      data: {
        email: 'client@doodlance.com',
        name: 'Rajesh Kumar',
        role: 'client',
        currentRole: 'client',
        phone: '+91 9876543210',
        location: 'Chennai, Tamil Nadu',
        coords: JSON.stringify([80.2707, 13.0338]),
        bio: 'Cricket enthusiast and academy owner',
        referralCode: 'RAJESH2024',
        isVerified: true,
      },
    })
    
    const freelancer1 = await prisma.user.create({
      data: {
        email: 'freelancer@doodlance.com',
        name: 'Sathish Sonu',
        role: 'freelancer',
        currentRole: 'freelancer',
        phone: '+91 9876543211',
        location: 'Chennai, Tamil Nadu',
        coords: JSON.stringify([80.2279, 13.0418]),
        bio: 'Professional Cricketer and AI Engineer with a passion for both sports and technology.',
        referralCode: 'SONU2024',
        isVerified: true,
      },
    })
    
    const freelancer2 = await prisma.user.create({
      data: {
        email: 'bowler@doodlance.com',
        name: 'Arjun Singh',
        role: 'freelancer',
        currentRole: 'freelancer',
        phone: '+91 9876543212',
        location: 'Chennai, Tamil Nadu',
        coords: JSON.stringify([80.2095, 13.0850]),
        bio: 'Fast bowler with state-level experience',
        referralCode: 'ARJUN2024',
        isVerified: true,
      },
    })
    console.log('✅ Created 3 sample users')
    
    // Create 14 subcategory services
    console.log('\n🎯 Creating 14 subcategory services...')
    
    const services = [
      // Playing Services (4)
      {
        title: 'Match Player',
        description: 'Professional cricket players available for matches and tournaments',
        price: 5000,
        duration: 240,
        categoryId: playingServices!.id,
        providerId: freelancer1.id,
        images: '/images/Bowler & batsman.png',
        tags: JSON.stringify(['Match Player', 'Tournament', 'Professional', 'Team Player']),
        location: 'Chennai, Tamil Nadu',
        coords: JSON.stringify([80.2095, 13.0850]),
        serviceType: 'in-person',
        deliveryTime: '4-8 hours',
        requirements: JSON.stringify(['Match venue', 'Team coordination', 'Cricket gear']),
        isActive: true,
        rating: 4.9,
        reviewCount: 45,
      },
      {
        title: 'Bowler',
        description: 'Professional bowling services for practice sessions and matches',
        price: 2500,
        duration: 90,
        categoryId: playingServices!.id,
        providerId: freelancer1.id,
        images: '/images/Bowler & batsman.png',
        tags: JSON.stringify(['Bowling', 'Fast Bowling', 'Spin Bowling', 'Practice']),
        location: 'Chennai, Tamil Nadu',
        coords: JSON.stringify([80.2095, 13.0850]),
        serviceType: 'in-person',
        deliveryTime: '2 hours',
        requirements: JSON.stringify(['Cricket ground', 'Safety equipment']),
        isActive: true,
        rating: 4.8,
        reviewCount: 25,
      },
      {
        title: 'Batsman',
        description: 'Professional batting services for net practice and match play',
        price: 2500,
        duration: 90,
        categoryId: playingServices!.id,
        providerId: freelancer1.id,
        images: '/images/Bowler & batsman.png',
        tags: JSON.stringify(['Batting', 'Net Practice', 'Match Play']),
        location: 'Chennai, Tamil Nadu',
        coords: JSON.stringify([80.2095, 13.0850]),
        serviceType: 'in-person',
        deliveryTime: '2 hours',
        requirements: JSON.stringify(['Cricket ground', 'Batting gear']),
        isActive: true,
        rating: 4.7,
        reviewCount: 20,
      },
      {
        title: 'Sidearm',
        description: 'Sidearm throwing services for batting practice',
        price: 2000,
        duration: 60,
        categoryId: playingServices!.id,
        providerId: freelancer1.id,
        images: '/images/women sidearm.png',
        tags: JSON.stringify(['Sidearm', 'Practice', 'Training']),
        location: 'Chennai, Tamil Nadu',
        coords: JSON.stringify([80.2095, 13.0850]),
        serviceType: 'in-person',
        deliveryTime: '1 hour',
        requirements: JSON.stringify(['Practice ground', 'Cricket balls']),
        isActive: true,
        rating: 4.6,
        reviewCount: 15,
      },
      
      // Coaching & Training (3)
      {
        title: 'Coach',
        description: 'Professional cricket coaching for all skill levels',
        price: 3000,
        duration: 120,
        categoryId: coachingTraining!.id,
        providerId: freelancer2.id,
        images: '/images/personal coaching.png',
        tags: JSON.stringify(['Coaching', 'Training', 'Technique', 'Strategy']),
        location: 'Chennai, Tamil Nadu',
        coords: JSON.stringify([80.2279, 13.0418]),
        serviceType: 'in-person',
        deliveryTime: '2 hours',
        requirements: JSON.stringify(['Cricket gear', 'Practice ground access']),
        isActive: true,
        rating: 4.9,
        reviewCount: 45,
      },
      {
        title: 'Sports Conditioning Trainer',
        description: 'Specialized sports conditioning and fitness training for cricketers',
        price: 2800,
        duration: 90,
        categoryId: coachingTraining!.id,
        providerId: freelancer2.id,
        images: '/images/Bowler & batsman.png',
        tags: JSON.stringify(['Conditioning', 'Fitness', 'Strength', 'Agility']),
        location: 'Chennai, Tamil Nadu',
        coords: JSON.stringify([80.2279, 13.0418]),
        serviceType: 'in-person',
        deliveryTime: '1.5 hours',
        requirements: JSON.stringify(['Gym access', 'Training equipment']),
        isActive: true,
        rating: 4.8,
        reviewCount: 30,
      },
      {
        title: 'Fitness Trainer',
        description: 'General fitness training tailored for cricket players',
        price: 2500,
        duration: 90,
        categoryId: coachingTraining!.id,
        providerId: freelancer2.id,
        images: '/images/Bowler & batsman.png',
        tags: JSON.stringify(['Fitness', 'Gym', 'Cardio', 'Strength Training']),
        location: 'Chennai, Tamil Nadu',
        coords: JSON.stringify([80.2279, 13.0418]),
        serviceType: 'in-person',
        deliveryTime: '1.5 hours',
        requirements: JSON.stringify(['Gym access', 'Fitness equipment']),
        isActive: true,
        rating: 4.7,
        reviewCount: 28,
      },
      
      // Support Staff (4)
      {
        title: 'Analyst',
        description: 'Cricket match and performance analysis services',
        price: 3500,
        duration: 180,
        categoryId: supportStaff!.id,
        providerId: freelancer2.id,
        images: '/images/Bowler & batsman.png',
        tags: JSON.stringify(['Analysis', 'Data', 'Strategy', 'Performance']),
        location: 'Chennai, Tamil Nadu',
        coords: JSON.stringify([80.2279, 13.0418]),
        serviceType: 'hybrid',
        deliveryTime: '3 hours',
        requirements: JSON.stringify(['Match footage', 'Performance data']),
        isActive: true,
        rating: 4.9,
        reviewCount: 18,
      },
      {
        title: 'Physio',
        description: 'Sports physiotherapy and injury management for cricketers',
        price: 3000,
        duration: 60,
        categoryId: supportStaff!.id,
        providerId: freelancer2.id,
        images: '/images/Bowler & batsman.png',
        tags: JSON.stringify(['Physiotherapy', 'Injury', 'Recovery', 'Treatment']),
        location: 'Chennai, Tamil Nadu',
        coords: JSON.stringify([80.2279, 13.0418]),
        serviceType: 'in-person',
        deliveryTime: '1 hour',
        requirements: JSON.stringify(['Medical history', 'Treatment space']),
        isActive: true,
        rating: 4.8,
        reviewCount: 35,
      },
      {
        title: 'Scorer',
        description: 'Professional cricket scoring services for matches',
        price: 1500,
        duration: 240,
        categoryId: supportStaff!.id,
        providerId: freelancer1.id,
        images: '/images/Bowler & batsman.png',
        tags: JSON.stringify(['Scoring', 'Match', 'Statistics']),
        location: 'Chennai, Tamil Nadu',
        coords: JSON.stringify([80.2095, 13.0850]),
        serviceType: 'in-person',
        deliveryTime: '4 hours',
        requirements: JSON.stringify(['Scoring equipment', 'Match venue access']),
        isActive: true,
        rating: 4.7,
        reviewCount: 22,
      },
      {
        title: 'Umpire',
        description: 'Certified umpiring services for cricket matches',
        price: 2000,
        duration: 240,
        categoryId: supportStaff!.id,
        providerId: freelancer1.id,
        images: '/images/Bowler & batsman.png',
        tags: JSON.stringify(['Umpiring', 'Officiating', 'Match', 'Rules']),
        location: 'Chennai, Tamil Nadu',
        coords: JSON.stringify([80.2095, 13.0850]),
        serviceType: 'in-person',
        deliveryTime: '4 hours',
        requirements: JSON.stringify(['Umpiring gear', 'Match venue access']),
        isActive: true,
        rating: 4.9,
        reviewCount: 40,
      },
      
      // Media & Content (3)
      {
        title: 'Cricket Photo / Videography',
        description: 'Professional cricket photography and videography services',
        price: 5000,
        duration: 240,
        categoryId: mediaContent!.id,
        providerId: freelancer2.id,
        images: '/images/Bowler & batsman.png',
        tags: JSON.stringify(['Photography', 'Videography', 'Media', 'Content']),
        location: 'Chennai, Tamil Nadu',
        coords: JSON.stringify([80.2279, 13.0418]),
        serviceType: 'in-person',
        deliveryTime: '4 hours',
        requirements: JSON.stringify(['Camera equipment', 'Event access']),
        isActive: true,
        rating: 4.9,
        reviewCount: 50,
      },
      {
        title: 'Cricket Content Creator',
        description: 'Cricket content creation for social media and digital platforms',
        price: 4000,
        duration: 180,
        categoryId: mediaContent!.id,
        providerId: freelancer2.id,
        images: '/images/Bowler & batsman.png',
        tags: JSON.stringify(['Content', 'Social Media', 'Digital', 'Creator']),
        location: 'Chennai, Tamil Nadu',
        coords: JSON.stringify([80.2279, 13.0418]),
        serviceType: 'hybrid',
        deliveryTime: '3 hours',
        requirements: JSON.stringify(['Content brief', 'Brand guidelines']),
        isActive: true,
        rating: 4.8,
        reviewCount: 32,
      },
      {
        title: 'Commentator',
        description: 'Professional cricket commentary services for matches and events',
        price: 4500,
        duration: 240,
        categoryId: mediaContent!.id,
        providerId: freelancer2.id,
        images: '/images/Bowler & batsman.png',
        tags: JSON.stringify(['Commentary', 'Broadcasting', 'Match', 'Voice']),
        location: 'Chennai, Tamil Nadu',
        coords: JSON.stringify([80.2279, 13.0418]),
        serviceType: 'in-person',
        deliveryTime: '4 hours',
        requirements: JSON.stringify(['Commentary booth', 'Broadcasting equipment']),
        isActive: true,
        rating: 4.9,
        reviewCount: 28,
      },
    ]
    
    for (const service of services) {
      await prisma.service.create({ data: service })
    }
    console.log(`✅ Created ${services.length} services`)
    
    // Create freelancer profiles
    console.log('\n💼 Creating freelancer profiles...')
    await prisma.freelancerProfile.create({
      data: {
        userId: freelancer1.id,
        title: 'Cricket All-Rounder',
        about: 'Professional Cricketer and AI Engineer with a passion for both sports and technology.',
        hourlyRate: 25000,
        skills: JSON.stringify(['RH Batsman', 'Sidearm Specialist', 'Off Spin', 'Coach', 'Analyst', 'Mystery Spin']),
        specializations: JSON.stringify(['AI Development', 'Cricket Coaching', 'Match Analysis']),
        languages: JSON.stringify(['English', 'Tamil', 'Hindi']),
        rating: 4.9,
        reviewCount: 42,
        completedJobs: 120,
        responseTime: '1-2 hours',
        deliveryTime: '1 week',
        completionRate: 100.0,
        repeatClientRate: 85.0,
        coords: JSON.stringify([80.2279, 13.0418]),
        serviceRadius: 50.0,
        isOnline: true,
        isVerified: true,
        verifiedAt: new Date(),
        totalEarnings: 450000,
        thisMonthEarnings: 75000,
        avgProjectValue: 3750,
        availability: JSON.stringify({
          monday: { available: true, slots: ['09:00-12:00', '16:00-19:00'] },
          tuesday: { available: true, slots: ['09:00-12:00', '16:00-19:00'] },
          wednesday: { available: true, slots: ['09:00-12:00', '16:00-19:00'] },
          thursday: { available: true, slots: ['09:00-12:00', '16:00-19:00'] },
          friday: { available: true, slots: ['09:00-12:00', '16:00-19:00'] },
          saturday: { available: true, slots: ['08:00-14:00'] },
          sunday: { available: false, slots: [] },
        }),
      },
    })
    
    await prisma.freelancerProfile.create({
      data: {
        userId: freelancer2.id,
        title: 'Fast Bowler & Net Specialist',
        about: 'State-level fast bowler available for net practice sessions. Can bowl consistently at 135+ kph with excellent variations.',
        hourlyRate: 2500,
        skills: JSON.stringify(['Fast Bowling', 'Net Bowling', 'Pace Variations', 'Death Overs']),
        specializations: JSON.stringify(['Express Pace', 'Yorkers', 'Bouncers']),
        languages: JSON.stringify(['English', 'Hindi', 'Punjabi']),
        rating: 4.7,
        reviewCount: 32,
        completedJobs: 85,
        responseTime: '30 mins',
        deliveryTime: '2 hours',
        completionRate: 96.0,
        repeatClientRate: 78.0,
        coords: JSON.stringify([80.2095, 13.0850]),
        serviceRadius: 30.0,
        isOnline: true,
        isVerified: true,
        verifiedAt: new Date(),
        totalEarnings: 212500,
        thisMonthEarnings: 35000,
        avgProjectValue: 2500,
        availability: JSON.stringify({
          monday: { available: true, slots: ['06:00-09:00', '17:00-20:00'] },
          tuesday: { available: true, slots: ['06:00-09:00', '17:00-20:00'] },
          wednesday: { available: true, slots: ['06:00-09:00', '17:00-20:00'] },
          thursday: { available: true, slots: ['06:00-09:00', '17:00-20:00'] },
          friday: { available: true, slots: ['06:00-09:00', '17:00-20:00'] },
          saturday: { available: true, slots: ['06:00-12:00'] },
          sunday: { available: true, slots: ['06:00-12:00'] },
        }),
      },
    })
    
    // Create wallets
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
    
    // Create client profile
    console.log('\n👤 Creating client profile...')
    await prisma.clientProfile.create({
      data: {
        userId: client1.id,
        company: 'Chennai Cricket Academy',
        industry: 'Sports & Recreation',
        totalSpent: 85000,
        projectsPosted: 8,
        hireRate: 87.5,
        avgRating: 4.8,
        preferredSkills: JSON.stringify(['Cricket Coaching', 'Fast Bowling', 'Batting Techniques']),
        isVerified: true,
        verifiedAt: new Date(),
      },
    })
    
    console.log('\n🎉 Database cleanup and reseed complete!')
    console.log('\n📊 Summary:')
    console.log('   - 4 main categories')
    console.log('   - 14 subcategory services')
    console.log('   - 3 sample users')
    console.log('   - 2 freelancer profiles')
    console.log('   - 1 client profile')
    console.log('   - 3 wallets')
    console.log('\n✨ Database is now aligned with your exact structure!')
    
  } catch (error) {
    console.error('❌ Cleanup and reseed failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

cleanupAndReseed()
