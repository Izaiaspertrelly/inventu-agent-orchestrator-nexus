
// Define shared types for the orchestrator functionality

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

export interface OrchestratorCapabilities {
  memory?: {
    enabled: boolean;
  };
  reasoning?: {
    enabled: boolean;
    strategy?: string;
  };
  planning?: {
    enabled: boolean;
  };
  monitoring?: {
    enabled: boolean;
  };
}

export interface AgentInfo {
  id: string;
  name: string;
  modelId: string;
  configJson: string;
}
