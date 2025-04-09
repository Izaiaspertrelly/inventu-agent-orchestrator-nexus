
import { useState } from "react";
import { DEFAULT_ORCHESTRATOR_STATE } from "./defaults";
import { OrchestratorState } from "./types";

export const useOrchestratorState = () => {
  // Orchestrator state for runtime information
  const [orchestratorState, setOrchestratorState] = useState<OrchestratorState>(() => {
    try {
      const savedState = localStorage.getItem("inventu_orchestrator_state");
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        return parsedState;
      }
    } catch (e) {
      console.error("Erro ao carregar estado do orquestrador:", e);
    }
    
    return DEFAULT_ORCHESTRATOR_STATE;
  });

  const updateOrchestratorState = (state: Partial<OrchestratorState>) => {
    const updatedState = {
      ...orchestratorState,
      ...state
    };
    
    localStorage.setItem("inventu_orchestrator_state", JSON.stringify(updatedState));
    setOrchestratorState(updatedState);
  };
  
  // Add message to conversation history
  const addToConversationHistory = (message: { role: string; content: string; timestamp: Date }) => {
    const updatedState = {
      ...orchestratorState,
      conversations: [...(orchestratorState.conversations || []), message]
    };
    
    localStorage.setItem("inventu_orchestrator_state", JSON.stringify(updatedState));
    setOrchestratorState(updatedState);
  };
  
  // Record decomposed task
  const decomposeTask = (taskId: string, task: string, subtasks: string[]) => {
    const updatedState = {
      ...orchestratorState,
      tasks: [...(orchestratorState.tasks || []), { id: taskId, task, subtasks, completed: false }]
    };
    
    localStorage.setItem("inventu_orchestrator_state", JSON.stringify(updatedState));
    setOrchestratorState(updatedState);
  };
  
  // Record performance metric
  const recordPerformanceMetric = (metric: "responseTime" | "tokenUsage", value: number) => {
    const updatedMetrics = {
      ...orchestratorState.metrics,
      [metric]: [...(orchestratorState.metrics?.[metric] || []), { value, timestamp: new Date() }]
    };
    
    const updatedState = {
      ...orchestratorState,
      metrics: updatedMetrics
    };
    
    localStorage.setItem("inventu_orchestrator_state", JSON.stringify(updatedState));
    setOrchestratorState(updatedState);
  };

  return {
    orchestratorState,
    updateOrchestratorState,
    addToConversationHistory,
    decomposeTask,
    recordPerformanceMetric,
  };
};
