'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Paperclip, ArrowLeft, Phone, Video } from 'lucide-react';
import { format } from 'date-fns';

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
  className?: string;
  messages?: Message[]; // Messages should be passed as prop or fetched from API
}

export function ChatView({
  chatId,
  recipientName,
  recipientAvatar,
  recipientJobTitle,
  online,
  onBack,
  className = '',
  messages: propMessages
}: ChatViewProps) {
  const [newMessage, setNewMessage] = useState('');
  const [localMessages, setLocalMessages] = useState<Message[]>(propMessages || [{
    id: '1',
    content: `Hi there! This is the start of your conversation about the ${recipientJobTitle} position.`,
    timestamp: new Date(),
    sender: 'other' as const,
    status: 'read' as const
  }]);

  const messages = localMessages;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior,
        block: 'end',
        inline: 'nearest'
      });
    }, 0);
  };

  useEffect(() => {
    // Use 'auto' behavior for initial load
    scrollToBottom('auto');
  }, []);

  useEffect(() => {
    // Use smooth behavior for new messages
    if (messages.length > 0) {
      scrollToBottom('smooth');
    }
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    // In a real app, this would send the message to the backend
    const newMsg: Message = {
      id: Date.now().toString(),
      content: newMessage,
      timestamp: new Date(),
      sender: 'user',
      status: 'sent'
    };
    setLocalMessages([...localMessages, newMsg]);
    setNewMessage('');
    scrollToBottom();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex flex-col h-full bg-[#111111] overflow-hidden ${className}`}
    >
      {/* Fixed Header */}
      <div className="flex-shrink-0 flex items-center justify-between p-2 border-b border-white/10 bg-[#111111]/95 backdrop-blur-xl z-10">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-lg transition-all duration-300 border border-white/5 hover:border-purple-500/30 group"
          >
            <ArrowLeft className="h-5 w-5 text-white/80 group-hover:text-purple-400 transition-colors duration-300" />
          </motion.button>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="relative h-10 w-10 rounded-xl overflow-hidden ring-2 ring-purple-500/30 group-hover:ring-purple-500/50 transition-all duration-300">
                <img
                  src={recipientAvatar}
                  alt={recipientName}
                  className="w-full h-full object-cover"
                />
                {online && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#111111]"></div>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-medium text-white">{recipientName}</h3>
              <p className="text-xs text-white/60">{recipientJobTitle}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-white/5 transition-colors duration-200">
            <Phone className="h-5 w-5 text-white/60 hover:text-white/80" />
          </button>
          <button className="p-2 rounded-lg hover:bg-white/5 transition-colors duration-200">
            <Video className="h-5 w-5 text-white/60 hover:text-white/80" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 pb-6" style={{ scrollBehavior: 'smooth' }}>
        <div className="space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${message.sender === 'user'
                    ? 'bg-purple-600 text-white rounded-br-none'
                    : 'bg-white/5 text-white rounded-bl-none'
                  }`}
              >
                <p className="text-sm break-words">{message.content}</p>
                <div className="flex items-center justify-end mt-1 space-x-1">
                  <span className="text-xs opacity-50">
                    {format(message.timestamp, 'h:mm a')}
                  </span>
                  {message.sender === 'user' && (
                    <span className={`text-xs ${message.status === 'sent' ? 'text-white/50' :
                        message.status === 'delivered' ? 'text-white/70' :
                          'text-purple-darker' // read
                      }`}>
                      {message.status === 'sent' && '✓'}
                      {message.status === 'delivered' && '✓✓'}
                      {message.status === 'read' && (
                        <span className="relative">
                          <span className="absolute left-0">✓</span>
                          <span className="ml-1">✓</span>
                        </span>
                      )}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* Fixed Message Input */}
      <div className="flex-shrink-0 px-4 pt-4 pb-4 border-t border-white/10 bg-[#111111]/95 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-white/5">
            <Paperclip className="h-5 w-5 text-white/60" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white/90 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="p-2.5 rounded-xl bg-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors duration-200"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}