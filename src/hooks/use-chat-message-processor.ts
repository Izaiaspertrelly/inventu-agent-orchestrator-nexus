
import { useState } from "react";
import { Message } from "../types";
import { extractToolCalls, createBotMessage } from "../utils/chatUtils";
import { useToast } from "@/hooks/use-toast";
import { useAgent } from "../contexts/AgentContext";

export const useChatMessageProcessor = () => {
  const { toast } = useToast();
  const { selectModelForTask, executeMCPTool, mcpConfig, models } = useAgent();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Process the bot's response
  const generateBotResponse = async (userMessage: string, selectedModelId: string, file?: File | null): Promise<Message> => {
    setIsProcessing(true);
    
    try {
      // In a real implementation, this would call the actual AI model API
      const model = models.find(m => m.id === selectedModelId);
      
      // Detect if tool execution is required
      const toolCalls = extractToolCalls(userMessage);
      const toolsUsed: string[] = [];
      let responseContent = "";
      
      // Check if MCP is configured
      const isMCPConfigured = mcpConfig && mcpConfig.serverUrl && mcpConfig.serverUrl.length > 0;
      
      // Execute any required tools if MCP is configured
      if (toolCalls.length > 0 && isMCPConfigured) {
        for (const call of toolCalls) {
          try {
            // Find the matching tool in the MCP config
            const matchingTool = mcpConfig.tools.find(t => t.id === call.toolId);
            
            if (matchingTool) {
              const result = await executeMCPTool(matchingTool, call.params);
              toolsUsed.push(call.toolId);
              
              if (result.success) {
                responseContent += `[Ferramenta: ${result.toolName}] ${JSON.stringify(result.result)}\n\n`;
              } else {
                responseContent += `[Erro na Ferramenta: ${result.toolName}] ${result.error}\n\n`;
              }
            }
          } catch (error) {
            console.error("Falha na execução da ferramenta:", error);
            responseContent += `Falha ao executar ferramenta: ${call.toolId}. `;
          }
        }
      }
      
      // Handle file uploads
      if (file) {
        const fileType = file.type;
        const isImage = fileType.startsWith('image/');
        
        if (isImage) {
          responseContent += `[Analisando imagem: ${file.name}]\n`;
        } else {
          responseContent += `[Analisando arquivo: ${file.name}]\n`;
        }
      }
      
      // Add AI response based on model
      switch(selectedModelId) {
        case "minimax":
          responseContent += `Usando MiniMax para processar seu pedido: "${userMessage}"`;
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
      
      setIsProcessing(false);
      return createBotMessage(responseContent, selectedModelId, toolsUsed.length > 0 ? toolsUsed : undefined);
    } catch (error) {
      setIsProcessing(false);
      console.error("Erro ao gerar resposta:", error);
      return createBotMessage(
        "Desculpe, houve um erro ao processar sua mensagem. Por favor, tente novamente.",
        "error",
        undefined
      );
    }
  };

  return {
    generateBotResponse,
    selectModelForTask,
    isProcessing
  };
};
