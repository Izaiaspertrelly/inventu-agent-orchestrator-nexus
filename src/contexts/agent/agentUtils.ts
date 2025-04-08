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
  
  try {
    // Prepare the full URL - if the endpoint starts with http, use it as is, otherwise prepend the server URL
    let url = tool.endpoint;
    if (!url.startsWith('http')) {
      // Remove trailing slash from serverUrl if it exists
      const baseUrl = tool.endpoint.startsWith('/') 
        ? window.localStorage.getItem('mcpServerUrl')?.replace(/\/$/, '') 
        : window.localStorage.getItem('mcpServerUrl');
      
      if (!baseUrl) {
        throw new Error("MCP Server URL not configured");
      }
      
      url = `${baseUrl}${tool.endpoint.startsWith('/') ? '' : '/'}${tool.endpoint}`;
    }
    
    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Add auth key if present
    if (tool.authKey) {
      headers['Authorization'] = `Bearer ${tool.authKey}`;
    }
    
    // Add MCP API key if present
    const mcpApiKey = window.localStorage.getItem('mcpApiKey');
    if (mcpApiKey) {
      headers['X-API-Key'] = mcpApiKey;
    }
    
    // Prepare the request options
    const options: RequestInit = {
      method: tool.method,
      headers,
    };
    
    // Add body for POST, PUT, PATCH requests
    if (tool.method === 'POST' || tool.method === 'PUT' || tool.method === 'PATCH') {
      options.body = JSON.stringify(params);
    }
    
    // For GET requests, append params to URL
    if (tool.method === 'GET' && Object.keys(params).length > 0) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        queryParams.append(key, String(value));
      });
      url = `${url}?${queryParams.toString()}`;
    }
    
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Make the actual request
    const response = await fetch(url, options);
    
    // Handle non-OK responses
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error ${response.status}: ${errorText}`);
    }
    
    // Parse and return the response
    const data = await response.json();
    
    return {
      success: true,
      toolName: tool.name,
      method: tool.method,
      endpoint: url,
      params,
      result: data,
      timestamp: new Date().toISOString(),
    };
    
  } catch (error) {
    console.error("Error executing MCP tool:", error);
    return {
      success: false,
      toolName: tool.name,
      method: tool.method,
      endpoint: tool.endpoint,
      params,
      error: String(error),
      timestamp: new Date().toISOString(),
    };
  }
};
