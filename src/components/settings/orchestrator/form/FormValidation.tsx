
import { useToast } from "@/hooks/use-toast";

interface FormValidationProps {
  name: string;
  selectedModel: string;
}

export const useFormValidation = () => {
  const { toast } = useToast();
  
  const validateForm = ({ name, selectedModel }: FormValidationProps): boolean => {
    if (!name) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, forneça um nome para o agente.",
        variant: "destructive"
      });
      return false;
    }

    if (!selectedModel) {
      toast({
        title: "Modelo obrigatório",
        description: "Por favor, selecione um modelo de IA.",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };
  
  return { validateForm };
};
