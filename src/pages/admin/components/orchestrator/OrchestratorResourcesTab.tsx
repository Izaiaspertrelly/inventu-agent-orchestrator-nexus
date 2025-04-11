
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
  
  // Fix the type issue by making the state accept string
  const [optimizeResources, setOptimizeResources] = React.useState(
    orchestratorConfig?.resources?.optimizeUsage || true
  );
  const [maxTokens, setMaxTokens] = React.useState(
    orchestratorConfig?.resources?.maxTokens?.toString() || "4000"
  );
  const [optimizationStrategy, setOptimizationStrategy] = React.useState<string>(
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
      
      // Map strategy values to those expected by the API
      const strategyMapping: Record<string, 'balanced' | 'performance' | 'economy'> = {
        'conservative': 'economy',
        'balanced': 'balanced',
        'aggressive': 'performance'
      };
      
      // Configure optimization strategy with the mapped value
      configureOptimization({
        strategy: strategyMapping[optimizationStrategy] as 'balanced' | 'performance' | 'economy',
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
        setOptimizationStrategy={(value: string) => setOptimizationStrategy(value)}
      />
    </div>
  );
};

export default OrchestratorResourcesTab;
