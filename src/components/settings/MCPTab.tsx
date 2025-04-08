import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAgent } from "@/contexts/AgentContext";
import { MCPTool } from "@/types";
import { v4 as uuidv4 } from "uuid";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Plus, Save, Trash } from "lucide-react";

const MCPTab = () => {
  const { toast } = useToast();
  const { mcpConfig, updateMCPConfig, addMCPTool, removeMCPTool } = useAgent();
  
  const [mcpServerUrl, setMcpServerUrl] = useState(mcpConfig.serverUrl);
  const [mcpApiKey, setMcpApiKey] = useState(mcpConfig.apiKey || "");
  
  const [toolDialogOpen, setToolDialogOpen] = useState(false);
  
  const [newTool, setNewTool] = useState<Partial<MCPTool>>({
    name: "",
    description: "",
    endpoint: "",
    method: "GET",
    parameters: "",
    authKey: "",
  });

  const handleUpdateMCPConfig = () => {
    updateMCPConfig({
      serverUrl: mcpServerUrl,
      apiKey: mcpApiKey,
    });
    
    toast({
      title: "Configuração atualizada",
      description: "As configurações do servidor MCP foram atualizadas com sucesso",
    });
  };

  const handleAddTool = () => {
    if (!newTool.name || !newTool.endpoint) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e endpoint são obrigatórios",
        variant: "destructive",
      });
      return;
    }
    
    const tool: MCPTool = {
      id: uuidv4(),
      name: newTool.name || "Nova Ferramenta",
      description: newTool.description || "Descrição da ferramenta",
      endpoint: newTool.endpoint || "/api/tool",
      method: (newTool.method as "GET" | "POST" | "PUT" | "DELETE") || "GET",
      parameters: newTool.parameters || "",
      authKey: newTool.authKey,
    };
    
    addMCPTool(tool);
    setToolDialogOpen(false);
    setNewTool({
      name: "",
      description: "",
      endpoint: "",
      method: "GET",
      parameters: "",
      authKey: "",
    });
    
    toast({
      title: "Ferramenta adicionada",
      description: `${tool.name} foi adicionada com sucesso`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuração do Servidor MCP</CardTitle>
          <CardDescription>
            Configure o servidor MCP para permitir que o agente utilize ferramentas externas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mcpServerUrl">URL do Servidor MCP</Label>
              <Input
                id="mcpServerUrl"
                value={mcpServerUrl}
                onChange={(e) => setMcpServerUrl(e.target.value)}
                placeholder="https://seu-servidor-mcp.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mcpApiKey">Chave de API do MCP</Label>
              <Input
                id="mcpApiKey"
                type="password"
                value={mcpApiKey}
                onChange={(e) => setMcpApiKey(e.target.value)}
                placeholder="Chave de acesso ao servidor MCP"
              />
            </div>
            <Button className="inventu-btn" onClick={handleUpdateMCPConfig}>
              <Save className="mr-2 h-4 w-4" />
              Salvar Configuração
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="pt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Ferramentas MCP</h3>
          <Dialog open={toolDialogOpen} onOpenChange={setToolDialogOpen}>
            <DialogTrigger asChild>
              <Button className="inventu-btn">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Ferramenta
              </Button>
            </DialogTrigger>
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
                    onValueChange={(value: "GET" | "POST" | "PUT" | "DELETE") => 
                      setNewTool({ ...newTool, method: value })
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
                      <SelectItem value="PATCH">PATCH</SelectItem>
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
                <Button variant="outline" onClick={() => setToolDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button className="inventu-btn" onClick={handleAddTool}>
                  Adicionar Ferramenta
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {mcpConfig.tools.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma ferramenta MCP configurada ainda. Adicione uma para começar.
          </div>
        ) : (
          <div className="space-y-4">
            {mcpConfig.tools.map((tool) => (
              <Card key={tool.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle>{tool.name}</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        removeMCPTool(tool.id);
                        toast({
                          title: "Ferramenta removida",
                          description: `${tool.name} foi removida com sucesso`,
                        });
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Método:</span>
                      <span>{tool.method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Endpoint:</span>
                      <span>{tool.endpoint}</span>
                    </div>
                    {tool.parameters && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Parâmetros:</span>
                        <span className="truncate max-w-[200px]">{tool.parameters}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Chave:</span>
                      <span>{tool.authKey ? "••••••••" : "Não configurada"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MCPTab;
