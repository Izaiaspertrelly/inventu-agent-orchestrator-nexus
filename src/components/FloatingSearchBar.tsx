
import React, { useState, useRef, useEffect } from "react";
import { Search, X, Paperclip, ToggleRight, ToggleLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface FloatingSearchBarProps {
  onSend: (message: string) => void;
  onClose: () => void;
  initialMessage?: string;  // New prop to pass initial message
}

const FloatingSearchBar: React.FC<FloatingSearchBarProps> = ({ 
  onSend, 
  onClose, 
  initialMessage = "" 
}) => {
  const [message, setMessage] = useState(initialMessage);
  const [superAgentEnabled, setSuperAgentEnabled] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth / 2 - 250, y: 80 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const { toast } = useToast();
  const floatingBarRef = useRef<HTMLDivElement>(null);
  
  // Handle drag start
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (floatingBarRef.current) {
      const rect = floatingBarRef.current.getBoundingClientRect();
      setOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };
  
  // Handle dragging
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    // Calculate new position with boundaries to keep on screen
    const newX = Math.max(0, Math.min(window.innerWidth - 500, e.clientX - offset.x));
    const newY = Math.max(0, Math.min(window.innerHeight - 60, e.clientY - offset.y));
    
    setPosition({
      x: newX,
      y: newY
    });
  };
  
  // Handle drag end
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Set up and remove event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);
  
  useEffect(() => {
    // Ensure the floating bar is visible initially
    const centerX = window.innerWidth / 2 - 250;
    setPosition({ x: centerX, y: 80 });
  }, []);
  
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
  
  const toggleSuperAgent = () => {
    setSuperAgentEnabled(!superAgentEnabled);
    toast({
      title: superAgentEnabled ? "God Mode Desativado" : "God Mode Ativado",
      description: superAgentEnabled 
        ? "Voltando ao modelo padrão" 
        : "Usando o modelo avançado para respostas melhores",
    });
  };
  
  return (
    <div 
      ref={floatingBarRef}
      className="fixed z-50 shadow-lg rounded-full"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        width: "600px",  // Increased width to ensure text fits
      }}
    >
      <div 
        className="bg-secondary/50 backdrop-blur-md rounded-full border border-border/40 p-1"
        onMouseDown={handleMouseDown}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        <form onSubmit={handleSendMessage} className="flex items-center px-2">
          <div className="flex-1 relative">
            <Input 
              className={`w-full py-3 px-4 pl-10 rounded-full text-base backdrop-blur-sm border-0 
                ${superAgentEnabled 
                  ? 'bg-blue-500 text-white placeholder:text-white/70' 
                  : 'bg-secondary/30 placeholder:text-muted-foreground/70'}`}
              placeholder="Dê uma tarefa para Inventor trabalhar..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onClick={(e) => e.stopPropagation()}
            />
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${superAgentEnabled ? 'text-white/70' : 'text-muted-foreground/70'}`} />
          </div>
          
          <div className="flex items-center gap-1.5 pl-2">
            <div 
              className={`flex items-center gap-1 bg-secondary/50 hover:bg-secondary/70 px-2 py-1 rounded-full transition-colors cursor-pointer text-xs ${superAgentEnabled ? 'text-blue-500 font-semibold' : ''}`}
              onClick={(e) => { e.stopPropagation(); toggleSuperAgent(); }}
              title="Ativar/Desativar God Mode"
            >
              {superAgentEnabled ? 
                <ToggleRight className="h-3 w-3" /> : 
                <ToggleLeft className="h-3 w-3" />
              }
              <span className="font-medium">God Mode</span>
            </div>
            
            <button 
              type="button"
              className="bg-secondary/50 hover:bg-secondary/70 text-foreground p-1.5 rounded-full transition-colors"
              title="Anexar arquivo"
              onClick={(e) => e.stopPropagation()}
            >
              <Paperclip className="h-4 w-4" />
            </button>
            
            <button 
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground p-1.5 rounded-full transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
            
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="bg-secondary/50 hover:bg-secondary/90 text-foreground p-1.5 rounded-full transition-colors"
              title="Fechar barra de pesquisa"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FloatingSearchBar;

