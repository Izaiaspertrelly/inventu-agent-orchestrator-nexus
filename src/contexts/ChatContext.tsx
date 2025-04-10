
import React, { createContext, useContext, useState, useEffect } from "react";
import { Chat, Message } from "../types";
import { ChatContextType } from "../types/chat";
import { createChat, createUserMessage, createChatTitle } from "../utils/chatUtils";
import { useChatMessageProcessor } from "../hooks/use-chat-message-processor";
import { useToast } from "@/hooks/use-toast";
import { useAgent } from "./AgentContext";
import { TerminalLine } from "@/components/terminal/OrchestratorTerminal";
import { v4 as uuidv4 } from 'uuid';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { toast } = useToast();
  const { generateBotResponse, selectModelForTask, isProcessing } = useChatMessageProcessor();
  const { orchestratorConfig } = useAgent();
  
  const [chats, setChats] = useState<Chat[]>(() => {
    const savedChats = localStorage.getItem("inventu_chats");
    return savedChats ? JSON.parse(savedChats) : [];
  });
  
  const [activeChat, setActiveChatState] = useState<Chat | null>(null);
  
  // Terminal state
  const [terminalOpen, setTerminalOpen] = useState<boolean>(false);
  const [terminalMinimized, setTerminalMinimized] = useState<boolean>(false);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);

  useEffect(() => {
    localStorage.setItem("inventu_chats", JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    if (chats.length > 0 && !activeChat) {
      setActiveChatState(chats[0]);
    }
  }, [chats, activeChat]);

  const createNewChat = () => {
    const newChat = createChat();
    setChats((prev) => [newChat, ...prev]);
    setActiveChatState(newChat);
    return newChat;
  };

  const setActiveChat = (chatId: string) => {
    const chat = chats.find((c) => c.id === chatId);
    if (chat) {
      setActiveChatState(chat);
    }
  };

  const updateChat = (chatId: string, updates: Partial<Chat>) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId ? { ...chat, ...updates } : chat
      )
    );

    if (activeChat?.id === chatId) {
      setActiveChatState((prev) => (prev ? { ...prev, ...updates } : prev));
    }
  };

  const removeChat = (chatId: string) => {
    setChats((prev) => prev.filter((chat) => chat.id !== chatId));
    
    if (activeChat?.id === chatId) {
      setActiveChatState(chats.length > 1 ? chats.filter(c => c.id !== chatId)[0] : null);
    }
  };

  // Terminal functions
  const addTerminalLine = (content: string, type: 'command' | 'output' | 'error' | 'info' | 'success') => {
    const newLine: TerminalLine = {
      id: uuidv4(),
      content,
      type,
      timestamp: new Date()
    };
    setTerminalLines(prev => [...prev, newLine]);
  };

  const clearTerminal = () => {
    setTerminalLines([]);
  };

  const toggleTerminal = () => {
    if (terminalOpen) {
      setTerminalMinimized(prev => !prev);
    } else {
      setTerminalOpen(true);
      setTerminalMinimized(false);
    }
  };

  const closeTerminal = () => {
    setTerminalOpen(false);
    // We don't clear the terminal lines here so they're still available if the user reopens it
  };

  const sendMessage = async (content: string, file?: File | null) => {
    // Always create a new chat if sending a message without an active chat
    if (!activeChat) {
      const newChat = createNewChat();
      await new Promise(resolve => setTimeout(resolve, 50)); // Small delay to ensure chat is created
      sendMessageToChat(newChat.id, content, file);
      return;
    }
    
    // If there's an active chat, use it
    sendMessageToChat(activeChat.id, content, file);
  };
  
  const sendMessageToChat = async (chatId: string, content: string, file?: File | null) => {
    console.log("Sending message to chat:", chatId);
    console.log("Content:", content);
    console.log("Attached file:", file?.name || "none");
    
    if (!content.trim() && !file) {
      toast({
        description: "Por favor, digite uma mensagem ou anexe um arquivo",
        variant: "destructive",
      });
      return;
    }
    
    // Create user message
    let messageContent = content;
    
    // If there's a file, add information about it to the message
    if (file) {
      messageContent += `\n\n[Arquivo anexado: ${file.name} (${Math.round(file.size / 1024)} KB)]`;
    }
    
    const userMessage = createUserMessage(messageContent);
    
    // Update chat with user message
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;
    
    const updatedMessages = [...chat.messages, userMessage];
    updateChat(chatId, {
      messages: updatedMessages,
      updatedAt: new Date(),
    });
    
    try {
      // Check if this is the first message in the chat
      const isFirstMessage = chat.messages.length === 0;
      
      // Open terminal for orchestrator if it's the first message and orchestrator is active
      if (isFirstMessage && orchestratorConfig && Object.keys(orchestratorConfig).length > 0) {
        setTerminalOpen(true);
        setTerminalMinimized(false);
        clearTerminal();
        addTerminalLine(`Processando mensagem: "${content}"`, 'command');
        addTerminalLine("Inicializando Orquestrador Neural...", 'info');
      }
      
      // Use orchestrator's selected model if available, otherwise use default selection
      console.log("Selecting model for task...");
      let selectedModelId;
      
      if (orchestratorConfig && orchestratorConfig.selectedModel) {
        console.log("Using orchestrator's selected model:", orchestratorConfig.selectedModel);
        selectedModelId = orchestratorConfig.selectedModel;
        
        if (isFirstMessage) {
          addTerminalLine(`Modelo selecionado: ${orchestratorConfig.selectedModel}`, 'info');
        }
      } else {
        selectedModelId = await selectModelForTask(content);
        console.log("Selected model using standard selection:", selectedModelId);
        
        if (isFirstMessage && terminalOpen) {
          addTerminalLine(`Modelo selecionado: ${selectedModelId}`, 'info');
        }
      }
      
      // Terminal updates for orchestrator
      if (terminalOpen) {
        if (orchestratorConfig?.memory?.enabled) {
          addTerminalLine("Buscando informações na memória...", 'info');
          setTimeout(() => {
            addTerminalLine("Memória acessada com sucesso", 'success');
          }, 800);
        }
        
        if (orchestratorConfig?.reasoning?.enabled) {
          addTerminalLine(`Iniciando raciocínio (profundidade: ${orchestratorConfig.reasoning.depth || 2})...`, 'info');
          setTimeout(() => {
            addTerminalLine("Processamento de raciocínio concluído", 'success');
          }, 1500);
        }
        
        if (file) {
          addTerminalLine(`Processando arquivo: ${file.name}`, 'info');
        }
      }
      
      // Generate AI response using the orchestrator
      console.log("Generating response with model:", selectedModelId);
      const botMessage = await generateBotResponse(content, selectedModelId, file);
      console.log("Response generated:", botMessage);
      
      // Update terminal with results
      if (terminalOpen) {
        addTerminalLine("Resposta gerada com sucesso", 'success');
        if (botMessage.toolsUsed && botMessage.toolsUsed.length > 0) {
          addTerminalLine(`Ferramentas utilizadas: ${botMessage.toolsUsed.join(", ")}`, 'output');
        }
        addTerminalLine("Processamento concluído", 'success');
      }
      
      // Update chat with AI response
      const finalMessages = [...updatedMessages, botMessage];
      updateChat(chatId, {
        messages: finalMessages,
        updatedAt: new Date(),
        // Update title for new chats after first exchange
        title: chat.messages.length === 0 
          ? createChatTitle(content)
          : chat.title,
      });
    } catch (error) {
      console.error("Failed to process message:", error);
      if (terminalOpen) {
        addTerminalLine(`Erro: ${error.message}`, 'error');
      }
      toast({
        title: "Erro",
        description: "Não foi possível processar sua mensagem. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        activeChat,
        isProcessing,
        setActiveChat,
        createNewChat,
        sendMessage,
        removeChat,
        // Terminal related
        terminalOpen,
        terminalMinimized,
        terminalLines,
        toggleTerminal,
        closeTerminal,
        addTerminalLine,
        clearTerminal
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
