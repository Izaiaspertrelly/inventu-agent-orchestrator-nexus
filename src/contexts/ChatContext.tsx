
import React, { createContext, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Message, Chat } from "../types";
import { createUserMessage, createBotMessage } from "../utils/chatUtils";
import { useChatMessageProcessor } from "@/hooks/use-chat-message-processor";
import { useAgent } from "./AgentContext";
import { TerminalLine } from "@/components/terminal/OrchestratorTerminal";

interface ChatContextType {
  activeChat: Chat | null;
  chats: Chat[];
  createNewChat: () => void;
  loadChat: (id: string) => void;
  sendMessage: (content: string, file?: File | null) => Promise<void>;
  isProcessing: boolean;
  // Terminal related props
  terminalOpen: boolean;
  terminalMinimized: boolean; 
  terminalLines: TerminalLine[];
  toggleTerminal: () => void;
  setTerminalMinimized: (minimized: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { orchestratorConfig, selectModelForTask } = useAgent();
  const { generateBotResponse } = useChatMessageProcessor();
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Terminal state
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [terminalMinimized, setTerminalMinimized] = useState(false);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  
  // Ouvir eventos do terminal
  React.useEffect(() => {
    const handleTerminalEvent = (event: CustomEvent<{content: string, type: TerminalLine['type']}>) => {
      const { content, type } = event.detail;
      
      setTerminalLines(prev => [
        ...prev,
        {
          id: uuidv4(),
          content,
          type,
          timestamp: new Date()
        }
      ]);
      
      // Abrir terminal automaticamente quando há atividade do orquestrador
      if (!terminalOpen) {
        setTerminalOpen(true);
        setTerminalMinimized(false);
      }
    };
    
    document.addEventListener('terminal-update', handleTerminalEvent as EventListener);
    
    return () => {
      document.removeEventListener('terminal-update', handleTerminalEvent as EventListener);
    };
  }, [terminalOpen]);
  
  const createNewChat = () => {
    const newChat: Chat = {
      id: uuidv4(),
      name: "Nova conversa",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setChats((prevChats) => [...prevChats, newChat]);
    setActiveChat(newChat);
    console.log("Nova conversa criada com ID:", newChat.id);
  };

  const loadChat = (id: string) => {
    const chat = chats.find((c) => c.id === id);
    if (chat) {
      setActiveChat(chat);
    }
  };

  const sendMessage = async (content: string, file: File | null = null) => {
    if (!activeChat) {
      createNewChat();
    }

    if (!content.trim() && !file) return;
    
    console.log("Sending message to chat:", activeChat?.id);
    console.log("Content:", content);
    console.log("Attached file:", file ? file.name : "none");

    // Add user message to chat
    const userMessage = createUserMessage(content);
    
    // Using main chat id instead of messages[0]
    const updatedChat: Chat = {
      ...activeChat!,
      messages: [...activeChat!.messages, userMessage],
      updatedAt: new Date(),
    };

    setChats((prevChats) =>
      prevChats.map((c) => (c.id === updatedChat.id ? updatedChat : c))
    );
    setActiveChat(updatedChat);

    // Process the message to generate a response
    setIsProcessing(true);
    
    // Ativar o terminal se temos o orquestrador configurado
    if (orchestratorConfig && Object.keys(orchestratorConfig).length > 0) {
      setTerminalOpen(true);
      setTerminalMinimized(false);
      
      // Adicionar eventos iniciais do terminal
      setTerminalLines(prev => [
        ...prev,
        {
          id: uuidv4(),
          content: "Enviando mensagem para processamento",
          type: "command",
          timestamp: new Date()
        },
        {
          id: uuidv4(),
          content: `Prompt do usuário: "${content}"`,
          type: "info",
          timestamp: new Date()
        }
      ]);
    }
    
    try {
      // Determinar qual modelo usar
      const selectedModel = orchestratorConfig && orchestratorConfig.selectedModel 
        ? orchestratorConfig.selectedModel 
        : await selectModelForTask(content);
      
      console.log("Using model:", selectedModel);
      
      if (orchestratorConfig && Object.keys(orchestratorConfig).length > 0) {
        setTerminalLines(prev => [
          ...prev,
          {
            id: uuidv4(),
            content: `Usando modelo do orquestrador: ${selectedModel}`,
            type: "info",
            timestamp: new Date()
          }
        ]);
      }

      const botResponse = await generateBotResponse(content, selectedModel, file);

      const updatedChatWithResponse: Chat = {
        ...updatedChat,
        messages: [...updatedChat.messages, botResponse],
        updatedAt: new Date(),
      };

      setChats((prevChats) =>
        prevChats.map((c) => (c.id === updatedChat.id ? updatedChatWithResponse : c))
      );
      setActiveChat(updatedChatWithResponse);
      
      // Registrar conclusão no terminal
      if (orchestratorConfig && Object.keys(orchestratorConfig).length > 0) {
        setTerminalLines(prev => [
          ...prev,
          {
            id: uuidv4(),
            content: "Resposta gerada com sucesso",
            type: "success",
            timestamp: new Date()
          }
        ]);
      }
    } catch (error) {
      console.error("Error generating response:", error);
      
      // Registrar erro no terminal
      if (orchestratorConfig && Object.keys(orchestratorConfig).length > 0) {
        setTerminalLines(prev => [
          ...prev,
          {
            id: uuidv4(),
            content: `Erro ao gerar resposta: ${error}`,
            type: "error",
            timestamp: new Date()
          }
        ]);
      }
      
      const errorMessage = createBotMessage(
        `Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente mais tarde.
Error: ${String(error)}`
      );

      const updatedChatWithError: Chat = {
        ...updatedChat,
        messages: [...updatedChat.messages, errorMessage],
        updatedAt: new Date(),
      };

      setChats((prevChats) =>
        prevChats.map((c) => (c.id === updatedChat.id ? updatedChatWithError : c))
      );
      setActiveChat(updatedChatWithError);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const toggleTerminal = () => {
    if (terminalOpen && !terminalMinimized) {
      setTerminalMinimized(true);
    } else {
      setTerminalOpen(true);
      setTerminalMinimized(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        activeChat,
        chats,
        createNewChat,
        loadChat,
        sendMessage,
        isProcessing,
        // Terminal related
        terminalOpen,
        terminalMinimized,
        terminalLines,
        toggleTerminal,
        setTerminalMinimized
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
