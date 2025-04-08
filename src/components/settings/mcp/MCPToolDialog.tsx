
import React from "react";
import { MCPTool } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MCPToolDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newTool: Partial<MCPTool>;
  setNewTool: React.Dispatch<React.SetStateAction<Partial<MCPTool>>>;
  onAddTool: () => void;
  children?: React.ReactNode;
}

const MCPToolDialog: React.FC<MCPToolDialogProps> = ({
  open,
  onOpenChange,
  newTool,
  setNewTool,
  onAddTool,
  children,
}) => {
  const isEditing = Boolean(newTool.id);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Ferramenta MCP" : "Adicionar Nova Ferramenta MCP"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Edite os detalhes da ferramenta para o servidor MCP." 
              : "Configure uma nova ferramenta para ser utilizada pelo agente através do servidor MCP."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="toolName">Nome da Ferramenta</Label>
            <Input
              id="toolName"
              value={newTool.name}
              onChange={(e) =>
                setNewTool({ ...newTool, name: e.target.value })
              }
              placeholder="Ex: Web Search"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="toolDescription">Descrição</Label>
            <Textarea
              id="toolDescription"
              value={newTool.description}
              onChange={(e) =>
                setNewTool({ ...newTool, description: e.target.value })
              }
              placeholder="Descreva o que esta ferramenta faz"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="toolMethod">Método HTTP</Label>
            <Select
              value={newTool.method}
              onValueChange={(value: "GET" | "POST" | "PUT" | "DELETE" | "PATCH") => 
                setNewTool({ ...newTool, method: value as "GET" | "POST" | "PUT" | "DELETE" })
              }
            >
              <SelectTrigger id="toolMethod">
                <SelectValue placeholder="Selecione o método HTTP" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="toolEndpoint">Endpoint/Path</Label>
            <Input
              id="toolEndpoint"
              value={newTool.endpoint}
              onChange={(e) =>
                setNewTool({ ...newTool, endpoint: e.target.value })
              }
              placeholder="/api/ferramentas/pesquisa"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="toolParameters">Parâmetros</Label>
            <Textarea
              id="toolParameters"
              value={newTool.parameters}
              onChange={(e) =>
                setNewTool({ ...newTool, parameters: e.target.value })
              }
              placeholder='{"param1": "value1", "param2": "value2"}'
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="toolAuthKey">Chave de Autenticação</Label>
            <Input
              id="toolAuthKey"
              type="password"
              value={newTool.authKey}
              onChange={(e) =>
                setNewTool({ ...newTool, authKey: e.target.value })
              }
              placeholder="Chave para autenticar esta ferramenta (opcional)"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button className="inventu-btn" onClick={onAddTool}>
            {isEditing ? "Salvar Alterações" : "Adicionar Ferramenta"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MCPToolDialog;
