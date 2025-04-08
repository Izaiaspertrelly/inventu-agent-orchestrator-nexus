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

const Chat: React.FC = () => {
  const { activeChat, createNewChat, sendMessage } = useChat();
  const { models } = useAgent();
  const { toast } = useToast();
  const [greeting, setGreeting] = useState("");
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const [superAgentEnabled, setSuperAgentEnabled] = useState(false);
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
    // This is intentionally left empty to remove the previous custom animation
  }, []);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // If superAgent is enabled, we can handle the message differently
    if (superAgentEnabled) {
      toast({
        title: "Super Agent Ativado",
        description: "Usando modelo avançado para processar sua mensagem",
      });
    }
    
    sendMessage(message);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as unknown as React.FormEvent);
    }
  };
  
  const toggleSuperAgent = () => {
    setSuperAgentEnabled(!superAgentEnabled);
    toast({
      title: superAgentEnabled ? "Super Agent Desativado" : "Super Agent Ativado",
      description: superAgentEnabled 
        ? "Voltando ao modelo padrão" 
        : "Usando o modelo avançado para respostas melhores",
    });
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
        <div 
          className={`flex items-center gap-1 bg-secondary/50 hover:bg-secondary/70 px-2 py-1 rounded-full transition-colors cursor-pointer text-xs ${superAgentEnabled ? 'text-primary' : ''}`}
          onClick={toggleSuperAgent} 
          title="Ativar/Desativar Super Agent"
        >
          {superAgentEnabled ? 
            <ToggleRight className="h-3 w-3" /> : 
            <ToggleLeft className="h-3 w-3" />
          }
          <span className="font-medium ml-1">Super Agent</span>
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

export default Chat;
