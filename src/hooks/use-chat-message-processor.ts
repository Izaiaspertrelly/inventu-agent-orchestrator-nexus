
import { useState } from "react";
import { Message } from "../types";
import { extractToolCalls, createBotMessage } from "../utils/chatUtils";
import { useToast } from "@/hooks/use-toast";
import { useAgent } from "../contexts/AgentContext";

export const useChatMessageProcessor = () => {
  const { toast } = useToast();
  const { selectModelForTask, executeMCPTool, mcpConfig, models, agents, orchestratorConfig } = useAgent();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Função para encontrar o agente correto baseado no modelo selecionado
  const findAgentByModel = (modelId: string) => {
    return agents.find(agent => agent.modelId === modelId);
  };
  
  // Encontrar o agente orquestrador baseado no ID configurado
  const getOrchestratorAgent = () => {
    if (!orchestratorConfig || !orchestratorConfig.mainAgentId) {
      return null;
    }
    return agents.find(agent => agent.id === orchestratorConfig.mainAgentId);
  };
  
  // Processo de orquestração de agentes
  const orchestrateAgentResponse = async (userMessage: string, agent: any) => {
    try {
      console.log("Orquestrando resposta usando agente:", agent?.name);
      
      // Tentar analisar a configuração do agente
      let agentConfig: any = {};
      try {
        agentConfig = JSON.parse(agent.configJson || "{}");
        console.log("Configuração do agente carregada:", agentConfig);
      } catch (e) {
        console.error("Erro ao analisar configuração do agente:", e);
      }
      
      // Usar configurações do orquestrador se este agente for o orquestrador principal
      let useOrchestratorConfig = false;
      if (orchestratorConfig && orchestratorConfig.mainAgentId === agent.id) {
        console.log("Este agente é o orquestrador principal, usando configurações centrais");
        useOrchestratorConfig = true;
      }
      
      // Verificar capacidades do orquestrador - com validação para evitar o erro
      const orchestratorSettings = useOrchestratorConfig ? orchestratorConfig : (agentConfig.orchestrator || {});
      const memory = orchestratorSettings.memory || { enabled: false };
      const reasoning = orchestratorSettings.reasoning || { enabled: false };
      const planning = orchestratorSettings.planning || { enabled: false };
      
      let responseContent = "";
      
      // Indicar se este é o orquestrador principal
      if (useOrchestratorConfig) {
        responseContent += `[Orquestrador Neural] `;
      } else {
        responseContent += `[Agente: ${agent.name}] `;
      }
      
      // Processar com memória se habilitado
      if (memory.enabled) {
        responseContent += `[Memória ${memory.type}] Memória processada. `;
      }
      
      // Processar com raciocínio se habilitado
      if (reasoning.enabled) {
        const depth = reasoning.depth || 1;
        responseContent += `[Raciocínio profundidade ${depth}] Analisando consulta com raciocínio. `;
      }
      
      // Processar com planejamento se habilitado
      if (planning.enabled) {
        responseContent += `[Planejamento] Criando plano de ação. `;
      }
      
      // Adicionar resposta baseada no modelo do agente
      const model = models.find(m => m.id === agent.modelId);
      responseContent += `Usando ${model?.name || agent.modelId} para processar: "${userMessage}"`;
      
      return responseContent;
    } catch (error) {
      console.error("Erro na orquestração do agente:", error);
      return `Erro ao processar com o agente: ${error.message}`;
    }
  };
  
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
        const useOrchestrator = orchestratorConfig && orchestratorConfig.memory?.enabled;
        
        if (useOrchestrator) {
          console.log("Usando orquestrador para processar a mensagem");
          const orchestratedResponse = await orchestrateAgentResponse(userMessage, orchestratorAgent);
          setIsProcessing(false);
          return createBotMessage(orchestratedResponse, orchestratorAgent.modelId);
        }
      }
      
      // Se não usamos o orquestrador ou ele não está configurado, usamos o fluxo normal
      
      // Encontrar o agente associado ao modelo selecionado
      const agent = findAgentByModel(selectedModelId);
      console.log("Agente encontrado para o modelo selecionado:", agent?.name);
      
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
              // Fixed: Pass the tool object instead of just the ID
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
      
      // Se um agente foi encontrado e está configurado, use o orquestrador
      if (agent) {
        const orchestratedResponse = await orchestrateAgentResponse(userMessage, agent);
        responseContent += orchestratedResponse;
      } else {
        // Fallback para o comportamento anterior se nenhum agente for encontrado
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
