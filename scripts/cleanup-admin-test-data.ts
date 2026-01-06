import fs from 'fs';
import path from 'path';

// 1. Clean up admin login route
const adminLoginPath = path.join(process.cwd(), 'src/app/api/admin/auth/login/route.ts');
if (fs.existsSync(adminLoginPath)) {
  let content = fs.readFileSync(adminLoginPath, 'utf8');
  content = content.replace(
    /\/\/ For demo purposes, accept specific passwords/,
    '// Validate admin credentials against database'
  );
  fs.writeFileSync(adminLoginPath, content, 'utf8');
  console.log('✅ Cleaned up demo comment in admin login route');
}

// 2. Clean up admin audit route
const adminAuditPath = path.join(process.cwd(), 'src/app/api/admin/audit/route.ts');
if (fs.existsSync(adminAuditPath)) {
  let content = fs.readFileSync(adminAuditPath, 'utf8');
  content = content.replace(
    /'demo-token'/,
    'req.headers.get(\'authorization\')?.split(\' \')[1] || \'\''
  );
  fs.writeFileSync(adminAuditPath, content, 'utf8');
  console.log('✅ Cleaned up demo token in admin audit route');
}

// 3. Clean up admin users action route
const adminUsersPath = path.join(process.cwd(), 'src/app/api/admin/users/action/route.ts');
if (fs.existsSync(adminUsersPath)) {
  let content = fs.readFileSync(adminUsersPath, 'utf8');
  content = content.replace(
    /email: 'rohit@example.com',/g,
    'email: user.email,'
  ).replace(
    /email: 'ananya@example.com',/g,
    'email: user.email,'
  );
  fs.writeFileSync(adminUsersPath, content, 'utf8');
  console.log('✅ Cleaned up example emails in admin users route');
}

// 4. Clean up applications route
const applicationsPath = path.join(process.cwd(), 'src/app/api/applications/route.ts');
if (fs.existsSync(applicationsPath)) {
  let content = fs.readFileSync(applicationsPath, 'utf8');
  content = content.replace(
    /\/\/ Check if freelancer already applied \(optional - for testing purposes\)[\s\S]*?console\.log\('⚠️ User already applied, but allowing for testing'\);/,
    '// Check if freelancer already applied\n    const existingApplication = await prisma.application.findFirst({\n      where: {\n        jobId: jobId,\n        freelancerId: userId\n      }\n    });\n    \n    if (existingApplication) {\n      return NextResponse.json(\n        { error: \'You have already applied to this job\' },\n        { status: 400 }\n      );\n    }'
  );
  fs.writeFileSync(applicationsPath, content, 'utf8');
  console.log('✅ Cleaned up testing code in applications route');
}

// 5. Clean up jobs route
const jobsPath = path.join(process.cwd(), 'src/app/api/jobs/route.ts');
if (fs.existsSync(jobsPath)) {
  let content = fs.readFileSync(jobsPath, 'utf8');
  content = content.replace(
    /\/\/ TEMPORARY: Allow all users to create jobs for testing purposes/,
    '// Only allow authenticated clients to create jobs'
  );
  fs.writeFileSync(jobsPath, content, 'utf8');
  console.log('✅ Cleaned up testing comment in jobs route');
}

// 6. Clean up health route
const healthPath = path.join(process.cwd(), 'src/app/api/health/route.ts');
if (fs.existsSync(healthPath)) {
  let content = fs.readFileSync(healthPath, 'utf8');
  content = content.replace(
    /testData: 'This is test data',/,
    ''
  ).replace(
    /tags: \{ test: true \},/,
    ''
  ).replace(
    /return NextResponse\.json\(\{ message: 'No test performed' \}\);/,
    'return NextResponse.json({ status: \'ok\', timestamp: new Date().toISOString() });'
  );
  fs.writeFileSync(healthPath, content, 'utf8');
  console.log('✅ Cleaned up test data in health route');
}

console.log('\n✨ Admin and API test data cleanup complete!');
