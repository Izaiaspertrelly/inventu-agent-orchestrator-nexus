
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { useAgent } from "@/contexts/AgentContext";
import OrchestratorMonitoring from "./OrchestratorMonitoring";

const OrchestratorMonitoringTab: React.FC = () => {
  const { toast } = useToast();
  const { updateOrchestratorConfig, orchestratorConfig, orchestratorState } = useAgent();
  
  const [enableMonitoring, setEnableMonitoring] = React.useState(orchestratorConfig?.monitoring?.enabled || true);
  const [adaptiveBehavior, setAdaptiveBehavior] = React.useState(orchestratorConfig?.monitoring?.adaptiveBehavior || true);
  
  // Effect to update state when orchestratorConfig changes
  React.useEffect(() => {
    if (orchestratorConfig) {
      setEnableMonitoring(orchestratorConfig.monitoring?.enabled || true);
      setAdaptiveBehavior(orchestratorConfig.monitoring?.adaptiveBehavior || true);
    }
  }, [orchestratorConfig]);

  const handleUpdateConfig = () => {
    try {
      const monitoringConfig = {
        enabled: enableMonitoring,
        adaptiveBehavior: adaptiveBehavior
      };
      
      const updatedConfig = {
        ...orchestratorConfig,
        monitoring: monitoringConfig
      };
      
      updateOrchestratorConfig(updatedConfig);
      
      toast({
        title: "Configuração atualizada",
        description: "A configuração de monitoramento foi atualizada."
      });
    } catch (e) {
      toast({
        title: "Erro na configuração",
        description: "Não foi possível atualizar a configuração de monitoramento.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <OrchestratorMonitoring 
        enableMonitoring={enableMonitoring}
        setEnableMonitoring={setEnableMonitoring}
        adaptiveBehavior={adaptiveBehavior}
        setAdaptiveBehavior={setAdaptiveBehavior}
        orchestratorState={orchestratorState}
        handleUpdateConfig={handleUpdateConfig}
      />
    </div>
  );
};

export default OrchestratorMonitoringTab;
