
import { useToast } from "@/hooks/use-toast";

// Configuração base para requisições HTTP
const BASE_URL = import.meta.env.VITE_API_URL || "";

// Tipos para requisições HTTP
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface RequestConfig extends RequestInit {
  params?: Record<string, string>;
  withCredentials?: boolean;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

// Classe para gerenciar requisições HTTP
class ApiService {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;
  
  constructor(baseUrl: string = "") {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      "Accept": "application/json",
    };
  }

  // Método para adicionar headers padrão
  setDefaultHeader(key: string, value: string): void {
    this.defaultHeaders = {
      ...this.defaultHeaders,
      [key]: value,
    };
  }

  // Método para configurar token de autenticação
  setAuthToken(token: string | null): void {
    if (token) {
      this.setDefaultHeader("Authorization", `Bearer ${token}`);
    } else {
      const headers = { ...this.defaultHeaders };
      delete headers["Authorization"];
      this.defaultHeaders = headers;
    }
  }

  // Método para criar URL com query params
  private createUrl(endpoint: string, params?: Record<string, string>): string {
    const url = new URL(
      endpoint.startsWith("http") ? endpoint : `${this.baseUrl}${endpoint}`
    );
    
    if (params) {
      Object.keys(params).forEach((key) => {
        url.searchParams.append(key, params[key]);
      });
    }
    
    return url.toString();
  }

  // Método para fazer requisições
  private async request<T>(
    method: HttpMethod,
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const { params, body, headers = {}, withCredentials, ...restConfig } = config;
    
    const url = this.createUrl(endpoint, params);
    
    const requestConfig: RequestInit = {
      method,
      headers: {
        ...this.defaultHeaders,
        ...headers,
      },
      credentials: withCredentials ? "include" : "same-origin",
      ...restConfig,
    };
    
    if (body) {
      requestConfig.body =
        typeof body === "string" ? body : JSON.stringify(body);
    }
    
    try {
      const response = await fetch(url, requestConfig);
      
      // Verificar se a resposta é um JSON
      const isJson = response.headers
        .get("content-type")
        ?.includes("application/json");
        
      const data = isJson ? await response.json() : await response.text();
      
      if (!response.ok) {
        throw {
          message: data.message || "Erro na requisição",
          status: response.status,
          data,
        };
      }
      
      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      };
    } catch (error) {
      console.error("API request error:", error);
      throw error;
    }
  }

  // Métodos HTTP
  async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>("GET", endpoint, config);
  }
  
  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>("POST", endpoint, { ...config, body: data });
  }
  
  async put<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>("PUT", endpoint, { ...config, body: data });
  }
  
  async patch<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>("PATCH", endpoint, { ...config, body: data });
  }
  
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>("DELETE", endpoint, config);
  }
}

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
