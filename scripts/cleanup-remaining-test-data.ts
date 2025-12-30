import fs from 'fs';
import path from 'path';

// 1. Clean up phone login page
const phoneLoginPath = path.join(process.cwd(), 'src/app/auth/phone-login/page.tsx');
if (fs.existsSync(phoneLoginPath)) {
  let content = fs.readFileSync(phoneLoginPath, 'utf8');
  content = content.replace(
    /<p className="text-xs">Use code <span className="font-mono font-bold text-purple-400">123456<\/span> to access mock data \+ real data for testing.<\/p>/,
    ''
  );
  fs.writeFileSync(phoneLoginPath, content, 'utf8');
  console.log('✅ Cleaned up test data in phone-login/page.tsx');
}

// 2. Clean up job details modal
const jobDetailsModalPath = path.join(process.cwd(), 'src/components/freelancer/jobs/JobDetailsModal.tsx');
if (fs.existsSync(jobDetailsModalPath)) {
  let content = fs.readFileSync(jobDetailsModalPath, 'utf8');
  
  // Remove fixed test OTP
  content = content.replace(
    /const testOtp = '1234';\s+setJobOtp\(testOtp\);/,
    'const otp = Math.floor(1000 + Math.random() * 9000).toString();\n      setJobOtp(otp);\n      // For demo purposes, we\'ll show the number in development only\n      if (process.env.NODE_ENV === \'development\') {'
  );
  
  fs.writeFileSync(jobDetailsModalPath, content, 'utf8');
  console.log('✅ Cleaned up test OTP in JobDetailsModal.tsx');
}

// 3. Clean up job dashboard
const jobDashboardPath = path.join(process.cwd(), 'src/components/freelancer/jobs/job-dashboard.tsx');
if (fs.existsSync(jobDashboardPath)) {
  let content = fs.readFileSync(jobDashboardPath, 'utf8');
  content = content.replace(
    /let storedOtp = '1234'; \/\/ Default for testing/,
    'let storedOtp = \'\'; // Will be set from API'
  );
  fs.writeFileSync(jobDashboardPath, content, 'utf8');
  console.log('✅ Cleaned up test OTP in job-dashboard.tsx');
}

// 4. Clean up demo dates in job cards
const jobCardPath = path.join(process.cwd(), 'src/components/freelancer/jobs/job-card.tsx');
if (fs.existsSync(jobCardPath)) {
  let content = fs.readFileSync(jobCardPath, 'utf8');
  content = content.replace(
    /\/\/ Hardcoded demo date for consistent card display: December 15, 3:30 PM[\s\S]*?const time = formatTime12Hour\(\`\$\{demoDate\.getHours\(\)\.toString\(\)\.padStart\(2, '0'\)\}:\$\{demoDate\.getMinutes\(\)\.toString\(\)\.padStart\(2, '0'\)\}\\`\);/,
    'const date = format(new Date(job.postedAt), \'MMM d\');\n                    const time = formatTime12Hour(format(new Date(job.postedAt), \'HH:mm\'));'
  );
  fs.writeFileSync(jobCardPath, content, 'utf8');
  console.log('✅ Cleaned up demo dates in job-card.tsx');
}

// 5. Clean up demo dates in JobDetailsFull
const jobDetailsFullPath = path.join(process.cwd(), 'src/app/freelancer/feed/components/JobDetailsFull.tsx');
if (fs.existsSync(jobDetailsFullPath)) {
  let content = fs.readFileSync(jobDetailsFullPath, 'utf8');
  content = content.replace(
    /\/\/ Hardcoded date for consistent demo: November 14, 2025 at 3:30 PM[\s\S]*?const time = demoDate\.toLocaleTimeString\([^;]*;/,
    'const date = new Date(job.postedAt);\n                    const month = date.toLocaleDateString(\'en-US\', { month: \'short\' });\n                    const day = date.getDate();\n                    const year = date.getFullYear();\n                    const time = date.toLocaleTimeString(\'en-US\', {'
  );
  fs.writeFileSync(jobDetailsFullPath, content, 'utf8');
  console.log('✅ Cleaned up demo dates in JobDetailsFull.tsx');
}

// 6. Clean up demo data in referrals page
const referralsPath = path.join(process.cwd(), 'src/app/client/referrals/page.tsx');
if (fs.existsSync(referralsPath)) {
  let content = fs.readFileSync(referralsPath, 'utf8');
  content = content.replace(
    /const referrals = \[[\s\S]*?\];/,
    'const [referrals, setReferrals] = useState<Array<{ id: number; name: string; email: string; status: string; date: string; reward: number }>>([]);\n  \n  useEffect(() => {\n    // Fetch referrals from API\n    const fetchReferrals = async () => {\n      try {\n        const response = await fetch(\'/api/user/referrals\');\n        const data = await response.json();\n        setReferrals(data);\n      } catch (error) {\n        console.error(\'Error fetching referrals:\', error);\n      }\n    };\n    \n    fetchReferrals();\n  }, []);'
  );
  fs.writeFileSync(referralsPath, content, 'utf8');
  console.log('✅ Cleaned up demo data in referrals/page.tsx');
}

console.log('\n✨ Remaining test data cleanup complete!');
