'use client';

import { useRef, useState } from 'react';
import { CheckCircle, AlertCircle, User, FileText, Clock, Loader2, ArrowLeft, Info, X, UploadCloud } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type VerificationStatus = 'pending' | 'in_review' | 'verified' | 'rejected';

interface VerificationItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  status: VerificationStatus;
  onVerify: (file?: File) => void;
  isVerifying?: boolean;
}

const VerificationItem: React.FC<VerificationItemProps> = ({
  title,
  description,
  icon,
  status,
  onVerify,
  isVerifying = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type (only allow images and PDFs)
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid file type (JPEG, PNG, or PDF)');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      onVerify(file);
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  const getStatusBadge = () => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded-full">
            <CheckCircle className="h-3 w-3" />
            Verified
          </span>
        );
      case 'in_review':
        return (
          <span className="inline-flex items-center gap-1 text-xs bg-yellow-900/30 text-yellow-400 px-2 py-1 rounded-full">
            <Clock className="h-3 w-3" />
            In Review
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 text-xs bg-red-900/30 text-red-400 px-2 py-1 rounded-full">
            <AlertCircle className="h-3 w-3" />
            Needs Attention
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#2A2A2A]/50 p-4 rounded-lg border border-white/5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-[#1E1E1E] rounded-lg text-white/80">
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium text-white/90">{title}</h4>
              {getStatusBadge()}
            </div>
            <p className="text-xs text-white/60 mt-1">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png,.pdf"
            className="hidden"
          />
          {selectedFile ? (
            <div className="flex items-center gap-2 text-xs text-white/80 bg-[#2A2A2A] px-3 py-1.5 rounded-md">
              <FileText className="h-3.5 w-3.5 text-purple-400" />
              <span className="max-w-[120px] truncate">{selectedFile.name}</span>
              <button 
                onClick={handleRemoveFile}
                className="text-white/40 hover:text-white/80 transition-colors"
                aria-label="Remove file"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : null}
          <Button
            variant={status === 'verified' ? 'outline' : 'default'}
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={status === 'verified' || isVerifying || isUploading}
            className="whitespace-nowrap"
          >
            {isVerifying || isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isUploading ? 'Uploading...' : 'Verifying...'}
              </>
            ) : status === 'verified' ? (
              'Verified'
            ) : (
              'Verify Now'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

const AdvancedKYC: React.FC = () => {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState<string | null>(null);

  // Mock verification statuses - in a real app, these would come from your backend
  const [verificationStatus, setVerificationStatus] = useState<Record<string, VerificationStatus>>({
    id: 'in_review',
    selfie: 'pending'
  });

  const handleVerify = async (type: string, file?: File) => {
    if (!file) {
      // If no file is provided, just simulate verification
      setIsVerifying(type);
      setTimeout(() => {
        setVerificationStatus(prev => ({
          ...prev,
          [type]: 'in_review'
        }));
        setIsVerifying(null);
      }, 1500);
      return;
    }

    // Here you would typically upload the file to your server
    // This is a mock implementation
    try {
      setIsVerifying(type);
      
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update status after successful upload
      setVerificationStatus(prev => ({
        ...prev,
        [type]: 'in_review'
      }));
      
      toast.success('Document uploaded successfully! It is now under review.');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload document. Please try again.');
    } finally {
      setIsVerifying(null);
    }
  };

  const documentVerifications = [
    {
      id: 'id',
      title: 'ID Verification',
      description: 'Upload a government-issued ID',
      icon: <FileText className="h-4 w-4" />,
      status: verificationStatus.id
    },
    {
      id: 'selfie',
      title: 'Selfie Verification',
      description: 'Take a selfie to verify your identity',
      icon: <User className="h-4 w-4" />,
      status: verificationStatus.selfie
    }
  ];

  const renderVerificationItems = () => {
    return documentVerifications.map((item) => (
      <VerificationItem
        key={item.id}
        title={item.title}
        description={item.description}
        icon={item.icon}
        status={item.status}
        onVerify={() => handleVerify(item.id)}
        isVerifying={isVerifying === item.id}
      />
    ));
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => router.back()}
            className="text-white/60 hover:bg-white/5 hover:text-white h-9 w-9"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-white">Identity Verification</h1>
        </div>
        <p className="text-sm text-white/60 pl-12">Complete your identity verification to access all features</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-lg font-medium text-white">Document Verification</h2>
          <p className="text-sm text-white/60">
            Verify your identity by uploading the required documents
          </p>
        </div>
        
        <div className="space-y-4">
          {renderVerificationItems()}
        </div>

        <div className="bg-[#1E1E1E]/50 border border-white/5 rounded-lg p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-white">Why verify your identity?</h3>
            <p className="text-sm text-white/60 mt-1">
              Verifying your identity helps build trust with clients and is required to access certain features 
              on DoodLance, including receiving payments and applying for premium jobs.
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 border border-dashed border-white/10 rounded-lg text-center">
          <div className="mx-auto w-12 h-12 bg-[#1E1E1E] rounded-full flex items-center justify-center mb-3">
            <UploadCloud className="h-5 w-5 text-white/60" />
          </div>
          <h4 className="text-sm font-medium text-white/90 mb-1">Upload Additional Documents</h4>
          <p className="text-sm text-white/60 mb-4">
            Upload any additional documents that may help verify your identity or professional qualifications.
          </p>
          <Button variant="outline" className="border-dashed">
            <UploadCloud className="h-4 w-4 mr-2" />
            Upload Documents
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedKYC;
