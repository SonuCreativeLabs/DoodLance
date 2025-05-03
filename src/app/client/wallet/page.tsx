import React from "react";
import { Wallet, Plus, ArrowDown, ArrowUp, CreditCard, Banknote } from "lucide-react";
import Link from "next/link";

const mockTransactions = [
  { id: 1, type: "add", amount: 500, method: "Credit Card", date: "2025-05-01", status: "Completed" },
  { id: 2, type: "withdraw", amount: 200, method: "Bank Transfer", date: "2025-04-28", status: "Completed" },
  { id: 3, type: "add", amount: 1000, method: "Credit Card", date: "2025-04-20", status: "Pending" },
];

export default function WalletPage() {
  return (
    <div className="min-h-screen bg-[#111111]">
      {/* Fixed Wallet Header */}
      <div className="fixed top-0 left-0 w-full z-30 bg-gradient-to-br from-[#6B46C1] via-[#4C1D95] to-[#2D1B69] border-b border-white/10">
        <div className="container mx-auto px-4 flex items-center justify-between pt-4 pb-3">
          <Link href="/client" aria-label="Back to Dashboard">
            <button className="flex items-center justify-center text-white/80 hover:text-white/100 p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400/40" aria-label="Back">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
            </button>
          </Link>
          <span className="text-xl md:text-2xl font-bold text-white">Wallet</span>
          <div className="w-20" /> {/* Spacer for symmetry */}
        </div>
      </div>
      {/* Main Wallet Content */}
      <div className="pt-[72px] pb-12 px-4 max-w-2xl mx-auto">

        {/* Wallet Card */}
        <div className="bg-[#18181b] rounded-2xl shadow-lg p-8 flex flex-col items-center border border-white/10 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <Wallet className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold text-white">My Wallet</span>
          </div>
          <div className="text-4xl font-extrabold text-white mb-1">₹1,300</div>
          <div className="text-white/70 mb-6">Total Balance (INR)</div>
          <div className="flex gap-3">
  <button className="flex items-center gap-1 bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 text-white px-3 py-1.5 rounded-full font-medium text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-purple-400/40">
    <Plus className="w-4 h-4" />
    Add Funds
  </button>
  <button className="flex items-center gap-1 bg-white text-purple-600 hover:bg-purple-50 px-3 py-1.5 rounded-full font-medium text-sm shadow-sm border border-purple-100 transition-all focus:outline-none focus:ring-2 focus:ring-purple-400/20">
    <ArrowDown className="w-4 h-4" />
    Withdraw
  </button>
</div>
        </div>

        {/* Skill Coins Card */}
        <div className="bg-[#18181b] rounded-2xl shadow-lg p-8 flex flex-col items-center border border-yellow-400/30 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-200 text-[#18181b] font-bold text-2xl shadow">
              ★
            </span>
            <span className="text-2xl font-bold text-yellow-200">Skill Coins</span>
          </div>
          <div className="text-3xl font-extrabold text-yellow-100 mb-1">2,500</div>
          <div className="text-yellow-100/80 mb-2">Total Skill Coins</div>
          <div className="text-center text-yellow-100/60 text-sm max-w-xs">
            Earn Skill Coins by completing bookings, referring friends, and participating in reward programs. Coins can be redeemed for discounts and special offers.
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-[#18181b] rounded-xl p-6 mb-8 border border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-purple-400" />
            <span className="text-lg font-semibold text-white">Payment Methods</span>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-white/70" />
              <span className="text-white/80">Visa •••• 4242</span>
              <span className="ml-auto text-xs text-white/50">Primary</span>
            </div>
            <div className="flex items-center gap-3">
              <Banknote className="w-6 h-6 text-white/70" />
              <span className="text-white/80">Bank Account •••• 7890</span>
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
                  <svg viewBox="0 0 48 48" width="28" height="28"><g><path fill="#4285F4" d="M23.52 14.17c2.82 0 4.72.12 7.03.37l.57.05v-5.2c-2.3-.23-4.74-.39-7.6-.39-6.15 0-11.43 2.23-15.17 5.9l4.37 4.37c2.56-2.39 6.25-5.1 10.8-5.1z"/><path fill="#34A853" d="M41.03 24.5c0-1.55-.14-2.7-.46-3.87H23.52v6.99h10.07c-.21 1.18-1.33 3.34-3.85 4.7l5.94 4.61c3.46-3.17 5.35-7.84 5.35-12.43z"/><path fill="#FBBC05" d="M23.52 41.03c4.85 0 8.9-1.6 11.86-4.36l-5.94-4.61c-1.6 1.08-3.77 1.84-5.92 1.84-4.7 0-8.67-3.17-10.1-7.47l-6.04 4.66c3.69 5.36 9.62 9.94 16.14 9.94z"/><path fill="#EA4335" d="M13.42 27.43c-.41-1.17-.65-2.43-.65-3.77s.24-2.6.65-3.77l-6.04-4.66C5.81 18.65 4.98 21.02 4.98 23.66c0 2.64.83 5.01 2.4 7.16l6.04-4.66z"/></g></svg>
                </span>
                <span className="text-xs text-white/80 mt-2">GPay</span>
              </button>
              {/* CRED */}
              <button className="flex flex-col items-center justify-center bg-[#18181b] border border-white/10 rounded-xl px-4 py-3 hover:border-purple-400 transition-all shadow-sm min-w-[80px]">
                {/* Inline SVG for CRED */}
                <span className="w-7 h-7 flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 60 60" fill="none"><rect x="8" y="8" width="44" height="44" rx="10" fill="#fff"/><path d="M30 18l10 6v12l-10 6-10-6V24l10-6zm0 3.464L22 24v9.072l8 4.464 8-4.464V24l-8-4.536z" fill="#18181b"/></svg>
                </span>
                <span className="text-xs text-white/80 mt-2">CRED</span>
              </button>
              {/* PhonePe */}
              <button className="flex flex-col items-center justify-center bg-[#18181b] border border-white/10 rounded-xl px-4 py-3 hover:border-purple-400 transition-all shadow-sm min-w-[80px]">
                {/* Inline SVG for PhonePe */}
                <span className="w-7 h-7 flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="22" fill="#673ab7"/><text x="50%" y="54%" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="bold" dy=".3em">पे</text></svg>
                </span>
                <span className="text-xs text-white/80 mt-2">PhonePe</span>
              </button>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-[#18181b] rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <ArrowUp className="w-5 h-5 text-purple-400" />
            <span className="text-lg font-semibold text-white">Transaction History</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-white/90">
              <thead>
                <tr>
                  <th className="py-2 px-3 font-semibold text-white/80">Date</th>
                  <th className="py-2 px-3 font-semibold text-white/80">Type</th>
                  <th className="py-2 px-3 font-semibold text-white/80">Amount</th>
                  <th className="py-2 px-3 font-semibold text-white/80">Method</th>
                  <th className="py-2 px-3 font-semibold text-white/80">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockTransactions.map((tx) => (
                  <tr key={tx.id} className="border-t border-white/10">
                    <td className="py-2 px-3">{tx.date}</td>
                    <td className="py-2 px-3">
                      {tx.type === "add" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                          <Plus className="w-4 h-4" /> Add
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-400 font-medium">
                          <ArrowDown className="w-4 h-4" /> Withdraw
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 font-bold">₹{tx.amount}</td>
                    <td className="py-2 px-3">{tx.method}</td>
                    <td className="py-2 px-3">
                      {tx.status === "Completed" ? (
                        <span className="text-emerald-400">{tx.status}</span>
                      ) : (
                        <span className="text-yellow-400">{tx.status}</span>
                      )}
                    </td>
                  </tr>
                ))}
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
