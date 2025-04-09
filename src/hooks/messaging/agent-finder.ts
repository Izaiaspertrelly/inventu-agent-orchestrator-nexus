
import { AgentInfo } from "./types/orchestrator-types";

/**
 * Functions to find and select appropriate agents
 */
export const findAgentByModel = (agents: Array<any>, modelId: string) => {
  return agents.find(agent => agent.modelId === modelId);
};

/**
 * Find orchestrator agent based on configured ID or selected model
 */
export const getOrchestratorAgent = (agents: Array<any>, orchestratorConfig: any): AgentInfo | null => {
  if (orchestratorConfig && orchestratorConfig.mainAgentId) {
    const agent = agents.find(agent => agent.id === orchestratorConfig.mainAgentId);
    if (agent) {
      console.log("Found orchestrator agent by ID:", agent.name);
      return agent;
    }
    console.log("Configured agent ID not found, trying by model ID");
  }
  
  if (orchestratorConfig && orchestratorConfig.selectedModel) {
    const agent = agents.find(agent => agent.modelId === orchestratorConfig.selectedModel);
    if (agent) {
      console.log("Found orchestrator agent by model ID:", agent.name);
      return agent;
    }
    
    console.log("No agent found for this model, creating virtual agent");
    return {
      id: "virtual-orchestrator",
      name: "Orquestrador Neural",
      modelId: orchestratorConfig.selectedModel,
      configJson: JSON.stringify(orchestratorConfig)
    };
  }
  
  console.log("No orchestrator agent configuration found");
  return null;
};
