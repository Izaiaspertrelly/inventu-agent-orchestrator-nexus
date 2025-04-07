
import React, { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import ChatSidebar from "@/components/ChatSidebar";
import ChatCategories from "@/components/ChatCategories";
import { useChat } from "@/contexts/ChatContext";
import { Image, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const Chat: React.FC = () => {
  const { activeChat, createNewChat } = useChat();
  const [greeting, setGreeting] = useState("");
  const [userName, setUserName] = useState("");
  
  // Create an initial chat if none exists
  useEffect(() => {
    if (!activeChat) {
      createNewChat();
    }
    
    // Get user information
    const user = JSON.parse(localStorage.getItem("inventu_user") || "{}");
    setUserName(user.name || "");
    
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Bom dia");
    else if (hour < 18) setGreeting("Boa tarde");
    else setGreeting("Boa noite");
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
              <div className="text-center max-w-2xl">
                <h1 className="text-4xl font-bold mb-2">
                  <span className="text-gray-400">Olá</span> {userName ? userName : "Usuário"} 
                </h1>
                <p className="text-2xl text-muted-foreground mb-10">
                  O que posso fazer por você?
                </p>
                
                <div className="relative max-w-lg mx-auto mb-8">
                  <Input 
                    className="w-full py-6 pl-12 pr-4 rounded-xl text-lg" 
                    placeholder="Digite uma tarefa para Inventu trabalhar..."
                    readOnly
                    onClick={(e) => {
                      const chatInputElement = document.querySelector('#chat-input');
                      if (chatInputElement) {
                        (chatInputElement as HTMLElement).focus();
                      }
                    }}
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                
                <div className="grid grid-cols-2 gap-6 mt-12">
                  <div className="col-span-2">
                    <h3 className="text-lg font-medium text-left mb-3">Destaques</h3>
                  </div>
                  
                  <div className="glass-panel p-6 text-left">
                    <div className="w-10 h-10 rounded-md bg-gray-200 mb-4 flex items-center justify-center">
                      <Image className="h-6 w-6 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Análise de imagens</h3>
                    <p className="text-sm text-muted-foreground">
                      A Inventu integra recursos de visão computacional para analisar imagens e extrair informações detalhadas.
                    </p>
                  </div>
                  
                  <div className="glass-panel p-6 text-left">
                    <div className="w-10 h-10 rounded-md bg-gray-200 mb-4 flex items-center justify-center">
                      <svg className="h-6 w-6 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium mb-2">Pesquisas em tempo real</h3>
                    <p className="text-sm text-muted-foreground">
                      Acesso instantâneo a informações atualizadas de múltiplas fontes para respostas precisas.
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
