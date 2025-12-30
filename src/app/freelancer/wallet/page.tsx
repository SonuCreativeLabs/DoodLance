'use client';

import React, { useState, useEffect } from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft, Clock, Calendar, ChevronRight, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

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

export default function WalletPage() {
  const { user } = useAuth();
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Fetch wallet data
  const fetchWallet = async () => {
    if (!user?.id) return;
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

  const handleWithdraw = async () => {
    if (!user?.id || !walletData || walletData.balance <= 0) return;

    setIsWithdrawing(true);
    try {
      const response = await fetch('/api/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          action: 'withdraw',
          amount: Math.min(walletData.balance, 5000), // Cap withdrawal for demo/safety
          description: 'Withdrawal to Bank Account'
        })
      });

      if (response.ok) {
        await fetchWallet(); // Refresh data
        alert('Withdrawal request submitted successfully');
      } else {
        const error = await response.json();
        alert(`Withdrawal failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      alert('Withdrawal failed');
    } finally {
      setIsWithdrawing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#111111]">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  const transactions = walletData?.transactions || [];
  const currentBalance = walletData?.balance || 0;

  return (
    <div className="min-h-screen bg-[#111111] text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#111111]/80 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Wallet & Earnings</h1>
        <div className="w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center">
          <Wallet className="w-4 h-4 text-purple-400" />
        </div>
      </div>

      <div className="p-4 space-y-6 max-w-2xl mx-auto">
        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-900/50 via-[#1a1a1a] to-[#1a1a1a] rounded-2xl p-6 border border-white/10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full -mr-16 -mt-16"></div>

          <div className="relative z-10">
            <p className="text-gray-400 text-sm mb-1">Total Balance</p>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-2xl font-bold text-white">₹</span>
              <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                {currentBalance.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleWithdraw}
                disabled={isWithdrawing || currentBalance <= 0}
                className={`flex items-center justify-center gap-2 bg-white text-black font-semibold py-2.5 rounded-xl hover:bg-gray-100 transition-colors ${isWithdrawing || currentBalance <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isWithdrawing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowUpRight className="w-4 h-4" />
                )}
                Withdraw
              </button>
              <button className="flex items-center justify-center gap-2 bg-white/10 text-white font-semibold py-2.5 rounded-xl hover:bg-white/20 transition-colors">
                <TrendingUp className="w-4 h-4" />
                Analytics
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#111] p-4 rounded-xl border border-white/5">
            <p className="text-gray-400 text-xs mb-1">Pending Clearance</p>
            <p className="text-lg font-semibold">₹{walletData?.frozenAmount?.toLocaleString('en-IN') || 0}</p>
          </div>
          <div className="bg-[#111] p-4 rounded-xl border border-white/5">
            <p className="text-gray-400 text-xs mb-1">Available Coins</p>
            <p className="text-lg font-semibold text-yellow-500 flex items-center gap-1">
              {walletData?.coins?.toLocaleString() || 0}
              <span className="text-[10px] bg-yellow-500/20 px-1 py-0.5 rounded text-yellow-500">GOLD</span>
            </p>
          </div>
        </div>

        {/* Transactions Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Transactions</h2>
            <button className="text-sm text-purple-400 font-medium">See All</button>
          </div>

          <div className="space-y-3">
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <div key={tx.id} className="bg-[#111] p-4 rounded-xl border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'CREDIT' || tx.type === 'EARNING'
                        ? 'bg-green-500/10 text-green-500'
                        : 'bg-red-500/10 text-red-500'
                      }`}>
                      {tx.type === 'CREDIT' || tx.type === 'EARNING' ? (
                        <ArrowDownLeft className="w-5 h-5" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-white">{tx.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(tx.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <span className={`font-semibold ${tx.type === 'CREDIT' || tx.type === 'EARNING'
                      ? 'text-green-500'
                      : 'text-white'
                    }`}>
                    {tx.type === 'CREDIT' || tx.type === 'EARNING' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No transactions yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
