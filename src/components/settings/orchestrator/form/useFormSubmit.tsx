
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
    
    // Utiliza nome e descrição fixos, validando apenas o modelo
    if (!validateForm({ name: "Orquestrador Neural", selectedModel })) {
      return false;
    }

    setIsFormLoading(true);
    
    try {
      let configObj;
      try {
        configObj = JSON.parse(orchestratorConfig);
      } catch (e) {
        console.error("Erro ao parsear JSON:", e);
        toast({
          title: "Erro na configuração",
          description: "O JSON de configuração é inválido.",
          variant: "destructive"
        });
        setIsFormLoading(false);
        return false;
      }
      
      // Garantir que as configurações essenciais estejam presentes
      const updatedConfig = {
        ...configObj,
        name: "Orquestrador Neural",
        description: "O Orquestrador Neural é a camada central e inteligente responsável por comandar, direcionar e conectar todos os fluxos de raciocínio, ação e execução de um ecossistema de agentes de IA.",
        selectedModel
      };
      
      // Garantir que as flags enabled sejam preservadas corretamente
      if (updatedConfig.memory) {
        updatedConfig.memory.enabled = updatedConfig.memory.enabled !== false;
      }
      
      if (updatedConfig.reasoning) {
        updatedConfig.reasoning.enabled = updatedConfig.reasoning.enabled !== false;
      }
      
      if (updatedConfig.planning) {
        updatedConfig.planning.enabled = updatedConfig.planning.enabled === true;
      }
      
      // Adicionar informações de timestamp
      updatedConfig.lastUpdated = new Date().toISOString();
      
      console.log("Salvando configuração do orquestrador:", updatedConfig);
      
      // Atualizar configuração do orquestrador
      updateOrchestratorConfig(updatedConfig);
      
      toast({
        title: "Orquestrador atualizado",
        description: "Configuração do orquestrador salva com sucesso.",
      });
      
      setIsFormSubmitted(true);
      setTimeout(() => setIsFormSubmitted(false), 5000);
      
      return true;
    } catch (e) {
      console.error("Erro ao salvar orquestrador:", e);
      toast({
        title: "Erro na configuração",
        description: "Não foi possível atualizar a configuração do orquestrador.",
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
