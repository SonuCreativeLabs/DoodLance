"use client"

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatList } from '@/components/freelancer/inbox/chat-list';
import { ChatView } from '@/components/freelancer/inbox/chat-view';
import { ArrowLeft, Search, Plus, Filter } from 'lucide-react';

const mockChats = [
  {
    id: '1',
    name: 'Raj Kumar',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=raj',
    jobTitle: 'Full Stack Developer',
    online: true,
    lastMessage: 'Hey, I have a question about the project...',
    time: '2m ago'
  },
  {
    id: '2',
    name: 'Priya Singh',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
    jobTitle: 'UI/UX Designer',
    online: false,
    lastMessage: 'The designs look great! I\'ll review them...',
    time: '1h ago'
  },
  {
    id: '3',
    name: 'Alex Thompson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    jobTitle: 'Backend Developer',
    online: true,
    lastMessage: 'I\'ve deployed the latest changes to staging',
    time: '3h ago'
  }
];

export default function InboxPage() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const selectedChat = mockChats.find(chat => chat.id === selectedChatId);

  const handleBackClick = () => {
    setSelectedChatId(null);
  };

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 relative"
    >
      <div className="flex flex-col flex-1">
        {selectedChat ? (
          <div className="flex-1 flex flex-col">
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
          <>
            {/* Header and Search always at top */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-xl font-semibold text-white mb-1">Messages</h1>
                  <p className="text-sm text-white/60">3 unread messages</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-lg transition-all duration-300 border border-white/5 hover:border-purple-500/30 group"
                >
                  <Plus className="w-4 h-4 text-white/80 group-hover:text-purple-400 transition-colors duration-300" />
                </motion.button>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input 
                    type="text"
                    placeholder="Search messages..."
                    className="w-full h-10 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/30 px-10 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  />
                  <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 hover:text-purple-400 cursor-pointer transition-colors duration-300" />
                </div>
              </div>
            </div>
            {/* Scrollable Chat List */}
            <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-2">
              <ChatList
                onChatSelect={setSelectedChatId}
                selectedChatId={selectedChatId || undefined}
                chats={mockChats}
              />
            </div>
          </>
        )}
      </div>
    </motion.main>
  );
} 