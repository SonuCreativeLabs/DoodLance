"use client";

import React, { useState } from "react";
import { Gift, Users, Copy, Check, Share2, Trophy, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavbar } from "@/contexts/NavbarContext";
import Link from "next/link";

const mockReferrals: any[] = [];

const referralStats = {
  totalReferrals: 8,
  successfulReferrals: 6,
  totalEarned: 3000,
  pendingRewards: 1000,
};

export default function ReferralsPage() {
  const { setNavbarVisibility } = useNavbar();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  React.useEffect(() => {
    setNavbarVisibility(false);
    return () => setNavbarVisibility(true);
  }, [setNavbarVisibility]);

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (e) {
      console.error('Failed to copy referral code', e);
    }
  };

  const handleShare = async () => {
    const referralCode = "DOODSONU2025";
    const shareUrl = `https://doodlance.com/join?ref=${referralCode}`;
    const shareText = `Join DoodLance and get cricket training from the best professionals! Use my referral code ${referralCode} for ₹500 off your first booking. ${shareUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join DoodLance',
          text: shareText,
          url: shareUrl,
        });
      } catch (e) {
        // User cancelled share
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(shareText);
      setCopiedCode("share");
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111]">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 w-full z-30 bg-gradient-to-br from-[#6B46C1] via-[#4C1D95] to-[#2D1B69] border-b border-white/10 shadow-md">
        <div className="container mx-auto px-4 h-16 flex items-center relative">
          <Link href="/client" aria-label="Back to Dashboard" className="relative z-10">
            <button className="flex items-center justify-center text-white/80 hover:text-white/100 p-2 -ml-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400/40" aria-label="Back">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
            </button>
          </Link>

          {/* Absolute centered title */}
          <div className="absolute left-0 right-0 flex justify-center pointer-events-none">
            <span className="text-lg font-bold text-white">My Referrals</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 pb-8 px-4 max-w-2xl mx-auto">
        {/* Referral Code Section */}
        <div className="bg-[#18181b] rounded-xl p-6 border border-white/10 shadow-lg mb-6">
          <div className="text-center mb-6">
            <h2 className="text-lg font-semibold text-white mb-2">Your Referral Code</h2>
            <p className="text-white/70 text-sm">Share this code and earn ₹500 for each successful referral</p>
          </div>

          <div className="bg-[#1a1a1a] rounded-lg p-4 border border-white/5 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs mb-1">Referral Code</p>
                <p className="text-white font-mono text-lg">DOODSONU2025</p>
              </div>
              <button
                onClick={() => handleCopyCode('DOODSONU2025')}
                className="flex items-center gap-2 px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-colors"
              >
                {copiedCode === 'DOODSONU2025' ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span className="text-xs">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="text-xs">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <button
            onClick={handleShare}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 text-white py-3 rounded-lg font-medium transition-all"
          >
            {copiedCode === "share" ? (
              <>
                <Check className="w-5 h-5" />
                Link Copied!
              </>
            ) : (
              <>
                <Share2 className="w-5 h-5" />
                Share Referral Link
              </>
            )}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-[#18181b] rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-purple-400" />
              <span className="text-white/70 text-sm">Total Referrals</span>
            </div>
            <p className="text-2xl font-bold text-white">{referralStats.totalReferrals}</p>
          </div>

          <div className="bg-[#18181b] rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-white/70 text-sm">Successful</span>
            </div>
            <p className="text-2xl font-bold text-white">{referralStats.successfulReferrals}</p>
          </div>

          <div className="bg-[#18181b] rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-white/70 text-sm">Total Earned</span>
            </div>
            <p className="text-2xl font-bold text-green-400">₹{referralStats.totalEarned}</p>
          </div>

          <div className="bg-[#18181b] rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <Gift className="w-5 h-5 text-blue-400" />
              <span className="text-white/70 text-sm">Pending</span>
            </div>
            <p className="text-2xl font-bold text-blue-400">₹{referralStats.pendingRewards}</p>
          </div>
        </div>

        {/* Referral History */}
        <div className="bg-[#18181b] rounded-xl p-6 border border-white/10 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Referral History</h3>

          <div className="space-y-3">
            {mockReferrals.map((referral) => (
              <div key={referral.id} className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-xl border border-white/5">
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{referral.name}</p>
                  <p className="text-white/60 text-sm truncate">{referral.email}</p>
                  <p className="text-white/50 text-xs">{referral.date}</p>
                </div>

                <div className="text-right ml-4">
                  <div className={cn(
                    "text-sm font-medium px-2 py-1 rounded-full",
                    referral.status === "completed"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  )}>
                    {referral.status === "completed" ? "Completed" : "Pending"}
                  </div>
                  {referral.reward > 0 && (
                    <p className="text-green-400 text-sm font-semibold mt-1">+₹{referral.reward}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
