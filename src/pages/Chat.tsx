
import React, { useEffect, useState, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "@/components/ChatMessage";
import ChatSidebar from "@/components/ChatSidebar";
import { useChat } from "@/contexts/ChatContext";
import { Paperclip, Search, X, Check, ToggleRight, ToggleLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import SuggestionBar from "@/components/SuggestionBar";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAgent } from "@/contexts/AgentContext";
import FloatingSearchBar from "@/components/FloatingSearchBar";

const Chat: React.FC = () => {
  const { activeChat, createNewChat, sendMessage } = useChat();
  const { models } = useAgent();
  const { toast } = useToast();
  const [greeting, setGreeting] = useState("");
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const [superAgentEnabled, setSuperAgentEnabled] = useState(false);
  const [isVibrating, setIsVibrating] = useState(false);
  const [showFloatingBar, setShowFloatingBar] = useState(false);
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
    
    if (activeChat) {
      setShowFloatingBar(activeChat.messages.length > 0);
    }
  }, [activeChat, createNewChat]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    if (superAgentEnabled) {
      toast({
        title: "God Mode Ativado",
        description: "Usando modelo avançado para processar sua mensagem",
      });
    }
    
    const currentMessage = message;
    setMessage("");
    setShowFloatingBar(true);
    await sendMessage(currentMessage);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as unknown as React.FormEvent);
    }
  };
  
  const toggleSuperAgent = () => {
    setIsVibrating(true);
    setSuperAgentEnabled(!superAgentEnabled);
    setTimeout(() => {
      setIsVibrating(false);
    }, 1500);
    toast({
      title: superAgentEnabled ? "God Mode Desativado" : "God Mode Ativado",
      description: superAgentEnabled 
        ? "Voltando ao modelo padrão" 
        : "Usando o modelo avançado para respostas melhores",
    });
  };
  
  const handleFloatingSearch = (searchText: string) => {
    sendMessage(searchText);
  };
  
  const MessageInputBar: React.FC = () => {
    return (
      <div className="relative">
        <Input 
          className={`w-full py-3.5 px-4 pl-12 pr-4 rounded-full text-lg backdrop-blur-sm border border-border/40 transition-all duration-300 
            ${superAgentEnabled 
              ? `bg-blue-500 text-white placeholder:text-white/70 ${isVibrating ? 'animate-vibrate' : ''}` 
              : 'bg-secondary/30 placeholder:text-muted-foreground/70'}`}
          placeholder="Dê uma tarefa para Inventor trabalhar..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${superAgentEnabled ? 'text-white/70' : 'text-muted-foreground/70'}`} />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          <div 
            className={`flex items-center gap-1 bg-secondary/50 hover:bg-secondary/70 px-2 py-1 rounded-full transition-colors cursor-pointer text-xs ${superAgentEnabled ? 'text-blue-500 font-semibold' : ''}`}
            onClick={toggleSuperAgent} 
            title="Ativar/Desativar God Mode"
          >
            {superAgentEnabled ? 
              <ToggleRight className="h-3 w-3" /> : 
              <ToggleLeft className="h-3 w-3" />
            }
            <span className="font-medium ml-1">God Mode</span>
          </div>
          
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
  };
  
  const isActiveConversation = activeChat && activeChat.messages.length > 0;
  
  return (
    <div className="flex h-screen bg-background dark">
      <ChatSidebar />
      
      {showFloatingBar && (
        <FloatingSearchBar 
          onSend={handleFloatingSearch}
          onMinimize={() => {}} // Empty function since minimizing is now handled internally
          initialMessage={message}
        />
      )}
      
      <div className="flex flex-col flex-1 h-full">
        {isActiveConversation ? (
          <div className="flex flex-col flex-1">
            <ScrollArea className="flex-1 p-4">
              <div className="max-w-3xl mx-auto w-full py-4">
                {activeChat.messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <div className="text-center max-w-2xl">
              <div className="flex justify-center mb-2">
                <div className="relative w-32 h-32" ref={animationRef}>
                  <img 
                    src="/lovable-uploads/5c33ad20-fb0e-41b1-ae4a-ef5922b7de8b.png" 
                    alt="Super Agent Logo" 
                    className="w-32 h-32 object-contain"
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
  );
};

export default Chat;
