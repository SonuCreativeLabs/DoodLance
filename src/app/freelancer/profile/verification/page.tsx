'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, FileText, Check, X, UploadCloud, AlertCircle, Loader2, User, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { SelfieCapture } from '@/components/verification/SelfieCapture';
import { Skeleton } from "@/components/ui/skeleton";
import imageCompression from 'browser-image-compression';

interface IdType {
  value: string;
  label: string;
  description: string;
}

type VerificationStep = 'document' | 'selfie' | 'review';

export default function IdUploadPage() {
  const router = useRouter();

  // Form state - NOW SUPPORTS MULTIPLE FILES
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedIdType, setSelectedIdType] = useState<string>('');
  const [idNumber, setIdNumber] = useState('');
  const [selfieImage, setSelfieImage] = useState<string | null>(null);

  // UI state
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<VerificationStep>('document');
  const [isLoading, setIsLoading] = useState(true);
  const [idValidation, setIdValidation] = useState<{ isValid: boolean; message: string }>({ isValid: true, message: '' });

  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'in_review' | 'verified' | 'rejected'>('idle');
  const [rejectionReason, setRejectionReason] = useState('');

  // Fetch current status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/freelancer/profile');
        if (response.ok) {
          const data = await response.json();
          // Check if docs exist and what the status is
          if (data.profile?.isVerified) {
            setVerificationStatus('verified');
          } else if (data.profile?.verificationDocs) {
            // If docs exist but not verified, it's likely in review
            // (unless we add a specific 'rejected' flag in the future)
            // For now, we assume 'in_review' if docs exist.
            // You can parse data.verificationDocs to check for a 'status' field if you added one.
            try {
              const docs = JSON.parse(data.profile.verificationDocs);
              if (docs.status === 'rejected') {
                setVerificationStatus('rejected');
                setRejectionReason(docs.rejectionReason || 'Documents were not clear.');
              } else {
                setVerificationStatus('in_review');
              }
            } catch (e) {
              setVerificationStatus('in_review');
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch verification status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStatus();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-[#0F0F0F] border-b border-white/5">
          <div className="px-4 py-3">
            <div className="flex items-start">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="ml-3">
                <Skeleton className="h-6 w-48 mb-1" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-md mx-auto w-full px-4 py-4 space-y-8">
            <div className="flex justify-between px-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-40 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (verificationStatus === 'in_review') {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col items-center justify-center p-4">
        <div className="bg-[#1E1E1E] p-8 rounded-2xl border border-white/10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Under Review</h2>
          <p className="text-white/60 mb-6">
            Your documents have been submitted and are currently being reviewed by our team. This usually takes 24-48 hours.
          </p>
          <Button
            variant="outline"
            className="w-full border-white/10 hover:bg-white/5"
            onClick={() => router.push('/freelancer/profile')}
          >
            Back to Profile
          </Button>
        </div>
      </div>
    );
  }

  if (verificationStatus === 'verified') {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col items-center justify-center p-4">
        <div className="bg-[#1E1E1E] p-8 rounded-2xl border border-green-500/20 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-green-500">Verified</h2>
          <p className="text-white/60 mb-6">
            Your identity has been successfully verified. You now have a verified badge on your profile.
          </p>
        </div>
      </div>
    );
  }

  if (verificationStatus === 'rejected') {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col items-center justify-center p-4">
        <div className="bg-[#1E1E1E] p-8 rounded-2xl border border-red-500/20 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-red-500">Verification Failed</h2>
          <p className="text-white/60 mb-2">
            Your verification request was rejected.
          </p>
          <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/20 mb-6 text-sm text-red-200">
            Reason: {rejectionReason}
          </div>
          <Button
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            onClick={() => setVerificationStatus('idle')}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const idTypes: IdType[] = [
    { value: 'aadhaar', label: 'Aadhaar Card', description: '12-digit unique identity number' },
    { value: 'pan', label: 'PAN Card', description: 'Permanent Account Number' },
    { value: 'passport', label: 'Passport', description: 'Indian Passport' },
    { value: 'voter_id', label: 'Voter ID', description: 'Voter Identity Card' },
    { value: 'driving_license', label: 'Driving License', description: 'Indian Driving License' },
    { value: 'company_id', label: 'Company ID', description: 'Current employment ID' },
    { value: 'other', label: 'Other Document', description: 'Any other valid document' },
  ];

  // ID validation patterns and formatters
  const idPatterns: Record<string, { pattern: RegExp; format: (val: string) => string; placeholder: string; maxLength: number }> = {
    aadhaar: {
      pattern: /^\d{4}\s?\d{4}\s?\d{4}$/,
      format: (val: string) => {
        const numbers = val.replace(/\D/g, '').slice(0, 12);
        if (numbers.length <= 4) return numbers;
        if (numbers.length <= 8) return `${numbers.slice(0, 4)} ${numbers.slice(4)}`;
        return `${numbers.slice(0, 4)} ${numbers.slice(4, 8)} ${numbers.slice(8)}`;
      },
      placeholder: '1234 5678 9012',
      maxLength: 14 // 12 digits + 2 spaces
    },
    pan: {
      pattern: /^[A-Z]{5}[0-9]{4}[A-Z]$/,
      format: (val: string) => val.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10),
      placeholder: 'ABCDE1234F',
      maxLength: 10
    },
    passport: {
      pattern: /^[A-Z][0-9]{7}$/,
      format: (val: string) => val.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8),
      placeholder: 'A1234567',
      maxLength: 8
    },
    voter_id: {
      pattern: /^[A-Z]{3}[0-9]{7}$/,
      format: (val: string) => val.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10),
      placeholder: 'ABC1234567',
      maxLength: 10
    },
    driving_license: {
      pattern: /^[A-Z]{2}[0-9]{13}$/,
      format: (val: string) => val.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 15),
      placeholder: 'DL1420110012345',
      maxLength: 15
    },
    company_id: {
      pattern: /.+/,
      format: (val: string) => val.slice(0, 50),
      placeholder: 'Enter your company ID',
      maxLength: 50
    },
    other: {
      pattern: /.+/,
      format: (val: string) => val.slice(0, 50),
      placeholder: 'Enter your document number',
      maxLength: 50
    }
  };

  const validateIdNumber = (idType: string, value: string): { isValid: boolean; message: string } => {
    if (!value.trim()) {
      return { isValid: false, message: 'ID number is required' };
    }

    const validator = idPatterns[idType];
    if (!validator) {
      return { isValid: true, message: '' };
    }

    const isValid = validator.pattern.test(value.trim());

    if (!isValid) {
      const messages: Record<string, string> = {
        aadhaar: 'Aadhaar must be 12 digits (e.g., 1234 5678 9012)',
        pan: 'PAN must be uppercase, format: ABCDE1234F',
        passport: 'Passport format: A1234567 (1 letter + 7 digits)',
        voter_id: 'Voter ID format: ABC1234567 (3 letters + 7 digits)',
        driving_license: 'Format: DL1420110012345 (2 letters + 13 digits)',
      };
      return { isValid: false, message: messages[idType] || 'Invalid format' };
    }

    return { isValid: true, message: '✓ Valid format' };
  };

  const handleIdNumberChange = (value: string) => {
    if (!selectedIdType) {
      setIdNumber(value);
      return;
    }

    const formatter = idPatterns[selectedIdType];
    const formattedValue = formatter ? formatter.format(value) : value;
    setIdNumber(formattedValue);

    // Validate
    const validation = validateIdNumber(selectedIdType, formattedValue);
    setIdValidation(validation);
  };

  const selectedTypeDetails = idTypes.find(type => type.value === selectedIdType);

  const compressImage = async (file: File): Promise<File> => {
    if (!file.type.startsWith('image/')) {
      return file; // Don't compress PDFs here
    }

    try {
      const options = {
        maxSizeMB: 0.3, // Max 300KB after compression (more aggressive)
        maxWidthOrHeight: 1080, // Reduced to 1080px for smaller files
        useWebWorker: true,
        initialQuality: 0.7, // More aggressive quality reduction
        fileType: file.type as 'image/jpeg' | 'image/png'
      };

      const compressedFile = await imageCompression(file, options);
      console.log('Image compressed:', (file.size / 1024 / 1024).toFixed(2), 'MB →', (compressedFile.size / 1024 / 1024).toFixed(2), 'MB');
      return compressedFile;
    } catch (error) {
      console.error('Compression error:', error);
      toast.error('Failed to compress image, using original');
      return file;
    }
  };

  const compressPDF = async (file: File): Promise<File> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/compress-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('PDF compression failed');
      }

      const compressedBlob = await response.blob();
      const originalSize = response.headers.get('X-Original-Size');
      const compressedSize = response.headers.get('X-Compressed-Size');
      const reduction = response.headers.get('X-Reduction-Percent');

      console.log(`PDF compressed: ${(parseInt(originalSize || '0') / 1024 / 1024).toFixed(2)}MB → ${(parseInt(compressedSize || '0') / 1024 / 1024).toFixed(2)}MB (${reduction}% reduction)`);

      // Create new File object from compressed blob
      return new File([compressedBlob], file.name, { type: 'application/pdf' });
    } catch (error) {
      console.error('PDF compression error:', error);
      toast.error('Failed to compress PDF, using original');
      return file;
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if already have max files
    if (selectedFiles.length >= 3) {
      toast.error('Maximum 3 documents allowed');
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid file type (JPEG, PNG, or PDF)');
      return;
    }

    // Check file size (max 10MB for original)
    if (file.size > 10 * 1024 * 1024) {
      toast.error(`File size should be less than 10MB (current: ${(file.size / 1024 / 1024).toFixed(2)}MB)`);
      return;
    }

    // Compress based on file type
    setIsCompressing(true);
    let processedFile: File;

    if (file.type === 'application/pdf') {
      processedFile = await compressPDF(file);
    } else {
      processedFile = await compressImage(file);
    }

    setIsCompressing(false);

    // Add to files array
    setSelectedFiles(prev => [...prev, processedFile]);

    // Create preview
    if (processedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(processedFile);
    } else {
      // For PDFs, add a placeholder
      setPreviewUrls(prev => [...prev, 'PDF']);
    }

    // Reset input
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    toast.success('Document removed');
  };

  const handleDocumentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      toast.error('Please upload at least one document');
      return;
    }

    if (!selectedIdType) {
      toast.error('Please select an ID type');
      return;
    }

    if (!idNumber.trim()) {
      toast.error('Please enter your ID number');
      return;
    }

    // Validate ID number
    const validation = validateIdNumber(selectedIdType, idNumber);
    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }

    // Move to selfie verification step
    setCurrentStep('selfie');
  };

  const handleSelfieCapture = (imageData: string) => {
    setSelfieImage(imageData);
    setCurrentStep('review');
  };

  const handleRetakeSelfie = () => {
    setSelfieImage(null);
    setCurrentStep('selfie');
  };

  const uploadFile = async (file: File, path: string) => {
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();

    // Convert to distinct file name to avoid collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(7)}_${Date.now()}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('verification-docs')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('verification-docs')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const uploadBase64 = async (base64Data: string, path: string) => {
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();

    // Convert base64 to blob
    const res = await fetch(base64Data);
    const blob = await res.blob();

    const fileName = `${Math.random().toString(36).substring(7)}_${Date.now()}.jpg`;
    const filePath = `${path}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('verification-docs')
      .upload(filePath, blob, {
        contentType: 'image/jpeg'
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('verification-docs')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async () => {
    if (!selfieImage || selectedFiles.length === 0) {
      toast.error('Please complete all verification steps');
      return;
    }

    setIsUploading(true);

    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error('User not authenticated');

      // 1. Upload All Documents
      const documentUrls: string[] = [];
      for (const file of selectedFiles) {
        try {
          const url = await uploadFile(file, `${user.id}/documents`);
          documentUrls.push(url);
        } catch (error) {
          console.error('Failed to upload document:', file.name, error);
          throw new Error(`Failed to upload ${file.name}`);
        }
      }

      // 2. Upload Selfie
      const selfieUrl = await uploadBase64(selfieImage, `${user.id}/selfies`);

      // 3. Submit to API
      const response = await fetch('/api/freelancer/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idType: selectedIdType,
          idNumber,
          documentUrls, // Changed to array
          selfieUrl
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit verification');
      }

      // On success
      toast.success('Verification submitted successfully! Your documents are under review.');
      router.push('/freelancer/profile/verification/status?status=in_review');
    } catch (error) {
      console.error('Error submitting verification:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit verification. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Modern horizontal step indicator with connecting lines
  const renderStepIndicator = () => {
    const steps = [
      { id: 'document', label: 'Document' },
      { id: 'selfie', label: 'Selfie' },
      { id: 'review', label: 'Review' }
    ] as const;

    const currentStepIndex = steps.findIndex(step => step.id === currentStep);

    return (
      <div className="w-full">
        <div className="relative max-w-md mx-auto">
          {/* Steps container */}
          <div className="flex items-start justify-between px-4">
            {steps.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isActive = index === currentStepIndex;
              const isLast = index === steps.length - 1;

              return (
                <div key={step.id} className="relative flex-1 flex flex-col items-center">
                  {/* Step circle */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center relative z-10 transition-all duration-300 ${isCompleted
                      ? 'bg-primary/90 text-white'
                      : isActive
                        ? 'bg-white border-2 border-primary text-primary'
                        : 'bg-white/5 border border-white/10 text-white/40'
                      }`}
                  >
                    {isCompleted ? (
                      <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                    ) : (
                      <span className="text-xs font-medium">
                        {index + 1}
                      </span>
                    )}
                  </div>

                  {/* Step label */}
                  <span
                    className={`mt-2 text-xs whitespace-nowrap transition-colors ${isActive ? 'text-white font-medium' : 'text-white/60'
                      }`}
                  >
                    {step.label}
                  </span>

                  {/* Connecting line */}
                  {!isLast && (
                    <div className="absolute top-3.5 left-full w-16 h-0.5 bg-white/10 overflow-hidden -translate-x-1/2">
                      <div
                        className="h-full bg-primary/80 transition-all duration-500 ease-out"
                        style={{
                          width: isCompleted ? '100%' : index < currentStepIndex ? '100%' : '0%'
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderHeader = () => {
    const title = {
      document: 'Upload Government ID',
      selfie: 'Take a Selfie',
      review: 'Review & Submit'
    }[currentStep];

    const description = {
      document: 'Verify your identity by uploading a valid government-issued ID',
      selfie: 'Take a selfie for identity verification',
      review: 'Review your information before submission'
    }[currentStep];

    return (
      <div className="flex items-center py-3">
        <button
          onClick={() => currentStep === 'document' ? router.back() : setCurrentStep('document')}
          className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200"
          aria-label="Go back"
          type="button"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200">
            <ArrowLeft className="h-4 w-4" />
          </div>
        </button>
        <div className="ml-3">
          <h1 className="text-lg font-semibold text-white">{title}</h1>
          <p className="text-white/50 text-xs">{description}</p>
        </div>
      </div>
    );
  };

  const renderDocumentStep = () => (
    <form onSubmit={handleDocumentSubmit} className="space-y-6">
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-white/80">
          ID Type <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`w-full flex items-center justify-between p-2.5 text-left rounded-xl border ${isDropdownOpen ? 'border-purple-500' : 'border-white/10'
              } bg-[#1E1E1E] hover:border-white/20 transition-colors text-sm`}
          >
            <div>
              {selectedIdType ? (
                <>
                  <div className="font-medium text-white">
                    {selectedTypeDetails?.label}
                  </div>
                  <div className="text-xs text-white/60">
                    {selectedTypeDetails?.description}
                  </div>
                </>
              ) : (
                <span className="text-white/60">Select ID type</span>
              )}
            </div>
            <svg
              className={`h-5 w-5 text-white/60 transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''
                }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full rounded-md bg-[#1E1E1E] border border-white/10 shadow-lg max-h-96 overflow-auto">
              <div className="py-1">
                {idTypes.map((type) => (
                  <div
                    key={type.value}
                    onClick={() => {
                      setSelectedIdType(type.value);
                      setIsDropdownOpen(false);
                    }}
                    className={`px-4 py-2 text-sm cursor-pointer hover:bg-white/5 ${selectedIdType === type.value ? 'bg-purple-500/10 text-purple-400' : 'text-white/90'
                      }`}
                  >
                    <div className="font-medium">{type.label}</div>
                    <div className="text-xs text-white/60">{type.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-white/80">
          ID Number <span className="text-red-500">*</span>
        </label>
        <div>
          <input
            type="text"
            value={idNumber}
            onChange={(e) => handleIdNumberChange(e.target.value)}
            className={`w-full px-3 py-2 text-sm bg-[#1E1E1E] border rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 transition-all ${idNumber && selectedIdType
                ? idValidation.isValid
                  ? 'border-green-500/50 focus:ring-green-500/50 focus:border-green-500'
                  : 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500'
                : 'border-white/10 focus:ring-purple-500 focus:border-transparent'
              }`}
            placeholder={selectedIdType && idPatterns[selectedIdType] ? idPatterns[selectedIdType].placeholder : 'Enter your ID number'}
            maxLength={selectedIdType && idPatterns[selectedIdType] ? idPatterns[selectedIdType].maxLength : 50}
            required
          />
          {idNumber && selectedIdType && (
            <p className={`mt-1.5 text-[11px] flex items-center gap-1 ${idValidation.isValid ? 'text-green-400' : 'text-red-400'
              }`}>
              {idValidation.message}
            </p>
          )}
          {!idNumber && selectedIdType && (
            <p className="mt-1 text-[11px] text-white/40">
              {selectedIdType === 'aadhaar' && 'Format: 1234 5678 9012'}
              {selectedIdType === 'pan' && 'Format: ABCDE1234F (uppercase letters and numbers)'}
              {selectedIdType === 'passport' && 'Format: A1234567'}
              {selectedIdType === 'voter_id' && 'Format: ABC1234567'}
              {selectedIdType === 'driving_license' && 'Format: DL1420110012345'}
              {(!selectedIdType || ['company_id', 'other'].includes(selectedIdType)) && 'Enter the ID number exactly as it appears on your document'}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-white/80">
          Upload Documents <span className="text-red-500">*</span>
        </label>
        <p className="text-[11px] text-white/40 mb-2">
          Upload 1-3 documents (e.g., front and back of ID). PNG, JPG, PDF up to 10MB each.
        </p>

        {/* Display uploaded files */}
        {selectedFiles.length > 0 && (
          <div className="space-y-2 mb-3">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-[#1E1E1E] rounded-xl border border-white/10">
                {/* Preview or icon */}
                <div className="flex-shrink-0 w-12 h-12 rounded overflow-hidden border border-white/10 bg-black/20">
                  {previewUrls[index] === 'PDF' ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="h-6 w-6 text-red-400" />
                    </div>
                  ) : (
                    <img
                      src={previewUrls[index]}
                      alt={`Document ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* File info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{file.name}</p>
                  <p className="text-xs text-white/50">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="flex-shrink-0 p-1.5 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload area - show only if less than 3 files */}
        {selectedFiles.length < 3 && (
          <div className="flex justify-center p-4 border-2 border-dashed border-white/10 rounded-xl hover:border-purple-500/50 transition-colors">
            <div className="space-y-1 text-center w-full">
              <div className="mx-auto h-8 w-8 text-white/40">
                <UploadCloud className="h-full w-full" />
              </div>
              <div className="flex items-center justify-center text-xs text-white/60">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded font-medium text-purple-400 hover:text-purple-300 focus-within:outline-none flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{selectedFiles.length === 0 ? 'Upload documents' : 'Add another document'}</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    accept="image/jpeg,image/png,application/pdf"
                    disabled={isCompressing}
                  />
                </label>
              </div>
              {isCompressing && (
                <p className="text-xs text-yellow-400 flex items-center justify-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Compressing file...
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="bg-[#1E1E1E] rounded-xl border border-white/10 p-3">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-medium text-white/90">Document Requirements</h4>
            <ul className="text-[11px] text-white/50 space-y-0.5 mt-1">
              <li className="flex items-start gap-1.5">
                <Check className="h-3 w-3 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Document must be valid and not expired</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="h-3 w-3 text-green-400 mt-0.5 flex-shrink-0" />
                <span>All four corners must be visible</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="h-3 w-3 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Text must be clear and readable</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="h-3 w-3 text-green-400 mt-0.5 flex-shrink-0" />
                <span>No screenshots or edited images</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          disabled={selectedFiles.length === 0 || !selectedIdType || !idNumber || isCompressing}
          className="w-full h-10 rounded-xl text-sm bg-primary hover:bg-primary/90 text-white transition-all duration-200 font-medium disabled:opacity-50"
        >
          {isCompressing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Continue to Selfie
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </form>
  );

  const renderSelfieStep = () => (
    <div className="space-y-6 pt-4">
      <SelfieCapture
        onCapture={handleSelfieCapture}
        onRetake={handleRetakeSelfie}
        capturedImage={selfieImage}
        isUploading={isUploading}
      />

      <div className="flex justify-between items-center pt-4 border-t border-white/5">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setCurrentStep('document')}
          disabled={isUploading}
          className="h-9 px-4 text-sm text-foreground/80 hover:text-foreground hover:bg-white/5"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back
        </Button>
        <Button
          type="button"
          onClick={() => setCurrentStep('review')}
          disabled={!selfieImage}
          className="flex-1 ml-4 h-9 rounded-xl text-sm bg-primary hover:bg-primary/90 text-white transition-all duration-200 font-medium"
        >
          Continue to Review
          <ArrowRight className="h-4 w-4 ml-1.5" />
        </Button>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <div className="bg-[#1E1E1E] rounded-xl border border-white/10 p-6 space-y-6">
        <div>
          <h2 className="text-lg font-medium text-white mb-4">Review Your Information</h2>

          <div className="space-y-4">
            <div className="border-b border-white/5 pb-4">
              <h3 className="text-sm font-medium text-white/80 mb-2">Document Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-white/50">Document Type</p>
                  <p className="text-white">{selectedTypeDetails?.label || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-xs text-white/50">ID Number</p>
                  <p className="text-white">{idNumber || 'Not provided'}</p>
                </div>
              </div>
            </div>

            <div className="border-b border-white/5 pb-4">
              <h3 className="text-sm font-medium text-white/80 mb-2">Document Previews ({selectedFiles.length})</h3>
              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 bg-black/20 rounded-lg border border-white/5">
                    <div className="flex-shrink-0 w-16 h-16 rounded overflow-hidden border border-white/10 bg-black/30">
                      {previewUrls[index] === 'PDF' ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileText className="h-8 w-8 text-red-400" />
                        </div>
                      ) : (
                        <img
                          src={previewUrls[index]}
                          alt={`Document ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{file.name}</p>
                      <p className="text-xs text-white/50">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-white/80 mb-2">Selfie</h3>
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-green-500/50">
                {selfieImage ? (
                  <img
                    src={selfieImage}
                    alt="Selfie preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-black/30 flex items-center justify-center">
                    <User className="h-8 w-8 text-white/40" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setCurrentStep('selfie')}
          disabled={isUploading}
          className="h-11 px-6 text-foreground/80 hover:text-foreground hover:bg-transparent"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isUploading}
          className="h-11 px-8 bg-primary hover:bg-primary/90 text-white transition-all duration-200 min-w-[140px]"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Submitting...
            </>
          ) : (
            <>
              Submit for Review
              <Check className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col">
      {/* Sticky Header with Description */}
      <div className="sticky top-0 z-20 bg-[#0F0F0F] border-b border-white/5">
        <div className="px-4 py-3">
          <div className="flex items-start">
            <button
              onClick={() => currentStep === 'document' ? router.back() : setCurrentStep('document')}
              className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200 mt-1"
              aria-label="Go back"
              type="button"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200">
                <ArrowLeft className="h-4 w-4" />
              </div>
            </button>
            <div className="ml-3">
              <h1 className="text-lg font-semibold text-white">
                {currentStep === 'document' ? 'Document Verification' :
                  currentStep === 'selfie' ? 'Take a Selfie' : 'Review & Submit'}
              </h1>
              <p className="text-sm text-white/60 mt-1">
                {currentStep === 'document' ? 'Verify your identity with a valid ID' :
                  currentStep === 'selfie' ? 'We need to match your selfie with your ID' :
                    'Verify your information before submission'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-md mx-auto w-full px-4 py-4">
          {/* Centered Step Indicator */}
          <div className="mb-6">
            {renderStepIndicator()}
          </div>

          {/* Dynamic Step Content */}
          <div className="animate-fade-in">
            {currentStep === 'document' ? (
              renderDocumentStep()
            ) : currentStep === 'selfie' ? (
              renderSelfieStep()
            ) : (
              renderReviewStep()
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
