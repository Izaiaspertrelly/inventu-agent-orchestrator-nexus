
import React, { useState, useRef, useEffect } from "react";
import { Search, Paperclip, ToggleRight, ToggleLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface FloatingSearchBarProps {
  onSendMessage: (message: string) => void;
  superAgentEnabled: boolean;
  onToggleSuperAgent: () => void;
  isVibrating: boolean;
}

const FloatingSearchBar: React.FC<FloatingSearchBarProps> = ({
  onSendMessage,
  superAgentEnabled,
  onToggleSuperAgent,
  isVibrating,
}) => {
  const [message, setMessage] = useState("");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const searchBarRef = useRef<HTMLDivElement>(null);

  // Initialize position in the center-bottom of the screen
  useEffect(() => {
    if (searchBarRef.current) {
      const width = searchBarRef.current.offsetWidth;
      const height = searchBarRef.current.offsetHeight;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      setPosition({
        x: (windowWidth - width) / 2,
        y: windowHeight - height - 40, // 40px from bottom
      });
    }
  }, []);

  // Handle drag start
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLButtonElement) return; // Don't start drag if clicking buttons
    
    const rect = searchBarRef.current?.getBoundingClientRect();
    if (rect) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  // Handle drag
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Ensure the search bar stays within viewport bounds
      if (searchBarRef.current) {
        const width = searchBarRef.current.offsetWidth;
        const height = searchBarRef.current.offsetHeight;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        const boundedX = Math.max(0, Math.min(newX, windowWidth - width));
        const boundedY = Math.max(0, Math.min(newY, windowHeight - height));
        
        setPosition({
          x: boundedX,
          y: boundedY,
        });
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSendMessage(message);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as unknown as React.FormEvent);
    }
  };

  return (
    <div 
      className={`fixed z-50 shadow-lg rounded-2xl bg-[#222]/80 backdrop-blur-md p-4 w-[600px] max-w-[90vw] cursor-move ${isDragging ? 'pointer-events-none' : ''}`}
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
      }}
      ref={searchBarRef}
      onMouseDown={handleMouseDown}
    >
      <div className="flex items-center mb-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 mr-4 flex-shrink-0"></div>
        <p className="text-white text-lg font-medium">Olá! no que posso te ajudar?</p>
      </div>
      
      <form onSubmit={handleSendMessage} className="relative">
        <Input 
          className={`w-full py-3.5 px-4 pl-12 pr-4 rounded-full text-base backdrop-blur-sm border border-gray-700/40 transition-all duration-300 
            ${superAgentEnabled 
              ? `bg-blue-500 text-white placeholder:text-white/70 ${isVibrating ? 'animate-vibrate' : ''}` 
              : 'bg-[#ffffff]/10 text-white placeholder:text-gray-400'}`}
          placeholder="Digite aqui o seu comando."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          onClick={(e) => e.stopPropagation()} // Prevent dragging when clicking in input
        />
        <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${superAgentEnabled ? 'text-white/70' : 'text-gray-400'}`} />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          <div 
            className={`flex items-center gap-1 bg-gray-800/50 hover:bg-gray-700/50 px-2 py-1 rounded-full transition-colors cursor-pointer text-xs ${superAgentEnabled ? 'text-blue-300 font-semibold' : 'text-gray-300'}`}
            onClick={(e) => { e.stopPropagation(); onToggleSuperAgent(); }}
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
            className="bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 p-2.5 rounded-full transition-colors"
            title="Anexar arquivo"
            onClick={(e) => e.stopPropagation()}
          >
            <Paperclip className="h-5 w-5" />
          </button>
          
          <button 
            type="submit"
            onClick={(e) => { e.stopPropagation(); handleSendMessage(e); }}
            className="bg-primary hover:bg-primary/90 text-primary-foreground p-2.5 rounded-full transition-colors"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default FloatingSearchBar;
