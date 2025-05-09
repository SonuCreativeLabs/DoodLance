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
}

interface ChatListProps {
  onChatSelect: (chatId: string) => void;
  selectedChatId?: string;
  chats: Chat[];
}

export function ChatList({ onChatSelect, selectedChatId, chats }: ChatListProps) {
  return (
    <div className="space-y-2">
      {chats.map((chat, index) => (
        <motion.div
          key={chat.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index }}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChatSelect(chat.id)}
            className={`w-full p-4 rounded-xl transition-all duration-300 group ${selectedChatId === chat.id 
              ? 'bg-gradient-to-r from-purple-600/20 to-purple-400/20 border border-purple-500/30' 
              : 'hover:bg-white/5 border border-transparent hover:border-white/10'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="relative h-12 w-12 rounded-xl overflow-hidden ring-2 ring-purple-500/30 group-hover:ring-purple-500/50 transition-all duration-300">
                  <img 
                    src={chat.avatar} 
                    alt={chat.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                {chat.online && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-gradient-to-r from-green-500 to-green-400 ring-2 ring-[#111111] shadow-lg" />
                )}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between gap-2">
                  <h3 className={`font-medium text-sm truncate ${selectedChatId === chat.id ? 'text-purple-400' : 'text-white group-hover:text-purple-400'} transition-colors duration-300`}>
                    {chat.name}
                  </h3>
                  <span className="text-xs text-white/40 whitespace-nowrap">
                    {chat.time}
                  </span>
                </div>
                <p className="text-xs text-white/60 truncate">{chat.jobTitle}</p>
                <p className="text-xs text-white/40 truncate mt-1 line-clamp-1">{chat.lastMessage}</p>
              </div>
            </div>
          </motion.button>
        </motion.div>
      ))}
    </div>
  );
} 