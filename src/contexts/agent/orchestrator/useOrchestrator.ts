
import { useEffect } from "react";
import { OrchestratorConfig, OrchestratorState } from "./types";
import { useOrchestratorConfig } from "./useOrchestratorConfig";
import { useOrchestratorState } from "./useOrchestratorState";
import { useMemoryManagement } from "./useMemoryManagement";
import { useUserManagement } from "./useUserManagement";
import { useResourceOptimization } from "./useResourceOptimization";

export const useOrchestrator = () => {
  const { orchestratorConfig, updateOrchestratorConfig } = useOrchestratorConfig();
  const { 
    orchestratorState, 
    updateOrchestratorState, 
    addToConversationHistory,
    decomposeTask,
    recordPerformanceMetric 
  } = useOrchestratorState();
  const { requestMemoryConfirmation, processMemoryConfirmation, addMemoryEntry } = useMemoryManagement();
  const { createUserDatabase } = useUserManagement();
  const { optimizeResources } = useResourceOptimization();

  // Efeito para verificar se há um orquestrador salvo na lista de agentes
  // e remover qualquer referência para evitar duplicação
  useEffect(() => {
    // Remover referências antigas do orquestrador dos agentes
    const savedAgents = localStorage.getItem("inventu_agents");
    if (savedAgents) {
      try {
        const agents = JSON.parse(savedAgents);
        const filteredAgents = agents.filter((agent: any) => 
          agent.name !== "Orquestrador Neural"
        );
        
        // Se houve mudança, atualizar localStorage
        if (filteredAgents.length !== agents.length) {
          localStorage.setItem("inventu_agents", JSON.stringify(filteredAgents));
        }
      } catch (e) {
        console.error("Erro ao filtrar agentes:", e);
      }
    }
  }, []);

  return {
    orchestratorConfig,
    orchestratorState,
    updateOrchestratorConfig,
    updateOrchestratorState,
    addToConversationHistory,
    decomposeTask,
    recordPerformanceMetric,
    requestMemoryConfirmation,
    processMemoryConfirmation,
    createUserDatabase,
    addMemoryEntry,
    optimizeResources
  };
};
