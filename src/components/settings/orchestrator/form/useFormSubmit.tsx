
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
  
  const handleSaveOrchestrator = (formData: FormData): boolean => {
    const { selectedModel, orchestratorConfig } = formData;
    
    // Utiliza nome e descrição fixos, validando apenas o modelo
    if (!validateForm({ name: "Orquestrador Neural", selectedModel })) {
      return false;
    }

    setIsFormLoading(true);
    
    try {
      const configObj = JSON.parse(orchestratorConfig);
      
      // Atualizar configuração do orquestrador
      updateOrchestratorConfig({
        ...configObj,
        name: "Orquestrador Neural",
        description: "O Orquestrador Neural é a camada central e inteligente responsável por comandar, direcionar e conectar todos os fluxos de raciocínio, ação e execução de um ecossistema de agentes de IA.",
        selectedModel
      });
      
      toast({
        title: "Orquestrador atualizado",
        description: "Configuração do orquestrador salva com sucesso.",
      });
      
      return true;
    } catch (e) {
      toast({
        title: "Erro na configuração",
        description: "O JSON de configuração é inválido.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsFormLoading(false);
    }
  };
  
  return { handleSaveOrchestrator, isFormLoading };
};
