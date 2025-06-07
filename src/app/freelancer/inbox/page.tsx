"use client"

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatList } from '@/components/freelancer/inbox/chat-list';
import { ChatView } from '@/components/freelancer/inbox/chat-view';
import { ArrowLeft, Search, Plus, Filter, ChevronDown, Check } from 'lucide-react';
import { useChatView } from '@/contexts/ChatViewContext';
import { mockUpcomingJobs } from '@/components/freelancer/jobs/mock-data';
import { mockChats } from './mockChats';

// Function to generate consistent avatar URL based on name and gender
const getAvatarUrl = (name: string, gender: 'men' | 'women' | 'male' | 'female' = 'men') => {
  const nameHash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const id = nameHash % 100; // Ensure we get a number between 0-99
  return `https://randomuser.me/api/portraits/${gender}/${id}.jpg`;
};

// Convert job data to chat format with enhanced avatars and statuses
const jobChats = mockUpcomingJobs.map((job, index) => {
  const description = job.description || 'No description available';
  const payment = job.payment || 0;
  const name = job.client?.name || `Client ${index + 1}`;
  const gender = index % 2 === 0 ? 'men' : 'women';
  
  // Randomly assign some chats as unread
  const unread = Math.random() > 0.5;
  
  // Add some variation to the statuses
  let status = job.status;
  if (status === 'confirmed' && Math.random() > 0.7) {
    status = 'upcoming'; // Convert some confirmed to upcoming for variety
  }
  
  return {
    id: `job-${job.id}`,
    name,
    avatar: getAvatarUrl(name, gender),
    jobTitle: job.title,
    online: index % 3 === 0, // Make some users online
    lastMessage: description.substring(0, 60) + (description.length > 60 ? '...' : ''),
    time: new Date(job.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + 
          (job.time ? ' • ' + job.time : ''),
    budget: `₹${payment.toLocaleString()}`,
    status: status === 'confirmed' ? 'Ongoing' : 
             status === 'completed' ? 'Completed' :
             status === 'cancelled' ? 'Cancelled' : 'Upcoming',
    unread,
    rating: (job.client?.rating || 4.0) + (Math.random() * 0.5) // Add some rating variation
  };
});

// Update mockChats with consistent avatars and statuses
const enhancedMockChats = mockChats.map((chat, index) => ({
  ...chat,
  avatar: getAvatarUrl(chat.name, index % 2 === 0 ? 'men' : 'women'),
  // Ensure we have a good mix of statuses
  status: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'][index % 4],
  unread: index % 3 === 0 // Make some chats unread
}));

// Combine and deduplicate chats by ID
const allChats = [
  ...enhancedMockChats,
  ...jobChats.filter(jobChat => 
    !enhancedMockChats.some(chat => chat.jobTitle === jobChat.jobTitle)
  )
];

function InboxPageInner() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const { setFullChatView } = useChatView();
  
  const statusOptions = ['All', 'Upcoming', 'Ongoing', 'Completed', 'Cancelled'];
  
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
  
  // Calculate unread messages count for filtered chats - ensure it's consistent between server and client
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

  // Calculate total unread messages count for all chats
  const totalUnreadCount = mockChats.filter(chat => chat.unread).length;
  
  // Calculate heights for all fixed elements
  const mainHeaderHeight = 64;    // Main header height
  const messagesHeaderHeight = unreadCount > 0 ? 132 : 116; // Adjust height based on unread count
  const bottomNavHeight = 64;     // Bottom navigation height
  const additionalSpacing = 16;    // Extra space for better visibility
  const totalOffset = mainHeaderHeight + messagesHeaderHeight + bottomNavHeight + additionalSpacing;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#111111]">
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
            />
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Fixed Messages Header - positioned below main header */}
            <div 
              className="fixed left-0 right-0 z-10 bg-[#111111]"
              style={{ top: `${mainHeaderHeight}px`, height: `${messagesHeaderHeight}px` }}
            >
              <div className="h-full flex flex-col justify-center px-4">
                <div className="flex flex-col mb-2">
                  <div className="flex items-start justify-between">
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
            
            {/* Scrollable Chat List with exact spacing */}
            <div 
              className="overflow-y-auto px-4 pb-4"
              style={{
                height: `calc(100vh - ${totalOffset}px)`,
                marginTop: `${messagesHeaderHeight}px`,
                marginBottom: `${bottomNavHeight}px`,
                scrollbarWidth: 'none', // Hide scrollbar for firefox
                msOverflowStyle: 'none', // Hide scrollbar for IE/Edge
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