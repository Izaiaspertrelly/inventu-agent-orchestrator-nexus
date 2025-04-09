
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { useAgent } from "@/contexts/AgentContext";
import ResourcesConfiguration from "./ResourcesConfiguration";

const OrchestratorResourcesTab: React.FC = () => {
  const { toast } = useToast();
  const { 
    updateOrchestratorConfig, 
    orchestratorConfig, 
    configureOptimization, 
    optimizationConfig 
  } = useAgent();
  
  const [optimizeResources, setOptimizeResources] = React.useState(
    orchestratorConfig?.resources?.optimizeUsage || true
  );
  const [maxTokens, setMaxTokens] = React.useState(
    orchestratorConfig?.resources?.maxTokens?.toString() || "4000"
  );
  const [optimizationStrategy, setOptimizationStrategy] = React.useState(
    optimizationConfig?.strategy || "balanced"
  );
  
  // Effect to update state when orchestratorConfig changes
  React.useEffect(() => {
    if (orchestratorConfig) {
      setOptimizeResources(orchestratorConfig.resources?.optimizeUsage || true);
      setMaxTokens(orchestratorConfig.resources?.maxTokens?.toString() || "4000");
    }
    
    if (optimizationConfig) {
      setOptimizationStrategy(optimizationConfig.strategy);
    }
  }, [orchestratorConfig, optimizationConfig]);

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
      
      // Update orchestrator configuration
      updateOrchestratorConfig(updatedConfig);
      
      // Configure optimization strategy
      configureOptimization({
        strategy: optimizationStrategy as 'conservative' | 'balanced' | 'aggressive',
        autoOptimize: optimizeResources
      });
      
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
        optimizationStrategy={optimizationStrategy}
        setOptimizationStrategy={setOptimizationStrategy}
      />
    </div>
  );
};

export default OrchestratorResourcesTab;
