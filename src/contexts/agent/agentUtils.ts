
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

// Helper function to normalize URL with proper format
const normalizeUrl = (baseUrl: string, endpoint: string): string => {
  // Remove trailing slash from baseUrl if it exists
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  // Add leading slash to endpoint if it doesn't exist
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  return `${cleanBaseUrl}${cleanEndpoint}`;
};

export const executeMCPTool = async (tool: MCPTool, params: Record<string, any>) => {
  console.log(`Executing tool ${tool.name} with method ${tool.method} to endpoint ${tool.endpoint}`);
  console.log(`Parameters:`, params);
  
  try {
    // Prepare the full URL - if the endpoint starts with http, use it as is, otherwise prepend the server URL
    let url = tool.endpoint;
    if (!url.startsWith('http')) {
      const baseUrl = window.localStorage.getItem('mcpServerUrl');
      
      if (!baseUrl) {
        throw new Error("MCP Server URL not configured");
      }
      
      url = normalizeUrl(baseUrl, tool.endpoint);
    }
    
    console.log(`Executing request to: ${url}`);
    
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
    
    console.log(`Request headers:`, Object.keys(headers).join(', '));
    
    // Prepare the request options
    const options: RequestInit = {
      method: tool.method,
      headers,
      mode: 'cors',
    };
    
    // Add body for POST, PUT, PATCH requests
    if (['POST', 'PUT', 'PATCH'].includes(tool.method)) {
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
    
    // Simulate a delay for UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Make the actual request
    console.log(`Making ${tool.method} request to ${url}`);
    const response = await fetch(url, options);
    
    // Handle non-OK responses
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP Error ${response.status}: ${errorText}`);
      throw new Error(`HTTP Error ${response.status}: ${errorText}`);
    }
    
    // Parse and return the response
    const data = await response.json();
    console.log(`Response data:`, data);
    
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
