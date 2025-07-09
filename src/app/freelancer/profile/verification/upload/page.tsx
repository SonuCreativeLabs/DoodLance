'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText, Check, X, UploadCloud, AlertCircle, Loader2, User } from 'lucide-react';
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
      router.push('/freelancer/profile/verification?status=in_review');
    } catch (error) {
      console.error('Error submitting verification:', error);
      toast.error('Failed to submit verification. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Render step indicators
  const renderStepIndicator = () => {
    const steps = [
      { id: 'document', label: 'Document', icon: <FileText className="h-4 w-4" /> },
      { id: 'selfie', label: 'Selfie', icon: <User className="h-4 w-4" /> },
      { id: 'review', label: 'Review', icon: <Check className="h-4 w-4" /> }
    ] as const;

    const currentStepIndex = steps.findIndex(step => step.id === currentStep);

    return (
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center justify-between w-full max-w-[280px] relative">
          {/* Progress line - positioned between the steps */}
          <div className="absolute top-4 left-6 right-6 h-1 bg-white/5 -translate-y-1/2 -z-10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
              style={{
                width: `${(currentStepIndex / (steps.length - 1)) * 100}%`
              }}
            />
          </div>
          
          {/* Steps */}
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isActive = index === currentStepIndex;
            const stepNumber = index + 1;
            
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div 
                  className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 relative z-10 ${
                    isCompleted 
                      ? 'bg-primary text-primary-foreground scale-100' 
                      : isActive 
                        ? 'bg-primary/10 text-primary border-2 border-primary scale-110' 
                        : 'bg-card border-2 border-white/10 text-white/40 scale-100'
                  }`}
                >
                  {isCompleted ? step.icon : stepNumber}
                </div>
                <span 
                  className={`text-xs mt-2 font-medium transition-colors ${
                    isCompleted || isActive ? 'text-white' : 'text-white/40'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
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
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => currentStep === 'document' ? router.back() : setCurrentStep('document')}
              className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200 group"
              aria-label="Go back"
              type="button"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors duration-200">
                <ArrowLeft className="h-4 w-4" />
              </div>
            </button>
            <div>
              <h1 className="text-xl font-bold">{title}</h1>
              <p className="text-white/60 text-sm mt-0.5">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDocumentStep = () => (
    <form onSubmit={handleDocumentSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white/90 mb-2">
          ID Type <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`w-full flex items-center justify-between p-3 text-left rounded-lg border ${
              isDropdownOpen ? 'border-purple-500' : 'border-white/10'
            } bg-[#1E1E1E] hover:border-white/20 transition-colors`}
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

      <div className="space-y-2">
        <label className="block text-sm font-medium text-white/90 mb-2">
          ID Number <span className="text-red-500">*</span>
        </label>
        <div className="mt-1">
          <input
            type="text"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            className="w-full px-4 py-3 bg-[#1E1E1E] border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder={selectedTypeDetails ? `Enter your ${selectedTypeDetails.label} number` : 'Enter your ID number'}
            required
          />
          <p className="mt-1 text-xs text-white/50">
            Enter the ID number exactly as it appears on your document
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-white/90">
          Upload Document <span className="text-red-500">*</span>
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-white/10 rounded-lg">
          <div className="space-y-1 text-center">
            {previewUrl ? (
              <div className="space-y-3 w-full">
                <p className="text-sm font-medium text-white/80 text-center">Document Preview</p>
                <div className="relative mx-auto">
                  <img 
                    src={previewUrl} 
                    alt="Document preview" 
                    className="max-h-48 mx-auto rounded-lg border border-white/10"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="mx-auto h-12 w-12 text-white/40">
                  <UploadCloud className="h-full w-full" />
                </div>
                <div className="flex text-sm text-white/60">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md font-medium text-purple-400 hover:text-purple-300 focus-within:outline-none"
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
                <p className="text-xs text-white/40">
                  PNG, JPG, PDF up to 5MB
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-[#1E1E1E] rounded-xl border border-white/10 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-white/90 mb-1">Document Requirements</h4>
            <ul className="text-xs text-white/60 space-y-1">
              <li className="flex items-start gap-2">
                <Check className="h-3.5 w-3.5 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Document must be valid and not expired</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-3.5 w-3.5 text-green-400 mt-0.5 flex-shrink-0" />
                <span>All four corners must be visible</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-3.5 w-3.5 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Text must be clear and readable</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-3.5 w-3.5 text-green-400 mt-0.5 flex-shrink-0" />
                <span>No screenshots or edited images</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isUploading}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={!selectedFile || !selectedIdType || !idNumber}
        >
          Continue to Selfie
        </Button>
      </div>
    </form>
  );

  const renderSelfieStep = () => (
    <div className="space-y-6">
      <div className="bg-[#1E1E1E] rounded-xl border border-white/10 p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-medium text-white">Take a Selfie</h2>
            <p className="text-white/60 text-sm mt-1">
              We need to verify that the ID belongs to you. Please take a clear selfie.
            </p>
          </div>
        </div>
        
        <SelfieCapture 
          onCapture={handleSelfieCapture}
          onRetake={handleRetakeSelfie}
          capturedImage={selfieImage}
          isUploading={isUploading}
        />
      </div>
      
      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setCurrentStep('document')}
          disabled={isUploading}
        >
          Back
        </Button>
        <Button 
          type="button" 
          onClick={() => setCurrentStep('review')}
          disabled={!selfieImage}
        >
          Continue to Review
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
      
      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setCurrentStep('selfie')}
          disabled={isUploading}
        >
          Back
        </Button>
        <Button 
          type="button" 
          onClick={handleSubmit}
          disabled={isUploading}
          className="min-w-[120px]"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : 'Submit for Review'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {renderHeader()}

      <div className="max-w-2xl mx-auto pb-8">
        {renderStepIndicator()}
        
        {currentStep === 'document' ? (
          renderDocumentStep()
        ) : currentStep === 'selfie' ? (
          renderSelfieStep()
        ) : (
          renderReviewStep()
        )}
      </div>
    </div>
  );
}
