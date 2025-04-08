
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAgent } from "@/contexts/AgentContext";
import { v4 as uuidv4 } from "uuid";
import OrchestratorBasicInfo from "./OrchestratorBasicInfo";
import ModelSelection from "./ModelSelection";
import OrchestratorCapabilities from "./OrchestratorCapabilities";
import ConfigDisplay from "./ConfigDisplay";

const OrchestratorForm: React.FC = () => {
  const { toast } = useToast();
  const { models, agents, addAgent } = useAgent();
  
  // Basic info state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  
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
  
  // Config state
  const [orchestratorConfig, setOrchestratorConfig] = useState(JSON.stringify({
    memory: {
      type: "buffer",
      capacity: 10
    },
    reasoning: {
      depth: 2,
      strategy: "chain-of-thought"
    },
    planning: {
      enabled: false,
      horizon: 5
    }
  }, null, 2));
  
  // Form state
  const [isFormLoading, setIsFormLoading] = useState(false);

  const handleUpdateConfig = () => {
    try {
      const memoryConfig = {
        type: memoryType,
        capacity: memoryType === "buffer" ? 10 : 50,
        enabled: memoryEnabled
      };
      
      const reasoningConfig = {
        depth: parseInt(reasoningDepth),
        strategy: "chain-of-thought",
        enabled: reasoningEnabled
      };
      
      const planningConfig = {
        enabled: planningEnabled,
        horizon: 5
      };
      
      const newConfig = JSON.stringify({
        memory: memoryConfig,
        reasoning: reasoningConfig,
        planning: planningConfig
      }, null, 2);
      
      setOrchestratorConfig(newConfig);
    } catch (e) {
      toast({
        title: "Erro na configuração",
        description: "Não foi possível atualizar a configuração do orquestrador.",
        variant: "destructive"
      });
    }
  };

  const handleSaveOrchestrator = () => {
    if (!name) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, forneça um nome para o agente.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedModel) {
      toast({
        title: "Modelo obrigatório",
        description: "Por favor, selecione um modelo de IA.",
        variant: "destructive"
      });
      return;
    }

    setIsFormLoading(true);
    
    try {
      const configObj = JSON.parse(orchestratorConfig);
      
      const newAgent = {
        id: uuidv4(),
        name,
        description,
        modelId: selectedModel,
        configJson: JSON.stringify({
          orchestrator: configObj
        }),
        toolIds: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      addAgent(newAgent);
      
      toast({
        title: "Agente criado",
        description: "Configuração do orquestrador salva com sucesso.",
      });
      
      // Reset form
      setName("");
      setDescription("");
      setSelectedProvider("");
      setSelectedModel("");
    } catch (e) {
      toast({
        title: "Erro na configuração",
        description: "O JSON de configuração é inválido.",
        variant: "destructive"
      });
    } finally {
      setIsFormLoading(false);
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
          <OrchestratorBasicInfo 
            name={name}
            setName={setName}
            description={description}
            setDescription={setDescription}
          />
          
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
            onUpdateConfig={handleUpdateConfig}
          />
          
          <ConfigDisplay 
            configJson={orchestratorConfig}
            setConfigJson={setOrchestratorConfig}
          />
          
          <Button 
            onClick={handleSaveOrchestrator} 
            disabled={isFormLoading || !selectedModel || !name}
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
