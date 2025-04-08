
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrchestratorBasicTab from "./orchestrator/OrchestratorBasicTab";
import OrchestratorCapabilitiesTab from "./orchestrator/OrchestratorCapabilitiesTab";
import OrchestratorResourcesTab from "./orchestrator/OrchestratorResourcesTab";
import OrchestratorMonitoringTab from "./orchestrator/OrchestratorMonitoringTab";
import OrchestratorHeader from "./orchestrator/OrchestratorHeader";

const OrchestratorSection: React.FC = () => {
  return (
    <div className="space-y-6">
      <OrchestratorHeader />
      
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
