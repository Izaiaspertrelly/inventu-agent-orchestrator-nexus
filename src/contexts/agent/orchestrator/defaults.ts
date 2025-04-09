
// Default configurations for the orchestrator

import { OrchestratorConfig, OrchestratorState } from './types';

export const DEFAULT_ORCHESTRATOR_CONFIG: OrchestratorConfig = {
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

export const DEFAULT_ORCHESTRATOR_STATE: OrchestratorState = {
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
