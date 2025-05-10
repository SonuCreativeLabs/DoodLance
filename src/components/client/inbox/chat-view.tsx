'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Paperclip, Send, Phone } from 'lucide-react';
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
  messages?: Message[];
}

// mockMessages removed; messages are now passed as a prop


export function ChatView({ 
  chatId, 
  recipientName, 
  recipientAvatar, 
  recipientJobTitle, 
  online,
  onBack,
  messages = [],
}: ChatViewProps) {
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (!newMessage.trim()) return;
    // In a real app, this would send the message to the backend
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-[100vh] fixed inset-0 bg-[#111111]">
      {/* Chat Header */}
      <div className="flex items-center gap-4 p-4 border-b border-white/5 bg-[#23232b] sticky top-0 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="h-10 w-10 p-0 rounded-xl md:hidden hover:bg-white/5"
        >
          <ArrowLeft className="h-5 w-5 text-white/70" />
        </Button>
        <div className="relative">
          <Avatar className="h-10 w-10 ring-2 ring-purple-500/20">
            <AvatarImage src={recipientAvatar} alt={recipientName} />
            <AvatarFallback>{recipientName.charAt(0)}</AvatarFallback>
          </Avatar>
          {online && (
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-[#23232b]" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-white">{recipientName}</h3>
          <p className="text-sm text-white/40">{recipientJobTitle}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10 rounded-full hover:bg-purple-900/30 ml-2"
          aria-label="Call"
        >
          <Phone className="h-6 w-6 text-purple-400" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#111111]">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-end gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender !== 'user' && (
              <Avatar className="h-6 w-6 ring-2 ring-purple-500/20">
                <AvatarImage src={recipientAvatar} alt={recipientName} />
                <AvatarFallback>{recipientName.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
            <div
              className={`max-w-[70%] rounded-xl p-3 ${message.sender === 'user'
                ? 'bg-purple-500/90 text-white'
                : 'bg-[#23232b] text-white/90 ring-1 ring-white/5'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <time className="text-[10px] tabular-nums opacity-40">
                  {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                </time>
                {message.sender === 'user' && (
                  <span className="text-[10px] opacity-40">
                    {message.status === 'sent' && '✓'}
                    {message.status === 'delivered' && '✓✓'}
                    {message.status === 'read' && (
                      <span className="text-purple-300">✓✓</span>
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-white/5 bg-[#23232b] sticky bottom-0 z-10">
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-10 w-10 p-0 rounded-xl shrink-0 hover:bg-white/5"
          >
            <Paperclip className="h-5 w-5 text-white/70" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-white/5 border-0 text-white/90 placeholder:text-white/40 rounded-xl focus-visible:ring-1 focus-visible:ring-purple-500/50"
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="flex items-center justify-center h-10 w-10 rounded-xl disabled:bg-white/5 enabled:bg-purple-500/90 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors group"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-6 h-6 text-white/70 group-hover:text-purple-400 transition-colors"
            >
              <path
                d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 