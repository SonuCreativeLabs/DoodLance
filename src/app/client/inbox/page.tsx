"use client"

import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChevronDown, Check, MessageSquare } from 'lucide-react';
import { useChatView } from '@/contexts/ChatViewContext';



// Dynamically import client-side components with SSR disabled
const ChatList = dynamic(
  () => import('@/components/client/inbox/chat-list').then(mod => ({
    default: mod.ChatList
  })),
  {
    ssr: false,
    loading: () => <div className="p-4 text-gray-400">Loading chats...</div>
  }
);

const ChatView = dynamic(
  () => import('@/components/client/inbox/chat-view').then(mod => ({
    default: mod.ChatView
  })),
  {
    ssr: false,
    loading: () => <div className="p-4 text-gray-400">Loading chat...</div>
  }
);

// Define message type
type Message = {
  id: string;
  content: string;
  timestamp: Date;
  sender: 'user' | 'other';
  status: 'sent' | 'delivered' | 'read';
};

// Empty chats for now - replace with API fetch when backend ready
const professionalChats: any[] = [];
// Mock messages map needed for ChatView prop types if strictly typed, but here it's any[] likely
const mockMessages: Record<string, Message[]> = {};

// Status options for chats
const statuses: Array<'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled'> = [
  'Upcoming', 'Ongoing', 'Completed', 'Cancelled'
];

function InboxPage() {
  // Client-side state
  const [isClient, setIsClient] = useState(false);

  // Chat state
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Refs and context
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const { setFullChatView } = useChatView();
  const statusOptions = ['All', 'Upcoming', 'Ongoing', 'Completed', 'Cancelled'];

  // Set client-side flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get URL search params
  const searchParams = useSearchParams();
  const chatParam = searchParams.get('chat');

  // Auto-select chat based on URL parameter
  useEffect(() => {
    if (chatParam && isClient) {
      // Find chat by freelancer/provider name
      const matchingChat = professionalChats.find(
        chat => chat.recipientName.toLowerCase() === chatParam.toLowerCase()
      );
      if (matchingChat) {
        setSelectedChatId(matchingChat.id);
        setFullChatView(true);
      }
    }
  }, [chatParam, isClient, setFullChatView]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterButtonRef.current && !filterButtonRef.current.contains(event.target as Node)) {
        setShowFilterDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle chat selection
  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    setFullChatView(true);
  };

  // Show loading state on server
  if (!isClient) {
    return (
      <div className="flex h-full w-full max-w-full overflow-x-hidden bg-[#111111] text-white items-center justify-center">
        <div className="animate-pulse">Loading messages...</div>
      </div>
    );
  }



  // Toggle filter dropdown
  const toggleFilter = () => setShowFilterDropdown(!showFilterDropdown);

  // Handle status filter change
  const handleStatusFilter = (status: string) => {
    setStatusFilter(status === 'All' ? undefined : status);
    setShowFilterDropdown(false);
  };

  const selectedChat = professionalChats.find(chat => chat.id === selectedChatId) || null;

  // Filter chats based on search query and status
  const filteredChats = professionalChats.filter(chat => {
    const matchesSearch = !searchQuery.trim() ||
      chat.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.recipientJobTitle.toLowerCase().includes(searchQuery.toLowerCase());

    // If status filter is active, only show chats that match the status
    const matchesStatus = !statusFilter || statusFilter === 'All' || chat.status === statusFilter;

    return matchesSearch && matchesStatus;
  });


  return (
    <div className="flex h-full w-full max-w-full overflow-hidden bg-[#111111] text-white">
      {/* Chat List Panel */}
      <div className={`w-full md:w-96 flex flex-col overflow-hidden ${selectedChatId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-white/5 sticky top-0 z-10 bg-gradient-to-b from-[#111111] to-[#0a0a0a] backdrop-blur-xl">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div className="relative">
                <MessageSquare className="w-5 h-5 text-purple-400" />
                <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></div>
              </div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">Messages</h1>
            </div>
            <div className="relative" ref={filterRef}>
              <button
                ref={filterButtonRef}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 text-xs border border-white/5 hover:border-white/10 backdrop-blur-sm group"
                onClick={toggleFilter}
              >
                <Filter className="w-3.5 h-3.5 text-white/60 group-hover:text-white/80 transition-colors" />
                <span className="text-white/80 group-hover:text-white transition-colors">{statusFilter || 'Filter'}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-white/60 group-hover:text-white/80 transition-all duration-300 ${showFilterDropdown ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showFilterDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 mt-2 w-44 bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] backdrop-blur-xl rounded-xl shadow-2xl z-50 overflow-hidden border border-white/10 ring-1 ring-white/5"
                  >
                    <div className="p-1">
                      {statusOptions.map((status) => (
                        <button
                          key={status}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-white/5 rounded-lg flex items-center justify-between transition-all duration-200 group"
                          onClick={() => handleStatusFilter(status)}
                        >
                          <span className={`font-medium ${statusFilter === status ? 'text-purple-400' : 'text-white/80 group-hover:text-white'}`}>
                            {status}
                          </span>
                          {statusFilter === status && (
                            <Check className="w-3.5 h-3.5 text-purple-400" />
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-3 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60 backdrop-blur-none z-20" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-9 pr-8 py-2 bg-white/5 border border-white/10 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/30 placeholder:text-white/40 text-white/90 transition-all duration-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats && (
            <ChatList
              chats={filteredChats}
              selectedChatId={selectedChatId || undefined}
              onSelectChat={handleSelectChat}
            />
          )}
        </div>
      </div>

      {/* Chat View - Only show when a chat is selected */}
      <div className="flex-1 flex flex-col bg-[#1a1a1a] border-l border-white/10">
        {selectedChat && (
          <ChatView
            chatId={selectedChat.id}
            recipientName={selectedChat.recipientName}
            recipientAvatar={selectedChat.recipientAvatar}
            recipientJobTitle={selectedChat.recipientJobTitle}
            online={selectedChat.online}
            onBack={() => setSelectedChatId(null)}
            messages={mockMessages[selectedChat.id] || []}
          />
        )}
      </div>
    </div>
  );
}

export default InboxPage;