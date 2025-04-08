
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
  
  // Importar hooks específicos para cada funcionalidade
  const { findAgentByModel, getOrchestratorAgent, orchestrateAgentResponse } = useOrchestratorResponse();
  const { executeToolsFromMessage, processFileUpload } = useToolExecutor();
  const { generateModelBasedResponse } = useModelResponse();
  
  // Detectar informações potencialmente importantes para memória
  const detectImportantInformation = (userMessage: string) => {
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
      }
    }
    
    return detectedInfo;
  };
  
  // Process the bot's response
  const generateBotResponse = async (userMessage: string, selectedModelId: string, file?: File | null): Promise<Message> => {
    setIsProcessing(true);
    
    try {
      console.log(`Gerando resposta usando modelo: ${selectedModelId}`);
      
      // 1. RECEBIMENTO DA TAREFA
      console.log("Passo 1: Recebimento da tarefa");
      // Gerar ID de usuário temporário (em uma implementação real, viria da autenticação)
      const userId = localStorage.getItem('temp_user_id') || uuidv4();
      localStorage.setItem('temp_user_id', userId);
      
      // Criar base de dados para o usuário se não existir
      createUserDatabase(userId);
      
      // Otimizar recursos se necessário
      const optimizedTokenLimit = optimizeResources ? optimizeResources() : 4000;
      console.log(`Limite otimizado de tokens: ${optimizedTokenLimit}`);
      
      // 2. PLANEJAMENTO
      console.log("Passo 2: Planejamento");
      // Verificar se temos um orquestrador configurado
      const orchestratorAgent = getOrchestratorAgent();
      
      let responseContent = "";
      let toolsUsed: string[] = [];
      
      if (orchestratorAgent) {
        console.log("Orquestrador encontrado:", orchestratorAgent.name);
        
        // Criar ID único para a tarefa
        const taskId = `task-${Date.now()}`;
        
        // Determinar subtasks baseado na configuração do orquestrador
        const useSteps = orchestratorConfig?.planning?.enabled || false;
        
        // 3. PROCESSAMENTO PELO MODELO
        console.log("Passo 3: Processamento pelo modelo");
        if (useSteps) {
          // Exemplo simplificado de decomposição de tarefas
          const subtasks = [
            `Entender a consulta: "${userMessage.substring(0, 30)}..."`,
            "Recuperar informações relevantes do contexto",
            "Identificar ferramentas necessárias",
            "Formular resposta com base nas informações disponíveis"
          ];
          
          // Registrar a decomposição da tarefa no orquestrador
          if (orchestratorConfig?.planning?.enabled) {
            console.log("Registrando decomposição de tarefa:", subtasks);
          }
        }
        
        // 4. EXECUÇÃO DE FERRAMENTAS
        console.log("Passo 4: Execução de ferramentas");
        // Executar ferramentas se necessário
        const toolResult = await executeToolsFromMessage(userMessage);
        toolsUsed = toolResult.toolsUsed;
        responseContent += toolResult.responseContent;
        
        // Processar arquivo se enviado
        const fileResponse = processFileUpload(file);
        responseContent += fileResponse;
        
        // 5 & 6. INTEGRAÇÃO DE RESULTADOS E GERAÇÃO DE RESPOSTA
        console.log("Passos 5 e 6: Integração de resultados e geração de resposta");
        // Orquestrar a resposta com o agente principal
        const orchestratedResponse = await orchestrateAgentResponse(userMessage, orchestratorAgent);
        responseContent += orchestratedResponse;
        
        // 7. ATUALIZAÇÃO DE MEMÓRIA
        console.log("Passo 7: Atualização de memória");
        // Detectar informações importantes
        const importantInfo = detectImportantInformation(userMessage);
        
        // Solicitar confirmação para salvar na memória
        if (importantInfo.length > 0 && orchestratorConfig?.memory?.userPromptEnabled) {
          console.log("Informações importantes detectadas:", importantInfo);
          
          // Para cada informação importante, solicitar confirmação
          for (const info of importantInfo) {
            requestMemoryConfirmation(userId, info);
            
            // Adicionar mensagem sobre a informação detectada
            responseContent += `\n\nDetectei que você mencionou ${info.label}: "${info.value}". Gostaria de salvar isso para referência futura?`;
          }
        }
        
        // Simular delay para UI
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        // Fallback para processamento simples sem orquestrador
        console.log("Nenhum orquestrador configurado, usando processamento simples");
        
        // Encontrar o agente associado ao modelo selecionado
        const agent = findAgentByModel(selectedModelId);
        
        // Executar ferramentas
        const toolResult = await executeToolsFromMessage(userMessage);
        toolsUsed = toolResult.toolsUsed;
        responseContent += toolResult.responseContent;
        
        // Processar arquivo
        const fileResponse = processFileUpload(file);
        responseContent += fileResponse;
        
        // Gerar resposta
        responseContent += generateModelBasedResponse(userMessage, selectedModelId, agent);
      }
      
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
