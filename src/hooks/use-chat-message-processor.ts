
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
  
  // Importar hooks para funcionalidades específicas
  const { findAgentByModel, getOrchestratorAgent, orchestrateAgentResponse } = useOrchestratorResponse();
  const { executeToolsFromMessage, processFileUpload } = useToolExecutor();
  const { generateModelBasedResponse } = useModelResponse();
  
  // Emissor de eventos para atualizações do terminal
  const emitTerminalEvent = (content: string, type: 'command' | 'output' | 'error' | 'info' | 'success') => {
    const event = new CustomEvent('terminal-update', { 
      detail: { content, type } 
    });
    document.dispatchEvent(event);
  };
  
  // Detectar informações potencialmente importantes para a memória
  const detectImportantInformation = (userMessage: string) => {
    emitTerminalEvent("Analisando informações importantes na mensagem...", 'info');
    
    // Exemplo de padrões para detectar informações importantes
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
        emitTerminalEvent(`Detectado ${pattern.label}: ${match[1]}`, 'success');
      }
    }
    
    return detectedInfo;
  };
  
  // Processar a resposta do bot
  const generateBotResponse = async (userMessage: string, selectedModelId: string, file?: File | null): Promise<Message> => {
    setIsProcessing(true);
    
    try {
      console.log(`Generating response using model: ${selectedModelId}`);
      emitTerminalEvent(`Iniciando processamento com modelo: ${selectedModelId}`, 'command');
      
      // 1. Configurar informações do usuário e banco de dados
      console.log("Step 1: Setting up user context");
      emitTerminalEvent("Configurando contexto do usuário...", 'info');
      const userId = localStorage.getItem('temp_user_id') || uuidv4();
      localStorage.setItem('temp_user_id', userId);
      createUserDatabase(userId);
      
      let responseContent = "";
      let toolsUsed: string[] = [];
      
      // Verificar se o orquestrador está configurado e deve ser usado
      if (orchestratorConfig && Object.keys(orchestratorConfig).length > 0) {
        console.log("Orchestrator is configured, using orchestrated response flow");
        emitTerminalEvent("Orquestrador Neural detectado, utilizando fluxo orquestrado", 'info');
        
        // Processar arquivo se enviado
        if (file) {
          emitTerminalEvent(`Processando arquivo: ${file.name} (${Math.round(file.size / 1024)} KB)`, 'info');
          const fileResponse = processFileUpload(file);
          responseContent += fileResponse;
          emitTerminalEvent("Arquivo processado com sucesso", 'success');
        }
        
        // Executar ferramentas com base no conteúdo da mensagem
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
        
        // Obter agente do orquestrador
        emitTerminalEvent("Obtendo agente do orquestrador...", 'info');
        const orchestratorAgent = getOrchestratorAgent();
        
        if (orchestratorAgent) {
          console.log("Using orchestrator agent:", orchestratorAgent.name);
          emitTerminalEvent(`Agente selecionado: ${orchestratorAgent.name}`, 'success');
          
          // Usar orquestrador para gerar resposta
          emitTerminalEvent("Gerando resposta orquestrada...", 'info');
          const orchestratedResponse = await orchestrateAgentResponse(userMessage, orchestratorAgent);
          responseContent += orchestratedResponse;
          console.log("Resposta orquestrada gerada:", responseContent);
          emitTerminalEvent("Resposta gerada com sucesso", 'success');
          
          // Processar aspectos de memória se habilitados
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
          
          // Fallback para resposta básica do modelo
          emitTerminalEvent("Gerando resposta padrão...", 'info');
          const modelResponse = generateModelBasedResponse(userMessage, selectedModelId, null);
          responseContent += modelResponse;
          emitTerminalEvent("Resposta padrão gerada", 'success');
        }
      } else {
        console.log("Orchestrator not configured, using standard processing flow");
        emitTerminalEvent("Orquestrador não configurado, usando fluxo de processamento padrão", 'info');
        
        // Executar ferramentas
        emitTerminalEvent("Verificando ferramentas...", 'info');
        const toolResult = await executeToolsFromMessage(userMessage);
        toolsUsed = toolResult.toolsUsed;
        responseContent += toolResult.responseContent;
        
        if (toolsUsed.length > 0) {
          emitTerminalEvent(`Ferramentas executadas: ${toolsUsed.join(", ")}`, 'success');
        }
        
        // Processar arquivo
        if (file) {
          emitTerminalEvent(`Processando arquivo: ${file.name}`, 'info');
          const fileResponse = processFileUpload(file);
          responseContent += fileResponse;
          emitTerminalEvent("Arquivo processado", 'success');
        }
        
        // Encontrar agente para o modelo e gerar resposta
        emitTerminalEvent("Gerando resposta baseada no modelo...", 'info');
        const agent = findAgentByModel(selectedModelId);
        responseContent += generateModelBasedResponse(userMessage, selectedModelId, agent);
        emitTerminalEvent("Resposta gerada com sucesso", 'success');
      }
      
      // Otimizar uso de recursos, se habilitado
      if (orchestratorConfig?.resources?.optimizeUsage) {
        emitTerminalEvent("Otimizando uso de recursos...", 'info');
        const savedPercentage = optimizeResources();
        emitTerminalEvent(`Otimização concluída: ${savedPercentage}% economizado`, 'success');
      }
      
      emitTerminalEvent("Processamento concluído com sucesso", 'success');
      setIsProcessing(false);
      
      // Garantir que temos conteúdo na resposta
      if (!responseContent.trim()) {
        responseContent = "Não foi possível gerar uma resposta. Por favor, tente novamente.";
      }
      
      console.log("Resposta final gerada:", responseContent);
      return createBotMessage(responseContent, selectedModelId, toolsUsed.length > 0 ? toolsUsed : undefined);
    } catch (error) {
      setIsProcessing(false);
      console.error("Error generating response:", error);
      emitTerminalEvent(`Erro: ${error instanceof Error ? error.message : String(error)}`, 'error');
      return createBotMessage(
        "Desculpe, houve um erro ao processar sua mensagem. Por favor, tente novamente.",
        "error", // Model ID como "error"
        undefined // Sem ferramentas
      );
    }
  };

  return {
    generateBotResponse,
    selectModelForTask,
    isProcessing
  };
};
