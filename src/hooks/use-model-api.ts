
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PROVIDER_MODEL_ENDPOINTS } from "@/components/settings/models/aiProviders";
import { AIModel } from "@/types";

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

  const fetchProviderModels = async (providerId: string, apiKey: string) => {
    // Set loading state for this provider
    setIsLoading(prev => ({ ...prev, [providerId]: true }));
    
    try {
      const endpoint = PROVIDER_MODEL_ENDPOINTS[providerId as keyof typeof PROVIDER_MODEL_ENDPOINTS];
      
      if (!endpoint) {
        console.log(`Endpoint não encontrado para o provedor: ${providerId}. Usando modelos simulados.`);
      }
      
      // Simular resposta da API enquanto os endpoints reais não estão disponíveis
      // Em produção, isso seria substituído por uma chamada real à API usando o apiKey
      // const headers = { 'Authorization': `Bearer ${apiKey}` };
      // const response = await apiClient.get<ModelApiResponse>(endpoint, { headers });
      
      // Simulação de modelos por provedor
      const mockModels: Record<string, any> = {
        "openai": [
          { id: "gpt-4o", name: "GPT-4o", description: "Modelo mais avançado da OpenAI" },
          { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", description: "Modelo eficiente para a maioria das tarefas" },
          { id: "gpt-4-vision", name: "GPT-4 Vision", description: "Modelo com capacidade de processamento de imagens" },
          { id: "dall-e-3", name: "DALL-E 3", description: "Geração de imagens avançada" },
          { id: "whisper", name: "Whisper", description: "Transcrição e tradução de áudio" }
        ],
        "anthropic": [
          { id: "claude-3-opus", name: "Claude 3 Opus", description: "Modelo de maior capacidade da Anthropic" },
          { id: "claude-3-sonnet", name: "Claude 3 Sonnet", description: "Equilíbrio entre performance e eficiência" },
          { id: "claude-3-haiku", name: "Claude 3 Haiku", description: "Modelo mais rápido e eficiente da Anthropic" },
          { id: "claude-2", name: "Claude 2", description: "Versão anterior do modelo Claude" }
        ],
        "google": [
          { id: "gemini-pro", name: "Gemini Pro", description: "Modelo avançado do Google AI" },
          { id: "gemini-ultra", name: "Gemini Ultra", description: "Modelo de maior capacidade do Google AI" },
          { id: "gemini-nano", name: "Gemini Nano", description: "Modelo compacto para dispositivos móveis" },
          { id: "palm", name: "PaLM", description: "Modelo de linguagem de grande escala do Google" },
          { id: "imagen", name: "Imagen", description: "Geração de imagens de alta qualidade" }
        ],
        "mistral": [
          { id: "mistral-large", name: "Mistral Large", description: "Modelo de maior capacidade da Mistral AI" },
          { id: "mistral-medium", name: "Mistral Medium", description: "Modelo intermediário da Mistral AI" },
          { id: "mistral-small", name: "Mistral Small", description: "Modelo compacto da Mistral AI" },
          { id: "mistral-tiny", name: "Mistral Tiny", description: "Modelo mais eficiente da Mistral AI" }
        ],
        "cohere": [
          { id: "command", name: "Command", description: "Modelo principal da Cohere para instruções" },
          { id: "command-light", name: "Command Light", description: "Versão mais leve e rápida do Command" },
          { id: "command-r", name: "Command R", description: "Versão otimizada para respostas do Command" },
          { id: "embed", name: "Embed", description: "Modelo de embeddings semânticos" }
        ],
        "minimax": [
          { id: "minimax-large", name: "MiniMax Large", description: "Modelo de grande capacidade" },
          { id: "minimax-medium", name: "MiniMax Medium", description: "Modelo de capacidade média" },
          { id: "minimax-small", name: "MiniMax Small", description: "Modelo compacto" }
        ],
        "deepseek": [
          { id: "deepseek-r1", name: "DeepSeek R1", description: "Modelo de raciocínio profundo" },
          { id: "deepseek-coder", name: "DeepSeek Coder", description: "Modelo especializado em código" },
          { id: "deepseek-math", name: "DeepSeek Math", description: "Modelo especializado em matemática" }
        ],
        "ideogram": [
          { id: "ideogram-v1", name: "Ideogram v1", description: "Geração de imagens" },
          { id: "ideogram-v2", name: "Ideogram v2", description: "Geração de imagens aprimorada" }
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
      console.log(`Modelos retornados para ${providerId}:`, models);
      
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
