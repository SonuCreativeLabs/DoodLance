"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  CreditCard,
  Pencil,
  Check,
  X,
  Shield,
  Banknote,
  Copy
} from 'lucide-react';
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useBankAccount } from '@/contexts/BankAccountContext';
import { Skeleton } from "@/components/ui/skeleton";

type BankAccountInfo = {
  accountHolderName: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  accountType: 'savings' | 'current';
  city: string;
  state: string;
  upiId: string;
};

interface SectionCardProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  onEdit?: () => void;
  isEditing?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
  className?: string;
}

const SectionCard = ({
  title,
  icon: Icon,
  children,
  onEdit,
  isEditing,
  onSave,
  onCancel,
  className = ''
}: SectionCardProps) => (
  <div className="bg-gradient-to-br from-[#1E1E1E] to-[#121212] rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300 shadow-lg shadow-purple-900/10 hover:shadow-purple-900/20">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="text-purple-400">
          <Icon className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      {onEdit && (
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={onSave}
                className="text-green-500 hover:bg-green-500/10 hover:text-green-400 h-8 px-3"
              >
                <Check className="h-4 w-4 mr-1" /> Save
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onCancel}
                className="text-red-500 hover:bg-red-500/10 hover:text-red-400 h-8 px-3"
              >
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
            </>
          ) : (
            <Button
              size="icon"
              variant="ghost"
              onClick={onEdit}
              className="text-gray-400 hover:bg-gray-500/10 hover:text-gray-300 h-8 w-8"
              aria-label="Edit"
            >
              <Pencil className="h-4 w-4 text-current" />
            </Button>
          )}
        </div>
      )}
    </div>
    <div className={`space-y-4 ${className}`}>
      {children}
    </div>
  </div>
);

const FormField = ({
  label,
  children,
  className = '',
  required = false
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
}) => (
  <div className={cn("flex flex-col gap-2", className)}>
    <Label className="text-sm font-medium text-white/70">
      {label}{required && <span className="text-red-500 ml-1">*</span>}
    </Label>
    <div className="relative">
      {children}
    </div>
  </div>
);

type EditSection = 'bank-details' | 'additional-info' | null;

export default function BankAccountPage() {
  const { bankAccountData, updateBankAccountData, isComplete, isLoading } = useBankAccount();
  const [editingSection, setEditingSection] = useState<EditSection>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [bankDetails, setBankDetails] = useState<BankAccountInfo>({
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountType: 'savings',
    city: '',
    state: '',
    upiId: '',
  });

  const [editBankDetails, setEditBankDetails] = useState<BankAccountInfo>({ ...bankDetails });
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Sync state with fetching data
  useEffect(() => {
    if (bankAccountData) {
      setBankDetails(bankAccountData);
      setEditBankDetails(bankAccountData);
    }
  }, [bankAccountData]);

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'accountHolderName':
        if (!value.trim()) return 'Account holder name is required';
        if (value.trim().length < 2) return 'Account holder name must be at least 2 characters';
        if (!/^[a-zA-Z\s]+$/.test(value.trim())) return 'Account holder name can only contain letters and spaces';
        return '';

      case 'bankName':
        if (!value.trim()) return 'Bank name is required';
        if (value.trim().length < 2) return 'Bank name must be at least 2 characters';
        return '';

      case 'accountNumber':
        if (!value.trim()) return 'Account number is required';
        if (!/^\d{9,18}$/.test(value.trim())) return 'Account number must be 9-18 digits';
        return '';

      case 'ifscCode':
        if (!value.trim()) return 'IFSC code is required';
        if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value.toUpperCase())) return 'IFSC code must be 11 characters (e.g., SBIN0001234)';
        return '';

      case 'city':
        if (!value.trim()) return 'City is required';
        if (value.trim().length < 2) return 'City name must be at least 2 characters';
        return '';

      case 'state':
        if (!value.trim()) return 'State is required';
        if (value.trim().length < 2) return 'State name must be at least 2 characters';
        return '';

      case 'upiId':
        if (!value.trim()) return 'UPI ID is required';
        if (!/^[a-zA-Z0-9.-]+@[a-zA-Z0-9]+$/.test(value.trim())) return 'UPI ID must be in format: username@bank (e.g., user@paytm)';
        return '';

      default:
        return '';
    }
  };

  const validateAllFields = (data: BankAccountInfo): boolean => {
    const errors: Record<string, string> = {};
    let isValid = true;

    Object.keys(data).forEach(field => {
      const error = validateField(field, data[field as keyof BankAccountInfo] as string);
      if (error) {
        errors[field] = error;
        isValid = false;
      }
    });

    setValidationErrors(errors);
    return isValid;
  };

  const handleCopy = async (value: string, field: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(value);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = value;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
      }
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleSave = (section: EditSection) => {
    if (section === 'bank-details') {
      if (validateAllFields(editBankDetails)) {
        const newBankDetails = { ...editBankDetails };
        setBankDetails(newBankDetails);
        updateBankAccountData(newBankDetails);
        setEditingSection(null);
      }
    }
  };

  const handleCancel = (section: EditSection) => {
    if (section === 'bank-details') {
      setEditBankDetails({ ...bankDetails });
    }
    setEditingSection(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, field: string) => {
    const value = e.target.value;

    // Update the edit state
    setEditBankDetails(prev => ({
      ...prev,
      [field]: value
    }));

    // Real-time validation
    const error = validateField(field, value);
    setValidationErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const startEditing = (section: EditSection) => {
    setEditingSection(section);
    setEditBankDetails({ ...bankDetails });
    setValidationErrors({}); // Clear validation errors when starting to edit
  };

  const renderSection = (section: EditSection) => {
    if (editingSection !== null && editingSection !== section) {
      return null; // Hide other sections when one is being edited
    }

    const isEditing = editingSection === section;

    if (section === 'bank-details') {
      return (
        <SectionCard
          key="bank-details"
          title="Bank Account Details"
          icon={CreditCard}
          onEdit={!isEditing ? () => startEditing('bank-details') : undefined}
          isEditing={isEditing}
          onSave={() => handleSave('bank-details')}
          onCancel={() => handleCancel('bank-details')}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isEditing ? (
              <>
                <div className="space-y-4">
                  <FormField label="Account Holder Name" required>
                    <Input
                      value={editBankDetails.accountHolderName}
                      onChange={(e) => handleInputChange(e, 'accountHolderName')}
                      className={cn(
                        "bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50",
                        validationErrors.accountHolderName && "border-red-500/50 focus-visible:ring-red-500/50"
                      )}
                      placeholder="Enter account holder name"
                    />
                    {validationErrors.accountHolderName && (
                      <p className="text-red-400 text-xs mt-1">{validationErrors.accountHolderName}</p>
                    )}
                  </FormField>

                  <FormField label="Bank Name" required>
                    <Input
                      value={editBankDetails.bankName}
                      onChange={(e) => handleInputChange(e, 'bankName')}
                      className={cn(
                        "bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50",
                        validationErrors.bankName && "border-red-500/50 focus-visible:ring-red-500/50"
                      )}
                      placeholder="e.g., State Bank of India"
                    />
                    {validationErrors.bankName && (
                      <p className="text-red-400 text-xs mt-1">{validationErrors.bankName}</p>
                    )}
                  </FormField>

                  <FormField label="Account Number" required>
                    <Input
                      value={editBankDetails.accountNumber}
                      onChange={(e) => handleInputChange(e, 'accountNumber')}
                      className={cn(
                        "bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50",
                        validationErrors.accountNumber && "border-red-500/50 focus-visible:ring-red-500/50"
                      )}
                      placeholder="Enter account number"
                    />
                    {validationErrors.accountNumber && (
                      <p className="text-red-400 text-xs mt-1">{validationErrors.accountNumber}</p>
                    )}
                  </FormField>

                  <FormField label="IFSC Code" required>
                    <Input
                      value={editBankDetails.ifscCode}
                      onChange={(e) => handleInputChange(e, 'ifscCode')}
                      className={cn(
                        "bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50",
                        validationErrors.ifscCode && "border-red-500/50 focus-visible:ring-red-500/50"
                      )}
                      placeholder="e.g., SBIN0001234"
                    />
                    {validationErrors.ifscCode && (
                      <p className="text-red-400 text-xs mt-1">{validationErrors.ifscCode}</p>
                    )}
                  </FormField>
                </div>

                <div className="space-y-4">
                  <FormField label="Account Type" required>
                    <div className="relative">
                      <select
                        value={editBankDetails.accountType}
                        onChange={(e) => handleInputChange(e, 'accountType')}
                        className="flex h-10 w-full rounded-xl bg-white/5 border border-white/10 text-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E1E1E] transition-colors cursor-pointer appearance-none pr-10"
                      >
                        <option value="savings" className="bg-[#1E1E1E] text-white">Savings Account</option>
                        <option value="current" className="bg-[#1E1E1E] text-white">Current Account</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </div>
                    </div>
                  </FormField>

                  <FormField label="City" required>
                    <Input
                      value={editBankDetails.city}
                      onChange={(e) => handleInputChange(e, 'city')}
                      className={cn(
                        "bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50",
                        validationErrors.city && "border-red-500/50 focus-visible:ring-red-500/50"
                      )}
                      placeholder="Enter city"
                    />
                    {validationErrors.city && (
                      <p className="text-red-400 text-xs mt-1">{validationErrors.city}</p>
                    )}
                  </FormField>

                  <FormField label="State" required>
                    <Input
                      value={editBankDetails.state}
                      onChange={(e) => handleInputChange(e, 'state')}
                      className={cn(
                        "bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50",
                        validationErrors.state && "border-red-500/50 focus-visible:ring-red-500/50"
                      )}
                      placeholder="Enter state"
                    />
                    {validationErrors.state && (
                      <p className="text-red-400 text-xs mt-1">{validationErrors.state}</p>
                    )}
                  </FormField>
                </div>

                <div className="md:col-span-2">
                  <FormField label="UPI ID" required>
                    <Input
                      value={editBankDetails.upiId}
                      onChange={(e) => handleInputChange(e, 'upiId')}
                      className={cn(
                        "bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50",
                        validationErrors.upiId && "border-red-500/50 focus-visible:ring-red-500/50"
                      )}
                      placeholder="e.g., user@paytm, user@oksbi"
                    />
                    {validationErrors.upiId && (
                      <p className="text-red-400 text-xs mt-1">{validationErrors.upiId}</p>
                    )}
                  </FormField>
                </div>

                <div className="flex justify-center gap-4 md:col-span-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleCancel('bank-details')}
                    className="h-10 px-8 rounded-xl border-white/10 text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleSave('bank-details')}
                    disabled={Object.keys(validationErrors).some(key => validationErrors[key] !== '')}
                    className="h-10 px-8 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600 shadow-md hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-purple-600 disabled:hover:to-purple-500"
                  >
                    Save Changes
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-white/70 mb-0.5">Account Holder Name</p>
                    <div className="flex items-center gap-2">
                      <span className="text-white/90 font-medium text-base">{bankDetails.accountHolderName || 'Not provided'}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-white/70 mb-0.5">Bank Name</p>
                    <div className="flex items-center gap-2">
                      <span className="text-white/90">{bankDetails.bankName || 'Not provided'}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-white/70 mb-0.5">Account Number</p>
                    <div className="flex items-center gap-2">
                      <span className="text-white/90 font-mono">{bankDetails.accountNumber ? `****${bankDetails.accountNumber.slice(-4)}` : 'Not provided'}</span>
                      {bankDetails.accountNumber && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopy(bankDetails.accountNumber, 'account')}
                          className="h-6 w-6 p-0 text-white/40 hover:text-white/80 hover:bg-white/5"
                          title="Copy full account number"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      )}
                      {copiedField === 'account' && (
                        <span className="text-xs text-green-400">Copied!</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-white/70 mb-0.5">IFSC Code</p>
                    <div className="flex items-center gap-2">
                      <span className="text-white/90 font-mono">{bankDetails.ifscCode || 'Not provided'}</span>
                      {bankDetails.ifscCode && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopy(bankDetails.ifscCode, 'ifsc')}
                          className="h-6 w-6 p-0 text-white/40 hover:text-white/80 hover:bg-white/5"
                          title="Copy IFSC code"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      )}
                      {copiedField === 'ifsc' && (
                        <span className="text-xs text-green-400">Copied!</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-white/70 mb-0.5">Account Type</p>
                    <div className="flex items-center gap-2">
                      <span className="text-white/90 capitalize">{bankDetails.accountType}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-white/70 mb-0.5">Location</p>
                    <div className="flex items-center gap-2">
                      <span className="text-white/90">{bankDetails.city && bankDetails.state ? `${bankDetails.city}, ${bankDetails.state}` : 'Not provided'}</span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-white/70 mb-0.5">UPI ID</p>
                    <div className="flex items-center gap-2">
                      <span className="text-white/90 font-mono">{bankDetails.upiId || 'Not provided'}</span>
                      {bankDetails.upiId && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopy(bankDetails.upiId, 'upi')}
                          className="h-6 w-6 p-0 text-white/40 hover:text-white/80 hover:bg-white/5"
                          title="Copy UPI ID"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      )}
                      {copiedField === 'upi' && (
                        <span className="text-xs text-green-400">Copied!</span>
                      )}
                    </div>
                  </div>
                </div>

              </>
            )}
          </div>
        </SectionCard>

      );
    }
    return null;
  };

  if (!isMounted || isLoading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-[#0F0F0F] border-b border-white/5 pt-2">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="ml-3">
                <Skeleton className="h-5 w-40 mb-1" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-6 space-y-6">
            <div className="bg-[#1E1E1E] border border-white/5 rounded-2xl p-6 shadow-lg">
              <div className="flex justify-between mb-6">
                <div className="flex gap-3">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-6 w-48" />
                </div>
                <Skeleton className="h-8 w-8" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                ))}
                <div className="md:col-span-2 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-[#0F0F0F] border-b border-white/5 pt-2">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center">
            <Link
              href="/freelancer/profile#bank-account"
              className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200">
                <ArrowLeft className="h-4 w-4" />
              </div>
            </Link>
            <div className="ml-3">
              <h1 className="text-lg font-semibold text-white">Bank Account</h1>
              <p className="text-white/50 text-xs">Manage your bank account details for secure payments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 space-y-6">
          {editingSection === null ? (
            // Show all sections in view mode
            <>
              {renderSection('bank-details')}
            </>
          ) : (
            // Show only the section being edited
            <>{renderSection(editingSection)}</>
          )}

          {/* Warning message for incomplete bank account */}
          {editingSection === null && !isComplete && (
            <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <div className="flex items-center gap-2 text-amber-400">
                <Shield className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm font-medium">Complete your bank account details to enable payments</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
