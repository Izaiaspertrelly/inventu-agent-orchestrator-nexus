
import React, { useEffect, useState, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "@/components/ChatMessage";
import ChatSidebar from "@/components/ChatSidebar";
import { useChat } from "@/contexts/ChatContext";
import { Check, X } from "lucide-react";
import SuggestionBar from "@/components/SuggestionBar";
import { useToast } from "@/hooks/use-toast";
import { useAgent } from "@/contexts/AgentContext";
import FloatingSearchBar from "@/components/FloatingSearchBar";

const Chat: React.FC = () => {
  const { activeChat, createNewChat, sendMessage } = useChat();
  const { models } = useAgent();
  const { toast } = useToast();
  const [greeting, setGreeting] = useState("");
  const [userName, setUserName] = useState("");
  const [superAgentEnabled, setSuperAgentEnabled] = useState(false);
  const [isVibrating, setIsVibrating] = useState(false);
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
  
  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;
    
    if (superAgentEnabled) {
      toast({
        title: "God Mode Ativado",
        description: "Usando modelo avançado para processar sua mensagem",
      });
    }
    
    sendMessage(message);
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
  
  return (
    <div className="flex h-screen bg-background dark">
      <ChatSidebar />
      
      <div className="flex flex-col flex-1 h-full">
        {/* Floating search bar - always visible */}
        <FloatingSearchBar 
          onSendMessage={handleSendMessage}
          superAgentEnabled={superAgentEnabled}
          onToggleSuperAgent={toggleSuperAgent}
          isVibrating={isVibrating}
        />
        
        {activeChat && activeChat.messages.length > 0 ? (
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
