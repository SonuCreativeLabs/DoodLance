'use client';

import React, { useState, useEffect } from 'react';
import { Wallet, Plus, ArrowUpRight, History, CreditCard, Loader2, ArrowDown, Info } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavbar } from '@/contexts/NavbarContext';
import Link from 'next/link';
import { cn } from "@/lib/utils";

type Transaction = {
  id: string;
  type: string;
  amount: number;
  description: string;
  createdAt: string;
  status: string;
};

type WalletData = {
  balance: number;
  frozenAmount: number;
  coins: number;
  transactions: Transaction[];
};

export default function ClientWalletPage() {
  const { user } = useAuth();
  const { setNavbarVisibility } = useNavbar();
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingFunds, setIsAddingFunds] = useState(false);

  useEffect(() => {
    setNavbarVisibility(false);
    return () => setNavbarVisibility(true);
  }, [setNavbarVisibility]);

  const fetchWallet = async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch(`/api/wallet?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setWalletData(data);
      }
    } catch (error) {
      console.error('Error fetching wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, [user?.id]);

  const handleAddFunds = async () => {
    if (!user?.id) return;
    setIsAddingFunds(true);
    try {
      // Mocking payment gateway delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const response = await fetch('/api/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          action: 'add',
          amount: 5000,
          description: 'Added funds via Payment Gateway'
        })
      });

      if (response.ok) {
        await fetchWallet();
        alert('Funds added successfully!');
      } else {
        alert('Failed to add funds');
      }
    } catch (error) {
      console.error('Error adding funds:', error);
    } finally {
      setIsAddingFunds(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#111111]">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  const currentBalance = walletData?.balance || 0;
  const transactions = walletData?.transactions || [];
  const doodCoins = walletData?.coins || 0;

  return (
    <div className="min-h-screen bg-[#111111] pb-24 text-white">
      {/* Fixed Wallet Header */}
      <div className="fixed top-0 left-0 w-full z-30 bg-gradient-to-br from-[#6B46C1] via-[#4C1D95] to-[#2D1B69] border-b border-white/10 shadow-md">
        <div className="container mx-auto px-4 h-16 flex items-center relative">
          <Link href="/client" aria-label="Back to Dashboard" className="relative z-10">
            <button className="flex items-center justify-center text-white/80 hover:text-white/100 p-2 -ml-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400/40" aria-label="Back">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
          </Link>

          {/* Absolute centered title */}
          <div className="absolute left-0 right-0 flex justify-center pointer-events-none">
            <span className="text-lg font-bold text-white">Wallet</span>
          </div>
        </div>
      </div>

      {/* Main Wallet Content */}
      <div className="pt-24 pb-12 px-4 max-w-2xl mx-auto">

        {/* Wallet Card */}
        <div className="bg-[#18181b] rounded-xl p-6 flex flex-col items-center border border-white/10 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Wallet className="w-6 h-6 text-purple-400" />
            <span className="text-lg font-bold text-white">My Wallet</span>
          </div>
          <div className="text-2xl font-extrabold text-white mb-1">
            ₹{currentBalance.toLocaleString('en-IN')}
          </div>
          <div className="text-white/60 text-sm mb-4">Total Balance (INR)</div>
          <div className="flex gap-2">
            <button
              onClick={handleAddFunds}
              disabled={isAddingFunds}
              className="flex items-center gap-1 bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 text-white px-2 py-1.5 rounded-lg font-medium text-xs shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-purple-400/40"
            >
              {isAddingFunds ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Plus className="w-3 h-3" />
              )}
              Add Funds
            </button>
            <button className="flex items-center gap-1 bg-white text-purple-600 hover:bg-purple-50 px-2 py-1.5 rounded-lg font-medium text-xs shadow-sm border border-purple-100 transition-all focus:outline-none focus:ring-2 focus:ring-purple-400/20">
              <ArrowDown className="w-3 h-3" />
              Withdraw
            </button>
          </div>
        </div>

        {/* Dood Coins Card */}
        <div className="bg-[#18181b] rounded-2xl shadow-lg p-8 flex flex-col items-center border border-yellow-400/30 mb-8 relative">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-200 text-[#18181b] font-bold text-lg shadow">
              ★
            </span>
            <span className="text-lg font-bold text-white">Dood Coins</span>
            <div className="relative group">
              <Info className="w-4 h-4 text-yellow-400/70 hover:text-yellow-300 cursor-help transition-colors" />
              {/* Tooltip */}
              <div className="absolute top-1/2 right-full mr-3 transform -translate-y-1/2 w-64 p-3 bg-black/90 text-yellow-100 text-sm rounded-lg border border-yellow-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-xl">
                Earn Dood Coins by completing bookings, referring friends, and participating in reward programs. Coins can be redeemed for discounts and special offers.
                <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-t-4 border-b-4 border-transparent border-l-yellow-400/30"></div>
              </div>
            </div>
          </div>
          <div className="text-3xl font-extrabold text-yellow-100 mb-1">
            {doodCoins.toLocaleString()}
          </div>
          <div className="text-yellow-100/80 mb-2">Total Dood Coins</div>
        </div>

        {/* Payment Methods */}
        <div className="bg-[#18181b] rounded-xl p-6 mb-8 border border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-purple-400" />
            <span className="text-lg font-semibold text-white">Payment Methods</span>
          </div>
          <div className="flex flex-col gap-3">
            <div className="text-center py-4 text-white/50 text-sm">
              No saved payment methods
            </div>
            <button className="flex items-center gap-2 text-purple-400 hover:text-purple-300 mt-2">
              <Plus className="w-4 h-4" /> Add Payment Method
            </button>
          </div>
        </div>

        {/* Transaction History */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-4">
            <ArrowUpRight className="w-4 h-4 text-purple-400" />
            <span className="text-base font-semibold text-white">Transaction History</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="pb-2 text-xs font-medium text-white/50 uppercase tracking-wider">Amount</th>
                  <th className="pb-2 text-xs font-medium text-white/50 uppercase tracking-wider">Type</th>
                  <th className="pb-2 text-xs font-medium text-white/50 uppercase tracking-wider">Date</th>
                  <th className="pb-2 text-xs font-medium text-white/50 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-white/50 text-sm">
                      No transactions yet
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-2.5">
                        <span className={cn(
                          "font-medium text-xs",
                          tx.type === "CREDIT" || tx.type === "EARNING" ? "text-emerald-400" : "text-red-400"
                        )}>
                          {tx.type === "CREDIT" || tx.type === "EARNING" ? "+" : "-"}{tx.amount}
                        </span>
                      </td>
                      <td className="py-2.5 text-white/60 text-xs">{tx.description}</td>
                      <td className="py-2.5 text-white/60 text-xs">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-2.5">
                        <span className={cn(
                          "inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium",
                          tx.status === "COMPLETED" ? "bg-emerald-500/20 text-emerald-400" : "bg-yellow-500/20 text-yellow-400"
                        )}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
