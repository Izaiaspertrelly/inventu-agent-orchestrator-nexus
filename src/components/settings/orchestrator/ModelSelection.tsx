
import React, { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useModelApi } from "@/hooks/use-model-api";

interface ModelSelectionProps {
  models: any[];
  selectedProvider: string;
  setSelectedProvider: (provider: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  availableModels: any[];
  setAvailableModels: React.Dispatch<React.SetStateAction<any[]>>;
}

const ModelSelection: React.FC<ModelSelectionProps> = ({
  models,
  selectedProvider,
  setSelectedProvider,
  selectedModel,
  setSelectedModel,
  availableModels,
  setAvailableModels,
}) => {
  const { fetchProviderModels, isLoading } = useModelApi();

  // Efeito para carregar modelos quando o provedor muda
  useEffect(() => {
    if (selectedProvider) {
      loadModelsForProvider(selectedProvider);
    }
  }, [selectedProvider]);

  const loadModelsForProvider = async (providerId: string) => {
    if (!providerId) return;
    
    try {
      const provider = models.find(m => m.providerId === providerId);
      const apiKey = provider?.apiKey || "";
      
      const providerModels = await fetchProviderModels(providerId, apiKey);
      setAvailableModels(providerModels);
    } catch (error) {
      console.error("Erro ao carregar modelos:", error);
      setAvailableModels([]);
    }
  };

  return (
    <div className="space-y-4 border-t pt-4">
      <h3 className="text-lg font-medium">Modelo de IA</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="provider">Provedor de IA</Label>
          <Select
            value={selectedProvider}
            onValueChange={(value) => {
              setSelectedProvider(value);
              setSelectedModel("");
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um provedor" />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model.providerId} value={model.providerId}>
                  {model.provider}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="model">Modelo de IA</Label>
          {isLoading[selectedProvider] ? (
            <div className="flex items-center space-x-2 h-10 border rounded-md px-3">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">Carregando modelos...</span>
            </div>
          ) : (
            <Select
              value={selectedModel}
              onValueChange={setSelectedModel}
              disabled={!selectedProvider || availableModels.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um modelo" />
              </SelectTrigger>
              <SelectContent>
                {availableModels.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name} {model.description && `(${model.description})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModelSelection;
