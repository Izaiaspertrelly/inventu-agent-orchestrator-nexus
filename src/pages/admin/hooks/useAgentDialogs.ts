
import { useState } from "react";
import { Agent } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { useAgent } from "@/contexts/AgentContext";
import { useToast } from "@/hooks/use-toast";

// Default empty agent state
const defaultAgentState: Partial<Agent> = {
  name: "",
  description: "",
  modelId: "",
  configJson: "{\n  \"parameters\": {},\n  \"instructions\": \"\"\n}",
  toolIds: [],
};

export const useAgentDialogs = () => {
  const { toast } = useToast();
  const { addAgent, updateAgent, agents } = useAgent();
  
  // Dialog states
  const [agentDialogOpen, setAgentDialogOpen] = useState(false);
  const [editAgentDialogOpen, setEditAgentDialogOpen] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  
  // Form state
  const [newAgent, setNewAgent] = useState<Partial<Agent>>(defaultAgentState);

  // Reset form to default state
  const resetFormState = () => {
    setNewAgent(defaultAgentState);
  };

  // Open add agent dialog
  const openAddDialog = () => {
    resetFormState();
    setAgentDialogOpen(true);
  };

  // Open edit agent dialog
  const openEditDialog = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (agent) {
      setSelectedAgentId(agentId);
      setNewAgent({
        name: agent.name,
        description: agent.description,
        modelId: agent.modelId,
        configJson: agent.configJson,
        toolIds: agent.toolIds,
      });
      setEditAgentDialogOpen(true);
    }
  };

  // Handle adding a new agent
  const handleAddAgent = () => {
    try {
      const agent: Agent = {
        id: uuidv4(),
        name: newAgent.name || "",
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

  // Handle updating an existing agent
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

  return {
    agentDialogOpen,
    setAgentDialogOpen,
    editAgentDialogOpen,
    setEditAgentDialogOpen,
    selectedAgentId,
    newAgent,
    setNewAgent,
    openAddDialog,
    openEditDialog,
    handleAddAgent,
    handleUpdateAgent,
  };
};
