
import { useState } from "react";
import { Agent } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { useModelApi } from "@/hooks/use-model-api";
import { useAgent } from "@/contexts/AgentContext";

export const useAgentDialogs = () => {
  const { toast } = useToast();
  const { addAgent, updateAgent } = useAgent();
  const { fetchProviderModels } = useModelApi();
  
  // Dialog states
  const [agentDialogOpen, setAgentDialogOpen] = useState(false);
  const [editAgentDialogOpen, setEditAgentDialogOpen] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [availableProviderModels, setAvailableProviderModels] = useState<any[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  
  // Form states
  const [newAgent, setNewAgent] = useState<Partial<Agent>>({
    name: "",
    description: "",
    modelId: "",
    configJson: "{\n  \"parameters\": {},\n  \"instructions\": \"\"\n}",
    toolIds: [],
  });

  // Handle loading models for a specific provider
  const loadModelsForProvider = async (providerId: string) => {
    if (!providerId) return;
    
    setIsLoadingModels(true);
    try {
      const models = await fetchProviderModels(providerId, "");
      setAvailableProviderModels(models);
    } catch (error) {
      console.error("Error fetching models:", error);
      toast({
        title: "Erro ao carregar modelos",
        description: "Não foi possível carregar os modelos do provedor selecionado.",
        variant: "destructive",
      });
      setAvailableProviderModels([]);
    } finally {
      setIsLoadingModels(false);
    }
  };

  // Reset form state
  const resetFormState = () => {
    setNewAgent({
      name: "",
      description: "",
      modelId: "",
      configJson: "{\n  \"parameters\": {},\n  \"instructions\": \"\"\n}",
      toolIds: [],
    });
    setAvailableProviderModels([]);
  };

  // Handle adding a new agent
  const handleAddAgent = () => {
    try {
      // Create agent object
      const agent: Agent = {
        id: uuidv4(),
        name: newAgent.name || "Novo Agente",
        description: newAgent.description || "",
        modelId: newAgent.modelId || "",
        configJson: newAgent.configJson || "{}",
        toolIds: newAgent.toolIds || [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      addAgent(agent);
      setAgentDialogOpen(false);
      resetFormState();
      
      toast({
        title: "Agente adicionado",
        description: `${agent.name} foi adicionado com sucesso`,
      });
    } catch (error) {
      toast({
        title: "Erro ao adicionar agente",
        description: "Ocorreu um erro ao adicionar o agente",
        variant: "destructive",
      });
    }
  };

  // Handle updating an agent
  const handleUpdateAgent = () => {
    if (!selectedAgentId) return;
    
    try {
      updateAgent(selectedAgentId, {
        name: newAgent.name,
        description: newAgent.description,
        modelId: newAgent.modelId,
        configJson: newAgent.configJson,
        toolIds: newAgent.toolIds,
        updatedAt: new Date(),
      });
      
      setEditAgentDialogOpen(false);
      setSelectedAgentId(null);
      resetFormState();
      
      toast({
        title: "Agente atualizado",
        description: `${newAgent.name} foi atualizado com sucesso`,
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar agente",
        description: "Ocorreu um erro ao atualizar o agente",
        variant: "destructive",
      });
    }
  };

  // Open add agent dialog
  const openAddDialog = () => {
    resetFormState();
    setAgentDialogOpen(true);
  };

  // Open edit agent dialog
  const openEditDialog = (agentId: string) => {
    const agent = window.agents?.find((a: Agent) => a.id === agentId);
    if (agent) {
      setSelectedAgentId(agentId);
      setNewAgent({
        name: agent.name,
        description: agent.description,
        modelId: agent.modelId,
        configJson: agent.configJson,
        toolIds: agent.toolIds,
      });
      
      // If the agent has a model provider, load its models
      if (agent.modelId) {
        const model = window.models?.find((m: any) => m.id === agent.modelId);
        if (model) {
          loadModelsForProvider(model.providerId);
        }
      }
      
      setEditAgentDialogOpen(true);
    }
  };

  return {
    agentDialogOpen,
    setAgentDialogOpen,
    editAgentDialogOpen,
    setEditAgentDialogOpen,
    newAgent,
    setNewAgent,
    selectedAgentId,
    availableProviderModels,
    isLoadingModels,
    loadModelsForProvider,
    openAddDialog,
    openEditDialog,
    handleAddAgent,
    handleUpdateAgent,
  };
};
