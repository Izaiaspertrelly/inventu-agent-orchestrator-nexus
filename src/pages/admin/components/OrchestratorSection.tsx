
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAgent } from "@/contexts/AgentContext";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import OrchestratorHeader from "./orchestrator/OrchestratorHeader";
import AgentSelector from "./orchestrator/AgentSelector";
import CapabilitiesSection from "./orchestrator/CapabilitiesSection";
import JsonConfigEditor from "./orchestrator/JsonConfigEditor";
import SaveButton from "./orchestrator/SaveButton";

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
          <OrchestratorHeader />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <AgentSelector 
              agents={agents}
              mainAgent={mainAgent}
              setMainAgent={setMainAgent}
            />
            
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
            
            <JsonConfigEditor 
              configJson={configJson}
              setConfigJson={setConfigJson}
            />
            
            <SaveButton 
              handleSaveOrchestrator={handleSaveOrchestrator} 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrchestratorSection;
