
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrchestratorBasicTab from "./orchestrator/OrchestratorBasicTab";
import OrchestratorCapabilitiesTab from "./orchestrator/OrchestratorCapabilitiesTab";
import OrchestratorResourcesTab from "./orchestrator/OrchestratorResourcesTab";
import OrchestratorMonitoringTab from "./orchestrator/OrchestratorMonitoringTab";
import OrchestratorHeader from "./orchestrator/OrchestratorHeader";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useAgent } from "@/contexts/AgentContext";
import { Brain } from "lucide-react";

const OrchestratorSection: React.FC = () => {
  const { orchestratorConfig } = useAgent();
  const isOrchestrator = orchestratorConfig && Object.keys(orchestratorConfig).length > 0;

  return (
    <div className="space-y-6">
      <OrchestratorHeader />
      
      {isOrchestrator && (
        <Alert className="bg-blue-50 border-blue-200">
          <Brain className="h-4 w-4 text-blue-500" />
          <AlertTitle>Orquestrador Neural ativo</AlertTitle>
          <AlertDescription>
            O orquestrador está configurado e pronto para uso
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="basic">Configuração Básica</TabsTrigger>
          <TabsTrigger value="capabilities">Capacidades</TabsTrigger>
          <TabsTrigger value="resources">Recursos</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoramento</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4">
          <OrchestratorBasicTab />
        </TabsContent>
        
        <TabsContent value="capabilities" className="space-y-4">
          <OrchestratorCapabilitiesTab />
        </TabsContent>
        
        <TabsContent value="resources" className="space-y-4">
          <OrchestratorResourcesTab />
        </TabsContent>
        
        <TabsContent value="monitoring" className="space-y-4">
          <OrchestratorMonitoringTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrchestratorSection;
