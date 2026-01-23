'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, Edit2, Save, X } from 'lucide-react';

interface Campaign {
    id: string;
    referralCode: string;
    name: string | null;
    locationType: string;
    contactEmail: string | null;
    contactPhone: string | null;
    link: string;
    stats: {
        totalReferrals: number;
        successfulReferrals: number;
        totalEarnings: number;
    };
}

export default function CampaignsPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);

    // Bulk generation
    const [quantity, setQuantity] = useState(10);
    const [locationType, setLocationType] = useState('academy');

    // Editing
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({ name: '', email: '', phone: '' });

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            const res = await fetch('/api/admin/campaigns');
            if (res.ok) {
                const data = await res.json();
                setCampaigns(data.campaigns);
            }
        } catch (error) {
            console.error('Failed to fetch campaigns:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBulkCreate = async () => {
        if (quantity < 1 || quantity > 100) {
            alert('Quantity must be between 1 and 100');
            return;
        }

        setCreating(true);
        try {
            const res = await fetch('/api/admin/campaigns/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ locationType, quantity })
            });

            if (res.ok) {
                const data = await res.json();
                alert(`✅ Created ${data.created} campaigns!`);
                fetchCampaigns();
                setQuantity(10);
            } else {
                const error = await res.json();
                alert(`Failed: ${error.error}`);
            }
        } catch (error) {
            alert('Failed to create campaigns');
        } finally {
            setCreating(false);
        }
    };

    const startEdit = (campaign: Campaign) => {
        setEditingId(campaign.id);
        setEditForm({
            name: campaign.name || '',
            email: campaign.contactEmail || '',
            phone: campaign.contactPhone || ''
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({ name: '', email: '', phone: '' });
    };

    const saveEdit = async (campaignId: string) => {
        try {
            const res = await fetch(`/api/admin/campaigns/${campaignId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: editForm.name,
                    contactEmail: editForm.email,
                    contactPhone: editForm.phone
                })
            });

            if (res.ok) {
                fetchCampaigns();
                cancelEdit();
            } else {
                alert('Failed to update campaign');
            }
        } catch (error) {
            alert('Failed to update campaign');
        }
    };

    const exportToCSV = () => {
        const headers = ['Code', 'Link', 'Name', 'Email', 'Phone', 'Type', 'Referrals', 'Successful', 'Earnings'];
        const rows = campaigns.map(c => [
            c.referralCode,
            c.link,
            c.name || '',
            c.contactEmail || '',
            c.contactPhone || '',
            c.locationType,
            c.stats.totalReferrals,
            c.stats.successfulReferrals,
            `₹${c.stats.totalEarnings}`
        ]);

        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `campaigns_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">QR Campaigns</h1>
                    <p className="text-gray-400 text-sm">Generate and manage campaign codes</p>
                </div>
                <Button onClick={exportToCSV} variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Export CSV
                </Button>
            </div>

            {/* Bulk Create Card */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h2 className="text-lg font-semibold text-white mb-4">Bulk Generate</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-sm text-gray-400 mb-2 block">Quantity</label>
                        <Input
                            type="number"
                            min={1}
                            max={100}
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                            className="bg-white/5 border-white/20 text-white"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-400 mb-2 block">Location Type</label>
                        <select
                            value={locationType}
                            onChange={(e) => setLocationType(e.target.value)}
                            className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white"
                        >
                            <option value="academy">Academy</option>
                            <option value="shop">Shop</option>
                            <option value="ground">Ground</option>
                            <option value="nets">Nets</option>
                        </select>
                    </div>

                    <div className="flex items-end">
                        <Button
                            onClick={handleBulkCreate}
                            disabled={creating}
                            className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600"
                        >
                            {creating ? 'Creating...' : 'Create'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Campaigns Table */}
            <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-white/5">
                            <tr className="text-left text-sm text-gray-400">
                                <th className="px-4 py-3">Code</th>
                                <th className="px-4 py-3">Link</th>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Contact</th>
                                <th className="px-4 py-3">Type</th>
                                <th className="px-4 py-3">Referrals</th>
                                <th className="px-4 py-3">Successful</th>
                                <th className="px-4 py-3">Earnings</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={10} className="text-center py-8 text-gray-400">Loading...</td>
                                </tr>
                            ) : campaigns.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="text-center py-8 text-gray-400">No campaigns yet</td>
                                </tr>
                            ) : (
                                campaigns.map((campaign) => (
                                    <tr key={campaign.id} className="border-t border-white/5 hover:bg-white/5">
                                        <td className="px-4 py-3">
                                            <span className="font-mono text-purple-400 text-sm">{campaign.referralCode}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => navigator.clipboard.writeText(campaign.link)}
                                                className="text-xs text-blue-400 hover:text-blue-300 underline"
                                            >
                                                Copy
                                            </button>
                                        </td>

                                        {editingId === campaign.id ? (
                                            <>
                                                <td className="px-4 py-3">
                                                    <Input
                                                        value={editForm.name}
                                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                        className="bg-white/10 border-white/20 text-white text-sm"
                                                        placeholder="Name"
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Input
                                                        value={editForm.email}
                                                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                                        className="bg-white/10 border-white/20 text-white text-sm"
                                                        placeholder="Email"
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Input
                                                        value={editForm.phone}
                                                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                                        className="bg-white/10 border-white/20 text-white text-sm"
                                                        placeholder="Phone"
                                                    />
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="px-4 py-3 text-white text-sm">{campaign.name || '-'}</td>
                                                <td className="px-4 py-3 text-gray-300 text-sm">{campaign.contactEmail || '-'}</td>
                                                <td className="px-4 py-3 text-gray-300 text-sm">{campaign.contactPhone || '-'}</td>
                                            </>
                                        )}

                                        <td className="px-4 py-3">
                                            <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs capitalize">
                                                {campaign.locationType}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-white">{campaign.stats.totalReferrals}</td>
                                        <td className="px-4 py-3 text-green-400">{campaign.stats.successfulReferrals}</td>
                                        <td className="px-4 py-3 text-purple-400">₹{campaign.stats.totalEarnings.toLocaleString()}</td>
                                        <td className="px-4 py-3">
                                            {editingId === campaign.id ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => saveEdit(campaign.id)}
                                                        className="text-green-400 hover:text-green-300"
                                                    >
                                                        <Save className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="text-red-400 hover:text-red-300"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => startEdit(campaign)}
                                                    className="text-blue-400 hover:text-blue-300"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
