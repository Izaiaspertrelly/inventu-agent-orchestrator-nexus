
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAgent } from "@/contexts/AgentContext";
import { v4 as uuidv4 } from "uuid";

const OrchestratorTab = () => {
  const { toast } = useToast();
  const { agents, addAgent, updateAgent } = useAgent();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [memoryEnabled, setMemoryEnabled] = useState(true);
  const [reasoningEnabled, setReasoningEnabled] = useState(true);
  const [planningEnabled, setPlanningEnabled] = useState(false);
  const [memoryType, setMemoryType] = useState("buffer");
  const [reasoningDepth, setReasoningDepth] = useState("2");
  const [orchestratorConfig, setOrchestratorConfig] = useState(JSON.stringify({
    memory: {
      type: "buffer",
      capacity: 10
    },
    reasoning: {
      depth: 2,
      strategy: "chain-of-thought"
    },
    planning: {
      enabled: false,
      horizon: 5
    }
  }, null, 2));
  
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateConfig = () => {
    try {
      const memoryConfig = {
        type: memoryType,
        capacity: memoryType === "buffer" ? 10 : 50,
        enabled: memoryEnabled
      };
      
      const reasoningConfig = {
        depth: parseInt(reasoningDepth),
        strategy: "chain-of-thought",
        enabled: reasoningEnabled
      };
      
      const planningConfig = {
        enabled: planningEnabled,
        horizon: 5
      };
      
      const newConfig = JSON.stringify({
        memory: memoryConfig,
        reasoning: reasoningConfig,
        planning: planningConfig
      }, null, 2);
      
      setOrchestratorConfig(newConfig);
    } catch (e) {
      toast({
        title: "Erro na configuração",
        description: "Não foi possível atualizar a configuração do orquestrador.",
        variant: "destructive"
      });
    }
  };

  const handleSaveOrchestrator = () => {
    if (!name) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, forneça um nome para o agente.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const configObj = JSON.parse(orchestratorConfig);
      
      const newAgent = {
        id: uuidv4(),
        name,
        description,
        modelId: "", // Será preenchido na próxima etapa
        configJson: JSON.stringify({
          orchestrator: configObj
        }),
        toolIds: [], // Será preenchido na próxima etapa
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      addAgent(newAgent);
      
      toast({
        title: "Agente criado",
        description: "Configuração do orquestrador salva com sucesso. Continue para selecionar o modelo.",
      });
      
      // Reset form
      setName("");
      setDescription("");
    } catch (e) {
      toast({
        title: "Erro na configuração",
        description: "O JSON de configuração é inválido.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuração do Orquestrador</CardTitle>
          <CardDescription>
            O orquestrador é responsável pelo gerenciamento da memória, raciocínio e planejamento do agente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Agente</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome do agente"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrição do propósito do agente"
                rows={2}
              />
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-4">Capacidades do Orquestrador</h3>
              
              <div className="space-y-6">
                {/* Memória */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Memória</h4>
                    <p className="text-sm text-muted-foreground">
                      Permite ao agente lembrar de interações anteriores
                    </p>
                  </div>
                  <Switch 
                    checked={memoryEnabled}
                    onCheckedChange={setMemoryEnabled}
                  />
                </div>
                
                {memoryEnabled && (
                  <div className="ml-4 space-y-2">
                    <Label htmlFor="memory-type">Tipo de Memória</Label>
                    <Select
                      value={memoryType}
                      onValueChange={setMemoryType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de memória" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buffer">Buffer Simples</SelectItem>
                        <SelectItem value="vectordb">Banco de Dados Vetorial</SelectItem>
                        <SelectItem value="summary">Memória com Resumo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {/* Raciocínio */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Raciocínio</h4>
                    <p className="text-sm text-muted-foreground">
                      Permite ao agente raciocinar sobre informações
                    </p>
                  </div>
                  <Switch 
                    checked={reasoningEnabled}
                    onCheckedChange={setReasoningEnabled}
                  />
                </div>
                
                {reasoningEnabled && (
                  <div className="ml-4 space-y-2">
                    <Label htmlFor="reasoning-depth">Profundidade de Raciocínio</Label>
                    <Select
                      value={reasoningDepth}
                      onValueChange={setReasoningDepth}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a profundidade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Básico (1 passo)</SelectItem>
                        <SelectItem value="2">Intermediário (2 passos)</SelectItem>
                        <SelectItem value="3">Avançado (3+ passos)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {/* Planejamento */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Planejamento</h4>
                    <p className="text-sm text-muted-foreground">
                      Permite ao agente planejar ações futuras
                    </p>
                  </div>
                  <Switch 
                    checked={planningEnabled}
                    onCheckedChange={setPlanningEnabled}
                  />
                </div>
              </div>
              
              <Button 
                variant="outline" 
                onClick={handleUpdateConfig}
                className="mt-4"
              >
                Atualizar Configuração
              </Button>
            </div>
            
            <div className="border-t pt-4 space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="orchestrator-config">Configuração JSON do Orquestrador</Label>
                <span className="text-xs text-muted-foreground">Edição avançada</span>
              </div>
              <Textarea
                id="orchestrator-config"
                value={orchestratorConfig}
                onChange={(e) => setOrchestratorConfig(e.target.value)}
                className="font-mono h-64"
              />
            </div>
            
            <Button 
              onClick={handleSaveOrchestrator} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Salvando..." : "Salvar Configuração do Orquestrador"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrchestratorTab;
