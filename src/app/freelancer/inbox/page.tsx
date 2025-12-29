"use client"

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChatList } from '@/components/freelancer/inbox/chat-list';
import { ChatView } from '@/components/freelancer/inbox/chat-view';
import { Search, Filter, ChevronDown, Check } from 'lucide-react';
import { useChatView } from '@/contexts/ChatViewContext';
import { useSearchParams } from 'next/navigation';

// Mock data removed
const allChats: any[] = [];

function InboxPageInner() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const { setFullChatView } = useChatView();
  const searchParams = useSearchParams();

  const statusOptions = ['All', 'Upcoming', 'Ongoing', 'Completed', 'Cancelled'];

  // Auto-select job chat if jobId parameter is present
  useEffect(() => {
    const jobId = searchParams.get('jobId');
    if (jobId) {
      const jobChatId = `job-${jobId}`;
      setSelectedChatId(jobChatId);
    }
  }, [searchParams]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedChat = allChats.find(chat => chat.id === selectedChatId) || null;

  // Filter chats based on search query and status
  const filteredChats = allChats.filter(chat => {
    const matchesSearch = !searchQuery.trim() ||
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = !statusFilter || statusFilter === 'All' || chat.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate unread messages count for filtered chats
  const [unreadCount, setUnreadCount] = useState(0);

  // Update unread count in an effect to avoid hydration mismatch
  useEffect(() => {
    setUnreadCount(filteredChats.filter(chat => chat.unread).length);
  }, [filteredChats]);

  useEffect(() => {
    setFullChatView(!!selectedChat);
    return () => setFullChatView(false);
  }, [selectedChat, setFullChatView]);

  const handleBackClick = () => {
    setSelectedChatId(null);
  };

  const totalUnreadCount = 0;

  // Calculate heights for all fixed elements
  const mainHeaderHeight = 64;    // Main header height
  const messagesHeaderHeight = unreadCount > 0 ? 132 : 116; // Adjust height based on unread count
  const bottomNavHeight = 64;     // Bottom navigation height
  const additionalSpacing = 16;    // Extra space for better visibility

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#111111]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 flex flex-col h-full overflow-hidden"
      >
        {selectedChat ? (
          <div className="flex-1 flex flex-col h-full">
            <ChatView
              chatId={selectedChat.id}
              recipientName={selectedChat.name}
              recipientAvatar={selectedChat.avatar}
              recipientJobTitle={selectedChat.jobTitle}
              online={selectedChat.online}
              onBack={handleBackClick}
              className="h-full"
            />
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Fixed Messages Header - positioned below main header */}
            <div
              className="sticky top-0 left-0 right-0 z-10 bg-[#111111] pt-2"
              style={{ height: `${messagesHeaderHeight}px` }}
            >
              <div className="h-full flex flex-col justify-center px-4">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h1 className="text-xl font-bold text-white">Messages</h1>
                      {unreadCount > 0 && (
                        <div className="text-sm text-purple-400 mt-0.5">
                          {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                    <div className="relative mt-1.5" ref={filterRef}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsFilterOpen(!isFilterOpen);
                        }}
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
                      >
                        <Filter className="w-4 h-4 text-white/60" />
                        <span className="text-sm font-medium text-white/80">{statusFilter || 'All'}</span>
                        <ChevronDown className={`w-4 h-4 text-white/60 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isFilterOpen && (
                        <div className="absolute right-0 mt-1 w-40 bg-[#1E1E1E] border border-white/10 rounded-lg shadow-lg z-20 overflow-hidden">
                          {statusOptions.map((option) => (
                            <button
                              key={option}
                              onClick={(e) => {
                                e.stopPropagation();
                                setStatusFilter(option === 'All' ? null : option);
                                setIsFilterOpen(false);
                              }}
                              className={`w-full px-4 py-2.5 text-sm text-left flex items-center justify-between hover:bg-white/5 ${statusFilter === option || (!statusFilter && option === 'All') ? 'text-purple-400' : 'text-white/80'}`}
                            >
                              {option}
                              {(statusFilter === option || (!statusFilter && option === 'All')) && (
                                <Check className="w-4 h-4" />
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search messages or names"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white/90 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Chat List */}
            <div
              className="flex-1 overflow-y-auto pb-6"
              style={{
                height: `calc(100vh - ${mainHeaderHeight + messagesHeaderHeight + 16}px)`,
                marginTop: `-${messagesHeaderHeight}px`,
                paddingTop: `${messagesHeaderHeight}px`
              }}
            >
              {/* Hide scrollbar for Chrome/Safari */}
              <style jsx>{`
                .overflow-y-auto::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              <ChatList
                chats={filteredChats}
                onChatSelect={setSelectedChatId}
                selectedChatId={selectedChatId || undefined}
              />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function InboxPage() {
  return <InboxPageInner />;
}