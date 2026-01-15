'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Download, Users, TrendingUp, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReferralParams {
    id: string;
    name: string;
    email: string;
    referralCode: string;
    referredBy: string;
    referralCount: number;
    totalEarningsCoins: number;
    joinedAt: string;
}

export default function AdminReferralsPage() {
    const [data, setData] = useState<ReferralParams[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/admin/referrals');
            if (res.ok) {
                const json = await res.json();
                setData(json);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredData = data.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.referralCode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        totalReferralsGenerated: data.filter(i => i.referralCode !== 'N/A').length,
        totalReferralEvents: data.reduce((acc, curr) => acc + curr.referralCount, 0),
        totalCoinsDistributed: data.reduce((acc, curr) => acc + curr.totalEarningsCoins, 0)
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Referral Management</h1>
                    <p className="text-gray-400">Track referral codes and performance</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="border-gray-700 text-gray-300">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-[#1a1a1a] border-gray-800">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 rounded-xl">
                                <Users className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Active Codes</p>
                                <h3 className="text-2xl font-bold text-white">{stats.totalReferralsGenerated}</h3>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#1a1a1a] border-gray-800">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-500/10 rounded-xl">
                                <TrendingUp className="w-6 h-6 text-purple-500" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Total Referrals</p>
                                <h3 className="text-2xl font-bold text-white">{stats.totalReferralEvents}</h3>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#1a1a1a] border-gray-800">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-yellow-500/10 rounded-xl">
                                <Gift className="w-6 h-6 text-yellow-500" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Coins Distributed</p>
                                <h3 className="text-2xl font-bold text-white">{stats.totalCoinsDistributed}</h3>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Table */}
            <Card className="bg-[#1a1a1a] border-gray-800">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-white">Referral Users</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <Input
                                placeholder="Search users..."
                                className="pl-9 bg-[#2a2a2a] border-gray-700 text-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-800 text-left">
                                    <th className="py-3 px-4 text-sm font-medium text-gray-400">User</th>
                                    <th className="py-3 px-4 text-sm font-medium text-gray-400">Referral Code</th>
                                    <th className="py-3 px-4 text-sm font-medium text-gray-400">Referred By</th>
                                    <th className="py-3 px-4 text-sm font-medium text-gray-400">Referrals Made</th>
                                    <th className="py-3 px-4 text-sm font-medium text-gray-400">Total Earned</th>
                                    <th className="py-3 px-4 text-sm font-medium text-gray-400">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {loading ? (
                                    <tr><td colSpan={6} className="text-center py-8 text-gray-500">Loading...</td></tr>
                                ) : filteredData.length === 0 ? (
                                    <tr><td colSpan={6} className="text-center py-8 text-gray-500">No data found</td></tr>
                                ) : (
                                    filteredData.map((item) => (
                                        <tr key={item.id} className="border-b border-gray-800/50 hover:bg-white/5">
                                            <td className="py-3 px-4">
                                                <div className="flex flex-col">
                                                    <span className="text-white font-medium">{item.name}</span>
                                                    <span className="text-xs text-gray-500">{item.email}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-gray-300 font-mono">{item.referralCode}</td>
                                            <td className="py-3 px-4 text-gray-300 font-mono">{item.referredBy}</td>
                                            <td className="py-3 px-4 text-gray-300 font-medium">{item.referralCount}</td>
                                            <td className="py-3 px-4 text-yellow-400 font-medium">{item.totalEarningsCoins}</td>
                                            <td className="py-3 px-4 text-gray-500">{new Date(item.joinedAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
