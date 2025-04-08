import React, { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "@/components/ChatMessage";
import ChatSidebar from "@/components/ChatSidebar";
import ChatCategories from "@/components/ChatCategories";
import { useChat } from "@/contexts/ChatContext";
import { Paperclip, Search, Sparkles, X, Check } from "lucide-react";
import { Input } from "@/components/ui/input";

const Chat: React.FC = () => {
  const { activeChat, createNewChat, sendMessage } = useChat();
  const [greeting, setGreeting] = useState("");
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  
  useEffect(() => {
    if (!activeChat) {
      createNewChat();
    }
    
    const user = JSON.parse(localStorage.getItem("inventu_user") || "{}");
    setUserName(user.name || "");
    
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
                
                <div className="relative max-w-2xl w-full mx-auto mb-8">
                  <div className="flex flex-col gap-4">
                    <div className="relative">
                      <Input 
                        className="w-full py-3.5 px-4 pl-12 pr-4 rounded-full text-lg bg-secondary/30 backdrop-blur-sm border border-border/40 placeholder:text-muted-foreground/70"
                        placeholder="Dê uma tarefa para Inventor trabalhar..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                      />
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground/70" />
                      
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                        <button 
                          type="button"
                          className="bg-secondary/50 hover:bg-secondary/70 text-foreground p-2.5 rounded-full transition-colors"
                          title="Anexar arquivo"
                        >
                          <Paperclip className="h-5 w-5" />
                        </button>
                        <button 
                          type="submit"
                          onClick={handleSendMessage}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground p-2.5 rounded-full transition-colors"
                        >
                          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="w-full p-4 rounded-2xl bg-secondary/30 backdrop-blur-sm border border-border/40 flex items-center">
                      <div className="rounded-xl bg-secondary/70 p-2.5 mr-4">
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5z"></path>
                          <line x1="8" y1="12" x2="16" y2="12"></line>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-base">
                          Autorize o Inventor a confirmar alguns de seus planos nos principais marcos
                        </p>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-secondary/70 hover:bg-secondary/90 text-foreground transition-colors">
                          <X className="h-4 w-4" />
                          <span>Recusar</span>
                        </button>
                        <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground transition-colors">
                          <Check className="h-4 w-4" />
                          <span>Aceitar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
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
