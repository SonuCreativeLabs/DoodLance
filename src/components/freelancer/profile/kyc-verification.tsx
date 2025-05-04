'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, Camera } from "lucide-react";

interface KYCStatus {
  idVerified: boolean;
  selfieVerified: boolean;
}

export function KYCVerification() {
  const [kycStatus, setKycStatus] = useState<KYCStatus>({
    idVerified: false,
    selfieVerified: false
  });

  const handleIDUpload = () => {
    // In a real app, this would handle file upload
    setKycStatus(prev => ({ ...prev, idVerified: true }));
  };

  const handleSelfieUpload = () => {
    // In a real app, this would handle selfie capture/upload
    setKycStatus(prev => ({ ...prev, selfieVerified: true }));
  };

  return (
    <div className="space-y-6">
      <section className="max-w-2xl mx-auto w-full px-2 md:px-0 mb-8 text-neutral-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 border-b border-neutral-700 pb-4">
          <div>
            <div className="font-semibold text-base text-neutral-100">Government ID</div>
            <div className="text-sm text-neutral-300">Upload your Aadhaar, PAN, or other valid ID</div>
          </div>
          <Button
            className={`rounded-lg px-4 py-2 ${kycStatus.idVerified ? 'bg-green-900/20 text-green-300 border border-green-700' : 'bg-neutral-900 text-neutral-100 border border-neutral-700 hover:bg-purple-900/30 hover:border-purple-400'} flex items-center gap-2 shadow-sm transition-all`}
            onClick={handleIDUpload}
          >
            {kycStatus.idVerified ? 'Verified' : 'Upload'}
            <Upload className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-sm text-neutral-400">
          Accepted documents: Aadhar Card, PAN Card, Passport, Driver's License
        </div>
      </section>

      <section className="max-w-2xl mx-auto w-full px-2 md:px-0 mb-8 text-neutral-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 border-b border-neutral-700 pb-4">
          <div>
            <div className="font-semibold text-base text-neutral-100">Selfie Verification</div>
            <div className="text-sm text-neutral-300">Take a selfie for facial verification</div>
          </div>
          <Button
            className={`rounded-lg px-4 py-2 ${kycStatus.selfieVerified ? 'bg-green-900/20 text-green-300 border border-green-700' : 'bg-neutral-900 text-neutral-100 border border-neutral-700 hover:bg-purple-900/30 hover:border-purple-400'} flex items-center gap-2 shadow-sm transition-all`}
            onClick={handleSelfieUpload}
          >
            {kycStatus.selfieVerified ? 'Verified' : 'Take Selfie'}
            <Camera className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-sm text-neutral-400">Make sure your face is clearly visible and matches your ID</div>
      </section>

      {kycStatus.idVerified && kycStatus.selfieVerified && (
        <div className="max-w-2xl mx-auto w-full px-2 md:px-0 text-center p-4 bg-green-900/20 text-green-300 rounded-xl border border-green-700 mt-8">
          <p className="font-semibold">KYC Verification Complete!</p>
          <p className="text-sm">Your account is now fully verified.</p>
        </div>
      )}
    </div>
  );
}