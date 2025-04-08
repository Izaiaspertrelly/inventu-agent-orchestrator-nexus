
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface OrchestratorConfigSettings {
  memoryEnabled: boolean;
  memoryType: string;
  reasoningEnabled: boolean;
  reasoningDepth: string;
  planningEnabled: boolean;
}

export const useConfigGenerator = () => {
  const { toast } = useToast();
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

  const handleUpdateConfig = (settings: OrchestratorConfigSettings) => {
    try {
      const { memoryEnabled, memoryType, reasoningEnabled, reasoningDepth, planningEnabled } = settings;
      
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
      return true;
    } catch (e) {
      toast({
        title: "Erro na configuração",
        description: "Não foi possível atualizar a configuração do orquestrador.",
        variant: "destructive"
      });
      return false;
    }
  };
  
  return {
    orchestratorConfig,
    setOrchestratorConfig,
    handleUpdateConfig
  };
};
