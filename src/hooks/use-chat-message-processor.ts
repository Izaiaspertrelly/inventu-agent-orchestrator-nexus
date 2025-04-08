
import { useState } from "react";
import { Message } from "../types";
import { createBotMessage } from "../utils/chatUtils";
import { useToast } from "@/hooks/use-toast";
import { useAgent } from "../contexts/AgentContext";
import { useOrchestratorResponse } from "./messaging/use-orchestrator-response";
import { useToolExecutor } from "./messaging/use-tool-executor";
import { useModelResponse } from "./messaging/use-model-response";

export const useChatMessageProcessor = () => {
  const { toast } = useToast();
  const { selectModelForTask } = useAgent();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Importar hooks específicos para cada funcionalidade
  const { findAgentByModel, getOrchestratorAgent, orchestrateAgentResponse } = useOrchestratorResponse();
  const { executeToolsFromMessage, processFileUpload } = useToolExecutor();
  const { generateModelBasedResponse, getModelInfo } = useModelResponse();
  
  // Process the bot's response
  const generateBotResponse = async (userMessage: string, selectedModelId: string, file?: File | null): Promise<Message> => {
    setIsProcessing(true);
    
    try {
      console.log(`Gerando resposta usando modelo: ${selectedModelId}`);
      
      // Verificar se temos um orquestrador configurado
      const orchestratorAgent = getOrchestratorAgent();
      
      if (orchestratorAgent) {
        console.log("Orquestrador encontrado:", orchestratorAgent.name);
        
        // Se temos um orquestrador, verificamos se devemos usar o modelo dele ou o modelo selecionado
        const useOrchestrator = true; // Simplifiquei para sempre usar orquestrador se disponível
        
        if (useOrchestrator) {
          console.log("Usando orquestrador para processar a mensagem");
          const orchestratedResponse = await orchestrateAgentResponse(userMessage, orchestratorAgent);
          
          // Completar a resposta do orquestrador com detalhes do modelo
          const completeResponse = orchestratedResponse + 
            generateModelBasedResponse(userMessage, orchestratorAgent.modelId, orchestratorAgent);
          
          setIsProcessing(false);
          return createBotMessage(completeResponse, orchestratorAgent.modelId);
        }
      }
      
      // Se não usamos o orquestrador ou ele não está configurado, usamos o fluxo normal
      
      // Encontrar o agente associado ao modelo selecionado
      const agent = findAgentByModel(selectedModelId);
      console.log("Agente encontrado para o modelo selecionado:", agent?.name);
      
      // Executar ferramentas se necessário
      const { toolsUsed, responseContent: toolsResponse } = await executeToolsFromMessage(userMessage);
      
      // Processar arquivo se enviado
      const fileResponse = processFileUpload(file);
      
      // Combinar respostas anteriores
      let responseContent = toolsResponse + fileResponse;
      
      // Gerar resposta baseada no modelo/agente
      if (agent) {
        const orchestratedResponse = await orchestrateAgentResponse(userMessage, agent);
        responseContent += orchestratedResponse;
      }
      
      // Adicionar conteúdo específico do modelo
      responseContent += generateModelBasedResponse(userMessage, selectedModelId, agent);
      
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
