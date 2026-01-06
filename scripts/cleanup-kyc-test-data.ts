import fs from 'fs';
import path from 'path';

const kycPath = path.join(process.cwd(), 'src/components/profile/AdvancedKYC.tsx');

if (fs.existsSync(kycPath)) {
  let content = fs.readFileSync(kycPath, 'utf8');
  
  // Remove mock verification status
  content = content.replace(
    /(\/\/\s*Mock verification statuses[\s\S]*?)(?=const\s+\[verificationStatus)/,
    '// Verification statuses will be fetched from backend\n  const [verificationStatus, setVerificationStatus] = useState<Record<string, VerificationStatus>>({});\n\n  const handleVerification = async (type: string) => {\n    // Implementation will be added later\n  };\n'
  );
  
  // Remove mock implementation comment
  content = content.replace(
    /(\/\/\s*This is a mock implementation\s*\n\s*)(try\s*{)/,
    '$1// Implementation will be added later\n  $2'
  );
  
  fs.writeFileSync(kycPath, content, 'utf8');
  console.log('✅ Cleaned up test data in AdvancedKYC.tsx');
} else {
  console.log('⚠️  AdvancedKYC.tsx not found');
}

console.log('\n✨ KYC component cleanup complete!');
