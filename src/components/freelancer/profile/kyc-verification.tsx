'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">ID Verification</h3>
            <p className="text-sm text-gray-500">Upload a government-issued ID</p>
          </div>
          <Button
            variant={kycStatus.idVerified ? "outline" : "default"}
            onClick={handleIDUpload}
            disabled={kycStatus.idVerified}
          >
            {kycStatus.idVerified ? "Verified" : "Upload ID"}
            <Upload className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="text-sm text-gray-500">
          Accepted documents: Aadhar Card, PAN Card, Passport, Driver's License
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Selfie Verification</h3>
            <p className="text-sm text-gray-500">Take a selfie to verify your identity</p>
          </div>
          <Button
            variant={kycStatus.selfieVerified ? "outline" : "default"}
            onClick={handleSelfieUpload}
            disabled={kycStatus.selfieVerified}
          >
            {kycStatus.selfieVerified ? "Verified" : "Take Selfie"}
            <Camera className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="text-sm text-gray-500">
          Make sure your face is clearly visible and matches your ID
        </div>
      </Card>

      {kycStatus.idVerified && kycStatus.selfieVerified && (
        <div className="text-center p-4 bg-green-50 text-green-700 rounded-lg">
          <p className="font-medium">KYC Verification Complete!</p>
          <p className="text-sm">Your account is now fully verified.</p>
        </div>
      )}
    </div>
  );
} 