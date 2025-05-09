"use client";
import { Wallet, ArrowLeft, Download, Upload, TrendingUp, CheckCircle } from "lucide-react";
import Link from "next/link";

// Mock data for wallet/earnings
const earningsSummary = {
  balance: 24500,
  pending: 3500,
  withdrawn: 18000,
  totalJobs: 48,
  lastPayout: "2025-05-01",
};

const skillCoins = {
  available: 120,
  pending: 30,
};

const transactions = [
  {
    id: 1,
    type: "credit",
    label: "Job Payment: Plumbing",
    amount: 2000,
    date: "2025-05-03",
    status: "Completed",
    icon: <Download className="w-4 h-4 text-green-400" />,
  },
  {
    id: 2,
    type: "debit",
    label: "Withdrawal to Bank",
    amount: -5000,
    date: "2025-05-02",
    status: "Completed",
    icon: <Upload className="w-4 h-4 text-amber-400" />,
  },
  {
    id: 3,
    type: "credit",
    label: "Job Payment: Electrical",
    amount: 1500,
    date: "2025-05-01",
    status: "Completed",
    icon: <Download className="w-4 h-4 text-green-400" />,
  },
  {
    id: 4,
    type: "credit",
    label: "Bonus",
    amount: 500,
    date: "2025-04-29",
    status: "Completed",
    icon: <TrendingUp className="w-4 h-4 text-purple-400" />,
  },
];

export default function WalletPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex items-center gap-2 mb-8">
        <Link
          href="/freelancer"
          className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-purple-700/80 to-purple-400/70 shadow-md hover:from-purple-600 hover:to-purple-500 border border-purple-500/30 hover:border-purple-400/60 transition-all duration-200 focus:ring-2 focus:ring-purple-400/40 focus:outline-none group"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5 text-white group-hover:text-purple-100 transition-colors" />
        </Link>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Wallet className="w-6 h-6 text-purple-400" /> Earnings Wallet
        </h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-gradient-to-br from-purple-600/10 to-purple-400/10 p-6 rounded-2xl border border-purple-500/20 flex flex-col gap-2">
          <span className="text-xs text-white/60">Available Balance</span>
          <span className="text-3xl font-bold text-white">₹{earningsSummary.balance.toLocaleString()}</span>
        </div>
        <div className="bg-gradient-to-br from-purple-600/10 to-purple-400/10 p-6 rounded-2xl border border-purple-500/20 flex flex-col gap-2">
          <span className="text-xs text-white/60">Pending Earnings</span>
          <span className="text-xl font-semibold text-amber-400">₹{earningsSummary.pending.toLocaleString()}</span>
        </div>
        <div className="bg-gradient-to-br from-purple-600/10 to-purple-400/10 p-6 rounded-2xl border border-purple-500/20 flex flex-col gap-2">
          <span className="text-xs text-white/60">Withdrawn</span>
          <span className="text-xl font-semibold text-green-400">₹{earningsSummary.withdrawn.toLocaleString()}</span>
        </div>
        <div className="bg-gradient-to-br from-purple-600/10 to-purple-400/10 p-6 rounded-2xl border border-purple-500/20 flex flex-col gap-2">
          <span className="text-xs text-white/60">Jobs Completed</span>
          <span className="text-xl font-semibold text-white">{earningsSummary.totalJobs}</span>
        </div>
        {/* Skill Coins Card */}
        <div className="bg-gradient-to-br from-yellow-400/10 to-yellow-200/10 p-6 rounded-2xl border border-yellow-400/20 flex flex-col gap-2 col-span-1">
          <span className="text-xs text-yellow-400 font-semibold flex items-center gap-1">
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" /><text x="10" y="15" textAnchor="middle" fontSize="10" fill="#fff">S</text></svg>
            Skill Coins
          </span>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex flex-col">
              <span className="text-[11px] text-white/60">Available</span>
              <span className="text-lg font-bold text-yellow-400">{skillCoins.available}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-white/60">Pending</span>
              <span className="text-lg font-bold text-yellow-300">{skillCoins.pending}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Last Payout Info */}
      <div className="flex items-center gap-3 mb-8 p-4 rounded-xl bg-gradient-to-r from-purple-700/30 to-purple-400/10 border border-purple-500/20">
        <CheckCircle className="w-5 h-5 text-green-400" />
        <span className="text-sm text-white/80">Last payout: <span className="font-medium text-white">{earningsSummary.lastPayout}</span></span>
      </div>

      {/* Transactions Table */}
      <div className="bg-gradient-to-br from-purple-600/10 to-purple-400/10 rounded-2xl border border-purple-500/20 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
          <button className="px-3 py-1.5 rounded-lg bg-purple-600/80 hover:bg-purple-700 text-white text-xs font-medium transition-all">Export</button>
        </div>
        <div className="divide-y divide-purple-400/10">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center gap-4 py-3">
              <div>{tx.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white truncate">{tx.label}</span>
                  <span className={`text-sm font-bold ${tx.amount > 0 ? 'text-green-400' : 'text-amber-400'}`}>{tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/60 mt-1">
                  <span>{tx.date}</span>
                  <span className="px-2 py-0.5 rounded bg-white/10 text-white/70">{tx.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
