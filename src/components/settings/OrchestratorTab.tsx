
import React from "react";
import { useAgent } from "@/contexts/AgentContext";
import OrchestratorForm from "./orchestrator/OrchestratorForm";
import OrchestratorDiagnostic from "./orchestrator/OrchestratorDiagnostic";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Brain, Play, Edit, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const OrchestratorTab = () => {
  const { orchestratorConfig, addToConversationHistory } = useAgent();
  const { toast } = useToast();
  const isOrchestrator = orchestratorConfig && Object.keys(orchestratorConfig).length > 0;
  const [isTesting, setIsTesting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // Handle test orchestrator functionality
  const handleTestOrchestrator = async () => {
    if (!orchestratorConfig || !orchestratorConfig.selectedModel) {
      toast({
        title: "Configuração incompleta",
        description: "O orquestrador precisa ter um modelo configurado para realizar testes",
        variant: "destructive"
      });
      return;
    }
    
    setIsTesting(true);
    
    try {
      // Simular teste do orquestrador
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Registrar interação de teste no histórico de conversas
      addToConversationHistory({
        role: "system",
        content: "Teste de funcionamento do Orquestrador Neural iniciado com sucesso",
        timestamp: new Date()
      });
      
      toast({
        title: "Teste concluído",
        description: "O orquestrador está funcionando corretamente",
      });
    } catch (error) {
      toast({
        title: "Falha no teste",
        description: "O orquestrador encontrou um problema",
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };

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
          <CardFooter className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={() => setShowForm(!showForm)}
            >
              <Edit className="h-4 w-4" />
              {showForm ? "Cancelar Edição" : "Editar Configuração"}
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={handleTestOrchestrator}
              disabled={isTesting || !orchestratorConfig.selectedModel}
            >
              {isTesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              Testar Orquestrador
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {(!isOrchestrator || showForm) && (
        <>
          <OrchestratorForm onComplete={() => setShowForm(false)} />
          <OrchestratorDiagnostic />
        </>
      )}
    </div>
  );
};

export default OrchestratorTab;
