
import React from "react";
import { useAgent } from "@/contexts/AgentContext";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AgentDialog from "./AgentDialog";
import AgentsTable from "@/components/settings/agents/AgentsTable";
import { useAgentDialogs } from "../hooks/useAgentDialogs";

const AgentsSection: React.FC = () => {
  const { models, mcpConfig, agents, removeAgent } = useAgent();
  
  const {
    agentDialogOpen,
    setAgentDialogOpen,
    editAgentDialogOpen,
    setEditAgentDialogOpen,
    newAgent,
    setNewAgent,
    availableProviderModels,
    isLoadingModels,
    loadModelsForProvider,
    openAddDialog,
    openEditDialog,
    handleAddAgent,
    handleUpdateAgent,
  } = useAgentDialogs();

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Agentes Configurados</h2>
        <Button className="inventu-btn" onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Agente
        </Button>
      </div>

      <div className="space-y-4">
        <AgentsTable
          agents={agents}
          models={models}
          mcpTools={mcpConfig.tools}
          onEdit={openEditDialog}
          onDelete={removeAgent}
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
        availableProviderModels={availableProviderModels}
        isLoadingModels={isLoadingModels}
        loadModelsForProvider={loadModelsForProvider}
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
        availableProviderModels={availableProviderModels}
        isLoadingModels={isLoadingModels}
        loadModelsForProvider={loadModelsForProvider}
      />
    </>
  );
};

export default AgentsSection;
