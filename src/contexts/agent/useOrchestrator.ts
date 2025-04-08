
import { useState, useEffect } from "react";

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
    horizon: 5,
    strategy: "goal-decomposition"
  },
  resources: {
    maxTokens: 4000,
    optimizeUsage: true
  },
  monitoring: {
    enabled: true,
    adaptiveBehavior: true
  }
};

export const useOrchestrator = () => {
  const [orchestratorConfig, setOrchestratorConfig] = useState(() => {
    const savedConfig = localStorage.getItem("inventu_orchestrator");
    return savedConfig ? JSON.parse(savedConfig) : DEFAULT_ORCHESTRATOR_CONFIG;
  });

  const [orchestratorState, setOrchestratorState] = useState({
    activeContextId: null,
    conversationHistory: [],
    taskDecomposition: {},
    performanceMetrics: {
      responseTime: [],
      tokenUsage: [],
      successRate: 100
    },
    lastUpdated: new Date()
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
  
  // Função para atualizar o estado do orquestrador
  const updateOrchestratorState = (stateUpdate: Partial<typeof orchestratorState>) => {
    setOrchestratorState(prev => {
      const updated = { ...prev, ...stateUpdate, lastUpdated: new Date() };
      return updated;
    });
  };
  
  // Adicionar uma mensagem ao histórico de conversas
  const addToConversationHistory = (message: { role: string; content: string; timestamp: Date }) => {
    setOrchestratorState(prev => {
      const updatedHistory = [...prev.conversationHistory, message];
      
      // Manter apenas as últimas X mensagens se a memória for do tipo buffer
      const memoryCapacity = orchestratorConfig.memory.capacity || 10;
      const limitedHistory = orchestratorConfig.memory.type === "buffer" 
        ? updatedHistory.slice(-memoryCapacity) 
        : updatedHistory;
      
      return {
        ...prev,
        conversationHistory: limitedHistory,
        lastUpdated: new Date()
      };
    });
  };
  
  // Decompor uma tarefa em subtarefas
  const decomposeTask = (taskId: string, task: string, subtasks: string[]) => {
    setOrchestratorState(prev => {
      const updatedDecomposition = {
        ...prev.taskDecomposition,
        [taskId]: {
          mainTask: task,
          subtasks,
          status: "in_progress",
          createdAt: new Date()
        }
      };
      
      return {
        ...prev,
        taskDecomposition: updatedDecomposition,
        lastUpdated: new Date()
      };
    });
  };
  
  // Registrar métricas de desempenho
  const recordPerformanceMetric = (metric: "responseTime" | "tokenUsage", value: number) => {
    setOrchestratorState(prev => {
      const metrics = [...prev.performanceMetrics[metric], value];
      // Manter apenas as últimas 50 métricas para evitar crescimento excessivo
      const limitedMetrics = metrics.slice(-50);
      
      return {
        ...prev,
        performanceMetrics: {
          ...prev.performanceMetrics,
          [metric]: limitedMetrics
        },
        lastUpdated: new Date()
      };
    });
  };
  
  // Otimizar uso de recursos com base em métricas e configuração
  const optimizeResources = () => {
    if (!orchestratorConfig.resources.optimizeUsage) return orchestratorConfig.resources.maxTokens;
    
    // Lógica simples de otimização baseada em métricas de desempenho
    const avgResponseTime = orchestratorState.performanceMetrics.responseTime.length > 0
      ? orchestratorState.performanceMetrics.responseTime.reduce((a, b) => a + b, 0) / 
        orchestratorState.performanceMetrics.responseTime.length
      : 0;
    
    // Se o tempo de resposta for muito alto, reduzir o uso de tokens
    if (avgResponseTime > 5000) {
      return Math.max(orchestratorConfig.resources.maxTokens * 0.8, 1000); // Nunca abaixo de 1000
    }
    
    return orchestratorConfig.resources.maxTokens;
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
