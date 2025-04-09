
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

  // Orchestrate agent response
  const orchestrateResponse = async (userMessage: string, agent: any) => {
    return orchestrateAgentResponse(
      userMessage,
      agent,
      addToConversationHistory,
      decomposeTask,
      recordPerformanceMetric
    );
  };

  return {
    findAgentByModel: findAgentByModelId,
    getOrchestratorAgent: getOrchAgent,
    orchestrateAgentResponse: orchestrateResponse,
    pendingMemoryConfirmation,
    setPendingMemoryConfirmation
  };
};
