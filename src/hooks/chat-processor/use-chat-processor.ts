
import { useState } from "react";
import { Message } from "../../types";
import { useToast } from "@/hooks/use-toast";
import { useAgent } from "../../contexts/AgentContext";
import { useOrchestratorResponse } from "../messaging/use-orchestrator-response";
import { useToolExecutor } from "../messaging/use-tool-executor";
import { useModelResponse } from "../messaging/use-model-response";
import { useChatProcessorUtils } from "./use-chat-processor-utils";
import { useChatTerminalEmitter } from "./use-chat-terminal-emitter";
import { useInformationDetector } from "./use-information-detector";

export const useChatMessageProcessor = () => {
  const { toast } = useToast();
  const { selectModelForTask, optimizeResources, orchestratorConfig, createUserDatabase, requestMemoryConfirmation } = useAgent();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Import hooks for specific functionalities
  const { findAgentByModel, getOrchestratorAgent, orchestrateAgentResponse } = useOrchestratorResponse();
  const { executeToolsFromMessage, processFileUpload } = useToolExecutor();
  const { generateModelBasedResponse } = useModelResponse();
  
  // Import utility hooks
  const { emitTerminalEvent } = useChatTerminalEmitter();
  const { detectImportantInformation } = useInformationDetector();
  
  // Process the response from the bot
  const generateBotResponse = async (userMessage: string, selectedModelId: string, file?: File | null): Promise<Message> => {
    setIsProcessing(true);
    
    try {
      console.log(`Generating response using model: ${selectedModelId}`);
      emitTerminalEvent(`Iniciando processamento com modelo: ${selectedModelId}`, 'command');
      
      // 1. Configure user information and database
      console.log("Step 1: Setting up user context");
      emitTerminalEvent("Configurando contexto do usuário...", 'info');
      
      // Setup user context using utility function from useChatProcessorUtils
      const userId = localStorage.getItem('temp_user_id') || crypto.randomUUID();
      localStorage.setItem('temp_user_id', userId);
      createUserDatabase(userId);
      
      let responseContent = "";
      let toolsUsed: string[] = [];
      
      // Check if orchestrator is configured and should be used
      if (orchestratorConfig && Object.keys(orchestratorConfig).length > 0) {
        console.log("Orchestrator is configured, using orchestrated response flow");
        emitTerminalEvent("Orquestrador Neural detectado, utilizando fluxo orquestrado", 'info');
        
        // Process file if uploaded
        if (file) {
          emitTerminalEvent(`Processando arquivo: ${file.name} (${Math.round(file.size / 1024)} KB)`, 'info');
          const fileResponse = processFileUpload(file);
          responseContent += fileResponse;
          emitTerminalEvent("Arquivo processado com sucesso", 'success');
        }
        
        // Execute tools based on message content
        emitTerminalEvent("Verificando ferramentas necessárias...", 'info');
        const toolResult = await executeToolsFromMessage(userMessage);
        toolsUsed = toolResult.toolsUsed;
        if (toolResult.responseContent) {
          responseContent += toolResult.responseContent;
          if (toolsUsed.length > 0) {
            emitTerminalEvent(`Ferramentas executadas: ${toolsUsed.join(", ")}`, 'success');
          } else {
            emitTerminalEvent("Nenhuma ferramenta necessária para esta mensagem", 'info');
          }
        }
        
        // Get orchestrator agent
        emitTerminalEvent("Obtendo agente do orquestrador...", 'info');
        const orchestratorAgent = getOrchestratorAgent();
        
        if (orchestratorAgent) {
          console.log("Using orchestrator agent:", orchestratorAgent.name);
          emitTerminalEvent(`Agente selecionado: ${orchestratorAgent.name}`, 'success');
          
          // Use orchestrator to generate response
          emitTerminalEvent("Gerando resposta orquestrada...", 'info');
          const orchestratedResponse = await orchestrateAgentResponse(userMessage, orchestratorAgent);
          responseContent += orchestratedResponse;
          console.log("Resposta orquestrada gerada:", responseContent);
          emitTerminalEvent("Resposta gerada com sucesso", 'success');
          
          // Process memory aspects if enabled
          if (orchestratorConfig.memory?.enabled) {
            emitTerminalEvent("Processando aspectos de memória...", 'info');
            const importantInfo = detectImportantInformation(userMessage);
            
            if (importantInfo.length > 0 && orchestratorConfig.memory?.userPromptEnabled) {
              for (const info of importantInfo) {
                requestMemoryConfirmation(userId, info);
                responseContent += `\n\nDetectei que você mencionou ${info.label}: "${info.value}". Gostaria de salvar isso para referência futura?`;
                emitTerminalEvent(`Solicitando confirmação de memória para ${info.label}`, 'info');
              }
            }
          }
        } else {
          console.log("No orchestrator agent found, using fallback processing");
          emitTerminalEvent("Agente do orquestrador não encontrado, usando processamento padrão", 'error');
          responseContent += "O orquestrador está configurado, mas não conseguiu processar sua mensagem. Usando processamento padrão. ";
          
          // Fallback to basic model response
          emitTerminalEvent("Gerando resposta padrão...", 'info');
          const modelResponse = generateModelBasedResponse(userMessage, selectedModelId, null);
          responseContent += modelResponse;
          emitTerminalEvent("Resposta padrão gerada", 'success');
        }
      } else {
        console.log("Orchestrator not configured, using standard processing flow");
        emitTerminalEvent("Orquestrador não configurado, usando fluxo de processamento padrão", 'info');
        
        // Execute tools
        emitTerminalEvent("Verificando ferramentas...", 'info');
        const toolResult = await executeToolsFromMessage(userMessage);
        toolsUsed = toolResult.toolsUsed;
        responseContent += toolResult.responseContent;
        
        if (toolsUsed.length > 0) {
          emitTerminalEvent(`Ferramentas executadas: ${toolsUsed.join(", ")}`, 'success');
        }
        
        // Process file
        if (file) {
          emitTerminalEvent(`Processando arquivo: ${file.name}`, 'info');
          const fileResponse = processFileUpload(file);
          responseContent += fileResponse;
          emitTerminalEvent("Arquivo processado", 'success');
        }
        
        // Find agent for the model and generate response
        emitTerminalEvent("Gerando resposta baseada no modelo...", 'info');
        const agent = findAgentByModel(selectedModelId);
        responseContent += generateModelBasedResponse(userMessage, selectedModelId, agent);
        emitTerminalEvent("Resposta gerada com sucesso", 'success');
      }
      
      // Optimize resource usage, if enabled
      if (orchestratorConfig?.resources?.optimizeUsage) {
        emitTerminalEvent("Otimizando uso de recursos...", 'info');
        const savedPercentage = optimizeResources();
        emitTerminalEvent(`Otimização concluída: ${savedPercentage}% economizado`, 'success');
      }
      
      emitTerminalEvent("Processamento concluído com sucesso", 'success');
      setIsProcessing(false);
      
      // Ensure we have content in the response
      if (!responseContent.trim()) {
        responseContent = "Não foi possível gerar uma resposta. Por favor, tente novamente.";
      }
      
      console.log("Final response generated:", responseContent);
      return { 
        id: crypto.randomUUID(),
        role: "assistant",
        content: responseContent,
        createdAt: new Date(),
        modelUsed: selectedModelId,
        toolsUsed: toolsUsed.length > 0 ? toolsUsed : undefined
      };
    } catch (error) {
      setIsProcessing(false);
      console.error("Error generating response:", error);
      emitTerminalEvent(`Erro: ${error instanceof Error ? error.message : String(error)}`, 'error');
      return { 
        id: crypto.randomUUID(),
        role: "assistant",
        content: `Desculpe, houve um erro ao processar sua mensagem. Por favor, tente novamente.\nError: ${String(error)}`,
        createdAt: new Date(),
        modelUsed: "error"
      };
    }
  };

  return {
    generateBotResponse,
    selectModelForTask,
    isProcessing
  };
};
