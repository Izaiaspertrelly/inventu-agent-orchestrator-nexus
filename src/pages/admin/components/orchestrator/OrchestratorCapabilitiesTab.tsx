
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { useAgent } from "@/contexts/AgentContext";
import CapabilitiesSection from "./CapabilitiesSection";

const OrchestratorCapabilitiesTab: React.FC = () => {
  const { toast } = useToast();
  const { updateOrchestratorConfig, orchestratorConfig } = useAgent();
  
  const [memoryEnabled, setMemoryEnabled] = React.useState(orchestratorConfig?.memory?.enabled || true);
  const [memoryType, setMemoryType] = React.useState(orchestratorConfig?.memory?.type || "buffer");
  const [reasoningEnabled, setReasoningEnabled] = React.useState(orchestratorConfig?.reasoning?.enabled || true);
  const [reasoningDepth, setReasoningDepth] = React.useState(orchestratorConfig?.reasoning?.depth?.toString() || "5");
  const [planningEnabled, setPlanningEnabled] = React.useState(orchestratorConfig?.planning?.enabled || false);
  
  // Effect to update state when orchestratorConfig changes
  React.useEffect(() => {
    if (orchestratorConfig) {
      setMemoryEnabled(orchestratorConfig.memory?.enabled || true);
      setMemoryType(orchestratorConfig.memory?.type || "buffer");
      setReasoningEnabled(orchestratorConfig.reasoning?.enabled || true);
      setReasoningDepth(orchestratorConfig.reasoning?.depth?.toString() || "5");
      setPlanningEnabled(orchestratorConfig.planning?.enabled || false);
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
        enabled: reasoningEnabled,
        dynamicSteps: true // Keep this for backend processing
      };
      
      const planningConfig = {
        enabled: planningEnabled,
        horizon: parseInt(reasoningDepth) * 3, // Make planning horizon scale with reasoning depth
        strategy: "goal-decomposition",
        adaptive: true // Enable adaptive planning
      };
      
      const updatedConfig = {
        ...orchestratorConfig,
        memory: memoryConfig,
        reasoning: reasoningConfig,
        planning: planningConfig
      };
      
      updateOrchestratorConfig(updatedConfig);
      
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

  return (
    <div className="space-y-6">
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
    </div>
  );
};

export default OrchestratorCapabilitiesTab;
