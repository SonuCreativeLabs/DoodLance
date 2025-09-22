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
    <div className="flex flex-col h-[100vh] fixed inset-0 bg-gradient-to-b from-[#111111] to-[#0a0a0a]">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-3 border-b border-white/5 bg-gradient-to-b from-[#1a1a1a] to-[#111111] backdrop-blur-xl sticky top-0 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="h-10 w-10 rounded-xl hover:bg-purple-500/10 transition-all duration-200"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5 text-white/70" />
        </Button>

        <div className="flex items-center gap-2 flex-1">
          <div className="relative">
            <Avatar className="h-9 w-9 ring-2 ring-purple-500/30">
              <AvatarImage src={recipientAvatar} alt={recipientName} />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 text-white font-semibold text-xs">
                {recipientName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {online && (
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-[#1a1a1a] animate-pulse" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="font-semibold text-white truncate text-sm">{recipientName}</h2>
              {online && (
                <span className="text-[10px] text-green-400 font-medium flex items-center gap-1">
                  <span className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></span>
                  Online
                </span>
              )}
            </div>
            <p className="text-xs text-white/60 truncate">{recipientJobTitle}</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10 rounded-xl hover:bg-purple-500/10 transition-all duration-200 group ml-1"
          aria-label="Call"
        >
          <Phone className="h-5 w-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gradient-to-b from-[#111111] to-[#0a0a0a]">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-end gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender !== 'user' && (
              <Avatar className="h-6 w-6 ring-2 ring-purple-500/30 transition-all duration-300">
                <AvatarImage src={recipientAvatar} alt={recipientName} />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 text-white font-semibold text-[10px]">
                  {recipientName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            )}
            <div
              className={`max-w-[80%] rounded-xl p-3 transition-all duration-300 transform hover:scale-[1.01] ${message.sender === 'user'
                ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/20'
                : 'bg-white/5 backdrop-blur-sm text-white/90 ring-1 ring-white/10 hover:bg-white/8'
              }`}
            >
              <p className="text-xs leading-relaxed font-medium">{message.content}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <time className="text-[9px] tabular-nums opacity-50 font-medium">
                  {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                </time>
                {message.sender === 'user' && (
                  <span className="text-[9px] opacity-60">
                    {message.status === 'sent' && (
                      <span className="text-white/60">✓</span>
                    )}
                    {message.status === 'delivered' && (
                      <span className="text-white/70">✓✓</span>
                    )}
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
      <div className="p-3 border-t border-white/5 bg-gradient-to-t from-[#1a1a1a] to-[#111111] backdrop-blur-xl sticky bottom-0 z-10">
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-10 w-10 p-0 rounded-xl shrink-0 hover:bg-white/10 transition-all duration-200 group"
          >
            <Paperclip className="h-5 w-5 text-white/80 group-hover:text-white transition-colors" />
          </Button>
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white/90 placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-purple-500/30 focus:border-purple-500/30 px-3 py-2 transition-all duration-300"
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            {newMessage && (
              <button 
                onClick={() => setNewMessage('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="flex items-center justify-center h-10 w-10 rounded-xl disabled:bg-white/5 enabled:bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 group shadow-lg shadow-purple-500/20"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-200"
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