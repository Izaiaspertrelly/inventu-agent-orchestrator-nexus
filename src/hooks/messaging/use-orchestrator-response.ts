
import { useState, useEffect } from "react";
import { useAgent } from "../../contexts/AgentContext";

export const useOrchestratorResponse = () => {
  const { agents, orchestratorConfig, orchestratorState, addToConversationHistory, recordPerformanceMetric, decomposeTask } = useAgent();
  
  // State to control memory confirmation pending status
  const [pendingMemoryConfirmation, setPendingMemoryConfirmation] = useState(null);
  
  // Monitor pending confirmations
  useEffect(() => {
    const pendingConfirmations = orchestratorState?.memory?.pendingConfirmations || [];
    if (pendingConfirmations.length > 0 && !pendingMemoryConfirmation) {
      // Get first pending confirmation
      setPendingMemoryConfirmation({
        id: 0,
        ...pendingConfirmations[0]
      });
    } else if (pendingConfirmations.length === 0 && pendingMemoryConfirmation) {
      // Clear when no more pending confirmations
      setPendingMemoryConfirmation(null);
    }
  }, [orchestratorState?.memory?.pendingConfirmations, pendingMemoryConfirmation]);
  
  // Function to find the correct agent based on selected model
  const findAgentByModel = (modelId: string) => {
    return agents.find(agent => agent.modelId === modelId);
  };
  
  // Find orchestrator agent based on configured ID or selected model
  const getOrchestratorAgent = () => {
    // Primeiro tenta encontrar um agente pelo ID configurado
    if (orchestratorConfig && orchestratorConfig.mainAgentId) {
      const agent = agents.find(agent => agent.id === orchestratorConfig.mainAgentId);
      if (agent) {
        console.log("Found orchestrator agent by ID:", agent.name);
        return agent;
      }
      console.log("Configured agent ID not found, trying by model ID");
    }
    
    // Se não encontrou pelo ID ou não tem ID configurado, tenta pelo modelo
    if (orchestratorConfig && orchestratorConfig.selectedModel) {
      const agent = agents.find(agent => agent.modelId === orchestratorConfig.selectedModel);
      if (agent) {
        console.log("Found orchestrator agent by model ID:", agent.name);
        return agent;
      }
      
      // Se não encontrou um agente para este modelo, mas temos um modelo, criamos um agente virtual
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
  
  // Agent orchestration process
  const orchestrateAgentResponse = async (userMessage: string, agent: any) => {
    const startTime = Date.now();
    try {
      console.log("Orchestrating response using agent:", agent?.name || "Virtual Orchestrator");
      
      // Register user message in conversation history
      addToConversationHistory?.({
        role: "user",
        content: userMessage,
        timestamp: new Date()
      });
      
      // Try to parse agent configuration
      let agentConfig: any = {};
      try {
        agentConfig = JSON.parse(agent.configJson || "{}");
        console.log("Agent configuration loaded:", agentConfig);
      } catch (e) {
        console.error("Error parsing agent configuration:", e);
      }
      
      // Use orchestrator settings if this agent is the main orchestrator
      let useOrchestratorConfig = false;
      if (orchestratorConfig && (orchestratorConfig.mainAgentId === agent.id || agent.id === "virtual-orchestrator")) {
        console.log("Using central orchestrator configuration");
        useOrchestratorConfig = true;
      }
      
      // Check orchestrator capabilities - with validation to avoid errors
      const orchestratorSettings = useOrchestratorConfig ? orchestratorConfig : (agentConfig.orchestrator || {});
      const memory = orchestratorSettings.memory || { enabled: false };
      const reasoning = orchestratorSettings.reasoning || { enabled: false };
      const planning = orchestratorSettings.planning || { enabled: false };
      const monitoring = orchestratorSettings.monitoring || { enabled: false };
      
      let responseContent = "";
      
      // Indicate if this is the main orchestrator
      if (useOrchestratorConfig) {
        responseContent += `[Orquestrador Neural] `;
      } else {
        responseContent += `[Agente: ${agent.name}] `;
      }
      
      // Planning process if enabled
      if (planning.enabled) {
        // Create unique task ID
        const taskId = `task-${Date.now()}`;
        
        // Simplified task decomposition example
        const subtasks = [
          `Understand the query: "${userMessage.substring(0, 30)}..."`,
          "Retrieve relevant information from context",
          "Formulate response based on available information"
        ];
        
        // Register task decomposition
        decomposeTask?.(taskId, userMessage, subtasks);
        
        responseContent += `[Planejamento] Decompondo tarefa em ${subtasks.length} subtarefas. `;
      }
      
      // Process with memory if enabled
      if (memory.enabled) {
        const historyCount = orchestratorState?.conversationHistory?.length || 0;
        responseContent += `[Memória ${memory.type || "buffer"}] Processando com contexto de ${historyCount} mensagens anteriores. `;
      }
      
      // Process with reasoning if enabled
      if (reasoning.enabled) {
        const depth = reasoning.depth || 1;
        const strategy = reasoning.strategy || "padrão";
        responseContent += `[Raciocínio profundidade ${depth}] Analisando consulta com raciocínio ${strategy}. `;
      }
      
      // Monitoring and adaptation if enabled
      if (monitoring.enabled) {
        const optimizedTokens = orchestratorSettings.resources?.optimizeUsage 
          ? `Uso otimizado de tokens (max: ${orchestratorSettings.resources?.maxTokens || 2000}). `
          : "";
        
        responseContent += `[Monitoramento] ${optimizedTokens}`;
      }
      
      // Build main response based on the agent
      responseContent += `\n\nAnalisando sua solicitação: "${userMessage}"\n\n`;
      
      if (planning.enabled) {
        responseContent += "Dividi esta tarefa em passos menores para melhor processamento.\n\n";
      }
      
      // Generate response based on message content
      if (userMessage.toLowerCase().includes("api") || userMessage.toLowerCase().includes("chave")) {
        responseContent += "Observei que você mencionou uma API ou chave. Vou guardar esta informação para referência futura, se você autorizar.";
      } else if (userMessage.toLowerCase().includes("ajuda") || userMessage.toLowerCase().includes("como")) {
        responseContent += "Estou aqui para ajudar! Vejo que você está procurando assistência. Vou utilizar todas as ferramentas disponíveis para resolver sua dúvida da melhor forma possível.";
      } else {
        responseContent += "Processando sua solicitação com as ferramentas e conhecimento disponíveis para gerar a melhor resposta possível.";
      }
      
      // Register response time for performance analysis
      const responseTime = Date.now() - startTime;
      recordPerformanceMetric?.("responseTime", responseTime);
      
      // Estimate and register token usage (simplified)
      const estimatedTokens = Math.ceil(userMessage.length / 4) + Math.ceil(responseContent.length / 4);
      recordPerformanceMetric?.("tokenUsage", estimatedTokens);
      
      // Register agent response in conversation history
      addToConversationHistory?.({
        role: "assistant",
        content: responseContent,
        timestamp: new Date()
      });
      
      return responseContent;
    } catch (error) {
      console.error("Error in agent orchestration:", error);
      return `Error processing with agent: ${error.message}`;
    }
  };

  return {
    findAgentByModel,
    getOrchestratorAgent,
    orchestrateAgentResponse,
    pendingMemoryConfirmation,
    setPendingMemoryConfirmation
  };
};
