
import React, { useState, useEffect, useRef } from "react";
import { useChat } from "@/contexts/ChatContext";
import { useToast } from "@/hooks/use-toast";
import { Check, X, ToggleRight, ToggleLeft, Paperclip } from "lucide-react";
import SuggestionBar from "@/components/SuggestionBar";
import SearchBarInput from "@/components/search/SearchBarInput";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { createNewChat, sendMessage } = useChat();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("");
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const [superAgentEnabled, setSuperAgentEnabled] = useState(false);
  const [isVibrating, setIsVibrating] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("inventu_user") || "{}");
    setUserName(user.name || "");
    
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Bom dia");
    else if (hour < 18) setGreeting("Boa tarde");
    else setGreeting("Boa noite");
  }, []);
  
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
    if (!message.trim()) return;
    
    if (superAgentEnabled) {
      toast({
        title: "God Mode Ativado",
        description: "Usando modelo avançado para processar sua mensagem",
      });
    }
    
    const tempMessage = message;
    setMessage("");
    
    // Show file information in toast if file is selected
    if (selectedFile) {
      toast({
        title: "Arquivo anexado",
        description: `${selectedFile.name} (${Math.round(selectedFile.size / 1024)} KB)`,
      });
    }
    
    createNewChat();
    
    navigate("/chat");
    
    setTimeout(() => {
      sendMessage(tempMessage);
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as unknown as React.FormEvent);
    }
  };
  
  const handleAttachmentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Trigger the hidden file input click
    fileInputRef.current?.click();
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast({
        title: "Arquivo selecionado",
        description: `${file.name} (${Math.round(file.size / 1024)} KB)`,
      });
    }
  };
  
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-screen bg-background">
      <div className="text-center max-w-2xl">
        <div className="flex justify-center mb-2">
          <div className="relative w-32 h-32">
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
              <div className={`relative border border-border/50 rounded-full ${isVibrating ? 'animate-vibrate' : ''}`}>
                <SearchBarInput 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  isSuperAgentEnabled={superAgentEnabled}
                  placeholder="Dê uma tarefa para Inventor trabalhar..."
                />
                
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                  <div 
                    className={`flex items-center gap-1 bg-secondary/50 hover:bg-secondary/70 px-2 py-1 rounded-full transition-colors cursor-pointer text-xs ${superAgentEnabled ? 'text-blue-500 font-semibold' : ''}`}
                    onClick={toggleSuperAgent} 
                    title="Ativar/Desativar God Mode"
                  >
                    {superAgentEnabled ? 
                      <ToggleRight className="h-3.5 w-3.5" /> : 
                      <ToggleLeft className="h-3.5 w-3.5" />
                    }
                    <span className="font-medium ml-1">God Mode</span>
                  </div>
                  
                  <button 
                    type="button"
                    className="bg-secondary/50 hover:bg-secondary/70 text-foreground p-2 rounded-full transition-colors"
                    onClick={handleAttachmentClick}
                    title="Anexar arquivo"
                  >
                    <Paperclip className="h-4 w-4" />
                  </button>
                  
                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                    // Accept various file types
                    accept="image/*,application/pdf,application/msword,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  />
                  
                  <button 
                    type="submit"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground p-2.5 rounded-full transition-colors"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </div>
              </div>
            </form>
            
            {/* File preview display when a file is selected */}
            {selectedFile && (
              <div className="px-4 py-2 bg-secondary/30 rounded-lg mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Paperclip className="h-4 w-4" />
                  <span className="text-sm truncate max-w-[250px]">{selectedFile.name}</span>
                  <span className="text-xs text-muted-foreground">({Math.round(selectedFile.size / 1024)} KB)</span>
                </div>
                <button 
                  onClick={() => setSelectedFile(null)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            
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
  );
};

export default Index;
