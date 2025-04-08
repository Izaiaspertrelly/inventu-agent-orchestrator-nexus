
import React from "react";
import { AIModel } from "@/types";
import { useToast } from "@/hooks/use-toast";
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

interface ModelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  model: Partial<AIModel>;
  setModel: React.Dispatch<React.SetStateAction<Partial<AIModel>>>;
  onSave: () => void;
}

const ModelDialog: React.FC<ModelDialogProps> = ({
  open,
  onOpenChange,
  model,
  setModel,
  onSave,
}) => {
  const { toast } = useToast();
  
  const handleSave = () => {
    if (!model.name || !model.provider) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e provedor são obrigatórios",
        variant: "destructive",
      });
      return;
    }
    
    onSave();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Modelo de IA</DialogTitle>
          <DialogDescription>
            Adicione um novo modelo de IA para ser usado pelo agente.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={model.name}
              onChange={(e) =>
                setModel({ ...model, name: e.target.value })
              }
              placeholder="Nome do modelo"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="provider">Provedor</Label>
            <Input
              id="provider"
              value={model.provider}
              onChange={(e) =>
                setModel({ ...model, provider: e.target.value })
              }
              placeholder="Provedor (ex: OpenAI, Anthropic)"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={model.description}
              onChange={(e) =>
                setModel({ ...model, description: e.target.value })
              }
              placeholder="Descrição das capacidades do modelo"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="apiKey">Chave de API</Label>
            <Input
              id="apiKey"
              type="password"
              value={model.apiKey}
              onChange={(e) =>
                setModel({ ...model, apiKey: e.target.value })
              }
              placeholder="Chave de API (opcional)"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button className="inventu-btn" onClick={handleSave}>
            Adicionar Modelo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModelDialog;
