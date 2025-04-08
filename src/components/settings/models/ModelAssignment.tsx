
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AIModel, Agent } from "@/types";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ModelAssignmentProps {
  agents: Agent[];
  models: AIModel[];
  onAssignModel: (agentId: string, modelId: string, configJson: string) => void;
}

const ModelAssignment: React.FC<ModelAssignmentProps> = ({ agents, models, onAssignModel }) => {
  const { toast } = useToast();
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [selectedModelId, setSelectedModelId] = useState("");
  const [isAssigningModel, setIsAssigningModel] = useState(false);
  const [modelParams, setModelParams] = useState(JSON.stringify({
    temperature: 0.7,
    top_p: 1,
    presence_penalty: 0,
    frequency_penalty: 0,
    max_tokens: 1000,
  }, null, 2));

  // Encontra o agente selecionado atualmente
  const selectedAgent = agents.find(a => a.id === selectedAgentId);

  const handleAssignModel = () => {
    if (!selectedAgentId || !selectedModelId) {
      toast({
        title: "Seleção necessária",
        description: "Selecione um agente e um modelo para continuar",
        variant: "destructive"
      });
      return;
    }

    setIsAssigningModel(true);
    
    try {
      onAssignModel(selectedAgentId, selectedModelId, modelParams);
      
      toast({
        title: "Modelo atribuído",
        description: `Modelo atribuído com sucesso ao agente ${selectedAgent?.name}`,
      });
      
      // Limpar seleção
      setSelectedAgentId(null);
      setSelectedModelId("");
      
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atribuir o modelo",
        variant: "destructive"
      });
    } finally {
      setIsAssigningModel(false);
    }
  };

  if (agents.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum agente configurado ainda. Configure um orquestrador primeiro.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Selecionar Agente</Label>
        <Select
          value={selectedAgentId || ""}
          onValueChange={setSelectedAgentId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um agente" />
          </SelectTrigger>
          <SelectContent>
            {agents.map((agent) => (
              <SelectItem key={agent.id} value={agent.id}>
                {agent.name} {agent.modelId ? `(${models.find(m => m.id === agent.modelId)?.name || 'Modelo configurado'})` : '(Sem modelo)'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedAgentId && (
        <div className="space-y-4 border rounded-md p-4">
          <div className="space-y-2">
            <Label>Selecionar Modelo para o Agente</Label>
            <Select
              value={selectedModelId}
              onValueChange={setSelectedModelId}
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
            <div className="flex items-center justify-between">
              <Label htmlFor="model-params">Parâmetros do Modelo</Label>
              <span className="text-xs text-muted-foreground">Configuração avançada</span>
            </div>
            <Textarea
              id="model-params"
              value={modelParams}
              onChange={(e) => setModelParams(e.target.value)}
              className="font-mono h-40"
            />
          </div>

          <Button 
            onClick={handleAssignModel} 
            disabled={isAssigningModel || !selectedModelId}
            className="w-full"
          >
            {isAssigningModel ? "Atribuindo..." : "Atribuir Modelo ao Agente"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ModelAssignment;
