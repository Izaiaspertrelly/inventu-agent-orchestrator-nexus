
import React, { createContext, useContext, useState, useEffect } from "react";
import { Chat, Message } from "../types";
import { v4 as uuidv4 } from "uuid";
import { useAgent } from "./AgentContext";
import { useToast } from "@/hooks/use-toast";

interface ChatContextType {
  chats: Chat[];
  activeChat: Chat | null;
  setActiveChat: (chatId: string) => void;
  createNewChat: () => void;
  sendMessage: (content: string) => Promise<void>;
  removeChat: (chatId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { toast } = useToast();
  const { selectModelForTask, executeMCPTool, models } = useAgent();
  const [chats, setChats] = useState<Chat[]>(() => {
    const savedChats = localStorage.getItem("inventu_chats");
    return savedChats ? JSON.parse(savedChats) : [];
  });
  const [activeChat, setActiveChatState] = useState<Chat | null>(null);

  useEffect(() => {
    localStorage.setItem("inventu_chats", JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    if (chats.length > 0 && !activeChat) {
      setActiveChatState(chats[0]);
    }
  }, [chats, activeChat]);

  const createNewChat = () => {
    const newChat: Chat = {
      id: uuidv4(),
      title: "Nova conversa",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setChats((prev) => [newChat, ...prev]);
    setActiveChatState(newChat);
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
      setActiveChatState(chats.length > 1 ? chats[0] : null);
    }
  };

  // Extract potential tool calls from the message
  const extractToolCalls = (message: string): { toolId: string; params: any }[] => {
    // This would be much more sophisticated in a real implementation
    // Here we're just doing basic pattern matching for demo purposes
    const toolCalls = [];
    
    // Very simple detection (in real implementation this would be more robust)
    if (message.toLowerCase().includes("search") || message.toLowerCase().includes("buscar")) {
      toolCalls.push({
        toolId: "web-search",
        params: { query: message }
      });
    }
    
    if (message.toLowerCase().includes("weather") || message.toLowerCase().includes("clima")) {
      toolCalls.push({
        toolId: "weather-api",
        params: { location: "current" }
      });
    }
    
    return toolCalls;
  };

  // Process the bot's response
  const generateBotResponse = async (userMessage: string, selectedModelId: string): Promise<Message> => {
    // In a real implementation, this would call the actual AI model API
    const model = models.find(m => m.id === selectedModelId);
    
    // Detect if tool execution is required
    const toolCalls = extractToolCalls(userMessage);
    const toolsUsed: string[] = [];
    let responseContent = "";
    
    // Execute any required tools
    if (toolCalls.length > 0) {
      for (const call of toolCalls) {
        try {
          const result = await executeMCPTool(call.toolId, call.params);
          toolsUsed.push(call.toolId);
          responseContent += `[Tool: ${result.toolName}] ${result.result}\n\n`;
        } catch (error) {
          console.error("Tool execution failed:", error);
          responseContent += `Failed to execute tool: ${call.toolId}. `;
        }
      }
    }
    
    // Add AI response based on model
    switch(selectedModelId) {
      case "minimax":
        responseContent += `Usando MiniMax para processar seu pedido completo: "${userMessage}"`;
        break;
      case "deepseek-r1":
        responseContent += `Analisando profundamente com DeepSeek R1: "${userMessage}"`;
        break;
      case "ideogram":
        responseContent += `Gerando visualização com Ideogram baseado em: "${userMessage}"`;
        break;
      default:
        responseContent += `Processando sua solicitação: "${userMessage}"`;
    }
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      id: uuidv4(),
      content: responseContent,
      role: "assistant",
      createdAt: new Date(),
      modelUsed: selectedModelId,
      toolsUsed: toolsUsed.length > 0 ? toolsUsed : undefined,
    };
  };

  const sendMessage = async (content: string) => {
    if (!activeChat) return;
    
    if (!content.trim()) {
      toast({
        description: "Por favor, digite uma mensagem",
        variant: "destructive",
      });
      return;
    }
    
    // Create user message
    const userMessage: Message = {
      id: uuidv4(),
      content,
      role: "user",
      createdAt: new Date(),
    };
    
    // Update chat with user message
    const updatedMessages = [...activeChat.messages, userMessage];
    updateChat(activeChat.id, {
      messages: updatedMessages,
      updatedAt: new Date(),
    });
    
    try {
      // Select the appropriate model for this task
      const selectedModelId = await selectModelForTask(content);
      
      // Generate AI response
      const botMessage = await generateBotResponse(content, selectedModelId);
      
      // Update chat with AI response
      const finalMessages = [...updatedMessages, botMessage];
      updateChat(activeChat.id, {
        messages: finalMessages,
        updatedAt: new Date(),
        // Update title for new chats after first exchange
        title: activeChat.messages.length === 0 
          ? content.slice(0, 30) + (content.length > 30 ? "..." : "")
          : activeChat.title,
      });
    } catch (error) {
      console.error("Failed to process message:", error);
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
        setActiveChat,
        createNewChat,
        sendMessage,
        removeChat,
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
