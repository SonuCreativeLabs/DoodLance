'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

interface Chat {
  id: string;
  recipientName: string;
  recipientAvatar: string;
  recipientJobTitle: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  online: boolean;
}

interface ChatListProps {
  chats: Chat[];
  selectedChatId?: string;
  onSelectChat: (chatId: string) => void;
}

export function ChatList({ chats, selectedChatId, onSelectChat }: ChatListProps) {
  return (
    <div className="space-y-2">
      {chats.map((chat) => (
        <div
          key={chat.id}
          onClick={() => onSelectChat(chat.id)}
          className={`mx-4 p-4 flex items-start gap-4 hover:bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer transition-colors ${
            selectedChatId === chat.id ? 'bg-gray-50' : 'bg-white'
          }`}
        >
          <div className="relative">
            <Avatar className="h-12 w-12">
              <AvatarImage src={chat.recipientAvatar} alt={chat.recipientName} />
              <AvatarFallback>{chat.recipientName.charAt(0)}</AvatarFallback>
            </Avatar>
            {chat.online && (
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-[#4A5568]">{chat.recipientName}</h3>
                <p className="text-sm text-[#718096]">{chat.recipientJobTitle}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#718096]">
                  {formatDistanceToNow(chat.timestamp, { addSuffix: false })} ago
                </span>
                {chat.unreadCount > 0 && (
                  <div className="h-6 w-6 rounded-full bg-[#4299E1] text-white text-sm flex items-center justify-center">
                    {chat.unreadCount}
                  </div>
                )}
              </div>
            </div>
            <p className="text-sm text-[#718096] truncate mt-1">{chat.lastMessage}</p>
          </div>
        </div>
      ))}
    </div>
  );
}