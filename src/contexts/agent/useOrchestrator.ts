import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

// Default configurations
const DEFAULT_ORCHESTRATOR_CONFIG = {
  name: "Orquestrador Neural",
  description: "O Orquestrador Neural é a camada central e inteligente responsável por comandar, direcionar e conectar todos os fluxos de raciocínio, ação e execução de um ecossistema de agentes de IA.",
  selectedModel: "",
  memory: {
    enabled: true,
    type: "buffer",
    capacity: 10,
    userPromptEnabled: true // Habilita prompts para confirmar salvamento na memória
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
  },
  multiAgent: {
    enabled: false,
    collaborationMode: "sequential"
  }
};

export const useOrchestrator = () => {
  const { toast } = useToast();
  
  // Orchestrator config
  const [orchestratorConfig, setOrchestratorConfig] = useState<any>(() => {
    try {
      const savedConfig = localStorage.getItem("inventu_orchestrator_config");
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        if (parsedConfig && typeof parsedConfig === 'object' && Object.keys(parsedConfig).length > 0) {
          console.log("Configuração do orquestrador carregada:", parsedConfig);
          
          // Garantir que as flags enabled sejam interpretadas corretamente
          if (parsedConfig.memory) {
            parsedConfig.memory.enabled = parsedConfig.memory.enabled !== false;
          }
          
          if (parsedConfig.reasoning) {
            parsedConfig.reasoning.enabled = parsedConfig.reasoning.enabled !== false;
          }
          
          if (parsedConfig.planning) {
            parsedConfig.planning.enabled = parsedConfig.planning.enabled === true;
          }
          
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
    try {
      const savedState = localStorage.getItem("inventu_orchestrator_state");
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        return parsedState;
      }
    } catch (e) {
      console.error("Erro ao carregar estado do orquestrador:", e);
    }
    
    return {
      conversations: [],
      tasks: [],
      metrics: {
        responseTime: [],
        tokenUsage: []
      },
      memory: {
        entries: [],
        pendingConfirmations: []
      },
      users: {}
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
      ...DEFAULT_ORCHESTRATOR_CONFIG, // Usar default para garantir que todas as propriedades existam
      ...config,
      name: "Orquestrador Neural", // Nome fixo
      description: "O Orquestrador Neural é a camada central e inteligente responsável por comandar, direcionar e conectar todos os fluxos de raciocínio, ação e execução de um ecossistema de agentes de IA." // Descrição fixa
    };
    
    // Garantir que as flags enabled sejam tratadas corretamente
    if (updatedConfig.memory) {
      updatedConfig.memory.enabled = updatedConfig.memory.enabled !== false;
    }
    
    if (updatedConfig.reasoning) {
      updatedConfig.reasoning.enabled = updatedConfig.reasoning.enabled !== false;
    }
    
    if (updatedConfig.planning) {
      updatedConfig.planning.enabled = updatedConfig.planning.enabled === true;
    }
    
    console.log("Salvando configuração do orquestrador:", updatedConfig);
    localStorage.setItem("inventu_orchestrator_config", JSON.stringify(updatedConfig));
    setOrchestratorConfig(updatedConfig);
    
    toast({
      title: "Orquestrador Neural Atualizado",
      description: "A configuração do orquestrador foi salva com sucesso"
    });
  };

  const updateOrchestratorState = (state: any) => {
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
  
  // Add memory entry for specific user
  const addMemoryEntry = (userId: string, entry: { key: string, value: any, source: string, timestamp: Date }) => {
    const users = orchestratorState.users || {};
    const userMemory = users[userId]?.memory || [];
    
    const updatedUsers = {
      ...users,
      [userId]: {
        ...users[userId],
        memory: [...userMemory, entry]
      }
    };
    
    const updatedState = {
      ...orchestratorState,
      users: updatedUsers
    };
    
    localStorage.setItem("inventu_orchestrator_state", JSON.stringify(updatedState));
    setOrchestratorState(updatedState);
  };
  
  // Request confirmation for memory entry
  const requestMemoryConfirmation = (userId: string, entry: { key: string, value: any, source: string }) => {
    if (!orchestratorConfig.memory?.userPromptEnabled) {
      // Se confirmação não está habilitada, salvar diretamente
      addMemoryEntry(userId, { ...entry, timestamp: new Date() });
      return;
    }
    
    const pendingConfirmations = orchestratorState.memory?.pendingConfirmations || [];
    
    const updatedState = {
      ...orchestratorState,
      memory: {
        ...orchestratorState.memory,
        pendingConfirmations: [...pendingConfirmations, { userId, entry, timestamp: new Date() }]
      }
    };
    
    localStorage.setItem("inventu_orchestrator_state", JSON.stringify(updatedState));
    setOrchestratorState(updatedState);
    
    return { userId, entry };
  };
  
  // Process memory confirmation
  const processMemoryConfirmation = (confirmationId: number, approved: boolean) => {
    const pendingConfirmations = orchestratorState.memory?.pendingConfirmations || [];
    
    if (pendingConfirmations[confirmationId]) {
      const { userId, entry } = pendingConfirmations[confirmationId];
      
      if (approved) {
        addMemoryEntry(userId, { ...entry, timestamp: new Date() });
      }
      
      // Remove from pending
      const updatedPending = pendingConfirmations.filter((_, index) => index !== confirmationId);
      
      const updatedState = {
        ...orchestratorState,
        memory: {
          ...orchestratorState.memory,
          pendingConfirmations: updatedPending
        }
      };
      
      localStorage.setItem("inventu_orchestrator_state", JSON.stringify(updatedState));
      setOrchestratorState(updatedState);
    }
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
  
  // Create user database
  const createUserDatabase = (userId: string, userData = {}) => {
    if (orchestratorState.users?.[userId]) {
      console.log(`Database for user ${userId} already exists`);
      return false;
    }
    
    const updatedState = {
      ...orchestratorState,
      users: {
        ...orchestratorState.users,
        [userId]: {
          created: new Date(),
          memory: [],
          preferences: {},
          ...userData
        }
      }
    };
    
    localStorage.setItem("inventu_orchestrator_state", JSON.stringify(updatedState));
    setOrchestratorState(updatedState);
    
    console.log(`Created database for user ${userId}`);
    return true;
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
    requestMemoryConfirmation,
    processMemoryConfirmation,
    createUserDatabase,
    addMemoryEntry,
    optimizeResources
  };
};
