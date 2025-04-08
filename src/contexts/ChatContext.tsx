
import React, { createContext, useContext, useState, useEffect } from "react";
import { Chat, Message } from "../types";
import { ChatContextType } from "../types/chat";
import { createChat, createUserMessage, createChatTitle } from "../utils/chatUtils";
import { useChatMessageProcessor } from "../hooks/use-chat-message-processor";
import { useToast } from "@/hooks/use-toast";
import { useAgent } from "./AgentContext";

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

  const sendMessage = async (content: string, file?: File | null) => {
    // If no active chat, create one
    if (!activeChat) {
      const newChat = createNewChat();
      await new Promise(resolve => setTimeout(resolve, 50)); // Small delay to ensure chat is created
      sendMessageToChat(newChat.id, content, file);
      return;
    }
    
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
      // Use orchestrator's selected model if available, otherwise use default selection
      console.log("Selecting model for task...");
      let selectedModelId;
      
      if (orchestratorConfig && orchestratorConfig.selectedModel) {
        console.log("Using orchestrator's selected model:", orchestratorConfig.selectedModel);
        selectedModelId = orchestratorConfig.selectedModel;
      } else {
        selectedModelId = await selectModelForTask(content);
        console.log("Selected model using standard selection:", selectedModelId);
      }
      
      // Generate AI response using the orchestrator
      console.log("Generating response with model:", selectedModelId);
      const botMessage = await generateBotResponse(content, selectedModelId, file);
      console.log("Response generated:", botMessage);
      
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
