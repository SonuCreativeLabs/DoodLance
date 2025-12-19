'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export interface BankAccountData {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountType: 'savings' | 'current';
  city: string;
  state: string;
  upiId: string;
}

interface BankAccountContextType {
  bankAccountData: BankAccountData | null;
  updateBankAccountData: (data: BankAccountData) => void;
  clearBankAccountData: () => void;
  isComplete: boolean;
}

const defaultBankAccountData: BankAccountData = {
  accountHolderName: '',
  bankName: '',
  accountNumber: '',
  ifscCode: '',
  accountType: 'savings',
  city: '',
  state: '',
  upiId: '',
};

const BankAccountContext = createContext<BankAccountContextType | undefined>(undefined);

export function BankAccountProvider({ children }: { children: ReactNode }) {
  const [bankAccountData, setBankAccountData] = useState<BankAccountData | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bankAccountData');
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  const updateBankAccountData = useCallback((data: BankAccountData) => {
    setBankAccountData(data);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bankAccountData', JSON.stringify(data));
    }
  }, []);

  const clearBankAccountData = useCallback(() => {
    setBankAccountData(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('bankAccountData');
    }
  }, []);

  const isComplete = Boolean(
    bankAccountData?.accountHolderName &&
    bankAccountData?.bankName &&
    bankAccountData?.accountNumber &&
    bankAccountData?.ifscCode &&
    bankAccountData?.city &&
    bankAccountData?.state &&
    bankAccountData?.upiId
  );

  const value: BankAccountContextType = {
    bankAccountData,
    updateBankAccountData,
    clearBankAccountData,
    isComplete,
  };

  return (
    <BankAccountContext.Provider value={value}>
      {children}
    </BankAccountContext.Provider>
  );
}

export function useBankAccount() {
  const context = useContext(BankAccountContext);
  if (context === undefined) {
    throw new Error('useBankAccount must be used within a BankAccountProvider');
  }
  return context;
}
