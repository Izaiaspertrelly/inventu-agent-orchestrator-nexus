
import React, { useState } from "react";
import { AI_PROVIDERS } from "./aiProviders";
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

interface AddModelFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddModel: (model: AIModel) => void;
}

const AddModelForm: React.FC<AddModelFormProps> = ({
  open,
  onOpenChange,
  onAddModel,
}) => {
  const { toast } = useToast();
  
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  
  const handleAddModel = () => {
    if (!selectedProvider) {
      toast({
        title: "Campo obrigatório",
        description: "Selecione um provedor",
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
    
    if (!provider) {
      return;
    }
    
    const newModel: AIModel = {
      id: uuidv4(),
      name: provider.name,
      provider: provider.name,
      description: `Provedor de IA ${provider.name} com todos os modelos disponíveis`,
      capabilities: [],
      apiKey,
      providerId: provider.id
    };
    
    onAddModel(newModel);
    
    // Reset form
    setSelectedProvider("");
    setApiKey("");
    
    toast({
      title: "Provedor adicionado",
      description: `${newModel.name} foi adicionado com sucesso`,
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Provedor de IA</DialogTitle>
          <DialogDescription>
            Selecione um provedor de IA e forneça sua chave de API para acessar todos os seus modelos.
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
            Adicionar Provedor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddModelForm;
