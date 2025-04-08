
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
    depth: 5,
    strategy: "chain-of-thought",
    enabled: true,
    dynamicSteps: true
  },
  planning: {
    enabled: true,
    horizon: 10,
    strategy: "goal-decomposition",
    adaptive: true
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
    lastUpdated: new Date(),
    promptEngineering: {
      originalPrompt: "",
      enhancedPrompt: "",
      steps: [],
      reasoning: []
    }
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
  
  // Decompor uma tarefa em subtarefas com suporte para número dinâmico de etapas
  const decomposeTask = (taskId: string, task: string, subtasks: string[]) => {
    setOrchestratorState(prev => {
      // Armazenar o prompt original para análise
      let promptEngineering = {
        ...prev.promptEngineering,
        originalPrompt: task
      };
      
      // Determinar o número adequado de passos com base na complexidade
      let stepsCount = orchestratorConfig.reasoning.depth || 5;
      
      // Ajustar dinamicamente se habilitado
      if (orchestratorConfig.reasoning.dynamicSteps) {
        // Estimar complexidade pelo tamanho do prompt e outros fatores
        const promptLength = task.length;
        const hasComplexTerms = /complex|detailed|elaborate|comprehensive|step by step/i.test(task);
        
        if (promptLength > 500 || hasComplexTerms) {
          stepsCount = Math.min(15, stepsCount + 5); // Aumentar para até 15 passos
        } else if (promptLength < 100) {
          stepsCount = Math.max(2, stepsCount - 2); // Reduzir para no mínimo 2 passos
        }
      }
      
      // Criar um prompt aprimorado com engenharia de prompt
      const enhancedPrompt = `Analisando sua solicitação: "${task.substring(0, 100)}${task.length > 100 ? '...' : ''}"\n\n` +
        `Vou decompor e abordar esta tarefa em ${subtasks.length} etapas de forma estruturada.`;
      
      // Atualizar o estado de engenharia de prompt
      promptEngineering = {
        ...promptEngineering,
        enhancedPrompt,
        steps: subtasks,
        reasoning: [
          `Complexidade estimada: ${stepsCount} passos de raciocínio`,
          `Abordagem: ${orchestratorConfig.reasoning.strategy}`,
          `Planejamento adaptativo: ${orchestratorConfig.planning.adaptive ? "Ativado" : "Desativado"}`
        ]
      };
      
      const updatedDecomposition = {
        ...prev.taskDecomposition,
        [taskId]: {
          mainTask: task,
          subtasks,
          status: "in_progress",
          createdAt: new Date(),
          stepsCount
        }
      };
      
      return {
        ...prev,
        taskDecomposition: updatedDecomposition,
        promptEngineering,
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
  
  // Processar e aprimorar o prompt do usuário com engenharia de prompt
  const enhanceUserPrompt = (userPrompt: string) => {
    if (!userPrompt) return { enhancedPrompt: "", reasoning: [] };
    
    // Analisar o prompt do usuário
    const isQuestion = userPrompt.endsWith('?');
    const hasTechnicalTerms = /api|function|code|data|system|integration/i.test(userPrompt);
    const isLongPrompt = userPrompt.length > 300;
    
    // Determinar a complexidade adequada para a resposta
    let targetSteps = orchestratorConfig.reasoning.depth;
    if (orchestratorConfig.reasoning.dynamicSteps) {
      if (isLongPrompt || hasTechnicalTerms) {
        targetSteps = Math.min(15, targetSteps + 3);
      } else if (isQuestion && !hasTechnicalTerms) {
        targetSteps = Math.max(2, targetSteps - 2);
      }
    }
    
    // Construir raciocínio para aprimoramento do prompt
    const reasoning = [
      `Tipo de consulta: ${isQuestion ? 'Pergunta' : 'Instrução/Comando'}`,
      `Complexidade técnica: ${hasTechnicalTerms ? 'Alta' : 'Média/Baixa'}`,
      `Extensão da consulta: ${isLongPrompt ? 'Longa' : 'Média/Curta'}`,
      `Passos de raciocínio planejados: ${targetSteps}`
    ];
    
    // Não alteramos o prompt original do usuário, mas fornecemos contexto sobre como ele será processado
    return {
      enhancedPrompt: userPrompt,
      reasoning,
      targetSteps
    };
  };

  return {
    orchestratorConfig,
    orchestratorState,
    updateOrchestratorConfig,
    updateOrchestratorState,
    addToConversationHistory,
    decomposeTask,
    recordPerformanceMetric,
    optimizeResources,
    enhanceUserPrompt
  };
};
