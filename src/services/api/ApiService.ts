
import { HttpMethod, RequestConfig, ApiResponse } from './types';
import { createUrl, convertToBodyInit } from './utils';

/**
 * Core API service for handling HTTP requests
 */
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

  // Método para fazer requisições
  private async request<T>(
    method: HttpMethod,
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const { params, body, headers = {}, withCredentials, ...restConfig } = config;
    
    const url = createUrl(this.baseUrl, endpoint, params);
    
    const requestConfig: RequestInit = {
      method,
      headers: {
        ...this.defaultHeaders,
        ...headers,
      },
      credentials: withCredentials ? "include" : "same-origin",
      ...restConfig,
    };
    
    if (body !== undefined) {
      requestConfig.body = convertToBodyInit(body);
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

export default ApiService;
