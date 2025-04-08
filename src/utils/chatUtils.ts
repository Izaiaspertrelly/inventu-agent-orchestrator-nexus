
import { v4 as uuidv4 } from "uuid";
import { Message, Chat } from "../types";
import { ToolCall } from "../types/chat";

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
export const extractToolCalls = (message: string): ToolCall[] => {
  const toolCalls = [];
  const lowerMessage = message.toLowerCase();
  
  // Detecção para pesquisa na web
  if (lowerMessage.includes("pesquisar") || 
      lowerMessage.includes("buscar") || 
      lowerMessage.includes("procurar") ||
      lowerMessage.includes("search")) {
    toolCalls.push({
      toolId: "web-search",
      params: { query: message }
    });
  }
  
  // Detecção para clima
  if (lowerMessage.includes("clima") || 
      lowerMessage.includes("tempo") || 
      lowerMessage.includes("previsão") ||
      lowerMessage.includes("weather")) {
    // Tentar extrair localização 
    let location = "current";
    
    const locationRegex = /(clima|tempo|previsão|weather).*(em|de|para|in|at|for)\s+([a-zA-ZÀ-ÿ\s]+)/i;
    const match = message.match(locationRegex);
    
    if (match && match[3]) {
      location = match[3].trim();
    }
    
    toolCalls.push({
      toolId: "weather-api",
      params: { location }
    });
  }
  
  // Detecção para calculadora
  if ((lowerMessage.includes("calcul") || 
       lowerMessage.includes("som") || 
       lowerMessage.includes("subtra") ||
       lowerMessage.includes("multiplic") ||
       lowerMessage.includes("divid")) && 
      /\d/.test(message)) {
    
    // Identificar possíveis números e operações
    let a = 0;
    let b = 0;
    let operation = "add";
    
    // Extração simples de números
    const numbers = message.match(/\d+/g);
    if (numbers && numbers.length >= 2) {
      a = parseInt(numbers[0]);
      b = parseInt(numbers[1]);
      
      // Tentar identificar a operação
      if (lowerMessage.includes("som") || lowerMessage.includes("adic") || lowerMessage.includes("mais") || lowerMessage.includes("add")) {
        operation = "add";
      } else if (lowerMessage.includes("subtra") || lowerMessage.includes("menos") || lowerMessage.includes("subtract")) {
        operation = "subtract";
      } else if (lowerMessage.includes("multiplic") || lowerMessage.includes("vezes") || lowerMessage.includes("multiply")) {
        operation = "multiply";
      } else if (lowerMessage.includes("divid") || lowerMessage.includes("divid") || lowerMessage.includes("divide")) {
        operation = "divide";
      }
      
      toolCalls.push({
        toolId: "calculator",
        params: { a, b, operation }
      });
    }
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
  // Remove special characters and limit the length
  let title = content.replace(/[^\w\s]/gi, '').trim();
  return title.slice(0, 30) + (title.length > 30 ? "..." : "");
};
