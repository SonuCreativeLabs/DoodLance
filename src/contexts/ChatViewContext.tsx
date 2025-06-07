import React, { createContext, useContext, useState } from 'react';

interface ChatViewContextProps {
  fullChatView: boolean;
  setFullChatView: (value: boolean) => void;
}

const ChatViewContext = createContext<ChatViewContextProps | undefined>(undefined);

export const ChatViewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fullChatView, setFullChatView] = useState(false);
  return (
    <ChatViewContext.Provider value={{ fullChatView, setFullChatView }}>
      {children}
    </ChatViewContext.Provider>
  );
};

export const useChatView = () => {
  const context = useContext(ChatViewContext);
  if (!context) throw new Error('useChatView must be used within a ChatViewProvider');
  return context;
};
