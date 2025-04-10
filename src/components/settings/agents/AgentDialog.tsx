
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent: Partial<Agent>;
  setAgent: React.Dispatch<React.SetStateAction<Partial<Agent>>>;
  onSave: () => void;
  isEditing: boolean;
  models: AIModel[];
  mcpTools: MCPTool[];
  availableProviderModels?: any[];
  isLoadingModels?: Record<string, boolean>;
  loadModelsForProvider?: (providerId: string) => Promise<void>;
}

const AgentDialog: React.FC<AgentDialogProps> = ({
  open,
  onOpenChange,
  agent,
  setAgent,
  onSave,
  isEditing,
  models,
  mcpTools,
  availableProviderModels = [],
  isLoadingModels = {},
  loadModelsForProvider = async () => {}
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
          <div className="space-y-2">
            <Label htmlFor="agentName">Nome do Agente</Label>
            <Input
              id="agentName"
              value={agent.name}
              onChange={(e) =>
                setAgent({ ...agent, name: e.target.value })
              }
              placeholder="Nome do agente"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="agentDescription">Descrição</Label>
            <Textarea
              id="agentDescription"
              value={agent.description}
              onChange={(e) =>
                setAgent({ ...agent, description: e.target.value })
              }
              placeholder="Descrição do propósito do agente"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="agentModel">Modelo de IA</Label>
            <Select 
              value={agent.modelId} 
              onValueChange={(value) => setAgent({ ...agent, modelId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um modelo" />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name} ({model.provider})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="agentTools">Ferramentas MCP</Label>
            <div className="border rounded-md p-4">
              {mcpTools.length > 0 ? (
                mcpTools.map((tool) => (
                  <div key={tool.id} className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      id={`tool-${tool.id}`}
                      checked={agent.toolIds?.includes(tool.id) || false}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setAgent({
                            ...agent,
                            toolIds: [...(agent.toolIds || []), tool.id],
                          });
                        } else {
                          setAgent({
                            ...agent,
                            toolIds: agent.toolIds?.filter(id => id !== tool.id) || [],
                          });
                        }
                      }}
                    />
                    <Label htmlFor={`tool-${tool.id}`}>{tool.name}</Label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nenhuma ferramenta MCP configurada. Adicione ferramentas na aba MCP.
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="configJson">Configuração JSON</Label>
              <span className="text-xs text-muted-foreground">Estrutura do agente</span>
            </div>
            <Textarea
              id="configJson"
              value={agent.configJson}
              onChange={(e) =>
                setAgent({ ...agent, configJson: e.target.value })
              }
              className="font-mono h-64"
              placeholder="{}"
            />
          </div>
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
