"use client"

import React, { useEffect, useState } from "react";
import { Wallet, Plus, ArrowDown, ArrowUp, CreditCard, Banknote, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavbar } from "@/contexts/NavbarContext";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

interface Transaction {
  id: string;
  type: "add" | "withdraw";
  amount: number;
  method: string;
  date: string;
  status: "Completed" | "Pending" | "Failed";
}

export default function WalletPage() {
  const { setNavbarVisibility } = useNavbar();
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [doodCoins, setDoodCoins] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setNavbarVisibility(false);
    return () => setNavbarVisibility(true);
  }, [setNavbarVisibility]);

  useEffect(() => {
    // Fetch wallet data from API
    const fetchWalletData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        // In production, fetch from your API
        // const response = await fetch(`/api/wallet?userId=${user.id}`);
        // const data = await response.json();

        // For now, set to empty state
        setBalance(0);
        setDoodCoins(0);
        setTransactions([]);
      } catch (error) {
        console.error('Failed to fetch wallet data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-[#111111]">
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
            {loading ? "Loading..." : `₹${balance.toLocaleString()}`}
          </div>
          <div className="text-white/60 text-sm mb-4">Total Balance (INR)</div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1 bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 text-white px-2 py-1.5 rounded-lg font-medium text-xs shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-purple-400/40">
              <Plus className="w-3 h-3" />
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
                {/* Tooltip arrow */}
                <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-t-4 border-b-4 border-transparent border-l-yellow-400/30"></div>
              </div>
            </div>
          </div>
          <div className="text-3xl font-extrabold text-yellow-100 mb-1">
            {loading ? "Loading..." : doodCoins.toLocaleString()}
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

          {/* Modern UPI/Wallet Payment Options */}
          <div className="mt-6">
            <div className="text-white/80 text-sm mb-2 font-medium">Other Payment Options</div>
            <div className="flex gap-3 flex-wrap">
              {/* UPI */}
              <button className="flex flex-col items-center justify-center bg-[#18181b] border border-white/10 rounded-xl px-4 py-3 hover:border-purple-400 transition-all shadow-sm min-w-[80px]">
                <span className="text-2xl">🔗</span>
                <span className="text-xs text-white/80 mt-2">UPI</span>
              </button>
              {/* GPay */}
              <button className="flex flex-col items-center justify-center bg-[#18181b] border border-white/10 rounded-xl px-4 py-3 hover:border-purple-400 transition-all shadow-sm min-w-[80px]">
                {/* Inline SVG for GPay */}
                <span className="w-7 h-7 flex items-center justify-center">
                  <svg viewBox="0 0 48 48" width="28" height="28"><g><path fill="#4285F4" d="M23.52 14.17c2.82 0 4.72.12 7.03.37l.57.05v-5.2c-2.3-.23-4.74-.39-7.6-.39-6.15 0-11.43 2.23-15.17 5.9l4.37 4.37c2.56-2.39 6.25-5.1 10.8-5.1z" /><path fill="#34A853" d="M41.03 24.5c0-1.55-.14-2.7-.46-3.87H23.52v6.99h10.07c-.21 1.18-1.33 3.34-3.85 4.7l5.94 4.61c3.46-3.17 5.35-7.84 5.35-12.43z" /><path fill="#FBBC05" d="M23.52 41.03c4.85 0 8.9-1.6 11.86-4.36l-5.94-4.61c-1.6 1.08-3.77 1.84-5.92 1.84-4.7 0-8.67-3.17-10.1-7.47l-6.04 4.66c3.69 5.36 9.62 9.94 16.14 9.94z" /><path fill="#EA4335" d="M13.42 27.43c-.41-1.17-.65-2.43-.65-3.77s.24-2.6.65-3.77l-6.04-4.66C5.81 18.65 4.98 21.02 4.98 23.66c0 2.64.83 5.01 2.4 7.16l6.04-4.66z" /></g></svg>
                </span>
                <span className="text-xs text-white/80 mt-2">GPay</span>
              </button>
              {/* CRED */}
              <button className="flex flex-col items-center justify-center bg-[#18181b] border border-white/10 rounded-xl px-4 py-3 hover:border-purple-400 transition-all shadow-sm min-w-[80px]">
                {/* Inline SVG for CRED */}
                <span className="w-7 h-7 flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 60 60" fill="none"><rect x="8" y="8" width="44" height="44" rx="10" fill="#fff" /><path d="M30 18l10 6v12l-10 6-10-6V24l10-6zm0 3.464L22 24v9.072l8 4.464 8-4.464V24l-8-4.536z" fill="#18181b" /></svg>
                </span>
                <span className="text-xs text-white/80 mt-2">CRED</span>
              </button>
              {/* PhonePe */}
              <button className="flex flex-col items-center justify-center bg-[#18181b] border border-white/10 rounded-xl px-4 py-3 hover:border-purple-400 transition-all shadow-sm min-w-[80px]">
                {/* Inline SVG for PhonePe */}
                <span className="w-7 h-7 flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="22" fill="#673ab7" /><text x="50%" y="54%" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="bold" dy=".3em">पे</text></svg>
                </span>
                <span className="text-xs text-white/80 mt-2">PhonePe</span>
              </button>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-4">
            <ArrowUp className="w-4 h-4 text-purple-400" />
            <span className="text-base font-semibold text-white">Transaction History</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="pb-2 text-xs font-medium text-white/50 uppercase tracking-wider">Amount</th>
                  <th className="pb-2 text-xs font-medium text-white/50 uppercase tracking-wider">Method</th>
                  <th className="pb-2 text-xs font-medium text-white/50 uppercase tracking-wider">Date</th>
                  <th className="pb-2 text-xs font-medium text-white/50 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-white/50 text-sm">
                      Loading transactions...
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-white/50 text-sm">
                      No transactions yet
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx: Transaction) => (
                    <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-2.5">
                        <span className={cn(
                          "font-medium text-xs",
                          tx.type === "add" ? "text-emerald-400" : "text-red-400"
                        )}>
                          {tx.type === "add" ? "+" : "-"}{tx.amount}
                        </span>
                      </td>
                      <td className="py-2.5 text-white/60 text-xs">{tx.method}</td>
                      <td className="py-2.5 text-white/60 text-xs">{tx.date}</td>
                      <td className="py-2.5">
                        <span className={cn(
                          "inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium",
                          tx.status === "Completed" ? "bg-emerald-500/20 text-emerald-400" : "bg-yellow-500/20 text-yellow-400"
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

        {/* Back to dashboard link */}
        {/* (Removed because back button is now in header) */}
      </div>
    </div>
  );
}
