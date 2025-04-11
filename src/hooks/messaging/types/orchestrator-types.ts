
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
