
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { AIModel } from "@/types";

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Lista dos provedores de IA
import { AI_PROVIDERS } from "./aiProviders";

interface AddModelFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddModel: (model: AIModel) => void;
}

const AddModelForm: React.FC<AddModelFormProps> = ({ open, onOpenChange, onAddModel }) => {
  const { toast } = useToast();
  const [selectedProviderId, setSelectedProviderId] = useState<string>("openai");
  const [modelKey, setModelKey] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");

  const selectedProvider = AI_PROVIDERS.find(p => p.id === selectedProviderId);

  const handleProviderChange = (providerId: string) => {
    setSelectedProviderId(providerId);
    const provider = AI_PROVIDERS.find(p => p.id === providerId);
    if (provider && provider.models.length > 0) {
      setSelectedModel(provider.models[0]);
    }
  };

  const handleAddModel = () => {
    if (!selectedProviderId || !modelKey) {
      toast({
        title: "Campos obrigatórios",
        description: "Provedor e Chave de API são obrigatórios",
        variant: "destructive",
      });
      return;
    }
    
    const provider = AI_PROVIDERS.find(p => p.id === selectedProviderId);
    
    if (!provider) {
      toast({
        title: "Provedor inválido",
        description: "Selecione um provedor válido",
        variant: "destructive",
      });
      return;
    }
    
    const modelName = selectedModel || provider.models[0];
    
    const model: AIModel = {
      id: uuidv4(),
      name: `${provider.name} - ${modelName}`,
      provider: provider.name,
      description: `Modelo ${modelName} de ${provider.name}`,
      capabilities: ["chat", "completion"],
      apiKey: modelKey,
    };
    
    onAddModel(model);
    onOpenChange(false);
    setModelKey("");
    setSelectedModel("");
    
    toast({
      title: "Modelo adicionado",
      description: `${model.name} foi adicionado com sucesso`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Modelo de IA</DialogTitle>
          <DialogDescription>
            Selecione um provedor e adicione a chave de API para usar o modelo.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="provider">Provedor</Label>
            <Select
              value={selectedProviderId}
              onValueChange={handleProviderChange}
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
          
          {selectedProvider && (
            <div className="space-y-2">
              <Label htmlFor="model">Modelo</Label>
              <Select
                value={selectedModel}
                onValueChange={setSelectedModel}
              >
                <SelectTrigger id="model">
                  <SelectValue placeholder="Selecione um modelo" />
                </SelectTrigger>
                <SelectContent>
                  {selectedProvider.models.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="apiKey">Chave de API</Label>
            <Input
              id="apiKey"
              type="password"
              value={modelKey}
              onChange={(e) => setModelKey(e.target.value)}
              placeholder="Insira sua chave de API"
            />
            <p className="text-xs text-muted-foreground">
              A chave será armazenada de forma segura e usada para autenticar requisições ao provedor.
            </p>
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
