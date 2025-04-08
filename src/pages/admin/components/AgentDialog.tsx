
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { Agent, AIModel, MCPTool } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import AgentBasicInfo from "./agent-dialog/AgentBasicInfo";
import ModelSelection from "./agent-dialog/ModelSelection";
import ToolsSelection from "./agent-dialog/ToolsSelection";
import ConfigJson from "./agent-dialog/ConfigJson";

interface AgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  models: AIModel[];
  mcpTools: MCPTool[];
  agent: Partial<Agent>;
  setAgent: React.Dispatch<React.SetStateAction<Partial<Agent>>>;
  onSave: () => void;
  isEditing: boolean;
  availableProviderModels: any[];
  isLoadingModels: Record<string, boolean>;
  loadModelsForProvider: (providerId: string) => Promise<void>;
}

const AgentDialog: React.FC<AgentDialogProps> = ({
  open,
  onOpenChange,
  models,
  mcpTools,
  agent,
  setAgent,
  onSave,
  isEditing,
  availableProviderModels,
  isLoadingModels,
  loadModelsForProvider
}) => {
  const { toast } = useToast();
  
  const handleSave = () => {
    if (!agent.name || !agent.modelId) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e modelo são obrigatórios",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Validate JSON
      JSON.parse(agent.configJson || "{}");
      onSave();
    } catch (error) {
      toast({
        title: "JSON inválido",
        description: "A configuração JSON do agente é inválida",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Agente" : "Adicionar Novo Agente"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Atualize a configuração do agente."
              : "Configure um novo agente para utilizar modelos de IA e ferramentas específicas."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
          <AgentBasicInfo
            name={agent.name || ""}
            description={agent.description || ""}
            onNameChange={(name) => setAgent({ ...agent, name })}
            onDescriptionChange={(description) => setAgent({ ...agent, description })}
          />
          
          <ModelSelection
            agent={agent}
            modelId={agent.modelId}
            models={models}
            availableProviderModels={availableProviderModels}
            isLoadingModels={isLoadingModels}
            onModelChange={(modelId) => setAgent({ ...agent, modelId })}
            loadModelsForProvider={loadModelsForProvider}
          />
          
          <ToolsSelection
            toolIds={agent.toolIds || []}
            mcpTools={mcpTools}
            onToolsChange={(toolIds) => setAgent({ ...agent, toolIds })}
          />

          <ConfigJson
            configJson={agent.configJson || "{}"}
            onConfigJsonChange={(configJson) => setAgent({ ...agent, configJson })}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button className="inventu-btn" onClick={handleSave}>
            {isEditing ? "Atualizar Agente" : "Adicionar Agente"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AgentDialog;
