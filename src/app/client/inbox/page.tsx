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
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-white">
      <div className="flex-1 overflow-hidden">
        <div className="h-full grid md:grid-cols-[350px_1fr] relative">
          {/* Chat List */}
          <div
            className={`h-full overflow-y-auto bg-white transition-transform duration-300 absolute md:relative inset-0 ${
              selectedChatId ? "-translate-x-full md:translate-x-0" : "translate-x-0"
            }`}
          >
            <div className="sticky top-0 z-10 p-4 bg-white">
              <h1 className="text-2xl font-semibold text-[#4A5568]">Messages</h1>
            </div>
            <div className="pb-4">
              <ChatList
                chats={mockChats}
                selectedChatId={selectedChatId}
                onSelectChat={setSelectedChatId}
              />
            </div>
          </div>

          {/* Chat View */}
          <div
            className={`h-full bg-white transition-transform duration-300 absolute md:relative inset-0 ${
              selectedChatId ? "translate-x-0" : "translate-x-full md:translate-x-0"
            }`}
          >
            {selectedChat ? (
              <>
                <div className="absolute top-4 left-4 z-10">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackClick}
                    className="h-8 w-8 md:hidden"
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
              <div className="h-full flex items-center justify-center text-gray-500">
                <p>Select a conversation to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 