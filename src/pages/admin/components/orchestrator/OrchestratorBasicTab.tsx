
import React, { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAgent } from "@/contexts/AgentContext";
import AgentSelector from "./AgentSelector";
import JsonConfigEditor from "./JsonConfigEditor";
import SaveButton from "./SaveButton";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Brain, Check } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const OrchestratorBasicTab: React.FC = () => {
  const { toast } = useToast();
  const { agents, updateOrchestratorConfig, orchestratorConfig } = useAgent();
  
  const [mainAgent, setMainAgent] = React.useState(orchestratorConfig?.mainAgentId || "");
  const [configJson, setConfigJson] = React.useState(JSON.stringify(orchestratorConfig || {}, null, 2));
  const [isSaved, setIsSaved] = React.useState(false);
  
  // Effect to update state when orchestratorConfig changes
  useEffect(() => {
    if (orchestratorConfig) {
      setMainAgent(orchestratorConfig.mainAgentId || "");
      setConfigJson(JSON.stringify(orchestratorConfig, null, 2));
    }
  }, [orchestratorConfig]);

  const handleSaveOrchestrator = () => {
    try {
      let config = JSON.parse(configJson);
      
      // Garantindo que o nome e descrição estejam fixos
      config.name = "Orquestrador Neural";
      config.description = "O Orquestrador Neural é a camada central e inteligente responsável por comandar, direcionar e conectar todos os fluxos de raciocínio, ação e execução de um ecossistema de agentes de IA.";
      config.mainAgentId = mainAgent;
      
      // Atualizar o orquestrador sem criar um agente
      updateOrchestratorConfig(config);
      
      toast({
        title: "Orquestrador salvo",
        description: "Configuração do orquestrador salva com sucesso.",
      });
      
      // Show saved alert
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (e) {
      console.error("Erro ao salvar configuração do orquestrador:", e);
      toast({
        title: "Erro",
        description: "O JSON de configuração é inválido.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-medium text-lg">Orquestrador Neural</h3>
          </div>
          <CardDescription>
            O Orquestrador Neural é a camada central e inteligente responsável por comandar, direcionar e conectar todos os fluxos de raciocínio, ação e execução de um ecossistema de agentes de IA.
          </CardDescription>
        </CardContent>
      </Card>
      
      {isSaved && (
        <Alert className="bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-500" />
          <AlertTitle>Orquestrador configurado com sucesso</AlertTitle>
          <AlertDescription>
            O Orquestrador Neural foi configurado e está pronto para uso
          </AlertDescription>
        </Alert>
      )}
      
      {orchestratorConfig && Object.keys(orchestratorConfig).length > 0 && (
        <Alert className="bg-blue-50 border-blue-200">
          <Brain className="h-4 w-4 text-blue-500" />
          <AlertTitle>Orquestrador Neural ativo</AlertTitle>
          <AlertDescription>
            {orchestratorConfig.mainAgentId ? (
              <>Configurado com agente principal selecionado</>
            ) : (
              <>Configurado, mas sem agente principal definido</>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      <AgentSelector 
        agents={agents}
        mainAgent={mainAgent}
        setMainAgent={setMainAgent}
      />
      
      <JsonConfigEditor 
        configJson={configJson}
        setConfigJson={setConfigJson}
      />
      
      <SaveButton 
        handleSaveOrchestrator={handleSaveOrchestrator} 
      />
    </div>
  );
};

export default OrchestratorBasicTab;
