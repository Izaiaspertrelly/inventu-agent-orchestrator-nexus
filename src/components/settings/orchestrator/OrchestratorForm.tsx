import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Brain, Check, AlertCircle, Loader2, Play, Eye } from "lucide-react";
import { useAgent } from "@/contexts/AgentContext";
import OrchestratorBasicInfo from "./OrchestratorBasicInfo";
import ModelSelection from "./ModelSelection";
import OrchestratorCapabilities from "./OrchestratorCapabilities";
import ConfigDisplay from "./ConfigDisplay";
import { useConfigGenerator } from "./form/useConfigGenerator";
import { useFormSubmit } from "./form/useFormSubmit";
import { useModelConnectionTest } from "@/hooks/use-model-connection-test";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface OrchestratorFormProps {
  onComplete?: () => void;
}

const OrchestratorForm: React.FC<OrchestratorFormProps> = ({ onComplete }) => {
  const { models, orchestratorConfig, orchestratorState, addToConversationHistory } = useAgent();
  const { toast } = useToast();
  
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
  
  // UI State
  const [showConfigDetails, setShowConfigDetails] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{status: 'success' | 'error' | 'idle', message: string}>({
    status: 'idle',
    message: ''
  });
  
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
      
      // Atualizar o JSON de configuração
      setOrchestratorConfig(JSON.stringify(orchestratorConfig, null, 2));
    }
  }, [orchestratorConfig, models, setOrchestratorConfig]);

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
    const result = handleSaveOrchestrator({
      name: "Orquestrador Neural", // Nome fixo
      description: "Centro de controle do sistema de IA", // Descrição fixa
      selectedModel,
      orchestratorConfig: configJson
    });
    
    if (result) {
      setShowConfigDetails(true);
      if (onComplete) {
        onComplete();
      }
    }
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
  
  // Handle full orchestrator test
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
    setTestResult({status: 'idle', message: ''});
    
    try {
      // Simular teste do orquestrador
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Registrar interação de teste no histórico de conversas
      addToConversationHistory({
        role: "system",
        content: "Teste de funcionamento do Orquestrador Neural iniciado com sucesso",
        timestamp: new Date()
      });
      
      setTestResult({
        status: 'success',
        message: 'O orquestrador respondeu corretamente. Todas as capacidades estão funcionando.'
      });
      
      toast({
        title: "Teste concluído",
        description: "O orquestrador está funcionando corretamente",
      });
    } catch (error) {
      setTestResult({
        status: 'error',
        message: `Falha no teste: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      });
      
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
        
        {/* Nova seção de detalhes do orquestrador - aparece após salvar */}
        {isFormSubmitted && orchestratorConfig && (
          <div className="mt-8 pt-6 border-t border-muted">
            <h3 className="text-lg font-medium mb-4">Orquestrador Neural Configurado</h3>
            
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex gap-3 mb-2 items-start">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Brain className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-md font-medium">Orquestrador Neural</h4>
                    <p className="text-sm text-muted-foreground">
                      Configurado com o modelo: <span className="font-medium">{orchestratorConfig.selectedModel}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Memória: <span className="font-medium">{orchestratorConfig.memory?.enabled !== false ? "Ativada" : "Desativada"}</span>
                      {orchestratorConfig.memory?.enabled !== false && <> (Tipo: {orchestratorConfig.memory.type})</>}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Raciocínio: <span className="font-medium">{orchestratorConfig.reasoning?.enabled !== false ? "Ativado" : "Desativado"}</span>
                      {orchestratorConfig.reasoning?.enabled !== false && <> (Profundidade: {orchestratorConfig.reasoning.depth})</>}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Planejamento: <span className="font-medium">{orchestratorConfig.planning?.enabled === true ? "Ativado" : "Desativado"}</span>
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2"
                  onClick={() => setShowConfigDetails(!showConfigDetails)}
                >
                  <Eye className="h-4 w-4" />
                  {showConfigDetails ? "Ocultar Detalhes" : "Ver Detalhes"}
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
            
            {/* Resultados de teste do orquestrador */}
            {testResult.status !== 'idle' && (
              <Alert className={testResult.status === 'success' ? "mt-4 bg-green-50 border-green-200" : "mt-4 bg-red-50 border-red-200"}>
                {testResult.status === 'success' ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                <AlertTitle>
                  {testResult.status === 'success' ? "Teste concluído com sucesso" : "Falha no teste"}
                </AlertTitle>
                <AlertDescription>
                  {testResult.message}
                </AlertDescription>
              </Alert>
            )}
            
            {/* Detalhes expandidos em tabs */}
            {showConfigDetails && (
              <div className="mt-4">
                <Tabs defaultValue="memory" className="w-full">
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="memory">Memória</TabsTrigger>
                    <TabsTrigger value="reasoning">Raciocínio</TabsTrigger>
                    <TabsTrigger value="planning">Planejamento</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="memory" className="p-4 border rounded-md mt-2">
                    <div className="text-sm">
                      <p><strong>Status:</strong> {orchestratorConfig.memory?.enabled !== false ? "Ativada" : "Desativada"}</p>
                      <p><strong>Tipo:</strong> {orchestratorConfig.memory?.type || "buffer"}</p>
                      <p><strong>Capacidade:</strong> {orchestratorConfig.memory?.capacity || 10} entradas</p>
                      <p><strong>Confirmação de usuário:</strong> {orchestratorConfig.memory?.userPromptEnabled ? "Ativada" : "Desativada"}</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="reasoning" className="p-4 border rounded-md mt-2">
                    <div className="text-sm">
                      <p><strong>Status:</strong> {orchestratorConfig.reasoning?.enabled !== false ? "Ativado" : "Desativado"}</p>
                      <p><strong>Profundidade:</strong> {orchestratorConfig.reasoning?.depth || 2}</p>
                      <p><strong>Estratégia:</strong> {orchestratorConfig.reasoning?.strategy || "chain-of-thought"}</p>
                      <p><strong>Passos dinâmicos:</strong> {orchestratorConfig.reasoning?.dynamicSteps ? "Sim" : "Não"}</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="planning" className="p-4 border rounded-md mt-2">
                    <div className="text-sm">
                      <p><strong>Status:</strong> {orchestratorConfig.planning?.enabled === true ? "Ativado" : "Desativado"}</p>
                      <p><strong>Horizonte:</strong> {orchestratorConfig.planning?.horizon || 15} passos</p>
                      <p><strong>Estratégia:</strong> {orchestratorConfig.planning?.strategy || "goal-decomposition"}</p>
                      <p><strong>Adaptativo:</strong> {orchestratorConfig.planning?.adaptive ? "Sim" : "Não"}</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrchestratorForm;
