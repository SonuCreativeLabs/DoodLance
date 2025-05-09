"use client"

import { useState, useMemo } from "react";
import { professionals } from "../nearby/mockData";
import { ChatList } from "@/components/client/inbox/chat-list";
import { ChatView } from "@/components/client/inbox/chat-view";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InboxPage() {
  // Generate chats and messages only on the client to avoid hydration mismatch
  const mockChats = useMemo(() => professionals.map((pro, idx) => ({
    id: String(pro.id),
    recipientName: pro.name,
    recipientAvatar: pro.image,
    recipientJobTitle: pro.service,
    lastMessage: `Hi, I'm available for ${pro.service} in ${pro.location}!`,
    // Use static timestamps and unreadCount for SSR safety
    timestamp: new Date(Date.now() - (idx * 5 * 60 * 1000)), // Each chat 5 min apart
    unreadCount: (idx % 3),
    online: idx % 2 === 0,
  })), []);

  const mockMessages = useMemo(() => {
    const msgs: Record<string, any[]> = {};
    mockChats.forEach((chat, idx) => {
      msgs[chat.id] = [
        {
          id: `${chat.id}-1`,
          content: `Hi ${chat.recipientName}, I'm interested in your ${chat.recipientJobTitle} service in ${professionals[idx].location}.`,
          timestamp: new Date(Date.now() - (60 * 60 * 1000)), // 1 hour ago
          sender: 'user',
          status: 'read',
        },
        {
          id: `${chat.id}-2`,
          content: `Hello! Thank you for reaching out. How can I help you?`,
          timestamp: new Date(Date.now() - (55 * 60 * 1000)), // 55 min ago
          sender: 'other',
          status: 'read',
        },
        {
          id: `${chat.id}-3`,
          content: `I'd like to know your availability this week.`,
          timestamp: new Date(Date.now() - (45 * 60 * 1000)), // 45 min ago
          sender: 'user',
          status: 'delivered',
        },
        {
          id: `${chat.id}-4`,
          content: `I'm available on Thursday and Friday. Let me know what works for you!`,
          timestamp: new Date(Date.now() - (30 * 60 * 1000)), // 30 min ago
          sender: 'other',
          status: 'delivered',
        },
      ];
    });
    return msgs;
  }, [mockChats]);

  const [selectedChatId, setSelectedChatId] = useState<string | undefined>(
    undefined
  );
  const selectedChat = mockChats.find((chat) => chat.id === selectedChatId);

  const handleBackClick = () => {
    setSelectedChatId(undefined);
  };

  return (
    <div className="flex-1 overflow-hidden bg-[#111111]">
      <div className="relative h-full">
        {/* Chat List */}
        <div
          className={`absolute inset-0 w-full h-full bg-white/80 backdrop-blur-sm transition-transform duration-300 ${
            selectedChatId ? "-translate-x-full md:translate-x-0" : "translate-x-0"
          }`}
        >
          <div className="sticky top-0 z-10 px-4 py-4 bg-[#111111]">
            <h1 className="text-3xl font-bold text-white tracking-tight">Messages</h1>
          </div>
          <ChatList
            chats={mockChats}
            selectedChatId={selectedChatId}
            onSelectChat={setSelectedChatId}
          />
        </div>

        {/* Chat View */}
        <div
          className={`absolute inset-0 w-full h-full bg-white/80 backdrop-blur-sm transition-transform duration-300 ${
            selectedChatId ? "translate-x-0" : "translate-x-full"
          } ${selectedChatId ? "md:relative md:w-auto md:inset-auto" : ""}`}
        >
          {selectedChat ? (
            <>
              <ChatView
                chatId={selectedChat.id}
                recipientName={selectedChat.recipientName}
                recipientAvatar={selectedChat.recipientAvatar}
                recipientJobTitle={selectedChat.recipientJobTitle}
                online={selectedChat.online}
                onBack={handleBackClick}
                messages={mockMessages[selectedChat.id]}
              />
            </>
          ) : (
            <div className="h-full" />
          )}
        </div>
      </div>
    </div>
  );
}