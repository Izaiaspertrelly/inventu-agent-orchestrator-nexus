
import { AgentInfo } from "./types/orchestrator-types";

/**
 * Find an agent by model ID
 */
export const findAgentByModel = (agents: any[], modelId: string): AgentInfo | null => {
  if (!agents || !modelId) return null;
  
  const agent = agents.find(agent => agent.modelId === modelId);
  if (!agent) return null;
  
  return {
    id: agent.id,
    name: agent.name,
    description: agent.description,
    configJson: agent.configJson,
    modelId: agent.modelId,
    role: agent.role || 'assistant'
  };
};

/**
 * Get the orchestrator agent based on orchestratorConfig
 */
export const getOrchestratorAgent = (agents: any[], orchestratorConfig: any): AgentInfo => {
  // Create a virtual orchestrator agent if no mainAgentId is specified
  if (!orchestratorConfig || !orchestratorConfig.mainAgentId) {
    return {
      id: "virtual-orchestrator",
      name: "Neural Orchestrator",
      description: "Virtual orchestration layer",
      configJson: orchestratorConfig ? JSON.stringify(orchestratorConfig) : "{}",
      role: "orchestrator"
    };
  }
  
  // Try to find the specified main agent
  const mainAgent = agents?.find(a => a.id === orchestratorConfig.mainAgentId);
  if (mainAgent) {
    return {
      id: mainAgent.id,
      name: mainAgent.name,
      description: mainAgent.description,
      configJson: orchestratorConfig ? JSON.stringify(orchestratorConfig) : "{}",
      modelId: mainAgent.modelId,
      role: "orchestrator"
    };
  }
  
  // Fallback to virtual orchestrator if the main agent is not found
  return {
    id: "virtual-orchestrator",
    name: "Neural Orchestrator",
    description: "Virtual orchestration layer (main agent not found)",
    configJson: orchestratorConfig ? JSON.stringify(orchestratorConfig) : "{}",
    role: "orchestrator"
  };
};
