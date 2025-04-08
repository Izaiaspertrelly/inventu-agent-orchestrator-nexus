
import { v4 as uuidv4 } from "uuid";
import { Message, Chat } from "../types";

// Create a new chat object
export const createChat = (): Chat => {
  return {
    id: uuidv4(),
    title: "Nova conversa",
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

// Create a new user message
export const createUserMessage = (content: string): Message => {
  return {
    id: uuidv4(),
    content,
    role: "user",
    createdAt: new Date(),
  };
};

// Extract potential tool calls from the message
export const extractToolCalls = (message: string): { toolId: string; params: any }[] => {
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

// Generate a response message for the bot
export const createBotMessage = (
  content: string,
  modelId: string,
  toolsUsed?: string[]
): Message => {
  return {
    id: uuidv4(),
    content,
    role: "assistant",
    createdAt: new Date(),
    modelUsed: modelId,
    toolsUsed,
  };
};

// Create a chat title from the first message
export const createChatTitle = (content: string): string => {
  return content.slice(0, 30) + (content.length > 30 ? "..." : "");
};
