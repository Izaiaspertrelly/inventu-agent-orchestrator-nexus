
import { useState } from "react";
import { Message } from "../types";
import { createBotMessage } from "../utils/chatUtils";
import { useToast } from "@/hooks/use-toast";
import { useAgent } from "../contexts/AgentContext";
import { useOrchestratorResponse } from "./messaging/use-orchestrator-response";
import { useToolExecutor } from "./messaging/use-tool-executor";
import { useModelResponse } from "./messaging/use-model-response";
import { v4 as uuidv4 } from 'uuid';

export const useChatMessageProcessor = () => {
  const { toast } = useToast();
  const { selectModelForTask, optimizeResources, orchestratorConfig, createUserDatabase, requestMemoryConfirmation } = useAgent();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Import hooks for specific functionalities
  const { findAgentByModel, getOrchestratorAgent, orchestrateAgentResponse } = useOrchestratorResponse();
  const { executeToolsFromMessage, processFileUpload } = useToolExecutor();
  const { generateModelBasedResponse } = useModelResponse();
  
  // Detect information potentially important for memory
  const detectImportantInformation = (userMessage: string) => {
    // Example of patterns for detecting important information
    const patterns = [
      { regex: /minha\s+api\s+[é:]?\s+([^\s.,]+)/i, key: 'api_key', label: 'API Key' },
      { regex: /uso\s+(o\s+)?([^\s.,]+)\s+para/i, key: 'tool_usage', label: 'Ferramenta utilizada' },
      { regex: /meu\s+(?:nome|usuário)\s+[é:]?\s+([^\s.,]+)/i, key: 'username', label: 'Nome de usuário' },
      { regex: /(?:trabalho|empresa)\s+[é:]?\s+([^\s.,]+)/i, key: 'company', label: 'Empresa' }
    ];
    
    const detectedInfo = [];
    
    for (const pattern of patterns) {
      const match = userMessage.match(pattern.regex);
      if (match && match[1]) {
        detectedInfo.push({
          key: pattern.key,
          value: match[1],
          label: pattern.label,
          source: 'message_analysis'
        });
      }
    }
    
    return detectedInfo;
  };
  
  // Process the bot's response
  const generateBotResponse = async (userMessage: string, selectedModelId: string, file?: File | null): Promise<Message> => {
    setIsProcessing(true);
    
    try {
      console.log(`Generating response using model: ${selectedModelId}`);
      
      // 1. Setup user info and database
      console.log("Step 1: Setting up user context");
      const userId = localStorage.getItem('temp_user_id') || uuidv4();
      localStorage.setItem('temp_user_id', userId);
      createUserDatabase(userId);
      
      let responseContent = "";
      let toolsUsed: string[] = [];
      
      // Check if orchestrator is configured and should be used
      if (orchestratorConfig && Object.keys(orchestratorConfig).length > 0) {
        console.log("Orchestrator is configured, using orchestrated response flow");
        
        // Process file if uploaded
        if (file) {
          const fileResponse = processFileUpload(file);
          responseContent += fileResponse;
        }
        
        // Execute tools based on message content
        const toolResult = await executeToolsFromMessage(userMessage);
        toolsUsed = toolResult.toolsUsed;
        if (toolResult.responseContent) {
          responseContent += toolResult.responseContent;
        }
        
        // Get orchestrator agent
        const orchestratorAgent = getOrchestratorAgent();
        
        if (orchestratorAgent) {
          console.log("Using orchestrator agent:", orchestratorAgent.name);
          
          // Use orchestrator to generate response
          const orchestratedResponse = await orchestrateAgentResponse(userMessage, orchestratorAgent);
          responseContent += orchestratedResponse;
          
          // Process memory aspects if enabled
          if (orchestratorConfig.memory?.enabled) {
            const importantInfo = detectImportantInformation(userMessage);
            
            if (importantInfo.length > 0 && orchestratorConfig.memory?.userPromptEnabled) {
              for (const info of importantInfo) {
                requestMemoryConfirmation(userId, info);
                responseContent += `\n\nDetectei que você mencionou ${info.label}: "${info.value}". Gostaria de salvar isso para referência futura?`;
              }
            }
          }
        } else {
          console.log("No orchestrator agent found, using fallback processing");
          responseContent += "O orquestrador está configurado, mas não conseguiu processar sua mensagem. Usando processamento padrão. ";
          
          // Fallback to basic model response
          const modelResponse = generateModelBasedResponse(userMessage, selectedModelId, null);
          responseContent += modelResponse;
        }
      } else {
        console.log("Orchestrator not configured, using standard processing flow");
        
        // Execute tools
        const toolResult = await executeToolsFromMessage(userMessage);
        toolsUsed = toolResult.toolsUsed;
        responseContent += toolResult.responseContent;
        
        // Process file
        if (file) {
          const fileResponse = processFileUpload(file);
          responseContent += fileResponse;
        }
        
        // Find agent for model and generate response
        const agent = findAgentByModel(selectedModelId);
        responseContent += generateModelBasedResponse(userMessage, selectedModelId, agent);
      }
      
      setIsProcessing(false);
      return createBotMessage(responseContent, selectedModelId, toolsUsed.length > 0 ? toolsUsed : undefined);
    } catch (error) {
      setIsProcessing(false);
      console.error("Error generating response:", error);
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
