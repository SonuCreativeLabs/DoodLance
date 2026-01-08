'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Search, RefreshCw, MessageSquare, User, Clock, Check, CheckCheck,
    MoreVertical, Filter, Trash2, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';

interface ChatModalProps {
    conversationId: string | null;
    open: boolean;
    onClose: () => void;
}

function ChatModal({ conversationId, open, onClose }: ChatModalProps) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (conversationId && open) {
            fetchConversation();
        }
    }, [conversationId, open]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [data]);

    const fetchConversation = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/messages/${conversationId}`);
            if (res.ok) {
                setData(await res.json());
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl h-[80vh] bg-[#1a1a1a] border-gray-800 flex flex-col p-0">
                <DialogHeader className="p-6 border-b border-gray-800">
                    <DialogTitle className="text-white flex items-center justify-between">
                        <span>Conversation Details</span>
                        {data && (
                            <span className="text-sm font-normal text-gray-400">ID: {data.id}</span>
                        )}
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                        {data ? (
                            <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="border-blue-500 text-blue-400">
                                    Client: {data.client?.name}
                                </Badge>
                                <span className="text-gray-600">to</span>
                                <Badge variant="outline" className="border-purple-500 text-purple-400">
                                    Freelancer: {data.freelancer?.name}
                                </Badge>
                            </div>
                        ) : 'Loading...'}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-black/20" ref={scrollRef}>
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                                    <Skeleton className="h-16 w-64 rounded-xl bg-gray-800" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        data?.messages.map((msg: any) => {
                            const isClient = msg.senderId === data.clientId;
                            return (
                                <div key={msg.id} className={`flex ${isClient ? 'justify-start' : 'justify-end'}`}>
                                    <div className={`max-w-[70%] rounded-xl p-3 ${isClient ? 'bg-[#2a2a2a] text-gray-200' : 'bg-purple-600/20 text-purple-100 border border-purple-600/50'
                                        }`}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold opacity-70">
                                                {isClient ? data.client?.name : data.freelancer?.name}
                                            </span>
                                            <span className="text-[10px] opacity-50">
                                                {new Date(msg.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-sm">{msg.content}</p>
                                    </div>
                                </div>
                            )
                        })
                    )}
                    {!loading && data?.messages.length === 0 && (
                        <p className="text-center text-gray-400">No messages found.</p>
                    )}
                </div>

                <div className="p-4 border-t border-gray-800 bg-[#2a2a2a]">
                    <p className="text-xs text-center text-gray-500">
                        Read-only View. To moderate, use action buttons above.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default function MessagesPage() {
    const [conversations, setConversations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const [chatOpen, setChatOpen] = useState(false);
    const itemsPerPage = 10;

    // Debounce
    const [debouncedSearch, setDebouncedSearch] = useState('');
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const fetchConversations = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: itemsPerPage.toString(),
                search: debouncedSearch
            });
            const res = await fetch(`/api/admin/messages?${params}`);
            if (res.ok) {
                const data = await res.json();
                setConversations(data.conversations);
                setTotalPages(data.totalPages);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, [currentPage, debouncedSearch]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Message Moderation</h1>
                    <p className="text-gray-400 mt-1 text-sm sm:text-base">Monitor and user conversations</p>
                </div>
                <Button variant="outline" onClick={fetchConversations} className="text-gray-300">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                </Button>
            </div>

            <Card className="bg-[#1a1a1a] border-gray-800 p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search conversations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-[#2a2a2a] border-gray-700 text-white"
                    />
                </div>
            </Card>

            <Card className="bg-[#1a1a1a] border-gray-800">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b border-gray-800">
                            <tr className="text-left">
                                <th className="p-4 text-sm font-medium text-gray-400">Participants</th>
                                <th className="p-4 text-sm font-medium text-gray-400">Last Message</th>
                                <th className="p-4 text-sm font-medium text-gray-400">Updated</th>
                                <th className="p-4 text-sm font-medium text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={4} className="p-8 text-center text-gray-400">Loading...</td></tr>
                            ) : conversations.map((conv) => (
                                <tr key={conv.id} className="border-b border-gray-800 hover:bg-[#2a2a2a]">
                                    <td className="p-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-blue-400 border-blue-500/30 text-xs">Cl</Badge>
                                                <span className="text-white text-sm">{conv.clientName}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-purple-400 border-purple-500/30 text-xs">Fr</Badge>
                                                <span className="text-white text-sm">{conv.freelancerName}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <p className="text-sm text-gray-300 line-clamp-1 max-w-md">{conv.lastMessage || 'No messages'}</p>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center text-gray-400 text-sm">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {new Date(conv.updatedAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setSelectedConversationId(conv.id);
                                                setChatOpen(true);
                                            }}
                                        >
                                            <MessageSquare className="w-4 h-4 mr-2" />
                                            View Chat
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {!loading && conversations.length === 0 && (
                                <tr><td colSpan={4} className="p-8 text-center text-gray-400">No conversations found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <ChatModal
                conversationId={selectedConversationId}
                open={chatOpen}
                onClose={() => {
                    setChatOpen(false);
                    setSelectedConversationId(null);
                }}
            />
        </div>
    );
}
