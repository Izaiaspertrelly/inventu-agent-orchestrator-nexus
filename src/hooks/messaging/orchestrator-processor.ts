
import { AgentInfo } from "./types/orchestrator-types";
import { generateDynamicResponse } from "./utils/response-generator";

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
    const isMainOrchestrator = agent.id === "virtual-orchestrator";
    
    // Check orchestrator capabilities - with validation to avoid errors
    const orchestratorSettings = isMainOrchestrator ? JSON.parse(agent.configJson) : (agentConfig.orchestrator || {});
    const memory = orchestratorSettings.memory || { enabled: false };
    const reasoning = orchestratorSettings.reasoning || { enabled: false };
    const planning = orchestratorSettings.planning || { enabled: false };
    const monitoring = orchestratorSettings.monitoring || { enabled: false };
    
    // Build response based on capabilities and message content
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
      
      // Simplified task decomposition example
      const subtasks = [
        `Understand the query: "${userMessage.substring(0, 30)}..."`,
        "Retrieve relevant information from context",
        "Formulate response based on available information"
      ];
      
      // Register task decomposition
      decomposeTask?.(taskId, userMessage, subtasks);
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
