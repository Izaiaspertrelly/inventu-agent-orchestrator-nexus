
import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrchestratorBasicTab from "./orchestrator/OrchestratorBasicTab";
import OrchestratorCapabilitiesTab from "./orchestrator/OrchestratorCapabilitiesTab";
import OrchestratorResourcesTab from "./orchestrator/OrchestratorResourcesTab";
import OrchestratorMonitoringTab from "./orchestrator/OrchestratorMonitoringTab";
import OrchestratorHeader from "./orchestrator/OrchestratorHeader";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useAgent } from "@/contexts/AgentContext";
import { Brain } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const OrchestratorSection: React.FC = () => {
  const { orchestratorConfig, orchestratorState, agents } = useAgent();
  const isOrchestrator = orchestratorConfig && Object.keys(orchestratorConfig).length > 0;

  // Efeito para exibir status do orquestrador no console para debugging
  useEffect(() => {
    if (isOrchestrator) {
      console.log("Orquestrador Neural ativo:", orchestratorConfig);
    } else {
      console.log("Orquestrador Neural não configurado");
    }
  }, [orchestratorConfig, isOrchestrator]);

  return (
    <div className="space-y-6">
      <OrchestratorHeader />
      
      {isOrchestrator && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex gap-3 mb-2 items-start">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <div>
                <AlertTitle className="text-lg font-medium">Orquestrador Neural ativo</AlertTitle>
                <AlertDescription>
                  <div className="text-sm text-muted-foreground mt-1">
                    {orchestratorConfig.mainAgentId ? (
                      <p>Usando agente principal: {agents?.find(a => a.id === orchestratorConfig.mainAgentId)?.name || 'ID: ' + orchestratorConfig.mainAgentId}</p>
                    ) : (
                      <p>Sem agente principal definido</p>
                    )}
                    {orchestratorConfig.memory?.enabled && (
                      <p>Memória: {orchestratorConfig.memory.type || "buffer"} (ativada)</p>
                    )}
                    {orchestratorConfig.reasoning?.enabled && (
                      <p>Raciocínio: profundidade {orchestratorConfig.reasoning.depth || 2}</p>
                    )}
                    {orchestratorConfig.planning?.enabled && (
                      <p>Planejamento: ativado</p>
                    )}
                  </div>
                </AlertDescription>
              </div>
            </div>
          </CardContent>
        </Card>
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
