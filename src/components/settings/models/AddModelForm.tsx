
import React, { useState, useEffect } from "react";
import { AI_PROVIDERS } from "./aiProviders";
import { useModelApi } from "@/hooks/use-model-api";
import { useToast } from "@/hooks/use-toast";
import { AIModel } from "@/types";
import { v4 as uuidv4 } from "uuid";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Loader2 } from "lucide-react";

interface AddModelFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddModel: (model: AIModel) => void;
}

interface ModelOption {
  id: string;
  name: string;
  description?: string;
}

const AddModelForm: React.FC<AddModelFormProps> = ({
  open,
  onOpenChange,
  onAddModel,
}) => {
  const { toast } = useToast();
  const { fetchProviderModels, isLoading } = useModelApi();
  
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [availableModels, setAvailableModels] = useState<ModelOption[]>([]);
  const [modelDescription, setModelDescription] = useState<string>("");
  
  useEffect(() => {
    if (selectedProvider) {
      loadModelsForProvider(selectedProvider);
    } else {
      setAvailableModels([]);
      setSelectedModel("");
    }
  }, [selectedProvider]);
  
  useEffect(() => {
    if (selectedModel) {
      const model = availableModels.find(m => m.id === selectedModel);
      setModelDescription(model?.description || "");
    } else {
      setModelDescription("");
    }
  }, [selectedModel, availableModels]);

  const loadModelsForProvider = async (providerId: string) => {
    const models = await fetchProviderModels(providerId);
    setAvailableModels(models);
    setSelectedModel("");
  };

  const handleAddModel = () => {
    if (!selectedProvider || !selectedModel) {
      toast({
        title: "Campos obrigatórios",
        description: "Selecione um provedor e um modelo",
        variant: "destructive",
      });
      return;
    }
    
    if (!apiKey) {
      toast({
        title: "Chave de API obrigatória",
        description: "Insira uma chave de API válida para continuar",
        variant: "destructive",
      });
      return;
    }
    
    const provider = AI_PROVIDERS.find(p => p.id === selectedProvider);
    const model = availableModels.find(m => m.id === selectedModel);
    
    if (!provider || !model) {
      return;
    }
    
    const newModel: AIModel = {
      id: uuidv4(),
      name: model.name,
      provider: provider.name,
      description: modelDescription || model.description || `Modelo ${model.name} do provedor ${provider.name}`,
      capabilities: [],
      apiKey,
    };
    
    onAddModel(newModel);
    
    // Reset form
    setSelectedProvider("");
    setSelectedModel("");
    setApiKey("");
    setModelDescription("");
    
    toast({
      title: "Modelo adicionado",
      description: `${newModel.name} foi adicionado com sucesso`,
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Modelo de IA</DialogTitle>
          <DialogDescription>
            Selecione um provedor e modelo de IA para usar em seu agente.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="provider">Provedor de IA</Label>
            <Select
              value={selectedProvider}
              onValueChange={setSelectedProvider}
            >
              <SelectTrigger id="provider">
                <SelectValue placeholder="Selecione um provedor" />
              </SelectTrigger>
              <SelectContent>
                {AI_PROVIDERS.map((provider) => (
                  <SelectItem key={provider.id} value={provider.id}>
                    {provider.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="model">Modelo de IA</Label>
            <Select
              value={selectedModel}
              onValueChange={setSelectedModel}
              disabled={!selectedProvider || isLoading[selectedProvider]}
            >
              <SelectTrigger id="model">
                {isLoading[selectedProvider] ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    <span>Carregando modelos...</span>
                  </div>
                ) : (
                  <SelectValue placeholder="Selecione um modelo" />
                )}
              </SelectTrigger>
              <SelectContent>
                {availableModels.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={modelDescription}
              onChange={(e) => setModelDescription(e.target.value)}
              placeholder="Descrição das capacidades do modelo"
              disabled={!selectedModel}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="apiKey">Chave de API</Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Chave de API necessária para autenticação"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleAddModel}>
            Adicionar Modelo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddModelForm;
