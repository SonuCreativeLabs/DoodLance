"use client"

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Search, Plus, Filter, ChevronDown, Check } from 'lucide-react';
import { useChatView } from '@/contexts/ChatViewContext';
import { professionals } from '../nearby/mockData';

// Define component types for better type safety
type ChatListProps = {
  chats: any[];
  selectedChatId?: string;
  onSelectChat: (id: string) => void;
};

type ChatViewProps = {
  chatId: string;
  recipientName: string;
  recipientAvatar: string;
  recipientJobTitle: string;
  online: boolean;
  onBack: () => void;
  messages: any[];
};

// Dynamically import client-side components with SSR disabled
const ChatList = dynamic<ChatListProps>(
  () => import('@/components/client/inbox/chat-list').then(mod => ({
    default: mod.ChatList
  })),
  { 
    ssr: false,
    loading: () => <div className="p-4 text-gray-400">Loading chats...</div>
  }
);

const ChatView = dynamic<ChatViewProps>(
  () => import('@/components/client/inbox/chat-view').then(mod => ({
    default: mod.ChatView
  })),
  { 
    ssr: false,
    loading: () => <div className="p-4 text-gray-400">Loading chat...</div>
  }
);

// Function to generate consistent avatar URL based on name
const getAvatarUrl = (name: string, gender: 'men' | 'women' = 'men') => {
  const nameHash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const id = nameHash % 100;
  return `https://randomuser.me/api/portraits/${gender}/${id}.jpg`;
};

// Define message type
type Message = {
  id: string;
  content: string;
  timestamp: Date;
  sender: 'user' | 'other';
  status: 'sent' | 'delivered' | 'read';
};

// Helper to generate random time offset in milliseconds
const randomTimeOffset = (maxHours: number) => Math.floor(Math.random() * maxHours * 60 * 60 * 1000);

// Generate unique mock messages based on job title and proId
const generateMockMessages = (proId: string, jobTitle: string): Message[] => {
  // Generate a seed based on proId for consistent randomness
  const seed = proId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (max: number) => (seed * 9301 + 49297) % 233280 / 233280 * max;
  
  // Common greetings
  const greetings = [
    `Hi there! I'm interested in your ${jobTitle} service.`,
    `Hello! I found your profile and I need help with ${jobTitle}.`,
    `Good day! Are you available for ${jobTitle} services?`,
    `Hi! I'm looking for a ${jobTitle} and came across your profile.`,
    `Hello! I have a question about your ${jobTitle} service.`
  ];

  // Common responses
  const responses = [
    `I'm available this week. What's your schedule like?`,
    `I can help with that! When would you like to get started?`,
    `I'd be happy to assist. What specific help do you need?`,
    `I have some availability. Could you tell me more about what you need?`,
    `Thanks for reaching out! I'm available for ${jobTitle} services.`
  ];

  // Job-specific message templates
  const jobTemplates = {
    'Photographer': [
      "I'm looking for someone to take {type} photos. Do you have experience with {type} photography?",
      "What's your rate for a {hour}-hour photoshoot?",
      "Do you provide {deliverable} with your photography packages?",
      "I need photos for {purpose}. Are you available on {date}?",
      "What's your turnaround time for {type} of photos?"
    ],
    'Tutor': [
      "I need help with {subject}, specifically with {topic}.",
      "Are you available for {frequency} sessions?",
      "What's your teaching approach for {subject}?",
      "Do you provide {material} for our sessions?",
      "I'm preparing for {exam}. Can you help me with that?"
    ],
    'Plumber': [
      "I have a {issue} in my {location}. Can you take a look?",
      "How soon can you come to fix a {problem}?",
      "What's your service fee for {task}?",
      "Do you work with {material} pipes?",
      "I need a quote for {job} in my {location}."
    ],
    'default': [
      "I need help with {task}. Are you available {time}?",
      "What's your experience with {specific}?",
      "Can you provide a quote for {service}?",
      "Do you have availability on {day}?",
      "What's included in your {service} package?"
    ]
  };

  // Job-specific variables
  const variables = {
    type: ['portrait', 'landscape', 'product', 'event', 'family', 'corporate'][Math.floor(random(6))],
    hour: ['1', '2', '3', '4', '8'][Math.floor(random(5))],
    deliverable: ['digital copies', 'prints', 'edited photos', 'a photo album', 'online gallery'][Math.floor(random(5))],
    purpose: ['my website', 'social media', 'a gift', 'a portfolio', 'a business profile'][Math.floor(random(5))],
    subject: ['math', 'science', 'English', 'programming', 'music', 'art'][Math.floor(random(6))],
    topic: ['algebra', 'calculus', 'grammar', 'algorithms', 'piano', 'painting'][Math.floor(random(6))],
    frequency: ['weekly', 'bi-weekly', 'daily', 'twice a week', 'monthly'][Math.floor(random(5))],
    material: ['study guides', 'practice tests', 'worksheets', 'online resources', 'videos'][Math.floor(random(5))],
    exam: ['SAT', 'ACT', 'GRE', 'TOEFL', 'IELTS', 'AP exams'][Math.floor(random(6))],
    issue: ['leak', 'clog', 'low water pressure', 'running toilet', 'no hot water'][Math.floor(random(5))],
    location: ['kitchen', 'bathroom', 'basement', 'laundry room', 'outdoor'][Math.floor(random(5))],
    problem: ['leaky faucet', 'clogged drain', 'burst pipe', 'water heater issue', 'toilet problem'][Math.floor(random(5))],
    task: ['installation', 'repair', 'replacement', 'maintenance', 'inspection'][Math.floor(random(5))],
    job: ['a full bathroom remodel', 'a kitchen renovation', 'a plumbing inspection', 'a pipe replacement'][Math.floor(random(4))],
    specific: ['this type of work', 'similar projects', 'this specific issue', 'this kind of service'][Math.floor(random(4))],
    service: jobTitle.toLowerCase(),
    date: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][Math.floor(random(6))],
    day: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'the weekend'][Math.floor(random(6))],
    time: ['this week', 'next week', 'tomorrow', 'on the weekend', 'in the morning', 'in the afternoon', 'in the evening'][Math.floor(random(7))]
  };

  // Function to replace placeholders in templates
  const fillTemplate = (template: string) => {
    return template.replace(/\{([^}]+)\}/g, (_, key) => variables[key as keyof typeof variables] || '');
  };

  // Get appropriate templates based on job title
  const templates = Object.entries(jobTemplates).find(([key]) => 
    key !== 'default' && jobTitle.toLowerCase().includes(key.toLowerCase())
  )?.[1] || jobTemplates.default;

  // Generate a unique conversation
  const greeting = greetings[Math.floor(random(greetings.length))];
  const response = responses[Math.floor(random(responses.length))];
  const userQuestion = fillTemplate(templates[Math.floor(random(templates.length))]);
  const professionalResponse = responses[Math.floor(random(responses.length))];

  // Generate timestamps with random but logical progression
  const now = Date.now();
  const timestamps = [
    now - randomTimeOffset(48), // 0-48 hours ago
    now - randomTimeOffset(24), // 0-24 hours after first
    now - randomTimeOffset(12), // 0-12 hours after second
    now - randomTimeOffset(6)   // 0-6 hours after third
  ].sort((a, b) => a - b); // Ensure chronological order

  return [
    {
      id: `${proId}-1`,
      content: greeting,
      timestamp: new Date(timestamps[0]),
      sender: 'user' as const,
      status: 'read' as const,
    },
    {
      id: `${proId}-2`,
      content: response,
      timestamp: new Date(timestamps[1]),
      sender: 'other' as const,
      status: 'read' as const,
    },
    {
      id: `${proId}-3`,
      content: userQuestion,
      timestamp: new Date(timestamps[2]),
      sender: 'user' as const,
      status: 'delivered' as const,
    },
    {
      id: `${proId}-4`,
      content: professionalResponse,
      timestamp: new Date(timestamps[3]),
      sender: 'other' as const,
      status: 'read' as const,
    }
  ];
};

// First generate mock messages for all professionals
const mockMessages = professionals.reduce((acc, pro, index) => {
  const chatId = `pro-${pro.id}`;
  return {
    ...acc,
    [chatId]: generateMockMessages(chatId, pro.service)
  };
}, {} as Record<string, Message[]>);

// Status options for chats
const statuses: Array<'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled'> = [
  'Upcoming', 'Ongoing', 'Completed', 'Cancelled'
];

// Convert professional data to chat format, using the last message from mockMessages
const professionalChats = professionals.map((pro, index) => {
  const gender = index % 2 === 0 ? 'men' : 'women';
  const unreadCount = Math.floor(Math.random() * 3); // 0-2 unread messages
  const chatId = `pro-${pro.id}`;
  const messages = mockMessages[chatId] || [];
  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
  // Assign a random status, weighted towards 'Upcoming' and 'Ongoing'
  const statusWeights = [0.4, 0.4, 0.15, 0.05]; // 40% Upcoming, 40% Ongoing, 15% Completed, 5% Cancelled
  const randomValue = Math.random();
  let statusIndex = 0;
  let weightSum = 0;
  for (let i = 0; i < statusWeights.length; i++) {
    weightSum += statusWeights[i];
    if (randomValue <= weightSum) {
      statusIndex = i;
      break;
    }
  }
  
  return {
    id: chatId,
    recipientName: pro.name,
    recipientAvatar: pro.image || getAvatarUrl(pro.name, gender),
    recipientJobTitle: pro.service,
    lastMessage: lastMessage?.content || `Hi, I'm available for ${pro.service} in ${pro.location}!`,
    timestamp: lastMessage?.timestamp || new Date(Date.now() - (index * 5 * 60 * 1000)),
    unreadCount,
    online: index % 3 === 0,
    status: statuses[statusIndex],
  };
});

function InboxPage() {
  // Client-side state
  const [isClient, setIsClient] = useState(false);
  
  // Chat state
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  
  // Refs and context
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const { setFullChatView } = useChatView();
  const statusOptions = ['All', 'Upcoming', 'Ongoing', 'Completed', 'Cancelled'];
  
  // Set client-side flag
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterButtonRef.current && !filterButtonRef.current.contains(event.target as Node)) {
        setShowFilterDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Handle chat selection
  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
  };
  
  // Show loading state on server
  if (!isClient) {
    return (
      <div className="flex h-full bg-[#111111] text-white items-center justify-center">
        <div className="animate-pulse">Loading messages...</div>
      </div>
    );
  }


  
  // Toggle filter dropdown
  const toggleFilter = () => setShowFilterDropdown(!showFilterDropdown);
  
  // Handle status filter change
  const handleStatusFilter = (status: string) => {
    setStatusFilter(status === 'All' ? undefined : status);
    setShowFilterDropdown(false);
  };

  const selectedChat = professionalChats.find(chat => chat.id === selectedChatId) || null;
  
  // Filter chats based on search query and status
  const filteredChats = professionalChats.filter(chat => {
    const matchesSearch = !searchQuery.trim() || 
      chat.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.recipientJobTitle.toLowerCase().includes(searchQuery.toLowerCase());
    
    // If status filter is active, only show chats that match the status
    // Since we're not tracking status in the chat object, this is a no-op for now
    // You can implement actual status filtering when you add status to the chat object
    return matchesSearch;
  });

  const handleBackClick = () => {
    setSelectedChatId(null);
    setFullChatView(false);
  };

  return (
    <div className="flex h-full bg-[#111111] text-white" suppressHydrationWarning>
      {/* Chat List Panel */}
      <div 
        className={`w-full md:w-96 border-r border-white/10 flex flex-col ${
          selectedChatId ? 'hidden md:flex' : 'flex'
        }`}
      >
        <div className="p-4 border-b border-white/10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">Messages</h1>
              <p className="text-sm text-white/60">
                {filteredChats.reduce((total, chat) => total + (chat.unreadCount || 0), 0)} unread messages
              </p>
            </div>
            <div className="relative" ref={filterRef}>
              <button 
                ref={filterButtonRef}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm"
                onClick={toggleFilter}
              >
                <Filter className="w-4 h-4" />
                <span>{statusFilter || 'Filter'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {showFilterDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-[#1E1E1E] rounded-lg shadow-lg z-50 overflow-hidden border border-white/10"
                  >
                    {statusOptions.map((status) => (
                      <button
                        key={status}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-white/5 flex items-center justify-between ${
                          statusFilter === status ? 'text-primary' : ''
                        }`}
                        onClick={() => handleStatusFilter(status)}
                      >
                        {status}
                        {statusFilter === status && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full pl-10 pr-4 py-2 bg-white/5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          

        </div>
        
        <div className="flex-1 overflow-hidden">
        {filteredChats && (
          <ChatList 
            chats={filteredChats} 
            selectedChatId={selectedChatId || undefined} 
            onSelectChat={handleSelectChat} 
          />
        )}
      </div>
      </div>
      
      {/* Chat View */}
      <div className="flex-1 flex flex-col bg-[#1a1a1a] border-l border-white/10">
        {selectedChat ? (
          <ChatView
            chatId={selectedChat.id}
            recipientName={selectedChat.recipientName}
            recipientAvatar={selectedChat.recipientAvatar}
            recipientJobTitle={selectedChat.recipientJobTitle}
            online={selectedChat.online}
            onBack={() => setSelectedChatId(null)}
            messages={mockMessages[selectedChat.id] || []}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}

export default InboxPage;