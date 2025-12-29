"use client";
import { ArrowLeft, Download, Upload, TrendingUp, CheckCircle, Coins } from "lucide-react";
import Link from "next/link";

// Mock data for wallet/earnings
import { useState } from "react";

export default function WalletPage() {
  // Use state for real data (fetch from API in future)
  const [earningsSummary] = useState({
    balance: 0,
    pending: 0,
    withdrawn: 0,
    totalJobs: 0,
    lastPayout: "-",
  });

  const [skillCoins] = useState({
    available: 0,
    pending: 0,
  });

  const [transactions] = useState<any[]>([]);

  return (
    <div className="min-h-screen bg-[#111111]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#111111]/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/freelancer"
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-lg transition-all duration-200 focus:ring-2 focus:ring-purple-400/40 focus:outline-none group border border-white/10 hover:border-purple-500/30"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 text-white/80 group-hover:text-purple-400 transition-colors" />
            </Link>
            <h1 className="text-xl font-semibold text-white">Earnings Wallet</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gradient-to-br from-[#1E1E1E] to-[#1A1A1A] rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all duration-200">
            <div className="flex flex-col gap-2">
              <span className="text-xs text-white/60 uppercase">Available Balance</span>
              <span className="text-2xl font-bold text-white">₹{earningsSummary.balance.toLocaleString()}</span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#1E1E1E] to-[#1A1A1A] rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all duration-200">
            <div className="flex flex-col gap-2">
              <span className="text-xs text-white/60 uppercase">Pending Earnings</span>
              <span className="text-2xl font-bold text-yellow-300">₹{earningsSummary.pending.toLocaleString()}</span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#1E1E1E] to-[#1A1A1A] rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all duration-200">
            <div className="flex flex-col gap-2">
              <span className="text-xs text-white/60 uppercase">Total Withdrawn</span>
              <span className="text-2xl font-bold text-green-400">₹{earningsSummary.withdrawn.toLocaleString()}</span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#1E1E1E] to-[#1A1A1A] rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all duration-200">
            <div className="flex flex-col gap-2">
              <span className="text-xs text-white/60 uppercase">Jobs Completed</span>
              <span className="text-2xl font-bold text-white">{earningsSummary.totalJobs}</span>
            </div>
          </div>
        </div>

        {/* Dood Coins Card */}
        <div className="bg-gradient-to-br from-[#1E1E1E] to-[#1A1A1A] rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all duration-200 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Coins className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-semibold text-yellow-500">Dood Coins</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <span className="text-xs text-white/60 uppercase">Available</span>
              <span className="text-2xl font-bold text-yellow-500">{skillCoins.available}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs text-white/60 uppercase">Pending</span>
              <span className="text-2xl font-bold text-yellow-400">{skillCoins.pending}</span>
            </div>
          </div>
        </div>

        {/* Last Payout Info */}
        <div className="bg-gradient-to-br from-[#1E1E1E] to-[#1A1A1A] rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all duration-200 mb-8">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            <div>
              <span className="text-sm text-white/80">Last payout completed on </span>
              <span className="text-sm font-medium text-white">{earningsSummary.lastPayout}</span>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-gradient-to-br from-[#1E1E1E] to-[#1A1A1A] rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-200">
          <div className="p-5 border-b border-white/5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
              <button className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white text-sm font-medium transition-all duration-200">
                Export
              </button>
            </div>
          </div>
          <div className="divide-y divide-white/5">
            {transactions.map((tx) => (
              <div key={tx.id} className="p-5">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-0.5">
                    {tx.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <span className="text-[14px] font-semibold text-white leading-tight">{tx.label}</span>
                      <span className={`text-[14px] font-bold flex-shrink-0 ${tx.amount > 0 ? 'text-green-400' : 'text-amber-400'
                        }`}>
                        {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/50">{tx.date}</span>
                      <span className="px-2 py-0.5 rounded-full bg-white/5 text-xs text-white/70 border border-white/10">
                        {tx.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
