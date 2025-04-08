
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAgent } from "@/contexts/AgentContext";
import { Agent, MCPTool } from "@/types";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash, Edit } from "lucide-react";

const AgentsTab = () => {
  const { toast } = useToast();
  const {
    models,
    mcpConfig,
    agents,
    addAgent,
    updateAgent,
    removeAgent,
  } = useAgent();
  
  // Dialog states
  const [agentDialogOpen, setAgentDialogOpen] = useState(false);
  const [editAgentDialogOpen, setEditAgentDialogOpen] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  
  // Form states
  const [newAgent, setNewAgent] = useState<Partial<Agent>>({
    name: "",
    description: "",
    modelId: "",
    configJson: "{\n  \"parameters\": {},\n  \"instructions\": \"\"\n}",
    toolIds: [],
  });

  // Handle adding a new agent
  const handleAddAgent = () => {
    if (!newAgent.name || !newAgent.modelId) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e modelo são obrigatórios",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Validate JSON
      JSON.parse(newAgent.configJson || "{}");
      
      const agent: Agent = {
        id: uuidv4(),
        name: newAgent.name,
        description: newAgent.description || "",
        modelId: newAgent.modelId,
        configJson: newAgent.configJson || "{}",
        toolIds: newAgent.toolIds || [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      addAgent(agent);
      setAgentDialogOpen(false);
      setNewAgent({
        name: "",
        description: "",
        modelId: "",
        configJson: "{\n  \"parameters\": {},\n  \"instructions\": \"\"\n}",
        toolIds: [],
      });
      
      toast({
        title: "Agente adicionado",
        description: `${agent.name} foi adicionado com sucesso`,
      });
    } catch (error) {
      toast({
        title: "JSON inválido",
        description: "A configuração JSON do agente é inválida",
        variant: "destructive",
      });
    }
  };

  // Handle updating an agent
  const handleUpdateAgent = () => {
    if (!selectedAgentId || !newAgent.name || !newAgent.modelId) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e modelo são obrigatórios",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Validate JSON
      JSON.parse(newAgent.configJson || "{}");
      
      updateAgent(selectedAgentId, {
        name: newAgent.name,
        description: newAgent.description,
        modelId: newAgent.modelId,
        configJson: newAgent.configJson,
        toolIds: newAgent.toolIds,
        updatedAt: new Date(),
      });
      
      setEditAgentDialogOpen(false);
      setSelectedAgentId(null);
      
      toast({
        title: "Agente atualizado",
        description: `${newAgent.name} foi atualizado com sucesso`,
      });
    } catch (error) {
      toast({
        title: "JSON inválido",
        description: "A configuração JSON do agente é inválida",
        variant: "destructive",
      });
    }
  };

  // Open edit agent dialog
  const openEditAgentDialog = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (agent) {
      setSelectedAgentId(agentId);
      setNewAgent({
        name: agent.name,
        description: agent.description,
        modelId: agent.modelId,
        configJson: agent.configJson,
        toolIds: agent.toolIds,
      });
      setEditAgentDialogOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Agentes Configurados</h2>
        <Dialog open={agentDialogOpen} onOpenChange={setAgentDialogOpen}>
          <DialogTrigger asChild>
            <Button className="inventu-btn">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Agente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Agente</DialogTitle>
              <DialogDescription>
                Configure um novo agente para utilizar modelos de IA e ferramentas específicas.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                <Label htmlFor="agentName">Nome do Agente</Label>
                <Input
                  id="agentName"
                  value={newAgent.name}
                  onChange={(e) =>
                    setNewAgent({ ...newAgent, name: e.target.value })
                  }
                  placeholder="Nome do agente"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agentDescription">Descrição</Label>
                <Textarea
                  id="agentDescription"
                  value={newAgent.description}
                  onChange={(e) =>
                    setNewAgent({ ...newAgent, description: e.target.value })
                  }
                  placeholder="Descrição do propósito do agente"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agentModel">Modelo de IA</Label>
                <Select 
                  value={newAgent.modelId} 
                  onValueChange={(value) => setNewAgent({ ...newAgent, modelId: value })}
                >
                  <SelectTrigger id="agentModel">
                    <SelectValue placeholder="Selecione um modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name} ({model.provider})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="agentTools">Ferramentas MCP</Label>
                <div className="border rounded-md p-4">
                  {mcpConfig.tools.length > 0 ? (
                    mcpConfig.tools.map((tool) => (
                      <div key={tool.id} className="flex items-center space-x-2 mb-2">
                        <input
                          type="checkbox"
                          id={`tool-${tool.id}`}
                          checked={newAgent.toolIds?.includes(tool.id) || false}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewAgent({
                                ...newAgent,
                                toolIds: [...(newAgent.toolIds || []), tool.id],
                              });
                            } else {
                              setNewAgent({
                                ...newAgent,
                                toolIds: newAgent.toolIds?.filter(id => id !== tool.id) || [],
                              });
                            }
                          }}
                        />
                        <Label htmlFor={`tool-${tool.id}`}>{tool.name}</Label>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Nenhuma ferramenta MCP configurada. Adicione ferramentas na aba MCP.
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="configJson">Configuração JSON</Label>
                  <span className="text-xs text-muted-foreground">Estrutura do agente</span>
                </div>
                <Textarea
                  id="configJson"
                  value={newAgent.configJson}
                  onChange={(e) =>
                    setNewAgent({ ...newAgent, configJson: e.target.value })
                  }
                  className="font-mono h-64"
                  placeholder="{}"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAgentDialogOpen(false)}>
                Cancelar
              </Button>
              <Button className="inventu-btn" onClick={handleAddAgent}>
                Adicionar Agente
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Agent Dialog */}
        <Dialog open={editAgentDialogOpen} onOpenChange={setEditAgentDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Agente</DialogTitle>
              <DialogDescription>
                Atualize a configuração do agente.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                <Label htmlFor="editAgentName">Nome do Agente</Label>
                <Input
                  id="editAgentName"
                  value={newAgent.name}
                  onChange={(e) =>
                    setNewAgent({ ...newAgent, name: e.target.value })
                  }
                  placeholder="Nome do agente"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editAgentDescription">Descrição</Label>
                <Textarea
                  id="editAgentDescription"
                  value={newAgent.description}
                  onChange={(e) =>
                    setNewAgent({ ...newAgent, description: e.target.value })
                  }
                  placeholder="Descrição do propósito do agente"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editAgentModel">Modelo de IA</Label>
                <Select 
                  value={newAgent.modelId} 
                  onValueChange={(value) => setNewAgent({ ...newAgent, modelId: value })}
                >
                  <SelectTrigger id="editAgentModel">
                    <SelectValue placeholder="Selecione um modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name} ({model.provider})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editAgentTools">Ferramentas MCP</Label>
                <div className="border rounded-md p-4">
                  {mcpConfig.tools.length > 0 ? (
                    mcpConfig.tools.map((tool) => (
                      <div key={tool.id} className="flex items-center space-x-2 mb-2">
                        <input
                          type="checkbox"
                          id={`edit-tool-${tool.id}`}
                          checked={newAgent.toolIds?.includes(tool.id) || false}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewAgent({
                                ...newAgent,
                                toolIds: [...(newAgent.toolIds || []), tool.id],
                              });
                            } else {
                              setNewAgent({
                                ...newAgent,
                                toolIds: newAgent.toolIds?.filter(id => id !== tool.id) || [],
                              });
                            }
                          }}
                        />
                        <Label htmlFor={`edit-tool-${tool.id}`}>{tool.name}</Label>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Nenhuma ferramenta MCP configurada. Adicione ferramentas na aba MCP.
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="editConfigJson">Configuração JSON</Label>
                  <span className="text-xs text-muted-foreground">Estrutura do agente</span>
                </div>
                <Textarea
                  id="editConfigJson"
                  value={newAgent.configJson}
                  onChange={(e) =>
                    setNewAgent({ ...newAgent, configJson: e.target.value })
                  }
                  className="font-mono h-64"
                  placeholder="{}"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditAgentDialogOpen(false)}>
                Cancelar
              </Button>
              <Button className="inventu-btn" onClick={handleUpdateAgent}>
                Atualizar Agente
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {agents && agents.length > 0 ? (
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Ferramentas</TableHead>
                <TableHead>Última Atualização</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agents.map((agent) => {
                const modelName = models.find(m => m.id === agent.modelId)?.name || "Desconhecido";
                const toolNames = agent.toolIds
                  .map(toolId => mcpConfig.tools.find(t => t.id === toolId)?.name || "")
                  .filter(Boolean)
                  .join(", ");
                  
                return (
                  <TableRow key={agent.id}>
                    <TableCell className="font-medium">{agent.name}</TableCell>
                    <TableCell>{modelName}</TableCell>
                    <TableCell>
                      {toolNames || <span className="text-muted-foreground">Nenhuma</span>}
                    </TableCell>
                    <TableCell>{new Date(agent.updatedAt).toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openEditAgentDialog(agent.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            removeAgent(agent.id);
                            toast({
                              title: "Agente removido",
                              description: `${agent.name} foi removido com sucesso`,
                            });
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum agente configurado ainda. Adicione um para começar.
        </div>
      )}
    </div>
  );
};

export default AgentsTab;
