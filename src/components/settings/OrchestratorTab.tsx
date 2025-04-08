
import React from "react";
import { useAgent } from "@/contexts/AgentContext";
import OrchestratorForm from "./orchestrator/OrchestratorForm";
import OrchestratorDiagnostic from "./orchestrator/OrchestratorDiagnostic";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Brain } from "lucide-react";

const OrchestratorTab = () => {
  const { orchestratorConfig } = useAgent();
  const isOrchestrator = orchestratorConfig && Object.keys(orchestratorConfig).length > 0;

  return (
    <div className="space-y-6">
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
                    {orchestratorConfig.selectedModel ? (
                      <p>Usando modelo: {orchestratorConfig.selectedModel}</p>
                    ) : (
                      <p>Sem modelo definido</p>
                    )}
                    {orchestratorConfig.memory?.enabled !== false && (
                      <p>Memória: {orchestratorConfig.memory?.type || "buffer"} (ativada)</p>
                    )}
                    {orchestratorConfig.reasoning?.enabled !== false && (
                      <p>Raciocínio: profundidade {orchestratorConfig.reasoning?.depth || 2}</p>
                    )}
                    {orchestratorConfig.planning?.enabled === true && (
                      <p>Planejamento: ativado</p>
                    )}
                  </div>
                </AlertDescription>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      <OrchestratorForm />
      <OrchestratorDiagnostic />
    </div>
  );
};

export default OrchestratorTab;
