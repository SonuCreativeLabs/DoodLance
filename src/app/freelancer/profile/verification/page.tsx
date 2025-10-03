'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, FileText, Check, X, UploadCloud, AlertCircle, Loader2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { SelfieCapture } from '@/components/verification/SelfieCapture';

interface IdType {
  value: string;
  label: string;
  description: string;
}

type VerificationStep = 'document' | 'selfie' | 'review';

export default function IdUploadPage() {
  const router = useRouter();
  
  // Form state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedIdType, setSelectedIdType] = useState<string>('');
  const [idNumber, setIdNumber] = useState('');
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  
  // UI state
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<VerificationStep>('document');

  const idTypes: IdType[] = [
    { value: 'aadhaar', label: 'Aadhaar Card', description: '12-digit unique identity number' },
    { value: 'pan', label: 'PAN Card', description: 'Permanent Account Number' },
    { value: 'passport', label: 'Passport', description: 'Indian Passport' },
    { value: 'voter_id', label: 'Voter ID', description: 'Voter Identity Card' },
    { value: 'driving_license', label: 'Driving License', description: 'Indian Driving License' },
    { value: 'company_id', label: 'Company ID', description: 'Current employment ID' },
    { value: 'other', label: 'Other Document', description: 'Any other valid document' },
  ];

  const selectedTypeDetails = idTypes.find(type => type.value === selectedIdType);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
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
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleDocumentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error('Please select a file to upload');
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
  
  const handleSubmit = async () => {
    if (!selfieImage) {
      toast.error('Please complete the selfie verification');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Simulate API call with both document and selfie
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // On success
      toast.success('Verification submitted successfully! Your documents are under review.');
      router.push('/freelancer/profile/verification/status?status=in_review');
    } catch (error) {
      console.error('Error submitting verification:', error);
      toast.error('Failed to submit verification. Please try again.');
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
                    className={`w-7 h-7 rounded-full flex items-center justify-center relative z-10 transition-all duration-300 ${
                      isCompleted 
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
                    className={`mt-2 text-xs whitespace-nowrap transition-colors ${
                      isActive ? 'text-white font-medium' : 'text-white/60'
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
            className={`w-full flex items-center justify-between p-2.5 text-left rounded-xl border ${
              isDropdownOpen ? 'border-purple-500' : 'border-white/10'
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
              className={`h-5 w-5 text-white/60 transform transition-transform ${
                isDropdownOpen ? 'rotate-180' : ''
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
                    className={`px-4 py-2 text-sm cursor-pointer hover:bg-white/5 ${
                      selectedIdType === type.value ? 'bg-purple-500/10 text-purple-400' : 'text-white/90'
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
            onChange={(e) => setIdNumber(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-[#1E1E1E] border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder={selectedTypeDetails ? `Enter your ${selectedTypeDetails.label} number` : 'Enter your ID number'}
            required
          />
          <p className="mt-1 text-[11px] text-white/40">
            Enter the ID number exactly as it appears on your document
          </p>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-white/80">
          Upload Document <span className="text-red-500">*</span>
        </label>
        <div className="flex justify-center p-4 border-2 border-dashed border-white/10 rounded-xl">
          <div className="space-y-1 text-center">
            {previewUrl ? (
              <div className="space-y-2 w-full">
                <p className="text-xs font-medium text-white/80">Document Preview</p>
                <div className="relative mx-auto">
                  <img 
                    src={previewUrl} 
                    alt="Document preview" 
                    className="max-h-40 mx-auto rounded border border-white/10"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-0.5 text-white hover:bg-red-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="mx-auto h-8 w-8 text-white/40">
                  <UploadCloud className="h-full w-full" />
                </div>
                <div className="flex items-center justify-center text-xs text-white/60">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded font-medium text-purple-400 hover:text-purple-300 focus-within:outline-none"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      accept="image/jpeg,image/png,application/pdf"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-[11px] text-white/40">
                  PNG, JPG, PDF up to 5MB
                </p>
              </>
            )}
          </div>
        </div>
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

      <div className="flex justify-end pt-2">
        <Button 
          type="submit" 
          disabled={!selectedFile || !selectedIdType || !idNumber}
          className="h-10 px-6 rounded-xl text-sm bg-primary hover:bg-primary/90 text-white transition-all duration-200 font-medium"
        >
          Continue to Selfie
          <ArrowRight className="h-4 w-4 ml-2" />
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
          className="h-9 px-5 rounded-xl text-sm bg-primary hover:bg-primary/90 text-white transition-all duration-200 font-medium"
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
              <h3 className="text-sm font-medium text-white/80 mb-2">Document Preview</h3>
              {previewUrl ? (
                <div className="relative w-full max-w-xs aspect-[3/2] bg-black/20 rounded-lg overflow-hidden border border-white/10">
                  <img 
                    src={previewUrl} 
                    alt="Document preview" 
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center w-full max-w-xs h-32 bg-black/20 rounded-lg border border-dashed border-white/10">
                  <FileText className="h-8 w-8 text-white/40" />
                </div>
              )}
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
