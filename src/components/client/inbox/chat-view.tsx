'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Paperclip, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  sender: 'user' | 'other';
  status: 'sent' | 'delivered' | 'read';
}

interface ChatViewProps {
  chatId: string;
  recipientName: string;
  recipientAvatar: string;
  recipientJobTitle: string;
  online: boolean;
  onBack?: () => void;
}

const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: '1',
      content: 'Hi, I saw your profile and I think you\'d be perfect for our project.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      sender: 'other',
      status: 'read'
    },
    {
      id: '2',
      content: 'Thanks! I\'d love to hear more about it.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      sender: 'user',
      status: 'read'
    },
    {
      id: '3',
      content: 'Can you start the project next week?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      sender: 'other',
      status: 'delivered'
    }
  ]
};

export function ChatView({ 
  chatId, 
  recipientName, 
  recipientAvatar, 
  recipientJobTitle, 
  online,
  onBack 
}: ChatViewProps) {
  const [newMessage, setNewMessage] = useState('');
  const messages = mockMessages[chatId] || [];

  const handleSend = () => {
    if (!newMessage.trim()) return;
    // In a real app, this would send the message to the backend
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-[100vh] fixed inset-0">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-white sticky top-0 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="h-12 w-12 md:hidden"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div className="relative">
          <Avatar>
            <AvatarImage src={recipientAvatar} alt={recipientName} />
            <AvatarFallback>{recipientName.charAt(0)}</AvatarFallback>
          </Avatar>
          {online && (
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white" />
          )}
        </div>
        <div>
          <h3 className="font-semibold">{recipientName}</h3>
          <p className="text-sm text-gray-500">{recipientJobTitle}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-900 shadow-sm'
              }`}
            >
              <p>{message.content}</p>
              <div
                className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}
              >
                {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                {message.sender === 'user' && (
                  <span className="ml-2">
                    {message.status === 'sent' && '✓'}
                    {message.status === 'delivered' && '✓✓'}
                    {message.status === 'read' && '✓✓'}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t bg-white sticky bottom-0 z-10">
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="shrink-0">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button onClick={handleSend} className="shrink-0" disabled={!newMessage.trim()}>
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
} 