
import React, { useState, useEffect } from "react";
import { useAgent } from "@/contexts/AgentContext";
import { useModelApi } from "@/hooks/use-model-api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { AIModel, Agent } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface ModelAssignmentProps {
  agents: Agent[];
  models: AIModel[];
  onAssignModel: (agentId: string, modelId: string, modelParamsJson: string) => void;
}

const ModelAssignment: React.FC<ModelAssignmentProps> = ({ agents, models, onAssignModel }) => {
  const { toast } = useToast();
  const { fetchProviderModels, isLoading } = useModelApi();
  const [agentModelConfigs, setAgentModelConfigs] = useState<Record<string, {
    selectedModel: string;
    modelParamsJson: string;
  }>>({});
  const [availableModels, setAvailableModels] = useState<Record<string, { id: string; name: string; description?: string; }[]>>({});

  useEffect(() => {
    // Initialize agent model configurations
    const initialConfigs: Record<string, { selectedModel: string; modelParamsJson: string; }> = {};
    agents.forEach(agent => {
      try {
        const config = JSON.parse(agent.configJson);
        initialConfigs[agent.id] = {
          selectedModel: config.model?.id || "",
          modelParamsJson: JSON.stringify(config.model?.parameters || { temperature: 0.7, top_p: 1 }, null, 2)
        };
      } catch (e) {
        console.error("Erro ao analisar configJson do agente:", e);
        initialConfigs[agent.id] = {
          selectedModel: "",
          modelParamsJson: JSON.stringify({ temperature: 0.7, top_p: 1 }, null, 2)
        };
      }
    });
    setAgentModelConfigs(initialConfigs);
  }, [agents]);

  const loadModelsForProvider = async (agentId: string, providerId: string, apiKey: string) => {
    try {
      const models = await fetchProviderModels(providerId, apiKey);
      setAvailableModels(prev => ({ ...prev, [agentId]: models }));
    } catch (error) {
      console.error(`Erro ao carregar modelos para o provedor ${providerId}:`, error);
      toast({
        title: "Erro ao carregar modelos",
        description: `Não foi possível carregar os modelos do provedor selecionado.`,
        variant: "destructive",
      });
    }
  };

  const handleProviderChange = async (agentId: string, providerId: string) => {
    const apiKey = models.find(model => model.providerId === providerId)?.apiKey || "";
    if (apiKey) {
      await loadModelsForProvider(agentId, providerId, apiKey);
    } else {
      toast({
        title: "Chave de API não encontrada",
        description: "Por favor, adicione a chave de API para este provedor nas configurações.",
        variant: "destructive",
      });
      setAvailableModels(prev => ({ ...prev, [agentId]: [] }));
    }
  };

  const handleAssign = (agentId: string) => {
    const { selectedModel, modelParamsJson } = agentModelConfigs[agentId];
    onAssignModel(agentId, selectedModel, modelParamsJson);
    toast({
      title: "Modelo atribuído",
      description: `Modelo atribuído ao agente com sucesso.`,
    });
  };

  const handleModelParamsChange = (agentId: string, modelParamsJson: string) => {
    try {
      JSON.parse(modelParamsJson);
      setAgentModelConfigs(prev => ({
        ...prev,
        [agentId]: { ...prev[agentId], modelParamsJson }
      }));
    } catch (e) {
      toast({
        title: "JSON inválido",
        description: "A configuração JSON do modelo é inválida.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      {agents.map((agent) => {
        const agentConfig = agentModelConfigs[agent.id] || { selectedModel: "", modelParamsJson: JSON.stringify({ temperature: 0.7, top_p: 1 }, null, 2) };
        const selectedProvider = models.find(model => model.id === agent.modelId)?.providerId || "";
        const availableModelsForAgent = availableModels[agent.id] || [];

        return (
          <Card key={agent.id}>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-semibold">{agent.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`provider-${agent.id}`}>Provedor de IA</Label>
                  <Select
                    value={selectedProvider}
                    onValueChange={(providerId) => handleProviderChange(agent.id, providerId)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um provedor" />
                    </SelectTrigger>
                    <SelectContent>
                      {models.map((model) => (
                        <SelectItem key={model.id} value={model.providerId}>
                          {model.provider}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor={`model-${agent.id}`}>Modelo de IA</Label>
                  <Select
                    value={agentConfig.selectedModel}
                    onValueChange={(modelId) => {
                      setAgentModelConfigs(prev => ({
                        ...prev,
                        [agent.id]: { ...prev[agent.id], selectedModel: modelId }
                      }));
                    }}
                    disabled={!selectedProvider || isLoading[selectedProvider]}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um modelo" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableModelsForAgent.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor={`model-params-${agent.id}`}>Parâmetros do Modelo (JSON)</Label>
                <Textarea
                  id={`model-params-${agent.id}`}
                  className="font-mono h-32"
                  value={agentConfig.modelParamsJson}
                  onChange={(e) => handleModelParamsChange(agent.id, e.target.value)}
                  placeholder="{}"
                />
              </div>
              <Button onClick={() => handleAssign(agent.id)}>
                Atribuir Modelo
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ModelAssignment;
