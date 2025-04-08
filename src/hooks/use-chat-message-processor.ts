
import { useState } from "react";
import { Message } from "../types";
import { extractToolCalls, createBotMessage } from "../utils/chatUtils";
import { useToast } from "@/hooks/use-toast";
import { useAgent } from "../contexts/AgentContext";

export const useChatMessageProcessor = () => {
  const { toast } = useToast();
  const { selectModelForTask, executeMCPTool, models } = useAgent();
  
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
    
    return createBotMessage(responseContent, selectedModelId, toolsUsed.length > 0 ? toolsUsed : undefined);
  };

  return {
    generateBotResponse,
    selectModelForTask
  };
};
