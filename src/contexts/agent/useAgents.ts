
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
    setAgents((prev) => {
      const updated = [...prev, agent];
      updateLocalStorage(updated);
      return updated;
    });
  };

  const updateAgent = (id: string, agentUpdate: Partial<Agent>) => {
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

  return {
    agents,
    addAgent,
    updateAgent,
    removeAgent,
  };
};
