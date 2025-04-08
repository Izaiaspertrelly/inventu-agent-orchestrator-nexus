
import React, { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import DraggableContainer from "./draggable/DraggableContainer";
import SearchBarInput from "./search/SearchBarInput";
import SearchBarActions from "./search/SearchBarActions";
import FilePreview from "./search/FilePreview";
import { useFileAttachment } from "@/hooks/use-file-attachment";

interface FloatingSearchBarProps {
  onSend: (message: string, file?: File | null) => void;
  initialMessage?: string;
}

const FloatingSearchBar: React.FC<FloatingSearchBarProps> = ({ 
  onSend, 
  initialMessage = "" 
}) => {
  const [message, setMessage] = useState(initialMessage);
  const [superAgentEnabled, setSuperAgentEnabled] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const { toast } = useToast();
  const logoRef = useRef<HTMLImageElement>(null);
  
  // Use the shared file attachment hook
  const {
    selectedFile,
    fileInputRef,
    handleAttachmentClick,
    handleFileSelect,
    clearSelectedFile
  } = useFileAttachment();
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    if (superAgentEnabled) {
      toast({
        title: "God Mode Ativado",
        description: "Usando modelo avançado para processar sua mensagem",
      });
    }
    
    // Pass both message and file to the onSend callback
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
        className={`neo-blur rounded-full p-1 transition-all duration-300 flex items-center shadow-lg`}
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
        <div 
          className={`flex flex-col w-full transition-all duration-300`}
          style={{ 
            opacity: isMinimized ? 0 : 1,
            width: isMinimized ? '0' : 'auto',
            pointerEvents: isMinimized ? 'none' : 'auto',
          }}
        >
          <form 
            onSubmit={handleSendMessage} 
            className="flex items-center flex-1 px-2"
          >
            <div className="flex-1 pr-2">
              <SearchBarInput 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                isSuperAgentEnabled={superAgentEnabled}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            
            <div className="flex-shrink-0">
              <SearchBarActions 
                isSuperAgentEnabled={superAgentEnabled}
                onToggleSuperAgent={toggleSuperAgent}
                onSubmit={handleSendMessage}
                onAttachmentClick={handleAttachmentClick}
                fileInputRef={fileInputRef}
              />
            </div>
          </form>
          
          {/* File preview display when a file is selected */}
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
