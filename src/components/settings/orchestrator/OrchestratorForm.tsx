
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Brain, Check } from "lucide-react";
import { useAgent } from "@/contexts/AgentContext";
import OrchestratorBasicInfo from "./OrchestratorBasicInfo";
import ModelSelection from "./ModelSelection";
import OrchestratorCapabilities from "./OrchestratorCapabilities";
import ConfigDisplay from "./ConfigDisplay";
import { useConfigGenerator } from "./form/useConfigGenerator";
import { useFormSubmit } from "./form/useFormSubmit";

const OrchestratorForm: React.FC = () => {
  const { models, orchestratorConfig } = useAgent();
  
  // Model selection state
  const [selectedProvider, setSelectedProvider] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [availableModels, setAvailableModels] = useState<any[]>([]);
  
  // Capabilities state
  const [memoryEnabled, setMemoryEnabled] = useState(true);
  const [reasoningEnabled, setReasoningEnabled] = useState(true);
  const [planningEnabled, setPlanningEnabled] = useState(false);
  const [memoryType, setMemoryType] = useState("buffer");
  const [reasoningDepth, setReasoningDepth] = useState("2");
  
  // Custom hooks for form functionality
  const { orchestratorConfig: configJson, setOrchestratorConfig, handleUpdateConfig } = useConfigGenerator();
  const { handleSaveOrchestrator, isFormLoading, isFormSubmitted } = useFormSubmit();

  // Effect to update selections based on existing config
  useEffect(() => {
    if (orchestratorConfig) {
      if (orchestratorConfig.selectedModel) {
        setSelectedModel(orchestratorConfig.selectedModel);
      }
      
      if (orchestratorConfig.memory) {
        setMemoryEnabled(orchestratorConfig.memory.enabled !== false);
        if (orchestratorConfig.memory.type) {
          setMemoryType(orchestratorConfig.memory.type);
        }
      }
      
      if (orchestratorConfig.reasoning) {
        setReasoningEnabled(orchestratorConfig.reasoning.enabled !== false);
        if (orchestratorConfig.reasoning.depth) {
          setReasoningDepth(orchestratorConfig.reasoning.depth.toString());
        }
      }
      
      if (orchestratorConfig.planning) {
        setPlanningEnabled(orchestratorConfig.planning.enabled === true);
      }
    }
  }, [orchestratorConfig]);

  // Handle config update
  const onUpdateConfig = () => {
    handleUpdateConfig({
      memoryEnabled,
      memoryType,
      reasoningEnabled,
      reasoningDepth,
      planningEnabled
    });
  };

  // Handle form submission
  const onSubmitForm = () => {
    const success = handleSaveOrchestrator({
      name: "Orquestrador Neural", // Nome fixo
      description: "Centro de controle do sistema de IA", // Descrição fixa
      selectedModel,
      orchestratorConfig: configJson
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuração do Orquestrador</CardTitle>
        <CardDescription>
          O orquestrador é responsável pelo gerenciamento da memória, raciocínio e planejamento do agente.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {orchestratorConfig && Object.keys(orchestratorConfig).length > 0 && (
            <Alert className="bg-blue-50 border-blue-200">
              <Brain className="h-4 w-4 text-blue-500" />
              <AlertTitle>Orquestrador Neural ativo</AlertTitle>
              <AlertDescription>
                O Orquestrador Neural já está configurado e disponível no sistema
              </AlertDescription>
            </Alert>
          )}
          
          {isFormSubmitted && (
            <Alert className="bg-green-50 border-green-200">
              <Check className="h-4 w-4 text-green-500" />
              <AlertTitle>Orquestrador salvo com sucesso</AlertTitle>
              <AlertDescription>
                As configurações foram salvas e aplicadas ao Orquestrador Neural
              </AlertDescription>
            </Alert>
          )}
          
          <OrchestratorBasicInfo />
          
          <ModelSelection 
            models={models}
            selectedProvider={selectedProvider}
            setSelectedProvider={setSelectedProvider}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            availableModels={availableModels}
            setAvailableModels={setAvailableModels}
          />
          
          <OrchestratorCapabilities 
            memoryEnabled={memoryEnabled}
            setMemoryEnabled={setMemoryEnabled}
            memoryType={memoryType}
            setMemoryType={setMemoryType}
            reasoningEnabled={reasoningEnabled}
            setReasoningEnabled={setReasoningEnabled}
            reasoningDepth={reasoningDepth}
            setReasoningDepth={setReasoningDepth}
            planningEnabled={planningEnabled}
            setPlanningEnabled={setPlanningEnabled}
            onUpdateConfig={onUpdateConfig}
          />
          
          <ConfigDisplay 
            configJson={configJson}
            setConfigJson={setOrchestratorConfig}
          />
          
          <Button 
            onClick={onSubmitForm} 
            disabled={isFormLoading || !selectedModel}
            className="w-full"
          >
            {isFormLoading ? "Salvando..." : "Salvar Configuração do Orquestrador"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrchestratorForm;
