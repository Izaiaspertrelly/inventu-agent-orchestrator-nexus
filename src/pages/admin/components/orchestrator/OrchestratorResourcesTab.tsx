
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { useAgent } from "@/contexts/AgentContext";
import ResourcesConfiguration from "./ResourcesConfiguration";

const OrchestratorResourcesTab: React.FC = () => {
  const { toast } = useToast();
  const { updateOrchestratorConfig, orchestratorConfig } = useAgent();
  
  const [optimizeResources, setOptimizeResources] = React.useState(orchestratorConfig?.resources?.optimizeUsage || true);
  const [maxTokens, setMaxTokens] = React.useState(orchestratorConfig?.resources?.maxTokens?.toString() || "4000");
  
  // Effect to update state when orchestratorConfig changes
  React.useEffect(() => {
    if (orchestratorConfig) {
      setOptimizeResources(orchestratorConfig.resources?.optimizeUsage || true);
      setMaxTokens(orchestratorConfig.resources?.maxTokens?.toString() || "4000");
    }
  }, [orchestratorConfig]);

  const handleUpdateConfig = () => {
    try {
      const resourcesConfig = {
        maxTokens: parseInt(maxTokens),
        optimizeUsage: optimizeResources
      };
      
      const updatedConfig = {
        ...orchestratorConfig,
        resources: resourcesConfig
      };
      
      updateOrchestratorConfig(updatedConfig);
      
      toast({
        title: "Configuração atualizada",
        description: "A configuração de recursos foi atualizada."
      });
    } catch (e) {
      toast({
        title: "Erro na configuração",
        description: "Não foi possível atualizar a configuração de recursos.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <ResourcesConfiguration
        optimizeResources={optimizeResources}
        setOptimizeResources={setOptimizeResources}
        maxTokens={maxTokens}
        setMaxTokens={setMaxTokens}
        handleUpdateConfig={handleUpdateConfig}
      />
    </div>
  );
};

export default OrchestratorResourcesTab;
