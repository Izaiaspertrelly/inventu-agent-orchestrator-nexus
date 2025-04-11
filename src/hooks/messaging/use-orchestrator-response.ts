
import { useState, useEffect } from "react";
import { useAgent } from "../../contexts/AgentContext";
import { MemoryConfirmation } from "./types/orchestrator-types";
import { findAgentByModel, getOrchestratorAgent } from "./agent-finder";
import { orchestrateAgentResponse } from "./orchestrator-processor";

/**
 * Hook para lidar com respostas do orquestrador e gerenciamento de memória
 */
export const useOrchestratorResponse = () => {
  const { 
    agents, 
    orchestratorConfig, 
    orchestratorState, 
    addToConversationHistory, 
    recordPerformanceMetric, 
    decomposeTask 
  } = useAgent();
  
  // State para controlar status pendente de confirmação de memória
  const [pendingMemoryConfirmation, setPendingMemoryConfirmation] = useState<MemoryConfirmation | null>(null);
  
  // Monitorar confirmações pendentes
  useEffect(() => {
    const pendingConfirmations = orchestratorState?.memory?.pendingConfirmations || [];
    if (pendingConfirmations.length > 0 && !pendingMemoryConfirmation) {
      setPendingMemoryConfirmation({
        id: pendingConfirmations[0].id || 0,
        userId: pendingConfirmations[0].userId,
        entry: pendingConfirmations[0].entry,
        timestamp: pendingConfirmations[0].timestamp || new Date()
      });
    } else if (pendingConfirmations.length === 0 && pendingMemoryConfirmation) {
      setPendingMemoryConfirmation(null);
    }
  }, [orchestratorState?.memory?.pendingConfirmations, pendingMemoryConfirmation]);

  // Função para encontrar o agente pelo ID do modelo
  const findAgentByModelId = (modelId: string) => {
    return findAgentByModel(agents, modelId);
  };

  // Obter o agente orquestrador
  const getOrchAgent = () => {
    return getOrchestratorAgent(agents, orchestratorConfig);
  };

  // Orquestrar resposta do agente com eventos do terminal
  const orchestrateResponse = async (userMessage: string, agent: any) => {
    // Encontrar manipuladores de eventos do terminal registrados
    const terminalEvent = (content: string, type: string) => {
      const event = new CustomEvent('terminal-update', { 
        detail: { content, type } 
      });
      document.dispatchEvent(event);
    };
    
    // Emitir eventos iniciais
    terminalEvent("Iniciando processamento do Orquestrador Neural", "command");
    
    // Se o agente tem capacidades, emitir eventos para elas
    if (agent.configJson) {
      try {
        const config = JSON.parse(agent.configJson);
        
        if (config.memory?.enabled) {
          terminalEvent("Ativando subsistema de memória", "info");
        }
        
        if (config.reasoning?.enabled) {
          terminalEvent(`Ativando raciocínio com profundidade ${config.reasoning.depth || 2}`, "info");
        }
        
        if (config.planning?.enabled) {
          terminalEvent("Ativando planejamento para tarefas complexas", "info");
        }
      } catch (e) {
        console.error("Erro ao analisar configuração do agente:", e);
      }
    }
    
    // Rastrear tempo de processamento
    const startTime = Date.now();
    
    // Emitir eventos-chave durante o processamento
    terminalEvent("Analisando mensagem do usuário", "info");
    await new Promise(r => setTimeout(r, 300));
    terminalEvent("Interpretando solicitação", "info");
    await new Promise(r => setTimeout(r, 500));
    
    // Executar a orquestração real
    const response = await orchestrateAgentResponse(
      userMessage,
      agent,
      addToConversationHistory,
      decomposeTask,
      recordPerformanceMetric
    );
    
    // Eventos finais
    const processingTime = ((Date.now() - startTime) / 1000).toFixed(2);
    terminalEvent(`Processamento concluído em ${processingTime}s`, "success");
    
    return response;
  };

  return {
    findAgentByModel: findAgentByModelId,
    getOrchestratorAgent: getOrchAgent,
    orchestrateAgentResponse: orchestrateResponse,
    pendingMemoryConfirmation,
    setPendingMemoryConfirmation
  };
};
