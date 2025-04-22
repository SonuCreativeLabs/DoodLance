"use client"

import { useState } from "react"
import { ChatList } from "@/components/client/inbox/chat-list"
import { ChatView } from "@/components/client/inbox/chat-view"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

// Mock data matching the image exactly
const mockChats = [
  {
    id: "1",
    recipientName: "Raj Kumar",
    recipientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=raj",
    recipientJobTitle: "Full Stack Developer",
    lastMessage: "Can you start the project next week?",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    unreadCount: 2,
    online: true,
  },
  {
    id: "2",
    recipientName: "Priya Singh",
    recipientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
    recipientJobTitle: "UI/UX Designer",
    lastMessage: "The design looks great! Moving forward with...",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    unreadCount: 0,
    online: false,
  },
  {
    id: "3",
    recipientName: "Alex Thompson",
    recipientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
    recipientJobTitle: "Backend Developer",
    lastMessage: "Perfect, I will review the code and get b...",
    timestamp: new Date(Date.now() - 1000 * 60 * 120), // about 2 hours ago
    unreadCount: 1,
    online: true,
  },
]

export default function InboxPage() {
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>(
    undefined
  )
  const selectedChat = mockChats.find((chat) => chat.id === selectedChatId)

  const handleBackClick = () => {
    setSelectedChatId(undefined)
  }

  return (
    <div className="flex-1 overflow-hidden bg-gradient-to-br from-gray-50 to-purple-50/30">
      <div className="relative h-full">
        {/* Chat List */}
        <div
          className={`absolute inset-0 w-full h-full bg-white/80 backdrop-blur-sm transition-transform duration-300 ${
            selectedChatId ? "-translate-x-full md:translate-x-0" : "translate-x-0"
          }`}
        >
          <div className="sticky top-0 z-10 p-4 bg-white/80 backdrop-blur-sm border-b border-purple-100/50">
            <h1 className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">Messages</h1>
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
              <div className="absolute top-4 left-4 z-10 md:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackClick}
                  className="h-8 w-8 hover:bg-purple-50 text-purple-600"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </div>
              <ChatView
                chatId={selectedChat.id}
                recipientName={selectedChat.recipientName}
                recipientAvatar={selectedChat.recipientAvatar}
                recipientJobTitle={selectedChat.recipientJobTitle}
                online={selectedChat.online}
                onBack={handleBackClick}
              />
            </>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-purple-600/80">Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 