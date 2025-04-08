
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Brain, Check, AlertCircle, Loader2 } from "lucide-react";
import { useAgent } from "@/contexts/AgentContext";
import OrchestratorBasicInfo from "./OrchestratorBasicInfo";
import ModelSelection from "./ModelSelection";
import OrchestratorCapabilities from "./OrchestratorCapabilities";
import ConfigDisplay from "./ConfigDisplay";
import { useConfigGenerator } from "./form/useConfigGenerator";
import { useFormSubmit } from "./form/useFormSubmit";
import { useModelConnectionTest } from "@/hooks/use-model-connection-test";

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
  
  // Connection test state
  const { testModelConnection, connectionStatus, connectionMessage } = useModelConnectionTest();
  
  // Custom hooks for form functionality
  const { orchestratorConfig: configJson, setOrchestratorConfig, handleUpdateConfig } = useConfigGenerator();
  const { handleSaveOrchestrator, isFormLoading, isFormSubmitted } = useFormSubmit();

  // Effect to update selections based on existing config
  useEffect(() => {
    if (orchestratorConfig) {
      if (orchestratorConfig.selectedModel) {
        setSelectedModel(orchestratorConfig.selectedModel);
        
        // Find the provider for this model
        const modelInfo = models.find(m => m.id === orchestratorConfig.selectedModel);
        if (modelInfo) {
          setSelectedProvider(modelInfo.providerId);
        }
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
  }, [orchestratorConfig, models]);

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
    handleSaveOrchestrator({
      name: "Orquestrador Neural", // Nome fixo
      description: "Centro de controle do sistema de IA", // Descrição fixa
      selectedModel,
      orchestratorConfig: configJson
    });
  };
  
  // Handle connection test
  const handleTestConnection = async () => {
    if (!selectedModel || !selectedProvider) {
      return;
    }
    
    const provider = models.find(m => m.providerId === selectedProvider);
    if (!provider) return;
    
    await testModelConnection(selectedProvider, selectedModel, provider.apiKey);
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
          {orchestratorConfig && Object.keys(orchestratorConfig).length > 0 ? (
            <Alert className="bg-blue-50 border-blue-200">
              <Brain className="h-4 w-4 text-blue-500" />
              <AlertTitle>Orquestrador Neural ativo</AlertTitle>
              <AlertDescription>
                {orchestratorConfig.selectedModel ? (
                  <>Configurado usando o modelo {orchestratorConfig.selectedModel}</>
                ) : (
                  <>Configurado, mas sem modelo definido</>
                )}
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <AlertTitle>Orquestrador não configurado</AlertTitle>
              <AlertDescription>
                Configure e salve o orquestrador para ativá-lo
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
          
          {connectionStatus && (
            <Alert className={`${
              connectionStatus === "success" ? "bg-green-50 border-green-200" : 
              connectionStatus === "error" ? "bg-red-50 border-red-200" : 
              "bg-blue-50 border-blue-200"
            }`}>
              {connectionStatus === "success" ? <Check className="h-4 w-4 text-green-500" /> : 
               connectionStatus === "error" ? <AlertCircle className="h-4 w-4 text-red-500" /> :
               <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />}
              <AlertTitle>
                {connectionStatus === "success" ? "Conexão estabelecida com sucesso" : 
                 connectionStatus === "error" ? "Erro na conexão" : 
                 "Testando conexão..."}
              </AlertTitle>
              <AlertDescription>
                {connectionMessage}
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
          
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              onClick={handleTestConnection}
              disabled={!selectedModel || !selectedProvider || connectionStatus === "loading"}
              className="mb-2"
            >
              {connectionStatus === "loading" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Testar Conexão com o Modelo
            </Button>
          </div>
          
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
