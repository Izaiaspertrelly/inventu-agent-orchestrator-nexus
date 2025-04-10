
import React, { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import DraggableContainer from "./draggable/DraggableContainer";
import SearchBarInput from "./search/SearchBarInput";
import SearchBarActions from "./search/SearchBarActions";
import FilePreview from "./search/FilePreview";
import { useFileAttachment } from "@/hooks/use-file-attachment";
import { Loader2 } from "lucide-react";

interface FloatingSearchBarProps {
  onSend: (message: string, file?: File | null) => void;
  initialMessage?: string;
  isProcessing?: boolean;
}

const FloatingSearchBar: React.FC<FloatingSearchBarProps> = ({ 
  onSend, 
  initialMessage = "",
  isProcessing = false
}) => {
  const [message, setMessage] = useState(initialMessage);
  const [superAgentEnabled, setSuperAgentEnabled] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVibrating, setIsVibrating] = useState(false);
  const { toast } = useToast();
  const logoRef = useRef<HTMLImageElement>(null);
  
  const {
    selectedFile,
    fileInputRef,
    handleAttachmentClick,
    handleFileSelect,
    clearSelectedFile
  } = useFileAttachment();
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !selectedFile) return;
    if (isProcessing) return;
    
    if (superAgentEnabled) {
      toast({
        title: "God Mode Ativado",
        description: "Usando modelo avançado para processar sua mensagem",
      });
    }
    
    onSend(message, selectedFile);
    setMessage("");
    clearSelectedFile();
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as unknown as React.FormEvent);
    }
  };
  
  const toggleSuperAgent = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVibrating(true);
    setSuperAgentEnabled(!superAgentEnabled);
    
    // Reset vibration after animation completes
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
  
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };
  
  return (
    <DraggableContainer isMinimized={isMinimized}>
      <div 
        className={`neo-blur rounded-full p-1 transition-all duration-300 flex items-center shadow-lg ${isVibrating ? 'animate-vibrate' : ''}`}
        style={{ 
          width: isMinimized ? '50px' : '600px',
          overflow: 'hidden'
        }}
      >
        <div 
          className="min-w-[40px] h-[40px] flex items-center justify-center cursor-pointer"
          onClick={toggleMinimize}
        >
          {isProcessing ? (
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          ) : (
            <img 
              ref={logoRef}
              src="/lovable-uploads/5c33ad20-fb0e-41b1-ae4a-ef5922b7de8b.png" 
              alt="Logo" 
              className="w-8 h-8 object-contain" 
            />
          )}
        </div>

        <div 
          className="flex flex-col flex-1 transition-all duration-300"
          style={{ 
            opacity: isMinimized ? 0 : 1,
            width: isMinimized ? '0' : 'auto',
            pointerEvents: isMinimized ? 'none' : 'auto',
          }}
        >
          <form 
            onSubmit={handleSendMessage} 
            className="flex items-center w-full"
          >
            <div className="flex-1 min-w-0 ml-2">
              <SearchBarInput 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                isSuperAgentEnabled={superAgentEnabled}
                onClick={(e) => e.stopPropagation()}
                inputClassName="floating-search-input"
                containerClassName="w-full"
                disabled={isProcessing}
              />
            </div>
            
            <div className="flex-shrink-0 ml-auto">
              <SearchBarActions 
                isSuperAgentEnabled={superAgentEnabled}
                onToggleSuperAgent={toggleSuperAgent}
                onSubmit={handleSendMessage}
                onAttachmentClick={handleAttachmentClick}
                fileInputRef={fileInputRef}
                isProcessing={isProcessing}
              />
            </div>
          </form>
          
          {selectedFile && (
            <div className="px-2 pb-1">
              <FilePreview file={selectedFile} onClear={clearSelectedFile} />
            </div>
          )}
        </div>
      </div>
    </DraggableContainer>
  );
};

export default FloatingSearchBar;
