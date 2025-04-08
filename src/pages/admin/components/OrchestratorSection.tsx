
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAgent } from "@/contexts/AgentContext";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrchestratorHeader from "./orchestrator/OrchestratorHeader";
import AgentSelector from "./orchestrator/AgentSelector";
import CapabilitiesSection from "./orchestrator/CapabilitiesSection";
import JsonConfigEditor from "./orchestrator/JsonConfigEditor";
import SaveButton from "./orchestrator/SaveButton";
import OrchestratorMonitoring from "./orchestrator/OrchestratorMonitoring";
import ResourcesConfiguration from "./orchestrator/ResourcesConfiguration";

const OrchestratorSection: React.FC = () => {
  const { toast } = useToast();
  const { models, agents, updateOrchestratorConfig, orchestratorConfig, orchestratorState } = useAgent();
  
  const [mainAgent, setMainAgent] = useState(orchestratorConfig?.mainAgentId || "");
  const [memoryEnabled, setMemoryEnabled] = useState(orchestratorConfig?.memory?.enabled || true);
  const [memoryType, setMemoryType] = useState(orchestratorConfig?.memory?.type || "buffer");
  const [reasoningEnabled, setReasoningEnabled] = useState(orchestratorConfig?.reasoning?.enabled || true);
  const [reasoningDepth, setReasoningDepth] = useState(orchestratorConfig?.reasoning?.depth?.toString() || "2");
  const [planningEnabled, setPlanningEnabled] = useState(orchestratorConfig?.planning?.enabled || false);
  const [optimizeResources, setOptimizeResources] = useState(orchestratorConfig?.resources?.optimizeUsage || true);
  const [maxTokens, setMaxTokens] = useState(orchestratorConfig?.resources?.maxTokens?.toString() || "4000");
  const [enableMonitoring, setEnableMonitoring] = useState(orchestratorConfig?.monitoring?.enabled || true);
  const [adaptiveBehavior, setAdaptiveBehavior] = useState(orchestratorConfig?.monitoring?.adaptiveBehavior || true);
  
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
      horizon: 5,
      strategy: "goal-decomposition"
    },
    resources: {
      maxTokens: 4000,
      optimizeUsage: true
    },
    monitoring: {
      enabled: true,
      adaptiveBehavior: true
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
      setOptimizeResources(orchestratorConfig.resources?.optimizeUsage || true);
      setMaxTokens(orchestratorConfig.resources?.maxTokens?.toString() || "4000");
      setEnableMonitoring(orchestratorConfig.monitoring?.enabled || true);
      setAdaptiveBehavior(orchestratorConfig.monitoring?.adaptiveBehavior || true);
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
        horizon: 5,
        strategy: "goal-decomposition"
      };
      
      const resourcesConfig = {
        maxTokens: parseInt(maxTokens),
        optimizeUsage: optimizeResources
      };
      
      const monitoringConfig = {
        enabled: enableMonitoring,
        adaptiveBehavior: adaptiveBehavior
      };
      
      const newConfig = {
        mainAgentId: mainAgent,
        memory: memoryConfig,
        reasoning: reasoningConfig,
        planning: planningConfig,
        resources: resourcesConfig,
        monitoring: monitoringConfig
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
          <OrchestratorHeader />
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="basic">Configuração Básica</TabsTrigger>
              <TabsTrigger value="capabilities">Capacidades</TabsTrigger>
              <TabsTrigger value="resources">Recursos</TabsTrigger>
              <TabsTrigger value="monitoring">Monitoramento</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-6">
              <AgentSelector 
                agents={agents}
                mainAgent={mainAgent}
                setMainAgent={setMainAgent}
              />
              
              <JsonConfigEditor 
                configJson={configJson}
                setConfigJson={setConfigJson}
              />
              
              <SaveButton 
                handleSaveOrchestrator={handleSaveOrchestrator} 
              />
            </TabsContent>
            
            <TabsContent value="capabilities" className="space-y-6">
              <CapabilitiesSection 
                memoryEnabled={memoryEnabled}
                setMemoryEnabled={setMemoryEnabled}
                memoryType={memoryType}
                setMemoryType={setMemoryType}
                reasoningEnabled={reasoningEnabled}
                setReasoningEnabled={setReasoningEnabled}
                reasoningDepth={reasoningDepth}
                setReasoningDepth={setReasoningDepth}
                planningEnabled={planningEnabled}
                setPlanningEnabled={setPlanningEnabled}
                handleUpdateConfig={handleUpdateConfig}
              />
            </TabsContent>
            
            <TabsContent value="resources" className="space-y-6">
              <ResourcesConfiguration
                optimizeResources={optimizeResources}
                setOptimizeResources={setOptimizeResources}
                maxTokens={maxTokens}
                setMaxTokens={setMaxTokens}
                handleUpdateConfig={handleUpdateConfig}
              />
            </TabsContent>
            
            <TabsContent value="monitoring" className="space-y-6">
              <OrchestratorMonitoring 
                enableMonitoring={enableMonitoring}
                setEnableMonitoring={setEnableMonitoring}
                adaptiveBehavior={adaptiveBehavior}
                setAdaptiveBehavior={setAdaptiveBehavior}
                orchestratorState={orchestratorState}
                handleUpdateConfig={handleUpdateConfig}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrchestratorSection;
