
import React, { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, AlertTriangle, PlusCircle } from "lucide-react";
import { useModelApi } from "@/hooks/use-model-api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ModelSelectionProps {
  models: any[];
  selectedProvider: string;
  setSelectedProvider: (provider: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  availableModels: any[];
  setAvailableModels: React.Dispatch<React.SetStateAction<any[]>>;
  onAddModelClick?: () => void;
}

const ModelSelection: React.FC<ModelSelectionProps> = ({
  models,
  selectedProvider,
  setSelectedProvider,
  selectedModel,
  setSelectedModel,
  availableModels,
  setAvailableModels,
  onAddModelClick
}) => {
  const { fetchProviderModels, isLoading } = useModelApi();
  const { toast } = useToast();

  // Efeito para carregar modelos quando o provedor muda
  useEffect(() => {
    if (selectedProvider) {
      loadModelsForProvider(selectedProvider);
    }
  }, [selectedProvider]);

  // Efeito para verificar se o modelo selecionado está disponível
  useEffect(() => {
    if (selectedModel && availableModels.length > 0) {
      const modelExists = availableModels.some(m => m.id === selectedModel);
      if (!modelExists) {
        // Manter o modelo selecionado mesmo que não esteja na lista,
        // mas exibir um alerta visual na interface
        console.log(`Modelo ${selectedModel} não encontrado na lista de modelos disponíveis`);
      }
    }
  }, [selectedModel, availableModels]);

  const loadModelsForProvider = async (providerId: string) => {
    if (!providerId) return;
    
    try {
      const provider = models.find(m => m.providerId === providerId);
      
      if (!provider || !provider.apiKey) {
        toast({
          title: "Chave de API ausente",
          description: `Configure uma chave de API para ${provider?.provider || providerId} para ver modelos disponíveis.`,
          variant: "warning",
        });
        setAvailableModels([]);
        return;
      }
      
      const apiKey = provider.apiKey;
      const providerModels = await fetchProviderModels(providerId, apiKey);
      
      if (providerModels.length === 0) {
        toast({
          title: "Nenhum modelo encontrado",
          description: `Não foi possível carregar modelos para ${provider.provider}.`,
          variant: "warning",
        });
      }
      
      setAvailableModels(providerModels);
    } catch (error) {
      console.error("Erro ao carregar modelos:", error);
      setAvailableModels([]);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os modelos. Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  // Verificar se o modelo atual está na lista de provedores
  const isModelFromUnknownProvider = selectedModel && !models.some(m => {
    // Verifica se o modelo pertence a algum dos provedores configurados
    if (m.id === selectedModel) return true;
    
    const providerModels = availableModels.filter(am => 
      models.find(pm => pm.providerId === selectedProvider)?.providerId === selectedProvider
    );
    return providerModels.some(pm => pm.id === selectedModel);
  });

  return (
    <div className="space-y-4 border-t pt-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Modelo de IA</h3>
        {onAddModelClick && (
          <Button variant="outline" size="sm" onClick={onAddModelClick}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Adicionar provedor
          </Button>
        )}
      </div>
      
      {isModelFromUnknownProvider && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 rounded-md border border-amber-200 dark:border-amber-800">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">
            O modelo <strong>{selectedModel}</strong> está configurado, mas seu provedor não está disponível. 
            Adicione o provedor correspondente para garantir o funcionamento correto.
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="provider">Provedor de IA</Label>
          <Select
            value={selectedProvider}
            onValueChange={(value) => {
              setSelectedProvider(value);
              // Não redefina o modelo selecionado para permitir a seleção manual depois
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
              disabled={!selectedProvider && availableModels.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um modelo" />
              </SelectTrigger>
              <SelectContent>
                {selectedModel && !availableModels.find(m => m.id === selectedModel) && (
                  <SelectItem value={selectedModel}>
                    {selectedModel} (modelo atual)
                  </SelectItem>
                )}
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
