
import React, { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "@/components/ChatMessage";
import ChatSidebar from "@/components/ChatSidebar";
import ChatCategories from "@/components/ChatCategories";
import { useChat } from "@/contexts/ChatContext";
import { Image, Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";

const Chat: React.FC = () => {
  const { activeChat, createNewChat, sendMessage } = useChat();
  const [greeting, setGreeting] = useState("");
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  
  // Create an initial chat if none exists
  useEffect(() => {
    if (!activeChat) {
      createNewChat();
    }
    
    // Get user information
    const user = JSON.parse(localStorage.getItem("inventu_user") || "{}");
    setUserName(user.name || "");
    
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Bom dia");
    else if (hour < 18) setGreeting("Boa tarde");
    else setGreeting("Boa noite");
  }, [activeChat, createNewChat]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    sendMessage(message);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as unknown as React.FormEvent);
    }
  };
  
  return (
    <div className="flex h-screen bg-background dark">
      <ChatSidebar />
      
      <div className="flex flex-col flex-1 h-full">
        <div className="flex-1 flex flex-col">
          {activeChat && activeChat.messages.length > 0 ? (
            <ScrollArea className="flex-1 p-4">
              <div className="max-w-3xl mx-auto w-full py-4">
                {activeChat.messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              <div className="text-center max-w-2xl">
                <h1 className="text-4xl font-bold mb-2 tracking-tight">
                  <span className="text-gray-400">Olá</span> {userName ? userName : "Usuário"} 
                </h1>
                <p className="text-2xl text-muted-foreground mb-10">
                  O que posso fazer por você?
                </p>
                
                <form onSubmit={handleSendMessage} className="relative max-w-lg mx-auto mb-8">
                  <div className="flex items-center">
                    <Input 
                      className="w-full py-7 pl-12 pr-4 rounded-full text-lg shadow-sm"
                      placeholder="Digite uma tarefa para Inventu trabalhar..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      autoFocus
                    />
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                  
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
                    <button 
                      type="button"
                      className="bg-primary/10 hover:bg-primary/20 text-primary p-2 rounded-full transition-colors"
                      title="Análise de imagens"
                    >
                      <Image className="h-5 w-5" />
                    </button>
                    
                    <button 
                      type="button"
                      className="bg-primary/10 hover:bg-primary/20 text-primary p-2 rounded-full transition-colors"
                      title="Pesquisas em tempo real"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                    </button>
                  </div>
                </form>
                
                <div className="grid grid-cols-1 gap-6 mt-12">
                  <div className="col-span-1">
                    <h3 className="text-lg font-medium text-left mb-3 flex items-center">
                      <Sparkles className="h-5 w-5 mr-2 text-primary" />
                      Destaques
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div>
          <ChatCategories />
        </div>
      </div>
    </div>
  );
};

export default Chat;
