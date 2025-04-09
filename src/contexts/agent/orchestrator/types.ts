
// Types for the orchestrator functionality

export interface OrchestratorConfig {
  name: string;
  description: string;
  selectedModel: string;
  mainAgentId?: string;
  memory?: {
    enabled: boolean;
    type: string;
    capacity: number;
    userPromptEnabled: boolean;
  };
  reasoning?: {
    enabled: boolean;
    depth: number;
    strategy: string;
    dynamicSteps: boolean;
  };
  planning?: {
    enabled: boolean;
    horizon: number;
    strategy: string;
    adaptive: boolean;
  };
  multiAgent?: {
    enabled: boolean;
    collaborationMode: string;
  };
  resources?: {
    maxTokens: number;
    optimizeUsage: boolean;
  };
}

export interface OrchestratorState {
  conversations: Array<{ role: string; content: string; timestamp: Date }>;
  tasks: Array<{ id: string; task: string; subtasks: string[]; completed: boolean }>;
  metrics: {
    responseTime: Array<{ value: number; timestamp: Date }>;
    tokenUsage: Array<{ value: number; timestamp: Date }>;
  };
  memory: {
    entries: Array<any>;
    pendingConfirmations: Array<{
      userId: string;
      entry: {
        key: string;
        value: any;
        label?: string;
        source: string;
      };
      timestamp: Date;
    }>;
  };
  users: Record<string, UserData>;
}

export interface UserData {
  created: Date;
  memory: Array<{
    key: string;
    value: any;
    source: string;
    timestamp: Date;
  }>;
  preferences: Record<string, any>;
  [key: string]: any;
}

export interface MemoryEntry {
  key: string;
  value: any;
  source: string;
  timestamp: Date;
  label?: string;
}
