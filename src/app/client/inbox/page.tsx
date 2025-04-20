"use client"

import { useState } from "react"
import { Send, Paperclip, Check, CheckCheck } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

// Types
interface Message {
  id: string
  content: string
  sender: "user" | "freelancer"
  timestamp: Date
  status: "sent" | "delivered" | "read"
}

interface Thread {
  id: string
  freelancerName: string
  freelancerImage: string
  lastMessage: string
  lastMessageTime: Date
  unread: number
}

// Mock data
const mockThreads: Thread[] = [
  {
    id: "1",
    freelancerName: "John Doe",
    freelancerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    lastMessage: "I'll be there in 20 minutes",
    lastMessageTime: new Date(),
    unread: 2,
  },
  {
    id: "2",
    freelancerName: "Sarah Wilson",
    freelancerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    lastMessage: "The job is completed",
    lastMessageTime: new Date(Date.now() - 3600000),
    unread: 0,
  },
]

const mockMessages: Message[] = [
  {
    id: "1",
    content: "Hi, I'm interested in the plumbing job",
    sender: "freelancer",
    timestamp: new Date(Date.now() - 3600000),
    status: "read"
  },
  {
    id: "2",
    content: "Great! When can you start?",
    sender: "user",
    timestamp: new Date(Date.now() - 3000000),
    status: "read"
  },
  {
    id: "3",
    content: "I can start tomorrow morning",
    sender: "freelancer",
    timestamp: new Date(Date.now() - 2400000),
    status: "read"
  }
]

export default function InboxPage() {
  const [selectedThread, setSelectedThread] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState(mockMessages)

  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    
    const newMsg: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: "user",
      timestamp: new Date(),
      status: "sent"
    }
    
    setMessages([...messages, newMsg])
    setNewMessage("")
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white">
      {/* Thread List */}
      <div className="w-full md:w-1/3 border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold">Messages</h1>
        </div>
        <div className="overflow-y-auto h-[calc(100%-4rem)]">
          {mockThreads.map((thread) => (
            <div
              key={thread.id}
              onClick={() => setSelectedThread(thread.id)}
              className={cn(
                "p-4 border-b border-gray-200 flex items-center space-x-3 cursor-pointer hover:bg-gray-50",
                selectedThread === thread.id && "bg-gray-50"
              )}
            >
              <div className="relative h-12 w-12">
                <Image
                  src={thread.freelancerImage}
                  alt={thread.freelancerName}
                  fill
                  className="rounded-full object-cover"
                />
                {thread.unread > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#FF8A3D] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {thread.unread}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{thread.freelancerName}</h3>
                <p className="text-sm text-gray-500 truncate">{thread.lastMessage}</p>
              </div>
              <span className="text-xs text-gray-400">
                {thread.lastMessageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="hidden md:flex flex-col flex-1">
        {selectedThread ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center space-x-3">
              <div className="h-10 w-10 relative">
                <Image
                  src={mockThreads.find(t => t.id === selectedThread)?.freelancerImage || ""}
                  alt="Freelancer"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <h2 className="font-medium">
                {mockThreads.find(t => t.id === selectedThread)?.freelancerName}
              </h2>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.sender === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[70%] rounded-lg p-3",
                      message.sender === "user"
                        ? "bg-[#FF8A3D] text-white"
                        : "bg-gray-100"
                    )}
                  >
                    <p>{message.content}</p>
                    <div className="flex items-center justify-end space-x-1 mt-1">
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {message.sender === "user" && (
                        message.status === "read" ? (
                          <CheckCheck className="h-4 w-4 opacity-70" />
                        ) : (
                          <Check className="h-4 w-4 opacity-70" />
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <Paperclip className="h-5 w-5 text-gray-500" />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 p-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF8A3D] focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-[#FF8A3D] text-white rounded-full hover:bg-[#ff9d5c] transition-colors"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  )
} 