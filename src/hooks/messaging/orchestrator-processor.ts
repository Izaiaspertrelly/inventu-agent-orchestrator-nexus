
import { AgentInfo } from "./types/orchestrator-types";
import { generateDynamicResponse } from "./utils/response-generator";
import { v4 as uuidv4 } from 'uuid';

/**
 * Process a user message using the orchestrator agent
 */
export const orchestrateAgentResponse = async (
  userMessage: string,
  agent: AgentInfo,
  addToConversationHistory?: (message: { role: string; content: string; timestamp: Date }) => void,
  decomposeTask?: (taskId: string, task: string, subtasks: string[]) => void,
  recordPerformanceMetric?: (metric: "responseTime" | "tokenUsage", value: number) => void
): Promise<string> => {
  const startTime = Date.now();
  
  // Terminal event emitter
  const emitTerminalEvent = (content: string, type: 'command' | 'output' | 'error' | 'info' | 'success') => {
    const event = new CustomEvent('terminal-update', { 
      detail: { content, type } 
    });
    document.dispatchEvent(event);
  };
  
  try {
    console.log("Orchestrating response using agent:", agent?.name || "Virtual Orchestrator");
    emitTerminalEvent(`Orquestrando resposta com ${agent?.name || "Orquestrador Neural"}`, 'info');
    
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
    const isMainOrchestrator = agent.id === "virtual-orchestrator";
    
    // Check orchestrator capabilities - with validation to avoid errors
    const orchestratorSettings = isMainOrchestrator ? JSON.parse(agent.configJson) : (agentConfig.orchestrator || {});
    const memory = orchestratorSettings.memory || { enabled: false };
    const reasoning = orchestratorSettings.reasoning || { enabled: false };
    const planning = orchestratorSettings.planning || { enabled: false };
    const monitoring = orchestratorSettings.monitoring || { enabled: false };
    
    // Show memory access in terminal
    if (memory.enabled) {
      emitTerminalEvent("Acessando memória de contexto...", 'info');
      await new Promise(resolve => setTimeout(resolve, 500));
      emitTerminalEvent("Memória carregada com sucesso", 'success');
    }
    
    // Show reasoning process in terminal
    if (reasoning.enabled) {
      emitTerminalEvent("Iniciando processo de raciocínio...", 'info');
      await new Promise(resolve => setTimeout(resolve, 700));
      emitTerminalEvent(`Profundidade de raciocínio: ${reasoning.depth || 2}`, 'output');
      await new Promise(resolve => setTimeout(resolve, 300));
      emitTerminalEvent("Raciocínio concluído", 'success');
    }
    
    // Build response based on capabilities and message content
    emitTerminalEvent("Gerando resposta para o usuário...", 'info');
    const responseContent = generateDynamicResponse(userMessage, {
      memory,
      reasoning,
      planning,
      monitoring
    });
    
    // Planning process if enabled
    if (planning.enabled) {
      // Create unique task ID
      const taskId = `task-${Date.now()}`;
      emitTerminalEvent("Planejando execução da tarefa...", 'info');
      
      // Simplified task decomposition example
      const subtasks = [
        `Understand the query: "${userMessage.substring(0, 30)}..."`,
        "Retrieve relevant information from context",
        "Formulate response based on available information"
      ];
      
      // Show subtasks in terminal
      emitTerminalEvent(`Decompondo tarefa em ${subtasks.length} subtarefas:`, 'output');
      for (let i = 0; i < subtasks.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 300));
        emitTerminalEvent(`Subtarefa ${i+1}: ${subtasks[i]}`, 'output');
      }
      
      // Register task decomposition
      decomposeTask?.(taskId, userMessage, subtasks);
      emitTerminalEvent("Planejamento concluído", 'success');
    }
    
    // Register response time for performance analysis
    const responseTime = Date.now() - startTime;
    recordPerformanceMetric?.("responseTime", responseTime);
    emitTerminalEvent(`Tempo de resposta: ${responseTime}ms`, 'output');
    
    // Estimate and register token usage (simplified)
    const estimatedTokens = Math.ceil(userMessage.length / 4) + Math.ceil(responseContent.length / 4);
    recordPerformanceMetric?.("tokenUsage", estimatedTokens);
    emitTerminalEvent(`Tokens utilizados (estimado): ${estimatedTokens}`, 'output');
    
    // Register agent response in conversation history
    addToConversationHistory?.({
      role: "assistant",
      content: responseContent,
      timestamp: new Date()
    });
    
    emitTerminalEvent("Processamento concluído com sucesso", 'success');
    return responseContent;
  } catch (error) {
    console.error("Error in agent orchestration:", error);
    emitTerminalEvent(`Erro: ${error.message}`, 'error');
    return `Error processing with agent: ${error.message}`;
  }
};
