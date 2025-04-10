
import React, { createContext, useContext } from "react";
import { useModels } from "./useModels";
import { useMCPConfig } from "./useMCPConfig";
import { useAgents } from "./useAgents";
import { useOrchestrator } from "./orchestrator/useOrchestrator";
import { AIModel, MCPServerConfig, MCPTool, Agent } from "@/types";
import { selectModelForTask, executeMCPTool } from "./agentUtils";
import { useToast } from "@/hooks/use-toast";
import { ResourceOptimizationConfig } from "./orchestrator/useResourceOptimization";

interface AgentContextType {
  models: AIModel[];
  mcpConfig: MCPServerConfig;
  agents: Agent[];
  orchestratorConfig: any;
  orchestratorState: any;
  addModel: (model: AIModel) => void;
  updateModel: (id: string, model: Partial<AIModel>) => void;
  removeModel: (id: string) => void;
  updateMCPConfig: (config: Partial<MCPServerConfig>) => void;
  addMCPTool: (tool: MCPTool) => void;
  removeMCPTool: (id: string) => void;
  selectModelForTask: (taskDescription: string) => Promise<string>;
  executeMCPTool: (tool: MCPTool, params: Record<string, any>) => Promise<any>;
  addAgent: (agent: Agent) => void;
  updateAgent: (id: string, agent: Partial<Agent>) => void;
  removeAgent: (id: string) => void;
  updateOrchestratorConfig: (config: any) => void;
  updateOrchestratorState: (state: any) => void;
  addToConversationHistory: (message: { role: string; content: string; timestamp: Date }) => void;
  decomposeTask: (taskId: string, task: string, subtasks: string[]) => void;
  recordPerformanceMetric: (metric: "responseTime" | "tokenUsage", value: number) => void;
  optimizeResources: () => number;
  requestMemoryConfirmation: (userId: string, entry: { key: string, value: any, source: string }) => any;
  processMemoryConfirmation: (confirmationId: number, approved: boolean) => void;
  createUserDatabase: (userId: string, userData?: any) => boolean;
  addMemoryEntry: (userId: string, entry: { key: string, value: any, source: string, timestamp: Date }) => void;
  // New functions for resource optimization
  configureOptimization: (config: Partial<ResourceOptimizationConfig>) => void;
  getOptimizationHistory: () => any[];
  clearOptimizationHistory: () => void;
  optimizationConfig: ResourceOptimizationConfig;
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
    rawAgents,
    addAgent,
    updateAgent,
    removeAgent
  } = useAgents();

  const {
    orchestratorConfig,
    orchestratorState,
    updateOrchestratorConfig,
    updateOrchestratorState,
    addToConversationHistory,
    decomposeTask,
    recordPerformanceMetric,
    requestMemoryConfirmation,
    processMemoryConfirmation,
    createUserDatabase,
    addMemoryEntry,
    optimizeResources,
    configureOptimization,
    getOptimizationHistory,
    clearOptimizationHistory,
    optimizationConfig
  } = useOrchestrator();

  const handleSelectModelForTask = async (taskDescription: string): Promise<string> => {
    console.log("Selecionando modelo para tarefa com agentes disponíveis:", agents.length);
    console.log("Configuração do orquestrador:", orchestratorConfig);
    
    // Se o orquestrador tem um agente principal configurado, tente usá-lo primeiro
    if (orchestratorConfig && orchestratorConfig.mainAgentId) {
      // Buscar no rawAgents para garantir que o orquestrador seja encontrado
      const mainAgent = rawAgents.find(a => a.id === orchestratorConfig.mainAgentId);
      if (mainAgent && mainAgent.modelId) {
        console.log("Usando agente principal do orquestrador:", mainAgent.name);
        return mainAgent.modelId;
      }
    }
    
    // Fallback para a lógica padrão
    return selectModelForTask(taskDescription, agents);
  };

  const handleExecuteMCPTool = async (tool: MCPTool, params: Record<string, any>) => {
    if (!tool) {
      toast({
        title: "Tool not found",
        description: `MCP tool is not available`,
        variant: "destructive",
      });
      throw new Error(`Tool not found`);
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
        orchestratorConfig,
        orchestratorState,
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
        updateOrchestratorConfig,
        updateOrchestratorState,
        addToConversationHistory,
        decomposeTask,
        recordPerformanceMetric,
        requestMemoryConfirmation,
        processMemoryConfirmation,
        createUserDatabase,
        addMemoryEntry,
        optimizeResources,
        // Add new resource optimization functions
        configureOptimization,
        getOptimizationHistory,
        clearOptimizationHistory,
        optimizationConfig
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
