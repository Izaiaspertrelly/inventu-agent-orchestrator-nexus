
import { useState, useEffect } from "react";
import { MCPServerConfig, MCPTool } from "@/types";

// Default MCP configuration
const DEFAULT_MCP_CONFIG: MCPServerConfig = {
  serverUrl: "",
  apiKey: "",
  tools: [],
};

export const useMCPConfig = () => {
  const [mcpConfig, setMCPConfig] = useState<MCPServerConfig>(() => {
    const savedConfig = localStorage.getItem("inventu_mcp_config");
    
    // Check for older storage format where only serverUrl was stored directly
    const legacyServerUrl = localStorage.getItem("mcpServerUrl");
    const legacyApiKey = localStorage.getItem("mcpApiKey");
    
    if (savedConfig) {
      return JSON.parse(savedConfig);
    } else if (legacyServerUrl) {
      // Migrate from old format
      const config = { 
        ...DEFAULT_MCP_CONFIG, 
        serverUrl: legacyServerUrl,
        apiKey: legacyApiKey || "" 
      };
      localStorage.setItem("inventu_mcp_config", JSON.stringify(config));
      
      // Clean up legacy items
      localStorage.removeItem("mcpServerUrl");
      localStorage.removeItem("mcpApiKey");
      
      return config;
    }
    
    return DEFAULT_MCP_CONFIG;
  });

  // Sync with localStorage for backward compatibility
  useEffect(() => {
    localStorage.setItem("mcpServerUrl", mcpConfig.serverUrl || "");
    localStorage.setItem("mcpApiKey", mcpConfig.apiKey || "");
  }, [mcpConfig.serverUrl, mcpConfig.apiKey]);

  const updateLocalStorage = (config: MCPServerConfig) => {
    localStorage.setItem("inventu_mcp_config", JSON.stringify(config));
    
    // Update legacy items for backward compatibility
    localStorage.setItem("mcpServerUrl", config.serverUrl || "");
    localStorage.setItem("mcpApiKey", config.apiKey || "");
  };

  const updateMCPConfig = (config: Partial<MCPServerConfig>) => {
    setMCPConfig((prev) => {
      const updated = { ...prev, ...config };
      updateLocalStorage(updated);
      return updated;
    });
  };

  const addMCPTool = (tool: MCPTool) => {
    // Ensure all required fields are present
    const completeToken = {
      ...tool,
      method: tool.method || "GET",
      parameters: tool.parameters || ""
    };
    
    setMCPConfig((prev) => {
      const updated = { 
        ...prev, 
        tools: [...prev.tools, completeToken] 
      };
      updateLocalStorage(updated);
      return updated;
    });
  };

  const removeMCPTool = (id: string) => {
    setMCPConfig((prev) => {
      const updated = {
        ...prev,
        tools: prev.tools.filter((tool) => tool.id !== id),
      };
      updateLocalStorage(updated);
      return updated;
    });
  };

  return {
    mcpConfig,
    updateMCPConfig,
    addMCPTool,
    removeMCPTool,
  };
};
