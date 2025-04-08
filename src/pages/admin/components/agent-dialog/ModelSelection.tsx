
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { AIModel, Agent } from "@/types";

interface ModelSelectionProps {
  agent: Partial<Agent>;
  onModelChange: (modelId: string) => void;
  models: AIModel[];
  isLoadingModels: Record<string, boolean>;
  availableProviderModels: any[];
  loadModelsForProvider: (providerId: string) => Promise<void>;
}

const ModelSelection: React.FC<ModelSelectionProps> = ({
  agent,
  onModelChange,
  models,
  isLoadingModels,
  availableProviderModels,
  loadModelsForProvider
}) => {
  const [selectedProviderId, setSelectedProviderId] = useState<string>("");
  
  // Find the current model's provider
  useEffect(() => {
    if (agent.modelId) {
      const modelProvider = models.find(m => m.id === agent.modelId)?.providerId;
      if (modelProvider) {
        setSelectedProviderId(modelProvider);
        loadModelsForProvider(modelProvider);
      }
    }
  }, [agent.modelId, models, loadModelsForProvider]);

  const handleProviderChange = async (value: string) => {
    setSelectedProviderId(value);
    // Reset agent model when provider changes
    onModelChange("");
    // Load models for selected provider
    await loadModelsForProvider(value);
  };
  
  // Get unique providers from models
  const availableProviders = [...new Set(models.map(model => model.providerId))];
  
  // Check if we're loading models for the selected provider
  const isLoading = selectedProviderId ? isLoadingModels[selectedProviderId] || false : false;
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="modelProvider">Provedor de IA</Label>
        <Select
          value={selectedProviderId}
          onValueChange={handleProviderChange}
        >
          <SelectTrigger id="modelProvider">
            <SelectValue placeholder="Selecione o provedor" />
          </SelectTrigger>
          <SelectContent>
            {availableProviders.map((provider) => (
              <SelectItem key={provider} value={provider}>
                {provider}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="modelId">Modelo de IA {isLoading && <Spinner className="inline ml-2" />}</Label>
        <Select
          value={agent.modelId || ""}
          onValueChange={onModelChange}
          disabled={!selectedProviderId || isLoading}
        >
          <SelectTrigger id="modelId">
            <SelectValue placeholder="Selecione o modelo" />
          </SelectTrigger>
          <SelectContent>
            {!isLoading && availableProviderModels.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ModelSelection;
