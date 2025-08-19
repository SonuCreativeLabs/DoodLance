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
  className?: string;
}

const mockMessages: Record<string, Message[]> = {
  // Cricket Coach
  'DLSP1234': [
    {
      id: '1',
      content: 'Hi Rajesh, I came across your coaching profile. We need a cricket coach for our U-16 team. Are you available?',
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      sender: 'other',
      status: 'read'
    },
    {
      id: '2',
      content: 'Yes, I have 5+ years of experience coaching junior teams. What are the training timings?',
      timestamp: new Date(Date.now() - 1000 * 60 * 115),
      sender: 'user',
      status: 'read'
    },
    {
      id: '3',
      content: 'We train on weekends, 8-10 AM at the City Sports Complex. Would you be available for a trial session this Saturday?',
      timestamp: new Date(Date.now() - 1000 * 60 * 100),
      sender: 'other',
      status: 'read'
    },
    {
      id: '4',
      content: 'This Saturday works for me. How many players are in the team currently?',
      timestamp: new Date(Date.now() - 1000 * 60 * 90),
      sender: 'user',
      status: 'read'
    },
    {
      id: '5',
      content: 'We have 12 players. Most are beginners with basic skills. We\'re looking to improve their batting and fielding techniques.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      sender: 'other',
      status: 'read'
    },
  ],
  
  // Corporate Yoga
  'DLSP5678': [
    {
      id: '1',
      content: 'Hello, I\'m Priya from TechCorp HR. We\'re starting a corporate wellness program and need a yoga instructor. Your profile looks perfect!',
      timestamp: new Date(Date.now() - 1000 * 60 * 180),
      sender: 'other',
      status: 'read'
    },
    {
      id: '2',
      content: 'Thank you, Priya! I\'d love to help. Could you share more about the program schedule and employee fitness levels?',
      timestamp: new Date(Date.now() - 1000 * 60 * 175),
      sender: 'user',
      status: 'read'
    },
    {
      id: '3',
      content: 'We\'re looking for 3 sessions per week - Mon, Wed, Fri from 7-8 AM. Most employees are beginners with desk jobs, so we need sessions focused on back pain and stress relief.',
      timestamp: new Date(Date.now() - 1000 * 60 * 160),
      sender: 'other',
      status: 'read'
    },
    {
      id: '4',
      content: 'That sounds great! I specialize in therapeutic yoga for office workers. I can bring mats, but we\'ll need a well-ventilated space. Do you have a conference room or should we look into a nearby studio?',
      timestamp: new Date(Date.now() - 1000 * 60 * 150),
      sender: 'user',
      status: 'read'
    },
  ],
  
  // Wedding Dance Choreography
  'DLSP9012': [
    {
      id: '1',
      content: 'Hi, we\'re planning our wedding sangeet and need a dance instructor. We saw your work at the Sharma wedding - loved it!',
      timestamp: new Date(Date.now() - 1000 * 60 * 300),
      sender: 'other',
      status: 'read'
    },
    {
      id: '2',
      content: 'Thank you! I remember the Sharma wedding fondly. I\'d be happy to help with your sangeet. What style of dance are you interested in?',
      timestamp: new Date(Date.now() - 1000 * 60 * 290),
      sender: 'user',
      status: 'read'
    },
    {
      id: '3',
      content: 'We love Bollywood fusion! There will be 8 of us with mixed experience levels. The wedding is in 3 months - is that enough time to prepare?',
      timestamp: new Date(Date.now() - 1000 * 60 * 280),
      sender: 'other',
      status: 'read'
    },
    {
      id: '4',
      content: '3 months is perfect! We can start with basic steps and build up to a 5-minute routine. How about we schedule a free trial session to discuss song choices and choreography ideas?',
      timestamp: new Date(Date.now() - 1000 * 60 * 270),
      sender: 'user',
      status: 'read'
    },
  ],
  // Piano Lessons for Kids
  'DLSP3456': [
    {
      id: '1',
      content: 'Hello, we\'re looking for a piano teacher for our 8-year-old daughter. She\'s a complete beginner. Do you have experience with young children?',
      timestamp: new Date(Date.now() - 1000 * 60 * 420),
      sender: 'other',
      status: 'read'
    },
    {
      id: '2',
      content: 'Yes, I specialize in teaching children ages 5-12. I use a fun, interactive method that keeps young learners engaged. Do you have a keyboard or piano at home?',
      timestamp: new Date(Date.now() - 1000 * 60 * 410),
      sender: 'user',
      status: 'read'
    },
    {
      id: '3',
      content: 'We have a basic keyboard. What materials will we need to purchase? Also, what\'s your availability for lessons?',
      timestamp: new Date(Date.now() - 1000 * 60 * 400),
      sender: 'other',
      status: 'read'
    },
    {
      id: '4',
      content: 'For beginners, I recommend the "Piano Adventures" book series. I have Tuesday and Thursday afternoons open. Would 4 PM work for you? Each lesson is 45 minutes.',
      timestamp: new Date(Date.now() - 1000 * 60 * 390),
      sender: 'user',
      status: 'read'
    },
    {
      id: '5',
      content: 'Thursday at 4 PM would be perfect. Should we start next week? Also, do we need to buy any additional materials like a metronome?',
      timestamp: new Date(Date.now() - 1000 * 60 * 380),
      sender: 'other',
      status: 'read'
    },
    {
      id: '6',
      content: 'Yes, let\'s start next Thursday. A metronome would be helpful, but there are free phone apps we can use initially. I\'ll send you a confirmation with the address and what to bring to the first lesson.',
      timestamp: new Date(Date.now() - 1000 * 60 * 370),
      sender: 'user',
      status: 'read'
    }
  ],
  
  // Outdoor Fitness Trainer
  'DLSP7890': [
    {
      id: '1',
      content: 'Hi, we\'re organizing a 6-week fitness bootcamp at Central Park starting next month. We need experienced trainers - are you available?',
      timestamp: new Date(Date.now() - 1000 * 60 * 1440),
      sender: 'other',
      status: 'read'
    },
    {
      id: '2',
      content: 'I\'d be interested! Could you share more details about the bootcamp format, expected group size, and compensation?',
      timestamp: new Date(Date.now() - 1000 * 60 * 1430),
      sender: 'user',
      status: 'read'
    },
    {
      id: '3',
      content: 'It\'s a high-energy outdoor bootcamp, 5 days a week. Groups of 15-20 participants per trainer. We pay $40/hour, and sessions are 6-7 AM. We provide all equipment.',
      timestamp: new Date(Date.now() - 1000 * 60 * 1420),
      sender: 'other',
      status: 'read'
    },
    {
      id: '4',
      content: 'That schedule works for me. I have experience with outdoor bootcamps and can bring creative circuit training ideas. Should we schedule a quick call to discuss the exercise programming?',
      timestamp: new Date(Date.now() - 1000 * 60 * 1400),
      sender: 'user',
      status: 'read'
    },
    {
      id: '5',
      content: 'That would be great! How about a 15-minute call tomorrow at 2 PM? Also, we\'d like to do a trial session with you next week. Would Monday work?',
      timestamp: new Date(Date.now() - 1000 * 60 * 1380),
      sender: 'other',
      status: 'read'
    },
    {
      id: '6',
      content: 'Tomorrow at 2 PM works perfectly. For the trial, I can do Monday at 6 AM. Looking forward to discussing the program structure and sharing some of my training philosophy with you!',
      timestamp: new Date(Date.now() - 1000 * 60 * 1370),
      sender: 'user',
      status: 'read'
    }
  ],
  
  // Web Development Project
  'DLWD5678': [
    {
      id: '1',
      content: 'Hi, we need a full-stack developer for our e-commerce platform. The project involves building a React frontend with Node.js backend. Are you available for a 3-month contract?',
      timestamp: new Date(Date.now() - 1000 * 60 * 2000),
      sender: 'other',
      status: 'read'
    },
    {
      id: '2',
      content: 'Thanks for reaching out! I\'d be interested in learning more. Could you share the tech stack you\'re using and any specific requirements for the e-commerce features?',
      timestamp: new Date(Date.now() - 1000 * 60 * 1980),
      sender: 'user',
      status: 'read'
    },
    {
      id: '3',
      content: 'We\'re using MERN stack (MongoDB, Express, React, Node.js) with TypeScript. Key features needed: User auth, product catalog, cart/checkout, and payment integration with Stripe.',
      timestamp: new Date(Date.now() - 1000 * 60 * 1950),
      sender: 'other',
      status: 'read'
    },
    {
      id: '4',
      content: 'I have extensive experience with the MERN stack and TypeScript. I recently built a similar e-commerce platform. Would you like to see my portfolio? Also, do you have a preferred state management solution?',
      timestamp: new Date(Date.now() - 1000 * 60 * 1900),
      sender: 'user',
      status: 'read'
    }
  ],
  
  // AC Service
  'DLAC3456': [
    {
      id: '1',
      content: 'Hi, our office AC unit isn\'t cooling properly. It makes a strange noise when starting up. Are you available for a service call?',
      timestamp: new Date(Date.now() - 1000 * 60 * 3000),
      sender: 'other',
      status: 'read'
    },
    {
      id: '2',
      content: 'I can help with that! Could you tell me the make and model of your AC unit? Also, when did you first notice the cooling issue?',
      timestamp: new Date(Date.now() - 1000 * 60 * 2950),
      sender: 'user',
      status: 'read'
    },
    {
      id: '3',
      content: 'It\'s a Daikin FTKF Series, installed about 3 years ago. The problem started last week. It cools for a while, then stops. The noise is new as of yesterday.',
      timestamp: new Date(Date.now() - 1000 * 60 * 2900),
      sender: 'other',
      status: 'read'
    },
    {
      id: '4',
      content: 'Based on your description, it might be a refrigerant issue or a problem with the compressor. I can come by tomorrow between 9 AM - 12 PM. Would that work? The service call fee is ₹800, including basic diagnostics.',
      timestamp: new Date(Date.now() - 1000 * 60 * 2850),
      sender: 'user',
      status: 'read'
    }
  ]
};

export function ChatView({ 
  chatId, 
  recipientName, 
  recipientAvatar, 
  recipientJobTitle, 
  online,
  onBack,
  className = '' 
}: ChatViewProps) {
  const [newMessage, setNewMessage] = useState('');
  const messages = mockMessages[chatId] || [{
    id: '1',
    content: `Hi there! This is the start of your conversation about the ${recipientJobTitle} position.`,
    timestamp: new Date(),
    sender: 'other' as const,
    status: 'read' as const
  }];
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
    messages.push(newMsg);
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
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  message.sender === 'user'
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
                  <span className={`text-xs ${
                    message.status === 'sent' ? 'text-white/50' : 
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