
import { useState } from "react";
import { MCPServerConfig, MCPTool } from "@/types";

// Default MCP configuration
const DEFAULT_MCP_CONFIG: MCPServerConfig = {
  serverUrl: "",
  tools: [],
};

export const useMCPConfig = () => {
  const [mcpConfig, setMCPConfig] = useState<MCPServerConfig>(() => {
    const savedConfig = localStorage.getItem("inventu_mcp_config");
    return savedConfig ? JSON.parse(savedConfig) : DEFAULT_MCP_CONFIG;
  });

  const updateLocalStorage = (config: MCPServerConfig) => {
    localStorage.setItem("inventu_mcp_config", JSON.stringify(config));
  };

  const updateMCPConfig = (config: Partial<MCPServerConfig>) => {
    setMCPConfig((prev) => {
      const updated = { ...prev, ...config };
      updateLocalStorage(updated);
      return updated;
    });
  };

  const addMCPTool = (tool: MCPTool) => {
    setMCPConfig((prev) => {
      const updated = { 
        ...prev, 
        tools: [...prev.tools, tool] 
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
