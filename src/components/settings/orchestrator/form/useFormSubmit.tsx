
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
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
  const { addAgent } = useAgent();
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
      
      const newAgent = {
        id: uuidv4(),
        name: "Orquestrador Neural", // Nome fixo
        description: "O Orquestrador Neural é a camada central e inteligente responsável por comandar, direcionar e conectar todos os fluxos de raciocínio, ação e execução de um ecossistema de agentes de IA.", // Descrição fixa atualizada
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
