import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedEnhancedData() {
  console.log('🌱 Seeding enhanced mock data...')
  
  try {
    await prisma.$connect()
    console.log('✅ Connected to MongoDB')
    
    // Get existing users and categories
    const client1 = await prisma.user.findUnique({ where: { email: 'client@doodlance.com' } })
    const freelancer1 = await prisma.user.findUnique({ where: { email: 'freelancer@doodlance.com' } })
    const freelancer2 = await prisma.user.findUnique({ where: { email: 'bowler@doodlance.com' } })
    
    if (!client1 || !freelancer1 || !freelancer2) {
      console.log('❌ Base users not found. Please run seed-data.ts first.')
      return
    }
    
    // Create additional clients for mock jobs
    console.log('\n👥 Creating additional clients...')
    
    const cskAcademy = await prisma.user.upsert({
      where: { email: 'csk@doodlance.com' },
      update: {},
      create: {
        email: 'csk@doodlance.com',
        name: 'Chennai Super Kings Academy',
        role: 'client',
        currentRole: 'client',
        phone: '+91 8765432109',
        location: 'Chepauk, Chennai',
        coords: [80.2095, 13.0850],
        bio: 'Professional cricket academy affiliated with CSK',
        referralCode: 'CSK2024',
        isVerified: true,
      },
    })
    
    const tncaClient = await prisma.user.upsert({
      where: { email: 'tnca@doodlance.com' },
      update: {},
      create: {
        email: 'tnca@doodlance.com',
        name: 'Tamil Nadu Cricket Academy',
        role: 'client',
        currentRole: 'client',
        phone: '+91 9432109876',
        location: 'Adyar Cricket Ground, Chennai',
        coords: [80.2570, 13.0067],
        bio: 'Official Tamil Nadu Cricket Association training facility',
        referralCode: 'TNCA2024',
        isVerified: true,
      },
    })
    
    const annaClub = await prisma.user.upsert({
      where: { email: 'annaclub@doodlance.com' },
      update: {},
      create: {
        email: 'annaclub@doodlance.com',
        name: 'Anna Nagar Cricket Club',
        role: 'client',
        currentRole: 'client',
        phone: '+91 7654321098',
        location: 'Anna Nagar Cricket Club, Chennai',
        coords: [80.2090, 13.0850],
        bio: 'Premier cricket club in Anna Nagar',
        referralCode: 'ANNA2024',
        isVerified: true,
      },
    })
    
    const arjunMehta = await prisma.user.upsert({
      where: { email: 'arjun.mehta@doodlance.com' },
      update: {},
      create: {
        email: 'arjun.mehta@doodlance.com',
        name: 'Arjun Mehta',
        role: 'client',
        currentRole: 'client',
        phone: '+91 6543210987',
        location: 'T Nagar Cricket Academy, Chennai',
        coords: [80.2279, 13.0418],
        bio: 'Parent looking for cricket coaching for my son',
        referralCode: 'ARJUN2024',
        isVerified: true,
      },
    })
    
    const ccaClient = await prisma.user.upsert({
      where: { email: 'cca@doodlance.com' },
      update: {},
      create: {
        email: 'cca@doodlance.com',
        name: 'Chennai Cricket Association',
        role: 'client',
        currentRole: 'client',
        phone: '+91 8765432101',
        location: 'M.A. Chidambaram Stadium, Chennai',
        coords: [80.2095, 13.0850],
        bio: 'Official Chennai Cricket Association',
        referralCode: 'CCA2024',
        isVerified: true,
      },
    })
    
    const cclClient = await prisma.user.upsert({
      where: { email: 'ccl@doodlance.com' },
      update: {},
      create: {
        email: 'ccl@doodlance.com',
        name: 'Chennai Cricket League',
        role: 'client',
        currentRole: 'client',
        phone: '+91 7654321098',
        location: 'Various Grounds, Chennai',
        coords: [80.2707, 13.0338],
        bio: 'Organizing local cricket tournaments',
        referralCode: 'CCL2024',
        isVerified: true,
      },
    })
    
    const nccClient = await prisma.user.upsert({
      where: { email: 'ncc@doodlance.com' },
      update: {},
      create: {
        email: 'ncc@doodlance.com',
        name: 'Nungambakkam Cricket Club',
        role: 'client',
        currentRole: 'client',
        phone: '+91 8765432111',
        location: 'Nungambakkam Cricket Club, Chennai',
        coords: [80.2420, 13.0569],
        bio: 'Elite cricket club with professional facilities',
        referralCode: 'NCC2024',
        isVerified: true,
      },
    })
    
    const velacheryAcademy = await prisma.user.upsert({
      where: { email: 'velachery@doodlance.com' },
      update: {},
      create: {
        email: 'velachery@doodlance.com',
        name: 'Velachery Cricket Academy',
        role: 'client',
        currentRole: 'client',
        phone: '+91 9876543213',
        location: 'Velachery Cricket Academy, Chennai',
        coords: [80.2209, 12.9756],
        bio: 'Cricket academy focused on youth development',
        referralCode: 'VCA2024',
        isVerified: true,
      },
    })
    
    console.log('✅ Created 8 additional clients')
    
    // Create client profiles
    console.log('\n👤 Creating client profiles...')
    await prisma.clientProfile.upsert({
      where: { userId: cskAcademy.id },
      update: {},
      create: {
        userId: cskAcademy.id,
        company: 'Chennai Super Kings Academy',
        industry: 'Sports & Recreation',
        totalSpent: 220000,
        projectsPosted: 18,
        hireRate: 92.5,
        avgRating: 4.9,
        preferredSkills: ['Fast Bowling', 'Sidearm Specialist', 'Content Creation'],
        isVerified: true,
        verifiedAt: new Date(),
      },
    })
    
    await prisma.clientProfile.upsert({
      where: { userId: tncaClient.id },
      update: {},
      create: {
        userId: tncaClient.id,
        company: 'Tamil Nadu Cricket Academy',
        industry: 'Sports & Recreation',
        totalSpent: 150000,
        projectsPosted: 14,
        hireRate: 88.0,
        avgRating: 4.7,
        preferredSkills: ['Mystery Spin', 'Cricket Analysis', 'Net Bowling'],
        isVerified: true,
        verifiedAt: new Date(),
      },
    })
    
    await prisma.clientProfile.upsert({
      where: { userId: ccaClient.id },
      update: {},
      create: {
        userId: ccaClient.id,
        company: 'Chennai Cricket Association',
        industry: 'Sports & Recreation',
        totalSpent: 180000,
        projectsPosted: 26,
        hireRate: 90.0,
        avgRating: 4.8,
        preferredSkills: ['Cricket Photography', 'Scoring', 'Umpiring'],
        isVerified: true,
        verifiedAt: new Date(),
      },
    })
    
    console.log('✅ Created client profiles')
    
    // Create wallets for new clients
    console.log('\n💰 Creating wallets...')
    const newClients = [cskAcademy, tncaClient, annaClub, arjunMehta, ccaClient, cclClient, nccClient, velacheryAcademy]
    for (const client of newClients) {
      await prisma.wallet.upsert({
        where: { userId: client.id },
        update: {},
        create: {
          userId: client.id,
          balance: 100000,
          coins: 2000,
        },
      })
    }
    console.log('✅ Created wallets for new clients')
    
    // Create mock jobs from the mock-data.ts file
    console.log('\n💼 Creating mock jobs...')
    
    const job1 = await prisma.job.create({
      data: {
        title: 'U-16 Academy Coach',
        description: 'Looking for an experienced cricket coach for our U-16 academy team. Must have prior coaching experience and knowledge of modern cricket techniques.',
        category: 'Coaching & Training',
        budget: 2500,
        budgetMin: 2000,
        budgetMax: 3500,
        location: 'Mylapore, Chennai',
        coords: [80.2707, 13.0338],
        skills: ['Cricket Coaching', 'Batting Techniques', 'Bowling Techniques', 'Fielding Drills', 'Team Management'],
        workMode: 'onsite',
        type: 'part-time',
        duration: '2 hours per session',
        experience: 'Expert',
        clientId: client1.id,
        isActive: true,
        proposals: 3,
      },
    })
    
    const job2 = await prisma.job.create({
      data: {
        title: 'Sidearm Specialist — Powerplay & Death Overs',
        description: 'Need an experienced sidearm specialist to simulate tournament conditions for our batsmen. Focus on yorkers, bouncers, and variations for T20 prep.',
        category: 'Playing Services',
        budget: 15000,
        budgetMin: 12000,
        budgetMax: 18000,
        location: 'Chepauk Cricket Ground, Chennai',
        coords: [80.2095, 13.0850],
        skills: ['Sidearm Throwing', 'Death Overs', 'Powerplay Bowling', 'Tournament Simulation'],
        workMode: 'onsite',
        type: 'contract',
        duration: '3 hours (2 sessions)',
        experience: 'Expert',
        clientId: cskAcademy.id,
        isActive: false,
        proposals: 5,
      },
    })
    
    const job3 = await prisma.job.create({
      data: {
        title: 'Mystery Spin Training — Carrom Ball & Doosra',
        description: 'Need a mystery spinner for training sessions with our top-order batsmen. Looking for someone who can bowl carrom balls, doosra, and other variations consistently.',
        category: 'Coaching & Training',
        budget: 2000,
        budgetMin: 1800,
        budgetMax: 2500,
        location: 'Anna Nagar Cricket Club, Chennai',
        coords: [80.2090, 13.0850],
        skills: ['Mystery Spinner', 'Bowling Techniques', 'Carrom Ball', 'Doosra'],
        workMode: 'onsite',
        type: 'freelance',
        duration: '2 hours per session',
        experience: 'Expert',
        clientId: annaClub.id,
        isActive: true,
        proposals: 2,
      },
    })
    
    const job4 = await prisma.job.create({
      data: {
        title: 'Personal Batting Coach — Front-Foot Technique',
        description: 'Looking for a dedicated cricket coach for private one-on-one sessions. Focus on improving batting technique and footwork for a 16-year-old aspiring cricketer.',
        category: 'Coaching & Training',
        budget: 2000,
        budgetMin: 1500,
        budgetMax: 2500,
        location: 'T Nagar Cricket Academy, Chennai',
        coords: [80.2279, 13.0418],
        skills: ['One-on-One Coaching', 'Batting Techniques', 'Footwork', 'Cricket Training'],
        workMode: 'onsite',
        type: 'part-time',
        duration: '1.5 hours per session',
        experience: 'Expert',
        clientId: arjunMehta.id,
        isActive: false,
        proposals: 4,
      },
    })
    
    const job5 = await prisma.job.create({
      data: {
        title: 'Fast Bowling Practice — 140+ kph Nets',
        description: 'Need a fast bowler (140+ kph) for our batsmen\'s net practice. Preparing for upcoming state-level tournament. 2-hour session with breaks.',
        category: 'Playing Services',
        budget: 1800,
        budgetMin: 1500,
        budgetMax: 2200,
        location: 'Adyar Cricket Ground, Chennai',
        coords: [80.2570, 13.0067],
        skills: ['Fast Bowler', 'Net Bowler', 'Cricket Training', 'Pace Bowling'],
        workMode: 'onsite',
        type: 'freelance',
        duration: '2 hours',
        experience: 'Expert',
        clientId: tncaClient.id,
        isActive: false,
        proposals: 3,
      },
    })
    
    const job6 = await prisma.job.create({
      data: {
        title: 'Match Footage Analysis — Technical Breakdown',
        description: 'Need a cricket analyst to review and analyze match footage for our academy team. Focus on identifying technical flaws in batting and bowling techniques.',
        category: 'Support Staff',
        budget: 3500,
        budgetMin: 3000,
        budgetMax: 4500,
        location: 'Velachery Cricket Academy, Chennai',
        coords: [80.2209, 12.9756],
        skills: ['Cricket Analyst', 'Video Analysis', 'Performance Analysis', 'Cricket Techniques'],
        workMode: 'hybrid',
        type: 'contract',
        duration: '4 hours',
        experience: 'Expert',
        clientId: velacheryAcademy.id,
        isActive: true,
        proposals: 2,
      },
    })
    
    const job7 = await prisma.job.create({
      data: {
        title: 'Tournament Photography — Action Shots & Highlights',
        description: 'Need a professional sports photographer for our local cricket tournament. Must have experience with action shots and sports photography equipment.',
        category: 'Media & Content',
        budget: 5000,
        budgetMin: 4000,
        budgetMax: 6000,
        location: 'M.A. Chidambaram Stadium, Chennai',
        coords: [80.2095, 13.0850],
        skills: ['Cricket Photography', 'Sports Photography', 'Action Shots', 'Photo Editing'],
        workMode: 'onsite',
        type: 'contract',
        duration: '8 hours (full match day)',
        experience: 'Expert',
        clientId: ccaClient.id,
        isActive: true,
        proposals: 4,
      },
    })
    
    const job8 = await prisma.job.create({
      data: {
        title: 'Social Media Content — Highlights & Player Profiles',
        description: 'Looking for a cricket content creator to produce engaging videos for our social media channels. Need highlights packages, player profiles, and technique analysis videos.',
        category: 'Media & Content',
        budget: 18000,
        budgetMin: 15000,
        budgetMax: 22000,
        location: 'Chepauk, Chennai',
        coords: [80.2095, 13.0850],
        skills: ['Cricket Content Creation', 'Video Editing', 'Social Media', 'Cricket Knowledge'],
        workMode: 'hybrid',
        type: 'contract',
        duration: 'Project based (15 videos)',
        experience: 'Expert',
        clientId: cskAcademy.id,
        isActive: true,
        proposals: 6,
      },
    })
    
    const job9 = await prisma.job.create({
      data: {
        title: 'Tournament Officiating — T20 Weekend Panel',
        description: 'Seeking experienced cricket umpires for our local T20 tournament. Knowledge of all cricket rules and good communication skills required.',
        category: 'Support Staff',
        budget: 8000,
        budgetMin: 6000,
        budgetMax: 10000,
        location: 'Various Grounds, Chennai',
        coords: [80.2707, 13.0338],
        skills: ['Cricket Umpire', 'Rules Knowledge', 'Decision Making', 'Communication'],
        workMode: 'onsite',
        type: 'contract',
        duration: '3 days (weekend tournament)',
        experience: 'Expert',
        clientId: cclClient.id,
        isActive: true,
        proposals: 8,
      },
    })
    
    const job10 = await prisma.job.create({
      data: {
        title: 'Digital Scoring — Weekend T20 Tournament',
        description: 'Looking for experienced cricket scorers for our upcoming weekend tournament. Must be familiar with digital scoring systems and cricket statistics.',
        category: 'Support Staff',
        budget: 5000,
        budgetMin: 4000,
        budgetMax: 6000,
        location: 'Anna Nagar Cricket Ground, Chennai',
        coords: [80.2090, 13.0850],
        skills: ['Cricket Scorer', 'Digital Scoring', 'Cricket Statistics', 'Match Analysis'],
        workMode: 'onsite',
        type: 'contract',
        duration: '2 days (weekend)',
        experience: 'Intermediate',
        clientId: ccaClient.id,
        isActive: true,
        proposals: 3,
      },
    })
    
    const job11 = await prisma.job.create({
      data: {
        title: 'Sports Physiotherapy — Injury Prevention Program',
        description: 'Seeking a qualified sports physiotherapist for our cricket club team. Focus on injury prevention, treatment, and recovery protocols specific to cricket players.',
        category: 'Support Staff',
        budget: 12000,
        budgetMin: 10000,
        budgetMax: 15000,
        location: 'Nungambakkam Cricket Club, Chennai',
        coords: [80.2420, 13.0569],
        skills: ['Cricket Physio', 'Sports Therapy', 'Injury Management', 'Recovery Techniques'],
        workMode: 'onsite',
        type: 'part-time',
        duration: '1 month (thrice weekly)',
        experience: 'Expert',
        clientId: nccClient.id,
        isActive: true,
        proposals: 5,
      },
    })
    
    console.log('✅ Created 11 mock jobs')
    
    // Create mock applications
    console.log('\n📝 Creating mock applications...')
    
    await prisma.application.create({
      data: {
        jobId: job2.id,
        freelancerId: freelancer1.id,
        coverLetter: 'I have 3+ years of experience as a sidearm specialist working with state-level teams. I can accurately simulate pace, spin, and variations up to 140 kph.',
        proposedRate: 3000,
        estimatedDays: 20,
        skills: ['Sidearm Throwing', 'Fast Bowling Simulation', 'Spin Bowling Simulation', 'Cricket Training'],
        attachments: ['experience_certificate.pdf', 'testimonials.pdf'],
        status: 'PENDING',
        progress: 0,
      },
    })
    
    await prisma.application.create({
      data: {
        jobId: job3.id,
        freelancerId: freelancer1.id,
        coverLetter: 'I specialize in mystery spin bowling including carrom ball, doosra, and slider variations. I have played state-level cricket and can help batsmen develop techniques against various spin deliveries.',
        proposedRate: 4500,
        estimatedDays: 15,
        skills: ['Mystery Spin', 'Carrom Ball', 'Doosra', 'Spin Coaching', 'Cricket Training'],
        attachments: ['spin_credentials.pdf', 'playing_history.pdf'],
        status: 'PENDING',
        progress: 0,
      },
    })
    
    await prisma.application.create({
      data: {
        jobId: job4.id,
        freelancerId: freelancer1.id,
        coverLetter: 'I am a cricket coach with over 7 years of experience specializing in youth development. I have worked with players at both school and academy levels, focusing on developing proper batting technique, footwork, and mental approach to the game.',
        proposedRate: 3000,
        estimatedDays: 30,
        skills: ['One-on-One Coaching', 'Batting Technique', 'Footwork Training', 'Youth Development', 'Video Analysis'],
        attachments: ['coaching_certificate.pdf', 'training_methodology.pdf'],
        status: 'PENDING',
        progress: 0,
      },
    })
    
    await prisma.application.create({
      data: {
        jobId: job10.id,
        freelancerId: freelancer2.id,
        coverLetter: 'I have 5+ years of experience as a cricket scorer for various tournaments across Chennai. I am proficient with digital scoring platforms like CricHQ and can provide detailed match statistics.',
        proposedRate: 2200,
        estimatedDays: 4,
        skills: ['Cricket Scoring', 'Digital Scoring', 'Match Statistics', 'Cricket Knowledge'],
        attachments: ['scoring_certificate.pdf', 'tournament_experience.pdf'],
        status: 'ACCEPTED',
        progress: 100,
      },
    })
    
    await prisma.application.create({
      data: {
        jobId: job6.id,
        freelancerId: freelancer1.id,
        coverLetter: 'Experienced cricket analyst with expertise in technical analysis and performance metrics. I use advanced video analysis software to identify strengths and weaknesses in batting and bowling techniques.',
        proposedRate: 4000,
        estimatedDays: 7,
        skills: ['Cricket Analysis', 'Video Analysis', 'Performance Metrics', 'Technical Feedback'],
        attachments: ['analysis_portfolio.pdf', 'cricket_certifications.pdf'],
        status: 'REJECTED',
        progress: 0,
      },
    })
    
    console.log('✅ Created 5 mock applications')
    
    // Create conversations and messages
    console.log('\n💬 Creating conversations and messages...')
    
    const conv1 = await prisma.conversation.create({
      data: {
        clientId: client1.id,
        freelancerId: freelancer1.id,
        jobId: job1.id,
        lastMessage: 'We have 12 players. Most are beginners with basic skills. We\'re looking to improve their batting and fielding techniques.',
        lastMessageAt: new Date(Date.now() - 1000 * 60 * 60),
        lastMessageType: 'TEXT',
        clientUnreadCount: 0,
        freelancerUnreadCount: 1,
        isActive: true,
      },
    })
    
    await prisma.message.createMany({
      data: [
        {
          conversationId: conv1.id,
          senderId: client1.id,
          content: 'Hi Rajesh, I came across your coaching profile. We need a cricket coach for our U-16 team. Are you available?',
          messageType: 'TEXT',
          isRead: true,
          readAt: new Date(Date.now() - 1000 * 60 * 115),
          isDelivered: true,
          deliveredAt: new Date(Date.now() - 1000 * 60 * 119),
          createdAt: new Date(Date.now() - 1000 * 60 * 120),
        },
        {
          conversationId: conv1.id,
          senderId: freelancer1.id,
          content: 'Yes, I have 5+ years of experience coaching junior teams. What are the training timings?',
          messageType: 'TEXT',
          isRead: true,
          readAt: new Date(Date.now() - 1000 * 60 * 100),
          isDelivered: true,
          deliveredAt: new Date(Date.now() - 1000 * 60 * 114),
          createdAt: new Date(Date.now() - 1000 * 60 * 115),
        },
        {
          conversationId: conv1.id,
          senderId: client1.id,
          content: 'We train on weekends, 8-10 AM at the City Sports Complex. Would you be available for a trial session this Saturday?',
          messageType: 'TEXT',
          isRead: true,
          readAt: new Date(Date.now() - 1000 * 60 * 90),
          isDelivered: true,
          deliveredAt: new Date(Date.now() - 1000 * 60 * 99),
          createdAt: new Date(Date.now() - 1000 * 60 * 100),
        },
        {
          conversationId: conv1.id,
          senderId: freelancer1.id,
          content: 'This Saturday works for me. How many players are in the team currently?',
          messageType: 'TEXT',
          isRead: true,
          readAt: new Date(Date.now() - 1000 * 60 * 60),
          isDelivered: true,
          deliveredAt: new Date(Date.now() - 1000 * 60 * 89),
          createdAt: new Date(Date.now() - 1000 * 60 * 90),
        },
        {
          conversationId: conv1.id,
          senderId: client1.id,
          content: 'We have 12 players. Most are beginners with basic skills. We\'re looking to improve their batting and fielding techniques.',
          messageType: 'TEXT',
          isRead: false,
          isDelivered: true,
          deliveredAt: new Date(Date.now() - 1000 * 60 * 59),
          createdAt: new Date(Date.now() - 1000 * 60 * 60),
        },
      ],
    })
    
    const conv2 = await prisma.conversation.create({
      data: {
        clientId: cskAcademy.id,
        freelancerId: freelancer1.id,
        jobId: job2.id,
        lastMessage: 'That would be great! How about a 15-minute call tomorrow at 2 PM? Also, we\'d like to do a trial session with you next week. Would Monday work?',
        lastMessageAt: new Date(Date.now() - 1000 * 60 * 1380),
        lastMessageType: 'TEXT',
        clientUnreadCount: 1,
        freelancerUnreadCount: 0,
        isActive: true,
      },
    })
    
    await prisma.message.createMany({
      data: [
        {
          conversationId: conv2.id,
          senderId: cskAcademy.id,
          content: 'Hi, we\'re organizing a 6-week fitness bootcamp at Central Park starting next month. We need experienced trainers - are you available?',
          messageType: 'TEXT',
          isRead: true,
          readAt: new Date(Date.now() - 1000 * 60 * 1430),
          isDelivered: true,
          deliveredAt: new Date(Date.now() - 1000 * 60 * 1439),
          createdAt: new Date(Date.now() - 1000 * 60 * 1440),
        },
        {
          conversationId: conv2.id,
          senderId: freelancer1.id,
          content: 'I\'d be interested! Could you share more details about the bootcamp format, expected group size, and compensation?',
          messageType: 'TEXT',
          isRead: true,
          readAt: new Date(Date.now() - 1000 * 60 * 1420),
          isDelivered: true,
          deliveredAt: new Date(Date.now() - 1000 * 60 * 1429),
          createdAt: new Date(Date.now() - 1000 * 60 * 1430),
        },
        {
          conversationId: conv2.id,
          senderId: cskAcademy.id,
          content: 'It\'s a high-energy outdoor bootcamp, 5 days a week. Groups of 15-20 participants per trainer. We pay $40/hour, and sessions are 6-7 AM. We provide all equipment.',
          messageType: 'TEXT',
          isRead: true,
          readAt: new Date(Date.now() - 1000 * 60 * 1400),
          isDelivered: true,
          deliveredAt: new Date(Date.now() - 1000 * 60 * 1419),
          createdAt: new Date(Date.now() - 1000 * 60 * 1420),
        },
        {
          conversationId: conv2.id,
          senderId: freelancer1.id,
          content: 'That schedule works for me. I have experience with outdoor bootcamps and can bring creative circuit training ideas. Should we schedule a quick call to discuss the exercise programming?',
          messageType: 'TEXT',
          isRead: true,
          readAt: new Date(Date.now() - 1000 * 60 * 1380),
          isDelivered: true,
          deliveredAt: new Date(Date.now() - 1000 * 60 * 1399),
          createdAt: new Date(Date.now() - 1000 * 60 * 1400),
        },
        {
          conversationId: conv2.id,
          senderId: cskAcademy.id,
          content: 'That would be great! How about a 15-minute call tomorrow at 2 PM? Also, we\'d like to do a trial session with you next week. Would Monday work?',
          messageType: 'TEXT',
          isRead: false,
          isDelivered: true,
          deliveredAt: new Date(Date.now() - 1000 * 60 * 1379),
          createdAt: new Date(Date.now() - 1000 * 60 * 1380),
        },
      ],
    })
    
    console.log('✅ Created 2 conversations with messages')
    
    // Create transactions for earnings
    console.log('\n💸 Creating transaction records...')
    
    const freelancer1Wallet = await prisma.wallet.findUnique({ where: { userId: freelancer1.id } })
    const freelancer2Wallet = await prisma.wallet.findUnique({ where: { userId: freelancer2.id } })
    
    if (freelancer1Wallet) {
      await prisma.transaction.createMany({
        data: [
          {
            walletId: freelancer1Wallet.id,
            amount: 2200,
            type: 'EARNING',
            description: 'Cricket Scorer for Tournament',
            reference: job10.id,
            status: 'COMPLETED',
            paymentMethod: 'wallet',
            createdAt: new Date('2024-06-28T15:00:00'),
          },
          {
            walletId: freelancer1Wallet.id,
            amount: 4500,
            type: 'EARNING',
            description: 'Cricket Video Analysis',
            reference: job6.id,
            status: 'COMPLETED',
            paymentMethod: 'wallet',
            createdAt: new Date('2024-06-25T12:30:00'),
          },
          {
            walletId: freelancer1Wallet.id,
            amount: 3500,
            type: 'EARNING',
            description: 'Sidearm Specialist Session',
            reference: job2.id,
            status: 'COMPLETED',
            paymentMethod: 'wallet',
            createdAt: new Date('2024-06-20T10:45:00'),
          },
          {
            walletId: freelancer1Wallet.id,
            amount: 3000,
            type: 'EARNING',
            description: 'One-on-One Cricket Coaching',
            reference: job4.id,
            status: 'COMPLETED',
            paymentMethod: 'wallet',
            createdAt: new Date('2024-06-15T16:20:00'),
          },
        ],
      })
    }
    
    if (freelancer2Wallet) {
      await prisma.transaction.createMany({
        data: [
          {
            walletId: freelancer2Wallet.id,
            amount: 1800,
            type: 'EARNING',
            description: 'Fast Bowling Net Practice',
            reference: job5.id,
            status: 'COMPLETED',
            paymentMethod: 'wallet',
            createdAt: new Date('2024-06-22T14:00:00'),
          },
          {
            walletId: freelancer2Wallet.id,
            amount: 2500,
            type: 'EARNING',
            description: 'Net Bowling Session',
            status: 'COMPLETED',
            paymentMethod: 'wallet',
            createdAt: new Date('2024-06-18T09:30:00'),
          },
        ],
      })
    }
    
    console.log('✅ Created transaction records')
    
    console.log('\n🎉 Enhanced mock data seeding complete!')
    console.log('\n📊 Summary:')
    console.log('   - 8 additional clients')
    console.log('   - 11 cricket job postings')
    console.log('   - 5 job applications with proposals')
    console.log('   - 2 conversations with message threads')
    console.log('   - 6 transaction records')
    
  } catch (error) {
    console.error('❌ Enhanced seeding failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seedEnhancedData()
