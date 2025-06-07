'use client';

import { motion } from 'framer-motion';

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  online: boolean;
  jobTitle: string;
  budget?: string;
  status?: string;
  unread?: boolean;
  rating?: number;
}

interface ChatListProps {
  onChatSelect: (chatId: string) => void;
  selectedChatId?: string;
  chats: Chat[];
}

export function ChatList({ onChatSelect, selectedChatId, chats: propChats = [] }: ChatListProps) {
  // Debug: Log the chats data
  console.log('ChatList rendering with chats:', propChats);
  
  // Add test chat if no chats are provided
  const chats = propChats.length > 0 ? propChats : [{
    id: 'test-1',
    name: 'Test User',
    avatar: 'https://i.pravatar.cc/150?img=1',
    lastMessage: 'This is a test message',
    time: 'Just now',
    online: true,
    jobTitle: 'Test Job',
    budget: '₹1,000',
    status: 'New',
    unread: true,
    rating: 5
  }];

  if (!chats || chats.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-white/60 mb-2">No messages yet</div>
          <div className="text-sm text-white/40">Your conversations will appear here</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Debug: Show if no chats */}
      {/* {!chats || chats.length === 0 ? (
        <div className="p-4 text-center text-white/60">
          No chats available
        </div>
      ) : null} */}
      {chats.map((chat, index) => (
        <motion.div
          key={chat.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.3,
            delay: 0.05 * index,
            ease: [0.16, 1, 0.3, 1]
          }}
          className="w-full"
        >
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onChatSelect(chat.id)}
            className={`w-full p-4 text-left rounded-xl transition-all duration-300 group border ${
              selectedChatId === chat.id 
                ? 'bg-gradient-to-r from-purple-600/20 to-purple-400/20 border-purple-500/30' 
                : 'border-white/10 hover:border-white/20 hover:bg-white/5'
            }`}
          >
            <div className="flex items-start gap-3 w-full">
              {/* Avatar with Fallback */}
              <div className="relative flex-shrink-0 mt-1">
                <div className="h-12 w-12 rounded-xl overflow-hidden ring-2 ring-purple-500/30 group-hover:ring-purple-500/50 transition-all duration-300 bg-gray-700 flex items-center justify-center">
                  <img 
                    src={chat.avatar} 
                    alt={chat.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div 
                    className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-lg"
                    style={{ display: 'none' }}
                  >
                    {chat.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                {chat.online && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-gradient-to-r from-green-500 to-green-400 ring-2 ring-[#111111] shadow-lg" />
                )}
              </div>

              {/* Content - Simplified Layout */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 pr-3">
                    {/* Name Row */}
                    <div className="flex items-center gap-2">
                      <h3 className={`font-semibold text-sm truncate ${selectedChatId === chat.id ? 'text-purple-400' : 'text-white group-hover:text-purple-400'} transition-colors duration-300`}>
                        {chat.name}
                      </h3>
                      {chat.unread && (
                        <span className="h-2 w-2 rounded-full bg-purple-500 flex-shrink-0"></span>
                      )}
                    </div>
                    
                    {/* Job Title and Message - Aligned */}
                    <div className="mt-1 space-y-0.5">
                      <div className="text-[13px] text-white/90 font-medium truncate pl-0">
                        {chat.jobTitle}
                      </div>
                      <div className="text-[13px] text-white/60 truncate pl-0">
                        {chat.lastMessage}
                      </div>
                    </div>
                  </div>
                  
                  {/* Time - aligned with name */}
                  <span className="text-xs text-white/50 whitespace-nowrap">
                    {chat.time}
                  </span>
                </div>

                {/* Budget and Status */}
                <div className="flex items-center justify-between w-full mt-2">
                  {chat.budget && (
                    <span className="text-xs font-semibold text-purple-400">
                      {chat.budget}
                    </span>
                  )}
                  {chat.status && (
                    <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                      chat.status === 'Completed' ? 'bg-green-900/30 text-green-400' :
                      chat.status === 'Ongoing' ? 'bg-blue-900/30 text-blue-400' :
                      chat.status === 'Upcoming' ? 'bg-purple-900/30 text-purple-400' :
                      chat.status === 'Cancelled' ? 'bg-red-900/30 text-red-400' :
                      'bg-yellow-900/30 text-yellow-400'
                    }`}>
                      {chat.status}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.button>
        </motion.div>
      ))}
    </div>
  );
} 