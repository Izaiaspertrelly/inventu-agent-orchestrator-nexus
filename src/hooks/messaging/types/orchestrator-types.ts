
export interface AgentInfo {
  id: string;
  name: string;
  description?: string;
  configJson?: string;
  modelId?: string;
  role?: 'assistant' | 'orchestrator' | 'specialist';
}

export interface MemoryConfirmation {
  id: number;
  userId: string;
  entry: {
    key: string;
    value: any;
    label?: string;
    source: string;
  };
  timestamp: Date;
}

export interface OpenAIAgentConfig {
  id: string;
  name: string;
  description?: string;
  instructions?: string;
  model: string;
  role: 'orchestrator' | 'specialist' | 'assistant';
  tools?: OpenAIAgentTool[];
  metadata?: Record<string, any>;
}

export interface OpenAIAgentTool {
  id: string;
  name: string;
  description?: string;
  type: 'function' | 'retrieval' | 'code_interpreter';
  parameters?: Record<string, any>;
}

export interface OpenAIAgentTeam {
  id: string;
  name: string;
  description?: string;
  orchestratorId: string;
  assistantIds: string[];
  metadata?: Record<string, any>;
}

export interface OpenAIRunStatus {
  id: string;
  teamId: string;
  status: 'queued' | 'in_progress' | 'completed' | 'failed';
  query: string;
  response?: string;
  startTime: Date;
  endTime?: Date;
  error?: string;
}
