
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAgent } from "@/contexts/AgentContext";
import { MCPTool } from "@/types";
import { v4 as uuidv4 } from "uuid";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Save, Trash, Edit, Link } from "lucide-react";

const ToolsTab = () => {
  const { toast } = useToast();
  const { 
    mcpConfig, 
    agents, 
    updateMCPConfig, 
    addMCPTool, 
    removeMCPTool, 
    updateAgent 
  } = useAgent();
  
  const [toolDialogOpen, setToolDialogOpen] = useState(false);
  const [mcpServerUrl, setMcpServerUrl] = useState(mcpConfig.serverUrl);
  const [mcpApiKey, setMcpApiKey] = useState(mcpConfig.apiKey || "");
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [isAssigningTools, setIsAssigningTools] = useState(false);
  const [selectedToolIds, setSelectedToolIds] = useState<string[]>([]);
  
  const [newTool, setNewTool] = useState<Partial<MCPTool>>({
    name: "",
    description: "",
    endpoint: "",
    method: "GET", // Default method
    parameters: "",
    authKey: "",
  });

  // Encontra o agente selecionado atualmente
  const selectedAgent = agents.find(a => a.id === selectedAgentId);

  // Handle MCP config update
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

  // Handle adding a new tool
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
      method: newTool.method || "GET", // Add method with default value
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

  // Handle assigning tools to agent
  const handleAssignTools = () => {
    if (!selectedAgentId) {
      toast({
        title: "Seleção necessária",
        description: "Selecione um agente para continuar",
        variant: "destructive"
      });
      return;
    }

    setIsAssigningTools(true);
    
    try {
      // Obter o agente existente
      const agent = agents.find(a => a.id === selectedAgentId);
      
      if (!agent) {
        throw new Error("Agente não encontrado");
      }
      
      // Parse a configuração existente
      let configJson = {};
      try {
        configJson = JSON.parse(agent.configJson);
      } catch (e) {
        configJson = {};
      }
      
      // Atualizar a configuração com as ferramentas selecionadas
      configJson = {
        ...configJson,
        tools: selectedToolIds.map(id => {
          const tool = mcpConfig.tools.find(t => t.id === id);
          return {
            id,
            name: tool?.name || "Ferramenta",
            endpoint: tool?.endpoint || "/api/tool"
          };
        })
      };
      
      // Atualizar o agente
      updateAgent(selectedAgentId, {
        toolIds: selectedToolIds,
        configJson: JSON.stringify(configJson),
        updatedAt: new Date()
      });
      
      toast({
        title: "Ferramentas atribuídas",
        description: `Ferramentas atribuídas com sucesso ao agente ${agent.name}`,
      });
      
      // Limpar seleção
      setSelectedAgentId(null);
      setSelectedToolIds([]);
      
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atribuir as ferramentas",
        variant: "destructive"
      });
    } finally {
      setIsAssigningTools(false);
    }
  };

  // Handle tool id selection
  const handleToolSelection = (toolId: string) => {
    setSelectedToolIds(prev => {
      if (prev.includes(toolId)) {
        return prev.filter(id => id !== toolId);
      } else {
        return [...prev, toolId];
      }
    });
  };

  // Reset selected tools when agent changes
  React.useEffect(() => {
    if (selectedAgentId) {
      const agent = agents.find(a => a.id === selectedAgentId);
      if (agent) {
        setSelectedToolIds(agent.toolIds || []);
      } else {
        setSelectedToolIds([]);
      }
    } else {
      setSelectedToolIds([]);
    }
  }, [selectedAgentId, agents]);

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
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleUpdateMCPConfig}>
            <Save className="mr-2 h-4 w-4" />
            Salvar Configuração MCP
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Ferramentas MCP</CardTitle>
              <CardDescription>
                Configure as ferramentas externas que serão utilizadas pelos agentes
              </CardDescription>
            </div>
            <Dialog open={toolDialogOpen} onOpenChange={setToolDialogOpen}>
              <DialogTrigger asChild>
                <Button>
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
                    <Label htmlFor="toolEndpoint">Endpoint</Label>
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
                  <Button onClick={handleAddTool}>
                    Adicionar Ferramenta
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {mcpConfig.tools.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma ferramenta MCP configurada ainda. Adicione uma para começar.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Endpoint</TableHead>
                  <TableHead>Autenticação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mcpConfig.tools.map((tool) => (
                  <TableRow key={tool.id}>
                    <TableCell className="font-medium">{tool.name}</TableCell>
                    <TableCell>{tool.description}</TableCell>
                    <TableCell>{tool.endpoint}</TableCell>
                    <TableCell>
                      {tool.authKey ? "••••••••" : "Não configurada"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Atribuição de Ferramentas aos Agentes</CardTitle>
          <CardDescription>
            Atribua ferramentas MCP para cada agente
          </CardDescription>
        </CardHeader>
        <CardContent>
          {agents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum agente configurado ainda. Configure um orquestrador primeiro.
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Selecionar Agente</Label>
                <Select
                  value={selectedAgentId || ""}
                  onValueChange={setSelectedAgentId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um agente" />
                  </SelectTrigger>
                  <SelectContent>
                    {agents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.name} {agent.toolIds && agent.toolIds.length > 0 ? `(${agent.toolIds.length} ferramentas)` : '(Sem ferramentas)'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedAgentId && mcpConfig.tools.length > 0 && (
                <div className="space-y-4 border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-4">Selecione as ferramentas para este agente</h3>
                  
                  <div className="space-y-2">
                    {mcpConfig.tools.map(tool => (
                      <div key={tool.id} className="flex items-center space-x-2 p-2 border rounded hover:bg-muted/20">
                        <input 
                          type="checkbox" 
                          id={`tool-${tool.id}`}
                          checked={selectedToolIds.includes(tool.id)}
                          onChange={() => handleToolSelection(tool.id)}
                          className="h-4 w-4"
                        />
                        <div className="flex-1">
                          <Label htmlFor={`tool-${tool.id}`} className="font-medium cursor-pointer">
                            {tool.name}
                          </Label>
                          <p className="text-sm text-muted-foreground">{tool.description}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {tool.endpoint}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  <Button 
                    onClick={handleAssignTools} 
                    disabled={isAssigningTools}
                    className="w-full mt-4"
                  >
                    {isAssigningTools ? "Atribuindo..." : "Atribuir Ferramentas ao Agente"}
                  </Button>
                </div>
              )}

              {selectedAgentId && mcpConfig.tools.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  Nenhuma ferramenta MCP disponível. Adicione ferramentas para poder atribuí-las a agentes.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ToolsTab;
