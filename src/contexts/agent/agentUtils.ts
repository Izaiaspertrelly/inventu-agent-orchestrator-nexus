
import { MCPTool, Agent } from "@/types";

// Função para selecionar o modelo com base em agentes configurados
export const selectModelForTask = async (taskDescription: string, agents?: Agent[], orchestratorConfig?: any): Promise<string> => {
  console.log("Selecionando modelo para tarefa:", taskDescription);
  console.log("Agentes disponíveis:", agents?.length || 0);
  console.log("Configuração do orquestrador:", orchestratorConfig);
  
  // Se temos um orquestrador configurado, tente usar o agente principal dele
  if (orchestratorConfig && orchestratorConfig.mainAgentId && agents) {
    const orchestratorAgent = agents.find(agent => agent.id === orchestratorConfig.mainAgentId);
    if (orchestratorAgent && orchestratorAgent.modelId) {
      console.log("Usando modelo do agente orquestrador:", orchestratorAgent.name);
      return orchestratorAgent.modelId;
    }
  }
  
  // Se temos agentes configurados, tente usar o mais adequado
  if (agents && agents.length > 0) {
    // Por enquanto, simplesmente use o primeiro agente disponível
    // Em uma implementação mais avançada, poderíamos analisar o texto para determinar o agente mais adequado
    console.log("Usando o agente:", agents[0].name);
    return agents[0].modelId;
  }
  
  // Fallback para a lógica original se não há agentes
  const lowerCaseTask = taskDescription.toLowerCase();
  
  if (lowerCaseTask.includes("image") || 
      lowerCaseTask.includes("picture") || 
      lowerCaseTask.includes("photo") ||
      lowerCaseTask.includes("imagem") ||
      lowerCaseTask.includes("foto")) {
    return "ideogram";
  } else if (lowerCaseTask.includes("analyze") || 
             lowerCaseTask.includes("reason") ||
             lowerCaseTask.includes("research") ||
             lowerCaseTask.includes("deep dive") ||
             lowerCaseTask.includes("análise") ||
             lowerCaseTask.includes("pesquisa") ||
             lowerCaseTask.includes("analisar")) {
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

// Função para testar a conexão com o servidor MCP
export const testMCPConnection = async (serverUrl: string, apiKey: string): Promise<boolean> => {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (apiKey) {
      headers['X-API-Key'] = apiKey;
    }
    
    const response = await fetch(serverUrl, {
      method: 'GET',
      headers,
      mode: 'cors'
    });
    
    return response.ok;
  } catch (error) {
    console.error("Erro ao testar conexão MCP:", error);
    return false;
  }
};

export const executeMCPTool = async (tool: MCPTool, params: Record<string, any>) => {
  console.log(`Executando ferramenta ${tool.name} com método ${tool.method} no endpoint ${tool.endpoint}`);
  console.log(`Parâmetros:`, params);
  
  try {
    // Prepare the full URL - if the endpoint starts with http, use it as is, otherwise prepend the server URL
    let url = tool.endpoint;
    if (!url.startsWith('http')) {
      const baseUrl = localStorage.getItem('inventu_mcp_config');
      const mcpConfig = baseUrl ? JSON.parse(baseUrl) : null;
      const serverUrl = mcpConfig?.serverUrl || localStorage.getItem('mcpServerUrl');
      
      if (!serverUrl) {
        throw new Error("URL do servidor MCP não configurada");
      }
      
      url = normalizeUrl(serverUrl, tool.endpoint);
    }
    
    console.log(`Executando requisição para: ${url}`);
    
    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Add auth key if present
    if (tool.authKey) {
      headers['Authorization'] = `Bearer ${tool.authKey}`;
    }
    
    // Add MCP API key if present
    const mcpConfig = localStorage.getItem('inventu_mcp_config');
    const parsedConfig = mcpConfig ? JSON.parse(mcpConfig) : null;
    const mcpApiKey = parsedConfig?.apiKey || localStorage.getItem('mcpApiKey');
    
    if (mcpApiKey) {
      headers['X-API-Key'] = mcpApiKey;
    }
    
    console.log(`Cabeçalhos da requisição:`, Object.keys(headers).join(', '));
    
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
    console.log(`Fazendo requisição ${tool.method} para ${url}`);
    const response = await fetch(url, options);
    
    // Handle non-OK responses
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro HTTP ${response.status}: ${errorText}`);
      throw new Error(`Erro HTTP ${response.status}: ${errorText}`);
    }
    
    // Parse and return the response
    const data = await response.json();
    console.log(`Dados de resposta:`, data);
    
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
    console.error("Erro ao executar ferramenta MCP:", error);
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
