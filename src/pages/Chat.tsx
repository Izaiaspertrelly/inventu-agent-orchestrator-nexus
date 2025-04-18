
import React, { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "@/components/ChatMessage";
import ChatSidebar from "@/components/ChatSidebar";
import { useChat } from "@/contexts/ChatContext";
import FloatingSearchBar from "@/components/FloatingSearchBar";
import { Loader2, Brain, Plus, Terminal } from "lucide-react";
import MemoryConfirmationDialog from "@/components/orchestrator/MemoryConfirmationDialog";
import { useOrchestratorResponse } from "@/hooks/messaging/use-orchestrator-response";
import { useAgent } from "@/contexts/AgentContext";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import OrchestratorTerminal from "@/components/terminal/OrchestratorTerminal";

const Chat: React.FC = () => {
  const { 
    activeChat, 
    createNewChat, 
    sendMessage, 
    isProcessing, 
    // Terminal related
    terminalOpen,
    terminalMinimized,
    terminalLines,
    toggleTerminal
  } = useChat();
  const { orchestratorConfig } = useAgent();
  const [showFloatingBar, setShowFloatingBar] = useState(false);
  const navigate = useNavigate();
  
  // Get orchestrator memory confirmation state
  const { pendingMemoryConfirmation, setPendingMemoryConfirmation } = useOrchestratorResponse();
  const [memoryDialogOpen, setMemoryDialogOpen] = useState(false);
  
  useEffect(() => {
    if (!activeChat) {
      createNewChat();
    }
    
    // Always show the floating search bar in chat view
    // Either immediately or after first message
    if (activeChat && activeChat.messages.length > 0) {
      setShowFloatingBar(true);
    } else {
      // Add slight delay to show floating bar if no messages yet
      const timer = setTimeout(() => setShowFloatingBar(true), 300);
      return () => clearTimeout(timer);
    }
  }, [activeChat, createNewChat]);
  
  // Effect to open dialog when there are pending confirmations
  useEffect(() => {
    if (pendingMemoryConfirmation) {
      setMemoryDialogOpen(true);
    } else {
      setMemoryDialogOpen(false);
    }
  }, [pendingMemoryConfirmation]);
  
  const handleFloatingSearch = (searchText: string, file: File | null) => {
    // Now we also pass any selected file
    sendMessage(searchText, file);
  };
  
  const handleNewChat = () => {
    createNewChat();
    // Navigate to the chat page (stay on the same page, but with a fresh chat)
    navigate("/chat");
  };
  
  const isOrchestratorActive = orchestratorConfig && 
    Object.keys(orchestratorConfig).length > 0 && 
    orchestratorConfig.selectedModel;
  
  return (
    <div className="flex h-screen bg-background dark">
      <ChatSidebar />
      
      {showFloatingBar && (
        <FloatingSearchBar 
          onSend={handleFloatingSearch}
          initialMessage=""
          isProcessing={isProcessing}
        />
      )}
      
      <div className="flex flex-1 h-full">
        {/* Chat Messages Section */}
        <div className="flex flex-col flex-1 h-full">
          {isOrchestratorActive && (
            <div className="px-4 py-2">
              <Alert className="bg-primary/5 border-primary/20">
                <Brain className="h-4 w-4 text-primary" />
                <AlertTitle className="text-sm font-medium flex items-center gap-2">
                  Orquestrador Neural ativo
                  <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">
                    {orchestratorConfig.memory?.enabled !== false ? "Memória Ativa" : "Memória Desativada"}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleTerminal}
                    className="ml-auto flex items-center gap-1.5 text-xs h-7 px-2"
                  >
                    <Terminal className="h-3.5 w-3.5" />
                    {terminalOpen ? (terminalMinimized ? "Expandir" : "Minimizar") : "Terminal"}
                  </Button>
                </AlertTitle>
              </Alert>
            </div>
          )}
          
          <ScrollArea className="flex-1 px-4 py-6">
            <div className="max-w-3xl mx-auto w-full py-4 space-y-6">
              {activeChat && activeChat.messages.length > 0 ? (
                activeChat.messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))
              ) : (
                <div className="flex flex-col justify-center items-center h-[60vh] text-center">
                  <div className="w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-foreground mb-2">Iniciar nova conversa</h3>
                  <p className="text-muted-foreground max-w-sm mb-6">
                    Use a barra de pesquisa flutuante para enviar uma mensagem e começar a conversar
                    {isOrchestratorActive ? " com o Orquestrador Neural" : ""}
                  </p>
                  
                  <Button 
                    onClick={handleNewChat} 
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Nova conversa
                  </Button>
                </div>
              )}
              
              {isProcessing && (
                <div className="flex items-center justify-center p-4">
                  <div className="flex items-center space-x-2 bg-secondary/50 rounded-full px-4 py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <p className="text-sm">Processando mensagem...</p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        
        {/* Terminal Section - Only show when open and not minimized */}
        {terminalOpen && !terminalMinimized && (
          <div className="w-1/3 min-w-80 max-w-md h-full">
            <OrchestratorTerminal
              isOpen={terminalOpen}
              onMinimize={toggleTerminal}
              lines={terminalLines}
              isProcessing={isProcessing}
              minimized={terminalMinimized}
            />
          </div>
        )}
      </div>
      
      {/* Memory Confirmation Dialog */}
      <MemoryConfirmationDialog
        open={memoryDialogOpen}
        setOpen={setMemoryDialogOpen}
        pendingConfirmation={pendingMemoryConfirmation}
      />
      
      {/* Minimized Terminal */}
      {terminalOpen && terminalMinimized && (
        <OrchestratorTerminal
          isOpen={terminalOpen}
          onMinimize={toggleTerminal}
          lines={terminalLines}
          isProcessing={isProcessing}
          minimized={terminalMinimized}
        />
      )}
    </div>
  );
};

export default Chat;
