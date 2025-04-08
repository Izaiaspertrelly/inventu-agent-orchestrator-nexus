
import React, { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "@/components/ChatMessage";
import ChatSidebar from "@/components/ChatSidebar";
import { useChat } from "@/contexts/ChatContext";
import FloatingSearchBar from "@/components/FloatingSearchBar";

const Chat: React.FC = () => {
  const { activeChat, createNewChat, sendMessage } = useChat();
  const [showFloatingBar, setShowFloatingBar] = useState(false);
  
  useEffect(() => {
    if (!activeChat) {
      createNewChat();
    }
    
    // Always show the floating search bar in chat view
    // Either immediately or after first message
    if (activeChat && activeChat.messages.length > 0) {
      setShowFloatingBar(true);
    } else {
      // Add slight delay to show floating bar if no messages yet
      const timer = setTimeout(() => setShowFloatingBar(true), 300);
      return () => clearTimeout(timer);
    }
  }, [activeChat, createNewChat]);
  
  const handleFloatingSearch = (searchText: string) => {
    sendMessage(searchText);
  };
  
  return (
    <div className="flex h-screen bg-background dark">
      <ChatSidebar />
      
      {showFloatingBar && (
        <FloatingSearchBar 
          onSend={handleFloatingSearch}
          initialMessage=""
        />
      )}
      
      <div className="flex flex-col flex-1 h-full">
        <div className="flex flex-col flex-1">
          <ScrollArea className="flex-1 px-4 py-6">
            <div className="max-w-3xl mx-auto w-full py-4 space-y-6">
              {activeChat && activeChat.messages.length > 0 ? (
                activeChat.messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))
              ) : (
                <div className="flex flex-col justify-center items-center h-[60vh] text-center">
                  <div className="w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-foreground mb-2">Iniciar nova conversa</h3>
                  <p className="text-muted-foreground max-w-sm">
                    Use a barra de pesquisa flutuante para enviar uma mensagem e começar a conversar
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default Chat;
