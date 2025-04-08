
import { useState, useEffect } from "react";

// Default configurations
const DEFAULT_ORCHESTRATOR_CONFIG = {
  name: "Orquestrador Neural",
  description: "O Orquestrador Neural é a camada central e inteligente responsável por comandar, direcionar e conectar todos os fluxos de raciocínio, ação e execução de um ecossistema de agentes de IA.",
  selectedModel: "",
  memory: {
    enabled: true,
    type: "buffer",
    capacity: 10
  },
  reasoning: {
    enabled: true,
    depth: 5,
    strategy: "chain-of-thought",
    dynamicSteps: true
  },
  planning: {
    enabled: false,
    horizon: 15,
    strategy: "goal-decomposition",
    adaptive: true
  }
};

export const useOrchestrator = () => {
  // Orchestrator config
  const [orchestratorConfig, setOrchestratorConfig] = useState<any>(() => {
    try {
      const savedConfig = localStorage.getItem("inventu_orchestrator_config");
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        if (parsedConfig && typeof parsedConfig === 'object' && Object.keys(parsedConfig).length > 0) {
          console.log("Configuração do orquestrador carregada:", parsedConfig);
          return parsedConfig;
        }
      }
    } catch (e) {
      console.error("Erro ao carregar configuração do orquestrador:", e);
    }
    console.log("Usando configuração padrão do orquestrador");
    return DEFAULT_ORCHESTRATOR_CONFIG;
  });
  
  // Orchestrator state for runtime information
  const [orchestratorState, setOrchestratorState] = useState<any>(() => {
    return {
      conversations: [],
      tasks: [],
      metrics: {
        responseTime: [],
        tokenUsage: []
      }
    };
  });

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

  const updateOrchestratorConfig = (config: any) => {
    // Garantir que as propriedades obrigatórias estão presentes
    const updatedConfig = {
      ...config,
      name: "Orquestrador Neural", // Nome fixo
      description: "O Orquestrador Neural é a camada central e inteligente responsável por comandar, direcionar e conectar todos os fluxos de raciocínio, ação e execução de um ecossistema de agentes de IA." // Descrição fixa
    };
    
    console.log("Salvando configuração do orquestrador:", updatedConfig);
    localStorage.setItem("inventu_orchestrator_config", JSON.stringify(updatedConfig));
    setOrchestratorConfig(updatedConfig);
  };

  const updateOrchestratorState = (state: any) => {
    setOrchestratorState((prev: any) => ({
      ...prev,
      ...state
    }));
  };
  
  // Add message to conversation history
  const addToConversationHistory = (message: { role: string; content: string; timestamp: Date }) => {
    setOrchestratorState((prev: any) => ({
      ...prev,
      conversations: [...(prev.conversations || []), message]
    }));
  };
  
  // Record decomposed task
  const decomposeTask = (taskId: string, task: string, subtasks: string[]) => {
    setOrchestratorState((prev: any) => ({
      ...prev,
      tasks: [...(prev.tasks || []), { id: taskId, task, subtasks, completed: false }]
    }));
  };
  
  // Record performance metric
  const recordPerformanceMetric = (metric: "responseTime" | "tokenUsage", value: number) => {
    setOrchestratorState((prev: any) => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        [metric]: [...(prev.metrics[metric] || []), { value, timestamp: new Date() }]
      }
    }));
  };
  
  // Optimize resources (simulation)
  const optimizeResources = (): number => {
    // In a real implementation, this would analyze usage patterns and adjust resource allocation
    // For now, just return a simulated optimization percentage
    return Math.floor(Math.random() * 15) + 5; // 5-20% optimization
  };

  return {
    orchestratorConfig,
    orchestratorState,
    updateOrchestratorConfig,
    updateOrchestratorState,
    addToConversationHistory,
    decomposeTask,
    recordPerformanceMetric,
    optimizeResources
  };
};
