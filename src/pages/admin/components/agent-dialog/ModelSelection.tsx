
import React, { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AIModel } from "@/types";
import { Loader2 } from "lucide-react";

interface ModelSelectionProps {
  providerId: string;
  modelId: string | undefined;
  models: AIModel[];
  availableProviderModels: any[];
  isLoadingModels: boolean;
  onProviderChange: (providerId: string) => void;
  onModelChange: (modelId: string) => void;
}

const ModelSelection: React.FC<ModelSelectionProps> = ({
  providerId,
  modelId,
  models,
  availableProviderModels,
  isLoadingModels,
  onProviderChange,
  onModelChange
}) => {
  // Agrupar modelos por provedor para o selector de provedor
  const providers = Array.from(new Set(models.map(model => model.providerId)))
    .map(providerId => {
      const provider = models.find(m => m.providerId === providerId);
      return {
        id: providerId,
        name: provider?.provider || providerId
      };
    });

  // Carregar modelos automaticamente quando o componente montar
  // se já houver um provider selecionado
  useEffect(() => {
    if (providerId && availableProviderModels.length === 0 && !isLoadingModels) {
      onProviderChange(providerId);
    }
  }, [providerId]);

  return (
    <>
      {/* Seletor de Provedor */}
      <div className="space-y-2">
        <Label htmlFor="providerSelect">Provedor de IA</Label>
        <Select 
          value={providerId}
          onValueChange={onProviderChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um provedor" />
          </SelectTrigger>
          <SelectContent>
            {providers.map((provider) => (
              <SelectItem key={provider.id} value={provider.id}>
                {provider.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Seletor de Modelo */}
      <div className="space-y-2">
        <Label htmlFor="agentModel">Modelo de IA</Label>
        {isLoadingModels ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">Carregando modelos...</span>
          </div>
        ) : (
          <Select 
            value={modelId} 
            onValueChange={onModelChange}
            disabled={availableProviderModels.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um modelo" />
            </SelectTrigger>
            <SelectContent>
              {availableProviderModels.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name} {model.description && `(${model.description})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </>
  );
};

export default ModelSelection;
