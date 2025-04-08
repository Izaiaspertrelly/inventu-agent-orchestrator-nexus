
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAgent } from "@/contexts/AgentContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const OrchestratorSection: React.FC = () => {
  const { toast } = useToast();
  const { models, agents, updateOrchestratorConfig, orchestratorConfig } = useAgent();
  
  const [mainAgent, setMainAgent] = useState(orchestratorConfig?.mainAgentId || "");
  const [memoryEnabled, setMemoryEnabled] = useState(orchestratorConfig?.memory?.enabled || true);
  const [memoryType, setMemoryType] = useState(orchestratorConfig?.memory?.type || "buffer");
  const [reasoningEnabled, setReasoningEnabled] = useState(orchestratorConfig?.reasoning?.enabled || true);
  const [reasoningDepth, setReasoningDepth] = useState(orchestratorConfig?.reasoning?.depth?.toString() || "2");
  const [planningEnabled, setPlanningEnabled] = useState(orchestratorConfig?.planning?.enabled || false);
  const [configJson, setConfigJson] = useState(JSON.stringify(orchestratorConfig || {
    memory: {
      type: "buffer",
      capacity: 10,
      enabled: true
    },
    reasoning: {
      depth: 2,
      strategy: "chain-of-thought",
      enabled: true
    },
    planning: {
      enabled: false,
      horizon: 5
    }
  }, null, 2));

  // Carrega a configuração atual do orquestrador quando o componente é montado
  useEffect(() => {
    if (orchestratorConfig) {
      setMainAgent(orchestratorConfig.mainAgentId || "");
      setMemoryEnabled(orchestratorConfig.memory?.enabled || true);
      setMemoryType(orchestratorConfig.memory?.type || "buffer");
      setReasoningEnabled(orchestratorConfig.reasoning?.enabled || true);
      setReasoningDepth(orchestratorConfig.reasoning?.depth?.toString() || "2");
      setPlanningEnabled(orchestratorConfig.planning?.enabled || false);
      setConfigJson(JSON.stringify(orchestratorConfig, null, 2));
    }
  }, [orchestratorConfig]);

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
      
      const newConfig = {
        mainAgentId: mainAgent,
        memory: memoryConfig,
        reasoning: reasoningConfig,
        planning: planningConfig
      };
      
      setConfigJson(JSON.stringify(newConfig, null, 2));
      
      toast({
        title: "Configuração atualizada",
        description: "A configuração do orquestrador foi atualizada."
      });
    } catch (e) {
      toast({
        title: "Erro na configuração",
        description: "Não foi possível atualizar a configuração.",
        variant: "destructive"
      });
    }
  };

  const handleSaveOrchestrator = () => {
    try {
      let config = JSON.parse(configJson);
      updateOrchestratorConfig(config);
      
      toast({
        title: "Orquestrador salvo",
        description: "Configuração do orquestrador salva com sucesso.",
      });
    } catch (e) {
      console.error("Erro ao salvar configuração do orquestrador:", e);
      toast({
        title: "Erro",
        description: "O JSON de configuração é inválido.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuração do Orquestrador Neural</CardTitle>
          <CardDescription>
            O orquestrador é o cérebro central que coordena todos os outros componentes do sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="mainAgent">Agente Principal</Label>
              <Select
                value={mainAgent}
                onValueChange={setMainAgent}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um agente principal" />
                </SelectTrigger>
                <SelectContent>
                  {agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Este é o agente que será responsável pela tomada de decisões primárias e delegação de tarefas.
              </p>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-4">Capacidades Neurais do Orquestrador</h3>
              
              <div className="space-y-6">
                {/* Memória */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Memória</h4>
                    <p className="text-sm text-muted-foreground">
                      Permite ao orquestrador lembrar de interações anteriores
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
                      Permite ao orquestrador raciocinar sobre informações
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
                      Permite ao orquestrador planejar ações futuras
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
                value={configJson}
                onChange={(e) => setConfigJson(e.target.value)}
                className="font-mono h-64"
              />
            </div>
            
            <Button 
              onClick={handleSaveOrchestrator} 
              className="w-full"
            >
              Salvar Configuração do Orquestrador Neural
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrchestratorSection;
