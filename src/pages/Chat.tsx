
import React, { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "@/components/ChatMessage";
import ChatSidebar from "@/components/ChatSidebar";
import { useChat } from "@/contexts/ChatContext";
import FloatingSearchBar from "@/components/FloatingSearchBar";
import { Loader2, Brain, Plus } from "lucide-react";
import MemoryConfirmationDialog from "@/components/orchestrator/MemoryConfirmationDialog";
import { useOrchestratorResponse } from "@/hooks/messaging/use-orchestrator-response";
import { useAgent } from "@/contexts/AgentContext";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import MemorySuggestionCard from "@/components/memory/MemorySuggestionCard";

const Chat: React.FC = () => {
  const { activeChat, createNewChat, sendMessage, isProcessing } = useChat();
  const { orchestratorConfig } = useAgent();
  const [showFloatingBar, setShowFloatingBar] = useState(false);
  const navigate = useNavigate();
  
  // Get orchestrator memory confirmation state
  const { 
    pendingMemoryConfirmation, 
    setPendingMemoryConfirmation,
    acceptMemorySuggestion,
    declineMemorySuggestion,
    memorySuggestions
  } = useOrchestratorResponse();
  
  const [memoryDialogOpen, setMemoryDialogOpen] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState<any>(null);
  
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
  
  // Effect to set current suggestion
  useEffect(() => {
    if (pendingMemoryConfirmation && !currentSuggestion) {
      setCurrentSuggestion(pendingMemoryConfirmation);
    }
  }, [pendingMemoryConfirmation, currentSuggestion]);
  
  const handleFloatingSearch = (searchText: string, file: File | null) => {
    // Now we also pass any selected file
    sendMessage(searchText, file);
  };
  
  const handleNewChat = () => {
    createNewChat();
    // Navigate to the chat page (stay on the same page, but with a fresh chat)
    navigate("/chat");
  };
  
  const handleAcceptSuggestion = () => {
    if (currentSuggestion) {
      acceptMemorySuggestion(currentSuggestion.id);
      setCurrentSuggestion(null);
    }
  };
  
  const handleDeclineSuggestion = () => {
    if (currentSuggestion) {
      declineMemorySuggestion(currentSuggestion.id);
      setCurrentSuggestion(null);
    }
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
      
      <div className="flex flex-col flex-1 h-full">
        <div className="flex flex-col flex-1">
          {isOrchestratorActive && (
            <div className="px-4 py-2">
              <Alert className="bg-primary/5 border-primary/20">
                <Brain className="h-4 w-4 text-primary" />
                <AlertTitle className="text-sm font-medium flex items-center gap-2">
                  Orquestrador Neural ativo
                  <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">
                    {orchestratorConfig.memory?.enabled !== false ? "Memória Ativa" : "Memória Desativada"}
                  </span>
                </AlertTitle>
              </Alert>
            </div>
          )}
          
          <ScrollArea className="flex-1 px-4 py-6">
            <div className="max-w-3xl mx-auto w-full py-4 space-y-6">
              {currentSuggestion && (
                <MemorySuggestionCard 
                  suggestion={currentSuggestion}
                  onAccept={handleAcceptSuggestion}
                  onDecline={handleDeclineSuggestion}
                />
              )}
              
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
      </div>
      
      {/* Memory Confirmation Dialog */}
      <MemoryConfirmationDialog
        open={memoryDialogOpen}
        setOpen={setMemoryDialogOpen}
        pendingConfirmation={pendingMemoryConfirmation}
      />
    </div>
  );
};

export default Chat;
