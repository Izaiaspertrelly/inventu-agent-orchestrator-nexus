
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAgent } from "@/contexts/AgentContext";
import OrchestratorBasicInfo from "./OrchestratorBasicInfo";
import ModelSelection from "./ModelSelection";
import OrchestratorCapabilities from "./OrchestratorCapabilities";
import ConfigDisplay from "./ConfigDisplay";
import { useConfigGenerator } from "./form/useConfigGenerator";
import { useFormSubmit } from "./form/useFormSubmit";

const OrchestratorForm: React.FC = () => {
  const { models } = useAgent();
  
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
  
  // Custom hooks for form functionality
  const { orchestratorConfig, setOrchestratorConfig, handleUpdateConfig } = useConfigGenerator();
  const { handleSaveOrchestrator, isFormLoading } = useFormSubmit();

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
      name,
      description,
      selectedModel,
      orchestratorConfig
    });
    
    // Reset form if submission was successful
    if (result) {
      setName("");
      setDescription("");
      setSelectedProvider("");
      setSelectedModel("");
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
            onUpdateConfig={onUpdateConfig}
          />
          
          <ConfigDisplay 
            configJson={orchestratorConfig}
            setConfigJson={setOrchestratorConfig}
          />
          
          <Button 
            onClick={onSubmitForm} 
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
