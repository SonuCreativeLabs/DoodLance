'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { RefreshCw, Shield, FileText, User, Activity } from 'lucide-react';

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [resourceFilter, setResourceFilter] = useState('all');

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/audit?resource=${resourceFilter}&limit=100`);
            if (res.ok) {
                const data = await res.json();
                setLogs(data.logs || []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [resourceFilter]);

    const getActionColor = (action: string) => {
        switch (action) {
            case 'CREATE': return 'bg-green-500/20 text-green-400 border-green-500/50';
            case 'DELETE': return 'bg-red-500/20 text-red-400 border-red-500/50';
            case 'UPDATE': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">System Logs</h1>
                    <p className="text-gray-400 mt-1 text-sm sm:text-base">Audit trail of all admin actions</p>
                </div>
                <div className="flex items-center gap-2">
                    <Select value={resourceFilter} onValueChange={setResourceFilter}>
                        <SelectTrigger className="w-[180px] bg-[#2a2a2a] border-gray-700 text-white">
                            <SelectValue placeholder="Filter by Resource" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Resources</SelectItem>
                            <SelectItem value="USER">User</SelectItem>
                            <SelectItem value="SERVICE">Service</SelectItem>
                            <SelectItem value="JOB">Job</SelectItem>
                            <SelectItem value="BOOKING">Booking</SelectItem>
                            <SelectItem value="TRANSACTION">Transaction</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={fetchLogs} className="text-gray-300">
                        <RefreshCw className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <Card className="bg-[#1a1a1a] border-gray-800">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b border-gray-800">
                            <tr className="text-left">
                                <th className="p-4 text-sm font-medium text-gray-400">Time</th>
                                <th className="p-4 text-sm font-medium text-gray-400">Admin</th>
                                <th className="p-4 text-sm font-medium text-gray-400">Action</th>
                                <th className="p-4 text-sm font-medium text-gray-400">Resource</th>
                                <th className="p-4 text-sm font-medium text-gray-400">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className="p-8 text-center text-gray-400">Loading logs...</td></tr>
                            ) : logs.map((log) => (
                                <tr key={log.id} className="border-b border-gray-800 hover:bg-[#2a2a2a]">
                                    <td className="p-4 text-sm text-gray-400 whitespace-nowrap">
                                        {new Date(log.createdAt).toLocaleString()}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <User className="w-3 h-3 text-gray-500" />
                                            <span className="text-sm text-white">{log.adminEmail}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <Badge variant="outline" className={`${getActionColor(log.action)}`}>
                                            {log.action}
                                        </Badge>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-3 h-3 text-gray-500" />
                                            <span className="text-sm text-white">{log.resource}</span>
                                            <span className="text-xs text-gray-500">#{log.resourceId?.substring(0, 6)}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <pre className="text-xs text-gray-500 bg-black/20 p-2 rounded max-w-[300px] overflow-x-auto whitespace-pre-wrap">
                                            {log.details ? JSON.stringify(JSON.parse(log.details), null, 1) : '-'}
                                        </pre>
                                    </td>
                                </tr>
                            ))}
                            {!loading && logs.length === 0 && (
                                <tr><td colSpan={5} className="p-8 text-center text-gray-400">No logs found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
