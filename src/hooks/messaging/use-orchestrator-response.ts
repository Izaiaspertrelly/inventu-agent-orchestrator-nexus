
import { useState } from "react";
import { Agent } from "@/types";
import { useAgent } from "@/contexts/AgentContext";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface MemoryConfirmation {
  id: number;
  userId: string;
  entry: {
    key: string;
    value: string;
    label: string;
    source: string;
  };
  timestamp: Date;
}

export const useOrchestratorResponse = () => {
  const { agents, orchestratorConfig } = useAgent();
  const [pendingMemoryConfirmation, setPendingMemoryConfirmation] = useState<MemoryConfirmation | null>(null);
  
  const [memorySuggestions, setMemorySuggestions] = useLocalStorage<MemoryConfirmation[]>("inventu_memory_suggestions", []);
  
  // Find agent by model ID
  const findAgentByModel = (modelId: string): Agent | null => {
    return agents.find(agent => agent.modelId === modelId) || null;
  };
  
  // Get the orchestrator agent
  const getOrchestratorAgent = (): Agent | null => {
    if (!orchestratorConfig || !orchestratorConfig.mainAgentId) {
      return null;
    }
    
    return agents.find(agent => agent.id === orchestratorConfig.mainAgentId) || null;
  };
  
  // Orchestrate agent response (for simulation)
  const orchestrateAgentResponse = async (userMessage: string, agent: Agent): Promise<string> => {
    // Process user message and check for potential memory information
    analyzeMessageForMemorySuggestions(userMessage);
    
    // Process any pending memory suggestions
    const pendingSuggestion = memorySuggestions[0];
    if (pendingSuggestion && !pendingMemoryConfirmation) {
      setPendingMemoryConfirmation(pendingSuggestion);
    }
    
    // Simple orchestration simulation for now
    return `[Orquestrador Neural está processando sua mensagem usando o agente: ${agent.name}]`;
  };
  
  // Analyze message for potential memory items
  const analyzeMessageForMemorySuggestions = (message: string) => {
    // Patterns for detecting common information in messages
    const patterns = [
      { regex: /API\s+[kK]ey\s*[=:is]?\s*["']?([a-zA-Z0-9_\-\.]+)["']?/, label: "API Key", key: "api_key" },
      { regex: /(?:usa|utiliza|con|tem conta no)\s+([a-zA-Z0-9_\-\.]+)/i, label: "Serviço utilizado", key: "service" },
      { regex: /meu\s+(?:nome|usuário)\s+(?:é|eh|e)\s+["']?([a-zA-Z0-9_\-\.]+)["']?/i, label: "Nome de usuário", key: "username" },
      { regex: /(?:empresa|companhia)\s+(?:é|eh|e)\s+["']?([a-zA-Z0-9_\-\.]+)["']?/i, label: "Empresa", key: "company" },
      { regex: /(?:estou usando|usarei|uso)\s+(?:o|a)?\s+Docker/i, label: "Tecnologia", key: "technology", value: "Docker" },
      { regex: /(?:estou usando|usarei|uso)\s+(?:o)?\s+Monday/i, label: "Serviço", key: "service", value: "Monday" },
      { regex: /(?:estou usando|usarei|uso)\s+(?:o)?\s+Jira/i, label: "Serviço", key: "service", value: "Jira" },
      { regex: /(?:estou usando|usarei|uso)\s+(?:o)?\s+Slack/i, label: "Serviço", key: "service", value: "Slack" },
      { regex: /(?:estou usando|usarei|uso)\s+(?:o)?\s+GitHub/i, label: "Serviço", key: "service", value: "GitHub" },
    ];
    
    const userId = localStorage.getItem('temp_user_id') || "default-user";
    const suggestions: MemoryConfirmation[] = [];
    
    // Check for matches in the message
    patterns.forEach(pattern => {
      let match: RegExpExecArray | null = null;
      if (pattern.value) {
        // If the pattern already has a predefined value, just check if the pattern matches
        if (pattern.regex.test(message)) {
          const suggestion = {
            id: Date.now() + suggestions.length,
            userId,
            entry: {
              key: pattern.key,
              value: pattern.value,
              label: pattern.label,
              source: "message_analysis"
            },
            timestamp: new Date()
          };
          suggestions.push(suggestion);
        }
      } else {
        // Extract the value from the message
        match = pattern.regex.exec(message);
        if (match && match[1]) {
          const suggestion = {
            id: Date.now() + suggestions.length,
            userId,
            entry: {
              key: pattern.key,
              value: match[1],
              label: pattern.label,
              source: "message_analysis"
            },
            timestamp: new Date()
          };
          suggestions.push(suggestion);
        }
      }
    });
    
    if (suggestions.length > 0) {
      // Fix #1: Properly type the function parameter
      setMemorySuggestions((prev: MemoryConfirmation[]) => [...prev, ...suggestions]);
      return true;
    }
    
    return false;
  };
  
  const acceptMemorySuggestion = (id: number) => {
    const suggestion = memorySuggestions.find(s => s.id === id);
    if (!suggestion) return;
    
    // Add to knowledge base through the Orchestrator
    // This would typically interact with your knowledge database
    
    // Remove from pending suggestions
    // Fix #2: Properly type the function parameter
    setMemorySuggestions((prev: MemoryConfirmation[]) => prev.filter(s => s.id !== id));
    setPendingMemoryConfirmation(null);
    
    // Check for next suggestion
    const nextSuggestion = memorySuggestions.find(s => s.id !== id);
    if (nextSuggestion) {
      setPendingMemoryConfirmation(nextSuggestion);
    }
  };
  
  const declineMemorySuggestion = (id: number) => {
    // Remove from pending suggestions
    // Fix #3: Properly type the function parameter
    setMemorySuggestions((prev: MemoryConfirmation[]) => prev.filter(s => s.id !== id));
    setPendingMemoryConfirmation(null);
    
    // Check for next suggestion
    const nextSuggestion = memorySuggestions.find(s => s.id !== id);
    if (nextSuggestion) {
      setPendingMemoryConfirmation(nextSuggestion);
    }
  };

  return {
    findAgentByModel,
    getOrchestratorAgent,
    orchestrateAgentResponse,
    analyzeMessageForMemorySuggestions,
    pendingMemoryConfirmation,
    setPendingMemoryConfirmation,
    acceptMemorySuggestion,
    declineMemorySuggestion,
    memorySuggestions
  };
};
