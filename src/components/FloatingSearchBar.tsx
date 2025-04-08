
import React, { useState, useRef, useEffect } from "react";
import { Search, Paperclip, ToggleRight, ToggleLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface FloatingSearchBarProps {
  onSend: (message: string) => void;
  onMinimize: () => void;
  initialMessage?: string;
}

const FloatingSearchBar: React.FC<FloatingSearchBarProps> = ({ 
  onSend, 
  onMinimize, 
  initialMessage = "" 
}) => {
  const [message, setMessage] = useState(initialMessage);
  const [superAgentEnabled, setSuperAgentEnabled] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = useState(false);
  const { toast } = useToast();
  const floatingBarRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const centerPosition = () => {
      if (floatingBarRef.current) {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const barWidth = 600;
        const barHeight = 60;
        
        const centerX = (windowWidth - barWidth) / 2;
        
        const fiveInCm = 5 * 37.8;
        const bottomY = windowHeight - barHeight - fiveInCm;
        
        setPosition({
          x: centerX,
          y: bottomY
        });
      }
    };
    
    centerPosition();
    
    window.addEventListener('resize', centerPosition);
    return () => {
      window.removeEventListener('resize', centerPosition);
    };
  }, []);
  
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
  
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const newX = Math.max(0, Math.min(window.innerWidth - 600, e.clientX - offset.x));
    const newY = Math.max(0, Math.min(window.innerHeight - 60, e.clientY - offset.y));
    
    setPosition({
      x: newX,
      y: newY
    });
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
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
  
  const handleToggleMinimize = () => {
    setIsMinimized(!isMinimized);
    
    if (!isMinimized) {
      onMinimize();
    }
  };

  return (
    <div 
      ref={floatingBarRef}
      className="fixed z-50 shadow-lg"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        pointerEvents: "auto"
      }}
    >
      <div 
        className={`bg-secondary/50 backdrop-blur-md border border-border/40 p-1 rounded-full relative transition-all duration-300 ease-in-out overflow-hidden`}
        style={{
          width: isMinimized ? "60px" : "600px",
          height: "60px",
          transform: "translateZ(0)",
          cursor: isDragging ? "grabbing" : "grab",
        }}
        onMouseDown={handleMouseDown}
      >
        <div 
          className="absolute right-1 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full z-20"
          onClick={(e) => {
            e.stopPropagation();
            handleToggleMinimize();
          }}
          ref={logoRef}
          style={{
            right: isMinimized ? "50%" : "1px",
            transform: isMinimized ? "translate(50%, -50%)" : "translateY(-50%)",
            transition: "right 0.3s ease-out, transform 0.3s ease-out",
            cursor: "pointer"
          }}
        >
          <img 
            src="/lovable-uploads/0bcb8607-8794-46a3-b29c-18186fe0a2bb.png" 
            alt="Logo" 
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>

        <div 
          className="flex items-center h-full"
          style={{
            opacity: isMinimized ? 0 : 1,
            visibility: isMinimized ? "hidden" : "visible",
            transition: "opacity 0.3s ease-out, visibility 0.3s"
          }}
        >
          <form onSubmit={handleSendMessage} className="flex items-center px-2 flex-1">
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FloatingSearchBar;
