
import { useToast } from "@/hooks/use-toast";
import ApiService from './ApiService';
import { ApiResponse, RequestConfig } from './types';

// Configuração base para requisições HTTP
const BASE_URL = import.meta.env.VITE_API_URL || "";

// Instância da API para uso em toda a aplicação
export const api = new ApiService(BASE_URL);

// Hook para usar a API com tratamento de erros
export const useApi = () => {
  const { toast } = useToast();
  
  const handleApiError = (error: any) => {
    const message = error.message || "Ocorreu um erro na requisição";
    toast({
      title: "Erro",
      description: message,
      variant: "destructive",
    });
    throw error;
  };
  
  return {
    get: async <T>(endpoint: string, config?: RequestConfig) => {
      try {
        return await api.get<T>(endpoint, config);
      } catch (error) {
        return handleApiError(error);
      }
    },
    post: async <T>(endpoint: string, data?: unknown, config?: RequestConfig) => {
      try {
        return await api.post<T>(endpoint, data, config);
      } catch (error) {
        return handleApiError(error);
      }
    },
    put: async <T>(endpoint: string, data?: unknown, config?: RequestConfig) => {
      try {
        return await api.put<T>(endpoint, data, config);
      } catch (error) {
        return handleApiError(error);
      }
    },
    patch: async <T>(endpoint: string, data?: unknown, config?: RequestConfig) => {
      try {
        return await api.patch<T>(endpoint, data, config);
      } catch (error) {
        return handleApiError(error);
      }
    },
    delete: async <T>(endpoint: string, config?: RequestConfig) => {
      try {
        return await api.delete<T>(endpoint, config);
      } catch (error) {
        return handleApiError(error);
      }
    },
  };
};

// Re-export types
export * from './types';
export { ApiService };
