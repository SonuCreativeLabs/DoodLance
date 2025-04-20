"use client"

import { useState } from 'react';
import { ChatList } from '@/components/freelancer/inbox/chat-list';
import { ChatView } from '@/components/freelancer/inbox/chat-view';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const mockChats = [
  {
    id: '1',
    name: 'Raj Kumar',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=raj',
    jobTitle: 'Full Stack Developer',
    online: true
  },
  {
    id: '2',
    name: 'Priya Singh',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
    jobTitle: 'UI/UX Designer',
    online: false
  },
  {
    id: '3',
    name: 'Alex Thompson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    jobTitle: 'Backend Developer',
    online: true
  }
];

export default function InboxPage() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const selectedChat = mockChats.find(chat => chat.id === selectedChatId);

  const handleBackClick = () => {
    setSelectedChatId(null);
  };

  return (
    <main className="min-h-screen h-screen flex-1 relative">
      <div className="h-[calc(100vh-4rem)] overflow-hidden">
        <div className="grid h-full md:grid-cols-[350px_1fr] relative">
          {/* Chat List */}
          <div className={`border-r h-full overflow-y-auto bg-white transition-transform duration-300 absolute md:relative inset-0 ${
            selectedChatId ? '-translate-x-full md:translate-x-0' : 'translate-x-0'
          }`}>
            <div className="p-4">
              <h1 className="text-2xl font-semibold mb-4">Messages</h1>
              <ChatList
                onChatSelect={setSelectedChatId}
                selectedChatId={selectedChatId || undefined}
              />
            </div>
          </div>

          {/* Chat View */}
          <div className={`h-full bg-white transition-transform duration-300 absolute md:relative inset-0 ${
            selectedChatId ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
          }`}>
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
                  recipientName={selectedChat.name}
                  recipientAvatar={selectedChat.avatar}
                  recipientJobTitle={selectedChat.jobTitle}
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
    </main>
  );
} 