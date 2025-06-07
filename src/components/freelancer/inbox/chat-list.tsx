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
    <div className="divide-y divide-white/5">
      {chats.map((chat, index) => (
        <motion.div
          key={chat.id}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.2,
            delay: 0.02 * index,
            ease: 'easeOut'
          }}
          className="w-full"
        >
          <motion.button
            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
            whileTap={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
            onClick={() => onChatSelect(chat.id)}
            className={`w-full px-4 py-3 text-left transition-colors duration-200 ${
              selectedChatId === chat.id ? 'bg-white/5' : ''
            }`}
          >
            <div className="flex items-center gap-3 w-full">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
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
                    className="hidden absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 items-center justify-center text-white font-medium text-sm"
                    style={{ display: 'none' }}
                  >
                    {chat.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                </div>
                {chat.online && (
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-[#111111]" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className={`text-sm font-medium truncate ${
                    chat.unread ? 'text-white' : 'text-white/90'
                  }`}>
                    {chat.name}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-white/40">
                      {chat.time}
                    </span>
                    {chat.unread && (
                      <span className="h-2 w-2 rounded-full bg-purple-500 flex-shrink-0" />
                    )}
                  </div>
                </div>
                
                <div className="mt-0.5">
                  <p className={`text-xs font-medium truncate ${
                    chat.unread ? 'text-white/80' : 'text-white/60'
                  }`}>
                    {chat.jobTitle}
                  </p>
                  <p className={`text-xs truncate ${
                    chat.unread ? 'text-white/70' : 'text-white/40'
                  }`}>
                    {chat.lastMessage}
                  </p>
                </div>
                
                <div className="flex items-center gap-1.5 mt-1">
                  {chat.status && (
                    <span className={`text-[10px] px-2 py-0.5 rounded ${
                      chat.status === 'Completed' ? 'bg-green-500/10 text-green-400' :
                      chat.status === 'Ongoing' ? 'bg-blue-500/10 text-blue-400' :
                      chat.status === 'Upcoming' ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-gray-500/10 text-gray-400'
                    }`}>
                      {chat.status}
                    </span>
                  )}
                  {chat.budget && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-400">
                      {chat.budget}
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