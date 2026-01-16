'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';

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
  hydrateBankAccount: (data: BankAccountData | null) => void;
  isLoading: boolean;
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

export interface BankAccountProviderProps {
  children: ReactNode;
  skipInitialFetch?: boolean;
}

export function BankAccountProvider({ children, skipInitialFetch = false }: BankAccountProviderProps) {
  const [bankAccountData, setBankAccountData] = useState<BankAccountData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const hydrateBankAccount = useCallback((data: BankAccountData | null) => {
    setBankAccountData(data);
  }, []);

  // Initial load
  useEffect(() => {
    if (skipInitialFetch) {
      setIsLoading(false);
      return;
    }

    async function fetchBankAccount() {
      try {
        const response = await fetch('/api/freelancer/bank-account');
        if (response.ok) {
          const data = await response.json();
          // The API returns null if no account exists, or the account object
          setBankAccountData(data);
        }
      } catch (error) {
        console.error('Failed to fetch bank account:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBankAccount();
  }, [skipInitialFetch]);

  const updateBankAccountData = useCallback(async (data: BankAccountData) => {
    // 1. Optimistic update
    setBankAccountData(data);

    // 2. Persist to API
    try {
      const response = await fetch('/api/freelancer/bank-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save bank account');
      }

      const savedData = await response.json();
      // Update with server confirmed data
      setBankAccountData(savedData);

    } catch (error) {
      console.error('Error saving bank account:', error);
      // Optional: Revert on failure
    }
  }, []);

  const clearBankAccountData = useCallback(() => {
    setBankAccountData(null);
    // Note: API doesn't have a delete method yet, but we clear local state
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
    hydrateBankAccount,
    isLoading,
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
