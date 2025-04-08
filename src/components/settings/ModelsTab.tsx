
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAgent } from "@/contexts/AgentContext";
import { AIModel } from "@/types";
import { v4 as uuidv4 } from "uuid";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { Plus, Save, Trash, Edit } from "lucide-react";

const ModelsTab = () => {
  const { toast } = useToast();
  const { models, agents, addModel, updateModel, removeModel, updateAgent } = useAgent();
  
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [modelDialogOpen, setModelDialogOpen] = useState(false);
  const [isAssigningModel, setIsAssigningModel] = useState(false);
  
  const [newModel, setNewModel] = useState<Partial<AIModel>>({
    name: "",
    provider: "",
    description: "",
    apiKey: "",
    capabilities: [],
  });

  const [selectedModelId, setSelectedModelId] = useState("");
  const [modelParams, setModelParams] = useState(JSON.stringify({
    temperature: 0.7,
    top_p: 1,
    presence_penalty: 0,
    frequency_penalty: 0,
    max_tokens: 1000,
  }, null, 2));

  // Encontra o agente selecionado atualmente
  const selectedAgent = agents.find(a => a.id === selectedAgentId);
  
  // Lista de agentes que ainda não têm modelo atribuído
  const agentsWithoutModel = agents.filter(a => !a.modelId);

  const handleAddModel = () => {
    if (!newModel.name || !newModel.provider) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e provedor são obrigatórios",
        variant: "destructive",
      });
      return;
    }
    
    const model: AIModel = {
      id: uuidv4(),
      name: newModel.name || "Novo Modelo",
      provider: newModel.provider || "Provedor",
      description: newModel.description || "Descrição do modelo",
      capabilities: newModel.capabilities || [],
      apiKey: newModel.apiKey,
    };
    
    addModel(model);
    setModelDialogOpen(false);
    setNewModel({
      name: "",
      provider: "",
      description: "",
      apiKey: "",
      capabilities: [],
    });
    
    toast({
      title: "Modelo adicionado",
      description: `${model.name} foi adicionado com sucesso`,
    });
  };

  const handleAssignModel = () => {
    if (!selectedAgentId || !selectedModelId) {
      toast({
        title: "Seleção necessária",
        description: "Selecione um agente e um modelo para continuar",
        variant: "destructive"
      });
      return;
    }

    setIsAssigningModel(true);
    
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
      
      // Parse parâmetros do modelo
      let modelConfig = {};
      try {
        modelConfig = JSON.parse(modelParams);
      } catch (e) {
        toast({
          title: "Erro nos parâmetros",
          description: "O JSON de parâmetros do modelo é inválido. Usando padrões.",
          variant: "destructive"
        });
        modelConfig = {
          temperature: 0.7,
          top_p: 1
        };
      }
      
      // Atualizar a configuração com o modelo selecionado
      configJson = {
        ...configJson,
        model: {
          id: selectedModelId,
          parameters: modelConfig
        }
      };
      
      // Atualizar o agente
      updateAgent(selectedAgentId, {
        modelId: selectedModelId,
        configJson: JSON.stringify(configJson),
        updatedAt: new Date()
      });
      
      toast({
        title: "Modelo atribuído",
        description: `Modelo atribuído com sucesso ao agente ${agent.name}`,
      });
      
      // Limpar seleção
      setSelectedAgentId(null);
      setSelectedModelId("");
      
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atribuir o modelo",
        variant: "destructive"
      });
    } finally {
      setIsAssigningModel(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Modelos de IA Disponíveis</CardTitle>
              <CardDescription>
                Selecione e configure os modelos de linguagem a serem usados pelos agentes
              </CardDescription>
            </div>
            <Dialog open={modelDialogOpen} onOpenChange={setModelDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Modelo
                </Button>
              </DialogTrigger>
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
                      value={newModel.name}
                      onChange={(e) =>
                        setNewModel({ ...newModel, name: e.target.value })
                      }
                      placeholder="Nome do modelo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="provider">Provedor</Label>
                    <Input
                      id="provider"
                      value={newModel.provider}
                      onChange={(e) =>
                        setNewModel({ ...newModel, provider: e.target.value })
                      }
                      placeholder="Provedor (ex: OpenAI, Anthropic)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={newModel.description}
                      onChange={(e) =>
                        setNewModel({ ...newModel, description: e.target.value })
                      }
                      placeholder="Descrição das capacidades do modelo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apiKey">Chave de API</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      value={newModel.apiKey}
                      onChange={(e) =>
                        setNewModel({ ...newModel, apiKey: e.target.value })
                      }
                      placeholder="Chave de API (opcional)"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setModelDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddModel}>
                    Adicionar Modelo
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {models.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum modelo configurado ainda. Adicione um para começar.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Provedor</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>API Key</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {models.map((model) => (
                  <TableRow key={model.id}>
                    <TableCell className="font-medium">{model.name}</TableCell>
                    <TableCell>{model.provider}</TableCell>
                    <TableCell>{model.description}</TableCell>
                    <TableCell>
                      {model.apiKey ? "••••••••" : "Não configurada"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            removeModel(model.id);
                            toast({
                              title: "Modelo removido",
                              description: `${model.name} foi removido com sucesso`,
                            });
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
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
          <CardTitle>Atribuição de Modelos aos Agentes</CardTitle>
          <CardDescription>
            Atribua e configure os modelos de IA para cada agente
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
                        {agent.name} {agent.modelId ? `(${models.find(m => m.id === agent.modelId)?.name || 'Modelo configurado'})` : '(Sem modelo)'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedAgentId && (
                <div className="space-y-4 border rounded-md p-4">
                  <div className="space-y-2">
                    <Label>Selecionar Modelo para o Agente</Label>
                    <Select
                      value={selectedModelId}
                      onValueChange={setSelectedModelId}
                    >
                      <SelectTrigger>
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
                    <div className="flex items-center justify-between">
                      <Label htmlFor="model-params">Parâmetros do Modelo</Label>
                      <span className="text-xs text-muted-foreground">Configuração avançada</span>
                    </div>
                    <Textarea
                      id="model-params"
                      value={modelParams}
                      onChange={(e) => setModelParams(e.target.value)}
                      className="font-mono h-40"
                    />
                  </div>

                  <Button 
                    onClick={handleAssignModel} 
                    disabled={isAssigningModel || !selectedModelId}
                    className="w-full"
                  >
                    {isAssigningModel ? "Atribuindo..." : "Atribuir Modelo ao Agente"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ModelsTab;
