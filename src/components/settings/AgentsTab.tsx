
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAgent } from "@/contexts/AgentContext";
import { Agent } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AgentDialog from "./agents/AgentDialog";
import AgentsTable from "./agents/AgentsTable";

const AgentsTab = () => {
  const { toast } = useToast();
  const {
    models,
    mcpConfig,
    agents,
    addAgent,
    updateAgent,
    removeAgent,
  } = useAgent();
  
  // Dialog states
  const [agentDialogOpen, setAgentDialogOpen] = useState(false);
  const [editAgentDialogOpen, setEditAgentDialogOpen] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  
  // Form states
  const [newAgent, setNewAgent] = useState<Partial<Agent>>({
    name: "",
    description: "",
    modelId: "",
    configJson: "{\n  \"parameters\": {},\n  \"instructions\": \"\"\n}",
    toolIds: [],
  });

  // Handle adding a new agent
  const handleAddAgent = () => {
    try {
      // Create agent object
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

  // Open edit agent dialog
  const handleEditAgent = (agentId: string) => {
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

  // Remove agent
  const handleRemoveAgent = (agentId: string) => {
    removeAgent(agentId);
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
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Agentes Configurados</h2>
        <Button className="inventu-btn" onClick={() => setAgentDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Agente
        </Button>
      </div>

      <div className="space-y-4">
        <AgentsTable
          agents={agents}
          models={models}
          mcpTools={mcpConfig.tools}
          onEdit={handleEditAgent}
          onDelete={handleRemoveAgent}
        />
      </div>
      
      {/* Add Agent Dialog */}
      <AgentDialog
        open={agentDialogOpen}
        onOpenChange={setAgentDialogOpen}
        agent={newAgent}
        setAgent={setNewAgent}
        onSave={handleAddAgent}
        isEditing={false}
        models={models}
        mcpTools={mcpConfig.tools}
      />
      
      {/* Edit Agent Dialog */}
      <AgentDialog
        open={editAgentDialogOpen}
        onOpenChange={setEditAgentDialogOpen}
        agent={newAgent}
        setAgent={setNewAgent}
        onSave={handleUpdateAgent}
        isEditing={true}
        models={models}
        mcpTools={mcpConfig.tools}
      />
    </div>
  );
};

export default AgentsTab;
