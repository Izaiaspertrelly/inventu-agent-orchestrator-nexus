import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useChat } from "@/contexts/ChatContext";
import { useFileAttachment } from "@/hooks/use-file-attachment";
import SearchBarInput from "@/components/search/SearchBarInput";
import SearchBarActions from "@/components/search/SearchBarActions";
import FilePreview from "@/components/search/FilePreview";
import NotificationCard from "@/components/home/NotificationCard";

interface SearchFormProps {
  isProcessing: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ isProcessing }) => {
  const { createNewChat, sendMessage } = useChat();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [superAgentEnabled, setSuperAgentEnabled] = useState(false);
  const [isVibrating, setIsVibrating] = useState(false);
  
  const {
    selectedFile,
    fileInputRef,
    handleAttachmentClick,
    handleFileSelect,
    clearSelectedFile
  } = useFileAttachment();
  
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
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !selectedFile) return;
    if (isProcessing) return;
    
    if (superAgentEnabled) {
      toast({
        title: "God Mode Ativado",
        description: "Usando modelo avançado para processar sua mensagem",
      });
    }
    
    const tempMessage = message;
    setMessage("");
    
    const tempFile = selectedFile;
    clearSelectedFile();
    
    const chat = createNewChat();
    navigate("/chat");
    
    setTimeout(() => {
      sendMessage(tempMessage, tempFile);
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as unknown as React.FormEvent);
    }
  };
  
  return (
    <div className="relative max-w-2xl w-full mx-auto mb-8">
      <div className="flex flex-col gap-4">
        <form onSubmit={handleSendMessage}>
          <div className={`relative border border-border/50 rounded-full ${isVibrating ? 'animate-vibrate' : ''}`}>
            <SearchBarInput 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              isSuperAgentEnabled={superAgentEnabled}
              placeholder="Dê uma tarefa para Inventor trabalhar..."
              disabled={isProcessing}
            />
            
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              <SearchBarActions 
                isSuperAgentEnabled={superAgentEnabled}
                onToggleSuperAgent={toggleSuperAgent}
                onSubmit={handleSendMessage}
                onAttachmentClick={handleAttachmentClick}
                fileInputRef={fileInputRef}
                isProcessing={isProcessing}
              />
            </div>
          </div>
        </form>
        
        {selectedFile && (
          <FilePreview file={selectedFile} onClear={clearSelectedFile} />
        )}
        
        <NotificationCard />
      </div>
    </div>
  );
};

export default SearchForm;
