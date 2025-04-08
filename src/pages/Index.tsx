
import React, { useState, useEffect } from "react";
import { useChat } from "@/contexts/ChatContext";
import { useToast } from "@/hooks/use-toast";
import { Check, X, ToggleRight, ToggleLeft, Paperclip } from "lucide-react";
import SuggestionBar from "@/components/SuggestionBar";
import SearchBarInput from "@/components/search/SearchBarInput";
import SearchBarActions from "@/components/search/SearchBarActions";
import FilePreview from "@/components/search/FilePreview";
import { useFileAttachment } from "@/hooks/use-file-attachment";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SidebarIcon from "@/components/icons/SidebarIcon";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarProvider,
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarFooter
} from "@/components/ui/sidebar";
import { Home, MessageSquare, Settings, User } from "lucide-react";

const Index = () => {
  const { createNewChat, sendMessage } = useChat();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("");
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const [superAgentEnabled, setSuperAgentEnabled] = useState(false);
  const [isVibrating, setIsVibrating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Use the shared file attachment hook
  const {
    selectedFile,
    fileInputRef,
    handleAttachmentClick,
    handleFileSelect,
    clearSelectedFile
  } = useFileAttachment();
  
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
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    toast({
      title: sidebarOpen ? "Menu lateral fechado" : "Menu lateral aberto",
      description: "Funcionalidade em desenvolvimento",
    });
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !selectedFile) return;
    
    if (superAgentEnabled) {
      toast({
        title: "God Mode Ativado",
        description: "Usando modelo avançado para processar sua mensagem",
      });
    }
    
    const tempMessage = message;
    setMessage("");
    
    // Store the file before clearing it
    const tempFile = selectedFile;
    clearSelectedFile();
    
    // Create new chat and navigate
    createNewChat();
    navigate("/chat");
    
    // Send message with delay to ensure navigation is complete
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
    <SidebarProvider defaultOpen={sidebarOpen} open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="flex min-h-screen w-full bg-background">
        {/* Sidebar */}
        <Sidebar side="left">
          <SidebarHeader className="px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img 
                  src="/lovable-uploads/5c33ad20-fb0e-41b1-ae4a-ef5922b7de8b.png" 
                  alt="Logo" 
                  className="w-8 h-8 object-contain"
                />
                <h3 className="font-semibold text-lg">Inventor</h3>
              </div>
              <div>
                <SidebarIcon 
                  className="h-5 w-5 text-sidebar-foreground" 
                  onClick={toggleSidebar}
                />
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate("/")} isActive={true} tooltip="Início">
                  <Home className="mr-2 h-4 w-4" />
                  <span>Início</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate("/chat")} tooltip="Conversas">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Conversas</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Configurações">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          
          <SidebarFooter className="px-4 py-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">{userName || "Usuário"}</p>
                <p className="text-xs text-muted-foreground">Plano Básico</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          {/* Sidebar toggle button */}
          <div className="absolute top-4 left-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10 rounded-full hover:bg-accent/50"
              onClick={toggleSidebar}
            >
              <SidebarIcon className="h-5 w-5" />
            </Button>
          </div>

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
                      <SearchBarActions 
                        isSuperAgentEnabled={superAgentEnabled}
                        onToggleSuperAgent={toggleSuperAgent}
                        onSubmit={handleSendMessage}
                        onAttachmentClick={handleAttachmentClick}
                        fileInputRef={fileInputRef}
                      />
                    </div>
                  </div>
                </form>
                
                {/* File preview when a file is selected */}
                {selectedFile && (
                  <FilePreview file={selectedFile} onClear={clearSelectedFile} />
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
      </div>
    </SidebarProvider>
  );
};

export default Index;
