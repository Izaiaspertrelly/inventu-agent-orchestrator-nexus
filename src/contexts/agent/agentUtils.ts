
import { MCPTool } from "@/types";

export const selectModelForTask = async (taskDescription: string): Promise<string> => {
  const lowerCaseTask = taskDescription.toLowerCase();
  
  if (lowerCaseTask.includes("image") || 
      lowerCaseTask.includes("picture") || 
      lowerCaseTask.includes("photo")) {
    return "ideogram";
  } else if (lowerCaseTask.includes("analyze") || 
             lowerCaseTask.includes("reason") ||
             lowerCaseTask.includes("research") ||
             lowerCaseTask.includes("deep dive")) {
    return "deepseek-r1";
  } else {
    return "minimax";
  }
};

export const executeMCPTool = async (tool: MCPTool, params: Record<string, any>) => {
  console.log(`Executing tool ${tool.name} with method ${tool.method} to endpoint ${tool.endpoint}`);
  console.log(`Parameters:`, params);
  
  // In a real implementation, this would make an HTTP request to the MCP server
  // based on the tool's method, endpoint, and parameters
  
  // For now, just simulate a delay and return a mock response
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // If tool has predefined parameters, merge them with passed params
  let mergedParams = params;
  if (tool.parameters) {
    try {
      const defaultParams = JSON.parse(tool.parameters);
      mergedParams = { ...defaultParams, ...params };
    } catch (error) {
      console.error("Error parsing tool parameters:", error);
    }
  }
  
  return {
    success: true,
    toolName: tool.name,
    method: tool.method,
    endpoint: tool.endpoint,
    params: mergedParams,
    result: `Simulated result from tool '${tool.name}' using ${tool.method} method`,
  };
};
