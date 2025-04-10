
import { useState, useEffect } from "react";
import { useAgent } from "../../contexts/AgentContext";
import { MemoryConfirmation } from "./types/orchestrator-types";
import { findAgentByModel, getOrchestratorAgent } from "./agent-finder";
import { orchestrateAgentResponse } from "./orchestrator-processor";

/**
 * Hook for handling orchestrator responses and memory management
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
  
  // State to control memory confirmation pending status
  const [pendingMemoryConfirmation, setPendingMemoryConfirmation] = useState<MemoryConfirmation | null>(null);
  
  // Monitor pending confirmations
  useEffect(() => {
    const pendingConfirmations = orchestratorState?.memory?.pendingConfirmations || [];
    if (pendingConfirmations.length > 0 && !pendingMemoryConfirmation) {
      setPendingMemoryConfirmation({
        id: 0,
        ...pendingConfirmations[0]
      });
    } else if (pendingConfirmations.length === 0 && pendingMemoryConfirmation) {
      setPendingMemoryConfirmation(null);
    }
  }, [orchestratorState?.memory?.pendingConfirmations, pendingMemoryConfirmation]);

  // Function for finding the agent by model ID
  const findAgentByModelId = (modelId: string) => {
    return findAgentByModel(agents, modelId);
  };

  // Get the orchestrator agent
  const getOrchAgent = () => {
    return getOrchestratorAgent(agents, orchestratorConfig);
  };

  // Orchestrate agent response with terminal events
  const orchestrateResponse = async (userMessage: string, agent: any) => {
    // Find any terminal event handlers registered
    const terminalEvent = (content: string, type: string) => {
      const event = new CustomEvent('terminal-update', { 
        detail: { content, type } 
      });
      document.dispatchEvent(event);
    };
    
    // Emit initial events
    terminalEvent("Iniciando processamento do Orquestrador Neural", "command");
    
    // If agent has capabilities, emit events for them
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
        console.error("Error parsing agent config:", e);
      }
    }
    
    // Track processing time
    const startTime = Date.now();
    
    // Emit key events during processing
    terminalEvent("Analisando mensagem do usuário", "info");
    await new Promise(r => setTimeout(r, 300));
    terminalEvent("Interpretando solicitação", "info");
    await new Promise(r => setTimeout(r, 500));
    
    // Execute the actual orchestration
    const response = await orchestrateAgentResponse(
      userMessage,
      agent,
      addToConversationHistory,
      decomposeTask,
      recordPerformanceMetric
    );
    
    // Final events
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
