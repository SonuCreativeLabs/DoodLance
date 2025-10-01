'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

export type ChatStatus = 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';

interface Chat {
  id: string;
  recipientName: string;
  recipientAvatar: string;
  recipientJobTitle: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  online: boolean;
  status: ChatStatus;
}

interface ChatListProps {
  chats: Chat[];
  selectedChatId?: string;
  onSelectChat: (chatId: string) => void;
}

export function ChatList({ chats, selectedChatId, onSelectChat }: ChatListProps) {
  return (
    <div className="space-y-3 py-4">
      {chats.map((chat) => (
        <div
          key={chat.id}
          onClick={() => onSelectChat(chat.id)}
          className={`group mx-3 p-3 flex items-start gap-3 rounded-xl border cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-lg ${selectedChatId === chat.id 
            ? 'bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/30 shadow-lg shadow-purple-500/10' 
            : 'bg-white/3 border-white/5 hover:border-purple-500/20 hover:bg-white/5'}`}
        >
          <div className="relative flex-shrink-0">
            <div className="relative">
              <Avatar className="h-10 w-10 ring-2 ring-purple-500/20 group-hover:ring-purple-500/40 transition-all duration-300">
                <AvatarImage src={chat.recipientAvatar} alt={chat.recipientName} />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 text-white font-semibold text-xs">
                  {chat.recipientName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {chat.online && (
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-[#111111] animate-pulse" />
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="flex justify-between items-start mb-1">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors truncate text-sm">
                    {chat.recipientName}
                  </h3>
                  <span 
                    className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 backdrop-blur-sm ${
                      chat.status === 'Upcoming' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      chat.status === 'Ongoing' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                      chat.status === 'Completed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {chat.status}
                  </span>
                </div>
                <p className="text-xs text-white/60 font-medium truncate mt-0.5">
                  {chat.recipientJobTitle}
                </p>
              </div>
              <div className="flex flex-col items-end gap-0.5 flex-shrink-0 ml-2">
                <span className="text-[10px] text-white/40 tabular-nums font-medium">
                  {formatDistanceToNow(chat.timestamp, { addSuffix: false })}
                </span>
                {chat.unreadCount > 0 && (
                  <div className="px-1.5 py-0.5 rounded-md bg-purple-500 text-white text-[10px] font-medium min-w-[16px] text-center">
                    {chat.unreadCount}
                  </div>
                )}
              </div>
            </div>
            <p className="text-xs text-white/70 leading-relaxed line-clamp-2 group-hover:text-white/90 transition-colors">
              {chat.lastMessage}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}