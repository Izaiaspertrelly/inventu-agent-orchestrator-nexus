
import { useQuery, useMutation, UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";
import { api, useApi } from "@/services/api";

// Hook para consultar dados com React Query
export const useGet = <TData = unknown, TError = unknown>(
  endpoint: string,
  queryKey: unknown[],
  options?: Omit<UseQueryOptions<TData, TError, TData, unknown[]>, "queryKey" | "queryFn">
) => {
  const apiClient = useApi();
  
  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const response = await apiClient.get<TData>(endpoint);
      return response.data;
    },
    ...options,
  });
};

// Hook para mutações (POST, PUT, DELETE, etc)
export const usePost = <TData = unknown, TVariables = unknown, TError = unknown>(
  endpoint: string,
  options?: Omit<UseMutationOptions<TData, TError, TVariables, unknown>, "mutationFn">
) => {
  const apiClient = useApi();
  
  return useMutation({
    mutationFn: async (variables: TVariables) => {
      const response = await apiClient.post<TData>(endpoint, variables);
      return response.data;
    },
    ...options,
  });
};

export const usePut = <TData = unknown, TVariables = unknown, TError = unknown>(
  endpoint: string,
  options?: Omit<UseMutationOptions<TData, TError, TVariables, unknown>, "mutationFn">
) => {
  const apiClient = useApi();
  
  return useMutation({
    mutationFn: async (variables: TVariables) => {
      const response = await apiClient.put<TData>(endpoint, variables);
      return response.data;
    },
    ...options,
  });
};

export const usePatch = <TData = unknown, TVariables = unknown, TError = unknown>(
  endpoint: string,
  options?: Omit<UseMutationOptions<TData, TError, TVariables, unknown>, "mutationFn">
) => {
  const apiClient = useApi();
  
  return useMutation({
    mutationFn: async (variables: TVariables) => {
      const response = await apiClient.patch<TData>(endpoint, variables);
      return response.data;
    },
    ...options,
  });
};

export const useDelete = <TData = unknown, TVariables = unknown, TError = unknown>(
  endpoint: string,
  options?: Omit<UseMutationOptions<TData, TError, TVariables, unknown>, "mutationFn">
) => {
  const apiClient = useApi();
  
  return useMutation({
    mutationFn: async (variables?: TVariables) => {
      const response = await apiClient.delete<TData>(endpoint);
      return response.data;
    },
    ...options,
  });
};

// Função para inicializar configurações da API
export const initializeApi = (baseUrl: string, token?: string) => {
  if (baseUrl) {
    const apiInstance = new (api.constructor as any)(baseUrl);
    if (token) {
      apiInstance.setAuthToken(token);
    }
    return apiInstance;
  }
  if (token) {
    api.setAuthToken(token);
  }
  return api;
};
