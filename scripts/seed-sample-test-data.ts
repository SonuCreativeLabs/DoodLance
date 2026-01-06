import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedSampleData() {
    console.log('🌱 Seeding sample freelancer profiles and jobs...\n');

    try {
        // 1. Create 2 Sample Freelancer Users
        const freelancers = [
            {
                email: 'rajesh.kumar@example.com',
                phone: '+919876543210',
                name: 'Rajesh Kumar',
                role: 'freelancer',
                location: 'Mumbai, India',
                bio: 'Experienced cricket coach with 10+ years of experience training professional players. Specialized in batting techniques and mental conditioning.',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh',
                username: 'rajesh-coach'
            },
            {
                email: 'priya.sharma@example.com',
                phone: '+919876543211',
                name: 'Priya Sharma',
                role: 'freelancer',
                location: 'Bangalore, India',
                bio: 'Professional fitness trainer and sports nutritionist. Helping cricketers achieve peak physical performance through customized training programs.',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
                username: 'priya-fitness'
            }
        ];

        const createdFreelancers = [];

        for (const freelancer of freelancers) {
            // Check if user already exists
            const { data: existing } = await supabase
                .from('users')
                .select('id')
                .eq('email', freelancer.email)
                .single();

            if (existing) {
                console.log(`  ✓ Freelancer ${freelancer.name} already exists`);
                createdFreelancers.push(existing);
                continue;
            }

            // Create user (remove timestamp fields - they're auto-generated)
            const { data: user, error: userError } = await supabase
                .from('users')
                .insert({
                    email: freelancer.email,
                    phone: freelancer.phone,
                    name: freelancer.name,
                    role: freelancer.role,
                    location: freelancer.location,
                    bio: freelancer.bio,
                    avatar: freelancer.avatar,
                    username: freelancer.username
                })
                .select()
                .single();

            if (userError) {
                console.error(`  ✗ Error creating ${freelancer.name}:`, userError);
                continue;
            }

            console.log(`  ✓ Created freelancer: ${freelancer.name}`);
            createdFreelancers.push(user);

            // Add skills for freelancers
            const skills = freelancer.email.includes('rajesh')
                ? ['Batting Coach', 'Mental Conditioning', 'Technical Analysis']
                : ['Fitness Training', 'Sports Nutrition', 'Strength & Conditioning'];

            for (const skillName of skills) {
                await supabase.from('skills').insert({
                    user_id: user.id,
                    skill_name: skillName,
                    proficiency_level: 'Expert'
                });
            }
        }

        // 2. Create a Sample Client User
        const { data: clientUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', 'client.demo@example.com')
            .single();

        let clientId = clientUser?.id;

        if (!clientUser) {
            const { data: newClient } = await supabase
                .from('users')
                .insert({
                    email: 'client.demo@example.com',
                    phone: '+919876543212',
                    name: 'Demo Client',
                    role: 'client',
                    location: 'Chennai, India',
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Client'
                })
                .select()
                .single();

            clientId = newClient?.id;
            console.log('  ✓ Created demo client user');
        } else {
            console.log('  ✓ Demo client already exists');
        }

        // 3. Create 2 Sample Jobs
        if (clientId) {
            const jobs = [
                {
                    title: 'Cricket Batting Coach Needed for U-19 Team',
                    description: 'Looking for an experienced batting coach to train our U-19 cricket team for the upcoming state championship. Must have experience with youth training and modern batting techniques.\n\nResponsibilities:\n- Conduct daily practice sessions\n- Analyze and improve batting techniques\n- Provide mental conditioning\n- Prepare team for tournament\n\nDuration: 3 months\nLocation: Chennai Cricket Academy',
                    category: 'Sports',
                    skills: ['Batting Coach', 'Youth Training', 'Technical Analysis'],
                    budget: 75000,
                    rate: 2500,
                    priceUnit: 'per day',
                    duration: 'monthly',
                    workMode: 'onsite',
                    type: 'contract',
                    experience: 'Intermediate',
                    location: 'Chennai, Tamil Nadu, India',
                    coords: [80.2707, 13.0827],
                    clientId: clientId,
                    clientName: 'Chennai Cricket Academy',
                    company: 'Chennai Cricket Academy',
                    companyLogo: 'https://api.dicebear.com/7.x/shapes/svg?seed=CCA'
                },
                {
                    title: 'Sports Nutritionist & Fitness Trainer',
                    description: 'Seeking a qualified sports nutritionist and fitness trainer to work with our professional cricket players. Must create personalized diet plans and training programs.\n\nRequirements:\n- Certified sports nutritionist\n- Experience with professional athletes\n- Knowledge of cricket-specific fitness\n- Ability to track and measure progress\n\nThis is a remote position with occasional on-site visits.',
                    category: 'Sports',
                    skills: ['Sports Nutrition', 'Fitness Training', 'Diet Planning'],
                    budget: 50000,
                    rate: 2000,
                    priceUnit: 'per day',
                    duration: 'monthly',
                    workMode: 'remote',
                    type: 'part-time',
                    experience: 'Expert',
                    location: 'Remote (India)',
                    coords: [77.5946, 12.9716], // Bangalore
                    clientId: clientId,
                    clientName: 'Pro Cricket Training',
                    company: 'Pro Cricket Training',
                    companyLogo: 'https://api.dicebear.com/7.x/shapes/svg?seed=PCT'
                }
            ];

            for (const job of jobs) {
                // Check if job exists
                const { data: existingJob } = await supabase
                    .from('jobs')
                    .select('id')
                    .eq('title', job.title)
                    .single();

                if (existingJob) {
                    console.log(`  ✓ Job "${job.title}" already exists`);
                    continue;
                }

                const { data: newJob, error: jobError } = await supabase
                    .from('jobs')
                    .insert({
                        title: job.title,
                        description: job.description,
                        category: job.category,
                        skills: job.skills,
                        budget: job.budget,
                        rate: job.rate,
                        price_unit: job.priceUnit,
                        duration: job.duration,
                        work_mode: job.workMode,
                        type: job.type,
                        experience: job.experience,
                        location: job.location,
                        coords: job.coords,
                        client_id: job.clientId,
                        client_name: job.clientName,
                        company: job.company,
                        company_logo: job.companyLogo,
                        client_rating: '4.8',
                        client_jobs: 12,
                        proposals: 5
                    })
                    .select()
                    .single();

                if (jobError) {
                    console.error(`  ✗ Error creating job "${job.title}":`, jobError);
                } else {
                    console.log(`  ✓ Created job: ${job.title}`);
                }
            }
        }

        console.log('\n✅ Sample data seeded successfully!');
        console.log('\n📋 Test Credentials:');
        console.log('Freelancer 1: rajesh.kumar@example.com / +919876543210');
        console.log('Freelancer 2: priya.sharma@example.com / +919876543211');
        console.log('Client: client.demo@example.com / +919876543212');
        console.log('\n🔑 Login Instructions:');
        console.log('1. Go to login page');
        console.log('2. Use phone OTP login');
        console.log('3. Enter one of the phone numbers above');
        console.log('4. Use any OTP code (development mode)');
        console.log('\n📝 Use these accounts to test the authentication flow!\n');

    } catch (error) {
        console.error('❌ Error seeding data:', error);
        throw error;
    }
}

// Run the seeder
seedSampleData()
    .then(() => {
        console.log('Done!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Failed:', error);
        process.exit(1);
    });
