
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrchestratorHeader from "./OrchestratorHeader";
import OrchestratorBasicTab from "./OrchestratorBasicTab";
import OrchestratorCapabilitiesTab from "./OrchestratorCapabilitiesTab";
import OrchestratorResourcesTab from "./OrchestratorResourcesTab";
import OrchestratorMonitoringTab from "./OrchestratorMonitoringTab";

const OrchestratorMain: React.FC = () => {
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
            
            <TabsContent value="basic">
              <OrchestratorBasicTab />
            </TabsContent>
            
            <TabsContent value="capabilities">
              <OrchestratorCapabilitiesTab />
            </TabsContent>
            
            <TabsContent value="resources">
              <OrchestratorResourcesTab />
            </TabsContent>
            
            <TabsContent value="monitoring">
              <OrchestratorMonitoringTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrchestratorMain;
