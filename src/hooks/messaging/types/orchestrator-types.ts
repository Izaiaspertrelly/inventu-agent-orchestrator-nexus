
// Basic types for the orchestrator

// Memory confirmation interface
export interface MemoryConfirmation {
  id: number;
  userId: string;
  entry: {
    key: string;
    value: any;
    source: string;
  };
}

// Agent information interface
export interface AgentInfo {
  id: string;
  name: string;
  description?: string;
  configJson?: string;
  modelId?: string;
  role?: string;
}

// Orchestrator message interface
export interface OrchestratorMessage {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'function' | 'tool';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Task decomposition interface
export interface TaskDecomposition {
  taskId: string;
  mainTask: string;
  subtasks: string[];
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt?: Date;
}

// Performance metrics interface
export interface PerformanceMetrics {
  responseTime: number[];
  tokenUsage: number[];
  sessionStart: Date;
  sessionEnd?: Date;
}

// OpenAI multi-agent orchestration interfaces
export interface OpenAIAgent {
  id: string;
  name: string;
  role: string;
  model: string;
  systemPrompt: string;
  tools: string[];
}

export interface OpenAIAgentGroup {
  id: string;
  name: string;
  description: string;
  agents: string[];
  coordinator: string;
}
