
import { useState } from "react";
import { Agent } from "@/types";

// Default agent array
const DEFAULT_AGENTS: Agent[] = [];

export const useAgents = () => {
  const [agents, setAgents] = useState<Agent[]>(() => {
    const savedAgents = localStorage.getItem("inventu_agents");
    return savedAgents ? JSON.parse(savedAgents) : DEFAULT_AGENTS;
  });

  const updateLocalStorage = (updatedAgents: Agent[]) => {
    localStorage.setItem("inventu_agents", JSON.stringify(updatedAgents));
  };

  const addAgent = (agent: Agent) => {
    // Skip adding if this is an orchestrator agent
    if (agent.name === "Orquestrador Neural") {
      console.log("Skipping orchestrator agent addition to agents list");
      return;
    }
    
    setAgents((prev) => {
      // Prevent adding duplicates
      if (prev.some(a => a.id === agent.id)) {
        console.log("Agent with this ID already exists, skipping");
        return prev;
      }
      
      const updated = [...prev, agent];
      updateLocalStorage(updated);
      return updated;
    });
  };

  const updateAgent = (id: string, agentUpdate: Partial<Agent>) => {
    // Skip updating if this is the orchestrator
    if (agentUpdate.name === "Orquestrador Neural") {
      console.log("Skipping orchestrator agent update in agents list");
      return;
    }
    
    setAgents((prev) => {
      const updated = prev.map((agent) => 
        agent.id === id ? { ...agent, ...agentUpdate } : agent
      );
      updateLocalStorage(updated);
      return updated;
    });
  };

  const removeAgent = (id: string) => {
    setAgents((prev) => {
      const updated = prev.filter((agent) => agent.id !== id);
      updateLocalStorage(updated);
      return updated;
    });
  };

  // Get all agents except the orchestrator
  const getRegularAgents = () => {
    return agents.filter(agent => agent.name !== "Orquestrador Neural");
  };

  return {
    agents: getRegularAgents(),
    rawAgents: agents,
    addAgent,
    updateAgent,
    removeAgent,
  };
};
