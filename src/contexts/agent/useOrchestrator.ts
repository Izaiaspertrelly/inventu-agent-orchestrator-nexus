
import { useState } from "react";

// Configuração padrão do orquestrador
const DEFAULT_ORCHESTRATOR_CONFIG = {
  mainAgentId: "",
  memory: {
    type: "buffer",
    capacity: 10,
    enabled: true
  },
  reasoning: {
    depth: 2,
    strategy: "chain-of-thought",
    enabled: true
  },
  planning: {
    enabled: false,
    horizon: 5
  }
};

export const useOrchestrator = () => {
  const [orchestratorConfig, setOrchestratorConfig] = useState(() => {
    const savedConfig = localStorage.getItem("inventu_orchestrator");
    return savedConfig ? JSON.parse(savedConfig) : DEFAULT_ORCHESTRATOR_CONFIG;
  });

  const updateLocalStorage = (updatedConfig: any) => {
    localStorage.setItem("inventu_orchestrator", JSON.stringify(updatedConfig));
  };

  const updateOrchestratorConfig = (config: any) => {
    setOrchestratorConfig((prev: any) => {
      const updated = { ...prev, ...config };
      updateLocalStorage(updated);
      return updated;
    });
  };

  return {
    orchestratorConfig,
    updateOrchestratorConfig,
  };
};
