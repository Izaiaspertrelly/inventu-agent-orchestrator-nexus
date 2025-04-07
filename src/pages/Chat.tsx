
import React, { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import ChatSidebar from "@/components/ChatSidebar";
import ChatCategories from "@/components/ChatCategories";
import { useChat } from "@/contexts/ChatContext";
import { Image } from "lucide-react";

const Chat: React.FC = () => {
  const { activeChat, createNewChat } = useChat();
  
  // Create an initial chat if none exists
  useEffect(() => {
    if (!activeChat) {
      createNewChat();
    }
  }, [activeChat, createNewChat]);
  
  return (
    <div className="flex h-screen bg-background dark">
      <ChatSidebar />
      
      <div className="flex flex-col flex-1 h-full">
        <div className="flex-1 flex flex-col">
          {activeChat && activeChat.messages.length > 0 ? (
            <ScrollArea className="flex-1 p-4">
              <div className="max-w-3xl mx-auto w-full py-4">
                {activeChat.messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              <div className="text-center max-w-md">
                <h2 className="text-2xl font-bold mb-2 inventu-gradient-text">
                  Inventu Super Agent
                </h2>
                <p className="text-muted-foreground mb-6">
                  Seu assistente inteligente que utiliza múltiplos modelos de IA e ferramentas para melhor atender suas necessidades.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="glass-panel p-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/20 mx-auto mb-3 flex items-center justify-center">
                      <Image className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium mb-1">Análise de Imagens</h3>
                    <p className="text-xs text-muted-foreground">
                      "Analise esta imagem para mim"
                    </p>
                  </div>
                  <div className="glass-panel p-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/20 mx-auto mb-3 flex items-center justify-center">
                      <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 6V12L16 14" />
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                    </div>
                    <h3 className="font-medium mb-1">Pesquisas em Tempo Real</h3>
                    <p className="text-xs text-muted-foreground">
                      "Busque informações atualizadas sobre..."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <ChatInput />
        </div>
        
        <div className="border-t">
          <ChatCategories />
        </div>
      </div>
    </div>
  );
};

export default Chat;
