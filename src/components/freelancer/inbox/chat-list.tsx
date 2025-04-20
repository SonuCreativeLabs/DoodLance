'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
  online: boolean;
  jobTitle: string;
}

const mockChats: Chat[] = [
  {
    id: '1',
    name: 'Raj Kumar',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=raj',
    lastMessage: 'Can you start the project next week?',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    unread: 2,
    online: true,
    jobTitle: 'Full Stack Developer'
  },
  {
    id: '2',
    name: 'Priya Singh',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
    lastMessage: 'The design looks great! Moving forward with...',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    unread: 0,
    online: false,
    jobTitle: 'UI/UX Designer'
  },
  {
    id: '3',
    name: 'Alex Thompson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    lastMessage: "Perfect, I will review the code and get back...",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    unread: 1,
    online: true,
    jobTitle: 'Backend Developer'
  }
];

interface ChatListProps {
  onChatSelect: (chatId: string) => void;
  selectedChatId?: string;
}

export function ChatList({ onChatSelect, selectedChatId }: ChatListProps) {
  return (
    <div className="space-y-2">
      {mockChats.map((chat) => (
        <Card
          key={chat.id}
          className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
            selectedChatId === chat.id ? 'bg-gray-50 border-blue-200' : ''
          }`}
          onClick={() => onChatSelect(chat.id)}
        >
          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0">
              <Avatar>
                <AvatarImage src={chat.avatar} alt={chat.name} />
                <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {chat.online && (
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold text-sm text-gray-900 truncate">{chat.name}</h3>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {formatDistanceToNow(chat.timestamp, { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-gray-600 truncate">{chat.jobTitle}</p>
              <p className="text-xs text-gray-500 truncate mt-0.5">{chat.lastMessage}</p>
            </div>
            {chat.unread > 0 && (
              <Badge variant="default" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-blue-500">
                <span className="text-xs">{chat.unread}</span>
              </Badge>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
} 