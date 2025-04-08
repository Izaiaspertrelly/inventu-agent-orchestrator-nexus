
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Lista dos 20 principais provedores de IA
const AI_PROVIDERS = [
  { id: "openai", name: "OpenAI", models: ["GPT-4o", "GPT-3.5 Turbo", "Claude 3"] },
  { id: "anthropic", name: "Anthropic", models: ["Claude 3 Opus", "Claude 3 Sonnet", "Claude 3 Haiku"] },
  { id: "google", name: "Google AI", models: ["Gemini Pro", "Gemini Ultra", "PaLM"] },
  { id: "meta", name: "Meta AI", models: ["Llama 3", "Llama 3.1"] },
  { id: "cohere", name: "Cohere", models: ["Command R+", "Command R", "Embed"] },
  { id: "mistral", name: "Mistral AI", models: ["Mistral Large", "Mistral Medium", "Mistral Small"] },
  { id: "perplexity", name: "Perplexity", models: ["pplx-7b", "pplx-70b"] },
  { id: "microsoft", name: "Microsoft", models: ["Turing", "Phi-3"] },
  { id: "nvidia", name: "NVIDIA", models: ["Nemotron", "NV LLM"] },
  { id: "stability", name: "Stability AI", models: ["Stable Diffusion 3", "Stable Diffusion XL"] },
  { id: "deepmind", name: "DeepMind", models: ["Gemini", "AlphaCode"] },
  { id: "huggingface", name: "HuggingFace", models: ["BLOOM", "Falcon"] },
  { id: "adept", name: "Adept AI", models: ["Fuyu", "Persimmon"] },
  { id: "inflection", name: "Inflection AI", models: ["Pi", "Inflection-1"] },
  { id: "midjourney", name: "Midjourney", models: ["MJ v6", "MJ v5"] },
  { id: "amazon", name: "Amazon Bedrock", models: ["Titan", "Claude (via Bedrock)"] },
  { id: "replicate", name: "Replicate", models: ["SDXL", "LLaMA"] },
  { id: "databricks", name: "Databricks", models: ["DBRX", "Dolly"] },
  { id: "ibm", name: "IBM", models: ["Watson", "Granite"] },
  { id: "baidu", name: "Baidu", models: ["ERNIE Bot", "Wenxin"] }
];

const ModelsTab = () => {
  const { toast } = useToast();
  const { models, agents, addModel, updateModel, removeModel, updateAgent } = useAgent();
  
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [modelDialogOpen, setModelDialogOpen] = useState(false);
  const [isAssigningModel, setIsAssigningModel] = useState(false);
  
  const [selectedProviderId, setSelectedProviderId] = useState<string>("openai");
  const [modelKey, setModelKey] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");

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
    
    addModel(model);
    setModelDialogOpen(false);
    setModelKey("");
    setSelectedModel("");
    
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
