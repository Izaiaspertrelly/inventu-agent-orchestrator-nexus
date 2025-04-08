
import React, { createContext, useContext } from "react";
import { useModels } from "./useModels";
import { useMCPConfig } from "./useMCPConfig";
import { useAgents } from "./useAgents";
import { AIModel, MCPServerConfig, MCPTool, Agent } from "@/types";
import { selectModelForTask, executeMCPTool } from "./agentUtils";
import { useToast } from "@/hooks/use-toast";

interface AgentContextType {
  models: AIModel[];
  mcpConfig: MCPServerConfig;
  agents: Agent[];
  addModel: (model: AIModel) => void;
  updateModel: (id: string, model: Partial<AIModel>) => void;
  removeModel: (id: string) => void;
  updateMCPConfig: (config: Partial<MCPServerConfig>) => void;
  addMCPTool: (tool: MCPTool) => void;
  removeMCPTool: (id: string) => void;
  selectModelForTask: (taskDescription: string) => Promise<string>;
  executeMCPTool: (toolId: string, params: Record<string, any>) => Promise<any>;
  addAgent: (agent: Agent) => void;
  updateAgent: (id: string, agent: Partial<Agent>) => void;
  removeAgent: (id: string) => void;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export const AgentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { toast } = useToast();
  const { 
    models, 
    addModel, 
    updateModel, 
    removeModel 
  } = useModels();
  
  const {
    mcpConfig,
    updateMCPConfig,
    addMCPTool,
    removeMCPTool
  } = useMCPConfig();
  
  const {
    agents,
    addAgent,
    updateAgent,
    removeAgent
  } = useAgents();

  const handleSelectModelForTask = async (taskDescription: string): Promise<string> => {
    return selectModelForTask(taskDescription);
  };

  const handleExecuteMCPTool = async (toolId: string, params: Record<string, any>) => {
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
    
    return executeMCPTool(tool, params);
  };

  return (
    <AgentContext.Provider
      value={{
        models,
        mcpConfig,
        agents,
        addModel,
        updateModel,
        removeModel,
        updateMCPConfig,
        addMCPTool,
        removeMCPTool,
        selectModelForTask: handleSelectModelForTask,
        executeMCPTool: handleExecuteMCPTool,
        addAgent,
        updateAgent,
        removeAgent,
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
