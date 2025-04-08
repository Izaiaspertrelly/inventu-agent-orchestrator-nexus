
import React from "react";
import { MCPTool } from "@/types";
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

interface ToolDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tool: Partial<MCPTool>;
  setTool: React.Dispatch<React.SetStateAction<Partial<MCPTool>>>;
  onSave: () => void;
}

const ToolDialog: React.FC<ToolDialogProps> = ({
  open,
  onOpenChange,
  tool,
  setTool,
  onSave,
}) => {
  const { toast } = useToast();
  
  const handleSave = () => {
    if (!tool.name || !tool.endpoint) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e endpoint são obrigatórios",
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
          <DialogTitle>Adicionar Nova Ferramenta MCP</DialogTitle>
          <DialogDescription>
            Configure uma nova ferramenta para ser utilizada pelo agente através do servidor MCP.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="toolName">Nome da Ferramenta</Label>
            <Input
              id="toolName"
              value={tool.name}
              onChange={(e) =>
                setTool({ ...tool, name: e.target.value })
              }
              placeholder="Ex: Web Search"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="toolDescription">Descrição</Label>
            <Textarea
              id="toolDescription"
              value={tool.description}
              onChange={(e) =>
                setTool({ ...tool, description: e.target.value })
              }
              placeholder="Descreva o que esta ferramenta faz"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="toolEndpoint">Endpoint</Label>
            <Input
              id="toolEndpoint"
              value={tool.endpoint}
              onChange={(e) =>
                setTool({ ...tool, endpoint: e.target.value })
              }
              placeholder="/api/ferramentas/pesquisa"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="toolAuthKey">Chave de Autenticação</Label>
            <Input
              id="toolAuthKey"
              type="password"
              value={tool.authKey}
              onChange={(e) =>
                setTool({ ...tool, authKey: e.target.value })
              }
              placeholder="Chave para autenticar esta ferramenta (opcional)"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button className="inventu-btn" onClick={handleSave}>
            Adicionar Ferramenta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ToolDialog;
