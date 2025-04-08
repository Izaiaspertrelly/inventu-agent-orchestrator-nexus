
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAgent } from "@/contexts/AgentContext";
import { useFormValidation } from "./FormValidation";

interface FormData {
  name: string;
  description: string;
  selectedModel: string;
  orchestratorConfig: string;
}

export const useFormSubmit = () => {
  const { toast } = useToast();
  const { updateOrchestratorConfig } = useAgent();
  const { validateForm } = useFormValidation();
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  
  const handleSaveOrchestrator = (formData: FormData): boolean => {
    const { selectedModel, orchestratorConfig } = formData;
    
    // Use fixed name and description, validating only the model
    if (!validateForm({ name: "Orquestrador Neural", selectedModel })) {
      return false;
    }

    setIsFormLoading(true);
    
    try {
      let configObj;
      try {
        configObj = JSON.parse(orchestratorConfig);
      } catch (e) {
        console.error("Error parsing JSON:", e);
        toast({
          title: "Configuration Error",
          description: "The configuration JSON is invalid.",
          variant: "destructive"
        });
        setIsFormLoading(false);
        return false;
      }
      
      // Ensure essential configurations are present
      const updatedConfig = {
        ...configObj,
        name: "Orquestrador Neural",
        description: "O Orquestrador Neural é a camada central e inteligente responsável por comandar, direcionar e conectar todos os fluxos de raciocínio, ação e execução de um ecossistema de agentes de IA.",
        selectedModel
      };
      
      // Ensure enabled flags are preserved correctly as boolean values
      if (updatedConfig.memory) {
        updatedConfig.memory.enabled = updatedConfig.memory.enabled !== false;
      }
      
      if (updatedConfig.reasoning) {
        updatedConfig.reasoning.enabled = updatedConfig.reasoning.enabled !== false;
      }
      
      if (updatedConfig.planning) {
        updatedConfig.planning.enabled = updatedConfig.planning.enabled === true;
      }
      
      // Add timestamp information
      updatedConfig.lastUpdated = new Date().toISOString();
      
      console.log("Saving orchestrator configuration:", updatedConfig);
      
      // Update orchestrator configuration
      updateOrchestratorConfig(updatedConfig);
      
      toast({
        title: "Orchestrator Updated",
        description: "Orchestrator configuration saved successfully.",
      });
      
      setIsFormSubmitted(true);
      setTimeout(() => setIsFormSubmitted(false), 5000);
      
      return true;
    } catch (e) {
      console.error("Error saving orchestrator:", e);
      toast({
        title: "Configuration Error",
        description: "Could not update orchestrator configuration.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsFormLoading(false);
    }
  };
  
  return { 
    handleSaveOrchestrator, 
    isFormLoading,
    isFormSubmitted 
  };
};
