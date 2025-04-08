
import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import DraggableContainer from "./draggable/DraggableContainer";
import SearchBarInput from "./search/SearchBarInput";
import SearchBarActions from "./search/SearchBarActions";

interface FloatingSearchBarProps {
  onSend: (message: string) => void;
  onClose: () => void;
  initialMessage?: string;
}

const FloatingSearchBar: React.FC<FloatingSearchBarProps> = ({ 
  onSend, 
  onClose, 
  initialMessage = "" 
}) => {
  const [message, setMessage] = useState(initialMessage);
  const [superAgentEnabled, setSuperAgentEnabled] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const { toast } = useToast();
  const logoRef = useRef<HTMLImageElement>(null);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    if (superAgentEnabled) {
      toast({
        title: "God Mode Ativado",
        description: "Usando modelo avançado para processar sua mensagem",
      });
    }
    
    onSend(message);
    setMessage("");
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as unknown as React.FormEvent);
    }
  };
  
  const toggleSuperAgent = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSuperAgentEnabled(!superAgentEnabled);
    toast({
      title: superAgentEnabled ? "God Mode Desativado" : "God Mode Ativado",
      description: superAgentEnabled 
        ? "Voltando ao modelo padrão" 
        : "Usando o modelo avançado para respostas melhores",
    });
  };
  
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };
  
  return (
    <DraggableContainer isMinimized={isMinimized}>
      <div 
        className={`bg-secondary/50 backdrop-blur-md rounded-full border border-border/40 p-1 transition-all duration-300 flex items-center`}
        style={{ 
          width: isMinimized ? '50px' : '600px',
          overflow: 'hidden'
        }}
      >
        {/* Logo for minimized state */}
        <div 
          className="min-w-[40px] h-[40px] flex items-center justify-center cursor-pointer"
          onClick={toggleMinimize}
        >
          <img 
            ref={logoRef}
            src="/lovable-uploads/5c33ad20-fb0e-41b1-ae4a-ef5922b7de8b.png" 
            alt="Logo" 
            className="w-8 h-8 object-contain" 
          />
        </div>

        {/* Search bar content - visible when not minimized */}
        <form 
          onSubmit={handleSendMessage} 
          className={`flex items-center flex-1 px-2 transition-all duration-300`}
          style={{ 
            opacity: isMinimized ? 0 : 1,
            width: isMinimized ? '0' : 'auto',
            pointerEvents: isMinimized ? 'none' : 'auto',
          }}
        >
          <SearchBarInput 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            isSuperAgentEnabled={superAgentEnabled}
            onClick={(e) => e.stopPropagation()}
          />
          
          <SearchBarActions 
            isSuperAgentEnabled={superAgentEnabled}
            onToggleSuperAgent={toggleSuperAgent}
            onClose={onClose}
            onSubmit={handleSendMessage}
          />
        </form>
      </div>
    </DraggableContainer>
  );
};

export default FloatingSearchBar;
