
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
          onClose={() => setShowFloatingBar(false)}
          initialMessage=""
        />
      )}
      
      <div className="flex flex-col flex-1 h-full">
        <div className="flex flex-col flex-1">
          <ScrollArea className="flex-1 p-4">
            <div className="max-w-3xl mx-auto w-full py-4">
              {activeChat && activeChat.messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {(!activeChat || activeChat.messages.length === 0) && (
                <div className="flex justify-center items-center h-32 opacity-70">
                  <p className="text-muted-foreground text-center">
                    Envie uma mensagem para iniciar a conversa
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
          {/* No fixed input bar in chat view */}
        </div>
      </div>
    </div>
  );
};

export default Chat;
