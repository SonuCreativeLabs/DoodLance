'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, ArrowLeft, MoreVertical, Phone, Video } from 'lucide-react';
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
}

const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: '1',
      content: 'Hi, I saw your profile and I think you\'d be perfect for our project. We\'re looking for someone with your expertise in full-stack development.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      sender: 'other',
      status: 'read'
    },
    {
      id: '2',
      content: 'Thanks! I\'d love to hear more about it. Could you share some details about the project scope and timeline?',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      sender: 'user',
      status: 'read'
    },
    {
      id: '3',
      content: 'Of course! It\'s a 3-month project to build a modern e-commerce platform. The tech stack includes React, Node.js, and PostgreSQL.',
      timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
      sender: 'other',
      status: 'read'
    },
    {
      id: '4',
      content: 'Sounds interesting! My experience aligns well with those technologies. When would you like to discuss the details?',
      timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
      sender: 'user',
      status: 'read'
    },
    {
      id: '5',
      content: 'Great! Are you available for a quick video call tomorrow at 2 PM to discuss the project in detail?',
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    // In a real app, this would send the message to the backend
    setNewMessage('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col min-h-0 flex-1"
    >
      {/* Chat Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#111111]/95 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-lg transition-all duration-300 border border-white/5 hover:border-purple-500/30 group"
          >
            <ArrowLeft className="h-5 w-5 text-white/80 group-hover:text-purple-400 transition-colors duration-300" />
          </motion.button>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="relative h-12 w-12 rounded-xl overflow-hidden ring-2 ring-purple-500/30 group-hover:ring-purple-500/50 transition-all duration-300">
                <img 
                  src={recipientAvatar} 
                  alt={recipientName} 
                  className="w-full h-full object-cover"
                />
              </div>
              {online && (
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-gradient-to-r from-green-500 to-green-400 ring-2 ring-[#111111] shadow-lg" />
              )}
            </div>
            <div>
              <h3 className="font-medium text-white">{recipientName}</h3>
              <p className="text-sm text-white/60">{recipientJobTitle}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-lg transition-all duration-300 border border-white/5 hover:border-purple-500/30 group"
          >
            <Phone className="h-4 w-4 text-white/80 group-hover:text-purple-400 transition-colors duration-300" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-lg transition-all duration-300 border border-white/5 hover:border-purple-500/30 group"
          >
            <Video className="h-4 w-4 text-white/80 group-hover:text-purple-400 transition-colors duration-300" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-lg transition-all duration-300 border border-white/5 hover:border-purple-500/30 group"
          >
            <MoreVertical className="h-4 w-4 text-white/80 group-hover:text-purple-400 transition-colors duration-300" />
          </motion.button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-[#111111]/95 to-[#111111]/90">
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: index * 0.1 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`max-w-[70%] rounded-2xl p-4 ${message.sender === 'user'
                  ? 'bg-gradient-to-r from-purple-600 to-purple-400 text-white'
                  : 'bg-white/5 text-white/90 backdrop-blur-lg border border-white/10'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs ${message.sender === 'user' ? 'text-white/60' : 'text-white/40'}`}>
                    {format(message.timestamp, 'h:mm a')}
                  </span>
                  {message.sender === 'user' && (
                    <span className="text-white/60">
                      {message.status === 'sent' && '✓'}
                      {message.status === 'delivered' && '✓✓'}
                      {message.status === 'read' && (
                        <span className="text-purple-400">✓✓</span>
                      )}
                    </span>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-6 border-t border-white/10 bg-[#111111]/95 backdrop-blur-xl">
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-lg transition-all duration-300 border border-white/5 hover:border-purple-500/30 group"
          >
            <Paperclip className="h-4 w-4 text-white/80 group-hover:text-purple-400 transition-colors duration-300" />
          </motion.button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="w-full h-10 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/30 px-4 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
              onKeyPress={(e: React.KeyboardEvent) => e.key === 'Enter' && handleSend()}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${newMessage.trim()
              ? 'bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-500 hover:to-purple-300'
              : 'bg-white/5 border border-white/10'
            } group`}
          >
            <Send className={`h-4 w-4 ${newMessage.trim() ? 'text-white' : 'text-white/40'}`} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
} 