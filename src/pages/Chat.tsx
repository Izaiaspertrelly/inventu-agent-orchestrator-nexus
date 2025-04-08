import React, { useEffect, useState, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "@/components/ChatMessage";
import ChatSidebar from "@/components/ChatSidebar";
import { useChat } from "@/contexts/ChatContext";
import { Paperclip, Search, X, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import SuggestionBar from "@/components/SuggestionBar";

const Chat: React.FC = () => {
  const { activeChat, createNewChat, sendMessage } = useChat();
  const [greeting, setGreeting] = useState("");
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const animationRef = useRef<HTMLDivElement>(null);
  
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
  
  useEffect(() => {
    if (animationRef.current) {
      const logoContainer = animationRef.current;
      logoContainer.innerHTML = '';
      
      const logoImg = document.createElement('img');
      logoImg.src = "/lovable-uploads/5c33ad20-fb0e-41b1-ae4a-ef5922b7de8b.png";
      logoImg.style.width = '100%';
      logoImg.style.height = '100%';
      logoImg.style.position = 'absolute';
      logoImg.style.top = '0';
      logoImg.style.left = '0';
      logoImg.style.opacity = '0';
      logoContainer.appendChild(logoImg);
      
      const dots = Array.from({ length: 22 }).map(() => {
        const dot = document.createElement('div');
        
        const size = Math.random() * 3 + 3;
        dot.style.width = `${size}px`;
        dot.style.height = `${size}px`;
        dot.style.backgroundColor = '#007AFF';
        dot.style.borderRadius = '50%';
        dot.style.position = 'absolute';
        
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 25 + 10;
        const x = Math.cos(angle) * distance + 50;
        const y = Math.sin(angle) * distance + 50;
        
        dot.style.left = `${x}%`;
        dot.style.top = `${y}%`;
        dot.style.opacity = (Math.random() * 0.5 + 0.5).toString();
        dot.style.transition = 'all 1.2s ease-in-out';
        
        dot.dataset.originX = x.toString();
        dot.dataset.originY = y.toString();
        
        return dot;
      });
      
      dots.forEach(dot => logoContainer.appendChild(dot));
      
      const animate = () => {
        dots.forEach(dot => {
          const originX = parseFloat(dot.dataset.originX || '50');
          const originY = parseFloat(dot.dataset.originY || '50');
          
          const offsetX = (Math.random() * 2) - 1; 
          const offsetY = (Math.random() * 2) - 1;
          
          dot.style.left = `${originX + offsetX}%`;
          dot.style.top = `${originY + offsetY}%`;
          
          setTimeout(() => {
            dot.style.left = `${originX}%`;
            dot.style.top = `${originY}%`;
          }, 800 + Math.random() * 400);
        });
        
        setTimeout(animate, 1800 + Math.random() * 600);
      };
      
      setTimeout(animate, 800);
    }
  }, []);
  
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
  
  const MessageInputBar = () => (
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
  );
  
  return (
    <div className="flex h-screen bg-background dark">
      <ChatSidebar />
      
      <div className="flex flex-col flex-1 h-full">
        <div className="flex-1 flex flex-col">
          {activeChat && activeChat.messages.length > 0 ? (
            <div className="flex flex-col flex-1">
              <ScrollArea className="flex-1 p-4">
                <div className="max-w-3xl mx-auto w-full py-4">
                  {activeChat.messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                </div>
              </ScrollArea>
              <div className="max-w-3xl mx-auto w-full px-4 py-4">
                <form onSubmit={handleSendMessage}>
                  <MessageInputBar />
                </form>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              <div className="text-center max-w-2xl">
                <div className="flex justify-center mb-2">
                  <div className="relative w-32 h-32" ref={animationRef}>
                    <img 
                      src="/lovable-uploads/5c33ad20-fb0e-41b1-ae4a-ef5922b7de8b.png" 
                      alt="Super Agent Logo" 
                      className="w-32 h-32 object-contain opacity-0"
                    />
                  </div>
                </div>
                
                <div className="flex flex-col items-center mb-2">
                  <h1 className="text-4xl font-bold mb-2 tracking-tight">
                    <span className="text-gray-400">Olá</span> {userName ? userName : "Usuário"}
                  </h1>
                </div>
                
                <div className="relative max-w-2xl w-full mx-auto mb-8">
                  <div className="flex flex-col gap-4">
                    <form onSubmit={handleSendMessage}>
                      <MessageInputBar />
                    </form>
                    
                    <div className="w-full p-3 rounded-2xl bg-secondary/30 backdrop-blur-sm border border-border/40 flex items-center">
                      <div className="rounded-xl bg-secondary/70 p-2 mr-3">
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5z"></path>
                          <line x1="8" y1="12" x2="16" y2="12"></line>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">
                          Autorize o Inventor a confirmar alguns de seus planos nos principais marcos
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-3">
                        <button className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-secondary/70 hover:bg-secondary/90 text-foreground text-xs transition-colors">
                          <X className="h-3 w-3" />
                          <span>Recusar</span>
                        </button>
                        <button className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs transition-colors">
                          <Check className="h-3 w-3" />
                          <span>Aceitar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-12 w-full">
                  <SuggestionBar />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
