
import React, { createContext, useContext, useState, useEffect } from "react";
import { Chat, Message } from "../types";
import { ChatContextType } from "../types/chat";
import { createChat, createUserMessage, createChatTitle } from "../utils/chatUtils";
import { useChatMessageProcessor } from "../hooks/use-chat-message-processor";
import { useToast } from "@/hooks/use-toast";

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { toast } = useToast();
  const { generateBotResponse, selectModelForTask } = useChatMessageProcessor();
  
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

  const sendMessage = async (content: string, file?: File | null) => {
    if (!activeChat) return;
    
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
          ? createChatTitle(content)
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
