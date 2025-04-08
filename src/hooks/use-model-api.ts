
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useGet } from "@/hooks/use-http";
import { PROVIDER_MODEL_ENDPOINTS } from "@/components/settings/models/aiProviders";

export interface ModelApiResponse {
  models: {
    id: string;
    name: string;
    description?: string;
  }[];
}

export const useModelApi = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});

  const fetchProviderModels = async (providerId: string) => {
    setIsLoading(prev => ({ ...prev, [providerId]: true }));
    
    try {
      const endpoint = PROVIDER_MODEL_ENDPOINTS[providerId as keyof typeof PROVIDER_MODEL_ENDPOINTS];
      
      if (!endpoint) {
        throw new Error(`Endpoint não encontrado para o provedor: ${providerId}`);
      }
      
      // Simular resposta da API enquanto os endpoints reais não estão disponíveis
      // Em produção, isso seria substituído por uma chamada real à API
      // const response = await apiClient.get<ModelApiResponse>(endpoint);
      
      // Simulação de modelos por provedor
      const mockModels: Record<string, any> = {
        "openai": [
          { id: "gpt-4o", name: "GPT-4o", description: "Modelo mais avançado da OpenAI" },
          { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", description: "Modelo eficiente para a maioria das tarefas" },
          { id: "gpt-4-vision", name: "GPT-4 Vision", description: "Modelo com capacidade de processamento de imagens" }
        ],
        "anthropic": [
          { id: "claude-3-opus", name: "Claude 3 Opus", description: "Modelo de maior capacidade da Anthropic" },
          { id: "claude-3-sonnet", name: "Claude 3 Sonnet", description: "Equilíbrio entre performance e eficiência" },
          { id: "claude-3-haiku", name: "Claude 3 Haiku", description: "Modelo mais rápido e eficiente da Anthropic" }
        ],
        "google": [
          { id: "gemini-pro", name: "Gemini Pro", description: "Modelo avançado do Google AI" },
          { id: "gemini-ultra", name: "Gemini Ultra", description: "Modelo de maior capacidade do Google AI" },
          { id: "palm", name: "PaLM", description: "Modelo de linguagem de grande escala do Google" }
        ]
      };
      
      // Para provedores sem simulação específica, gerar alguns modelos genéricos
      const defaultModels = [
        { id: `${providerId}-large`, name: "Large", description: "Modelo grande" },
        { id: `${providerId}-medium`, name: "Medium", description: "Modelo médio" },
        { id: `${providerId}-small`, name: "Small", description: "Modelo pequeno" }
      ];
      
      // Simular um atraso de rede
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const models = mockModels[providerId] || defaultModels;
      
      return models;
    } catch (error) {
      console.error(`Erro ao buscar modelos do provedor ${providerId}:`, error);
      
      toast({
        title: "Erro ao carregar modelos",
        description: `Não foi possível carregar os modelos do provedor selecionado.`,
        variant: "destructive",
      });
      
      return [];
    } finally {
      setIsLoading(prev => ({ ...prev, [providerId]: false }));
    }
  };

  return {
    fetchProviderModels,
    isLoading,
  };
};
