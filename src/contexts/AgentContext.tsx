
import React, { createContext, useContext, useState } from "react";
import { AIModel, MCPServerConfig, MCPTool } from "../types";
import { useToast } from "@/hooks/use-toast";

interface AgentContextType {
  models: AIModel[];
  mcpConfig: MCPServerConfig;
  addModel: (model: AIModel) => void;
  updateModel: (id: string, model: Partial<AIModel>) => void;
  removeModel: (id: string) => void;
  updateMCPConfig: (config: Partial<MCPServerConfig>) => void;
  addMCPTool: (tool: MCPTool) => void;
  removeMCPTool: (id: string) => void;
  selectModelForTask: (taskDescription: string) => Promise<string>;
  executeMCPTool: (toolId: string, params: Record<string, any>) => Promise<any>;
}

// Default models
const DEFAULT_MODELS: AIModel[] = [
  {
    id: "minimax",
    name: "MiniMax",
    provider: "MiniMax",
    description: "General purpose model with large context window",
    capabilities: ["general", "summarization", "translation"],
  },
  {
    id: "deepseek-r1",
    name: "DeepSeek R1",
    provider: "DeepSeek",
    description: "Model specializing in deep reasoning and analysis",
    capabilities: ["reasoning", "research", "analysis"],
  },
  {
    id: "ideogram",
    name: "Ideogram",
    provider: "Ideogram",
    description: "Image generation and vision model",
    capabilities: ["image-generation", "vision", "creative"],
  },
];

// Default MCP configuration
const DEFAULT_MCP_CONFIG: MCPServerConfig = {
  serverUrl: "",
  tools: [],
};

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export const AgentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { toast } = useToast();
  const [models, setModels] = useState<AIModel[]>(() => {
    const savedModels = localStorage.getItem("inventu_models");
    return savedModels ? JSON.parse(savedModels) : DEFAULT_MODELS;
  });

  const [mcpConfig, setMCPConfig] = useState<MCPServerConfig>(() => {
    const savedConfig = localStorage.getItem("inventu_mcp_config");
    return savedConfig ? JSON.parse(savedConfig) : DEFAULT_MCP_CONFIG;
  });

  const updateLocalStorage = (
    models: AIModel[], 
    config: MCPServerConfig
  ) => {
    localStorage.setItem("inventu_models", JSON.stringify(models));
    localStorage.setItem("inventu_mcp_config", JSON.stringify(config));
  };

  const addModel = (model: AIModel) => {
    setModels((prev) => {
      const updated = [...prev, model];
      updateLocalStorage(updated, mcpConfig);
      return updated;
    });
  };

  const updateModel = (id: string, modelUpdate: Partial<AIModel>) => {
    setModels((prev) => {
      const updated = prev.map((model) => 
        model.id === id ? { ...model, ...modelUpdate } : model
      );
      updateLocalStorage(updated, mcpConfig);
      return updated;
    });
  };

  const removeModel = (id: string) => {
    setModels((prev) => {
      const updated = prev.filter((model) => model.id !== id);
      updateLocalStorage(updated, mcpConfig);
      return updated;
    });
  };

  const updateMCPConfig = (config: Partial<MCPServerConfig>) => {
    setMCPConfig((prev) => {
      const updated = { ...prev, ...config };
      updateLocalStorage(models, updated);
      return updated;
    });
  };

  const addMCPTool = (tool: MCPTool) => {
    setMCPConfig((prev) => {
      const updated = { 
        ...prev, 
        tools: [...prev.tools, tool] 
      };
      updateLocalStorage(models, updated);
      return updated;
    });
  };

  const removeMCPTool = (id: string) => {
    setMCPConfig((prev) => {
      const updated = {
        ...prev,
        tools: prev.tools.filter((tool) => tool.id !== id),
      };
      updateLocalStorage(models, updated);
      return updated;
    });
  };

  // Logic to select the best model based on the task description
  const selectModelForTask = async (taskDescription: string): Promise<string> => {
    // This would be more sophisticated in a real implementation
    const lowerCaseTask = taskDescription.toLowerCase();
    
    // Simple keyword matching for demo purposes
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
      return "minimax"; // Default model
    }
  };

  // Simulate executing a tool via MCP server
  const executeMCPTool = async (toolId: string, params: Record<string, any>) => {
    const tool = mcpConfig.tools.find(t => t.id === toolId);
    
    if (!tool) {
      toast({
        title: "Tool not found",
        description: `MCP tool with ID ${toolId} is not available`,
        variant: "destructive",
      });
      throw new Error(`Tool ${toolId} not found`);
    }
    
    if (!mcpConfig.serverUrl) {
      toast({
        title: "MCP Server not configured",
        description: "Please configure the MCP server URL in admin settings",
        variant: "destructive",
      });
      throw new Error("MCP Server URL not configured");
    }
    
    // In a real implementation, this would make an actual API call
    console.log(`Executing tool ${tool.name} with params:`, params);
    
    // Simulate API response delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      success: true,
      toolName: tool.name,
      result: `Simulated result from tool '${tool.name}'`,
    };
  };

  return (
    <AgentContext.Provider
      value={{
        models,
        mcpConfig,
        addModel,
        updateModel,
        removeModel,
        updateMCPConfig,
        addMCPTool,
        removeMCPTool,
        selectModelForTask,
        executeMCPTool,
      }}
    >
      {children}
    </AgentContext.Provider>
  );
};

export const useAgent = () => {
  const context = useContext(AgentContext);
  if (context === undefined) {
    throw new Error("useAgent must be used within an AgentProvider");
  }
  return context;
};
