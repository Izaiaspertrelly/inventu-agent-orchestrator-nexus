
// Utility functions for API service

/**
 * Creates a URL with query parameters
 */
export const createUrl = (baseUrl: string, endpoint: string, params?: Record<string, string>): string => {
  const url = new URL(
    endpoint.startsWith("http") ? endpoint : `${baseUrl}${endpoint}`
  );
  
  if (params) {
    Object.keys(params).forEach((key) => {
      url.searchParams.append(key, params[key]);
    });
  }
  
  return url.toString();
};

/**
 * Converts a value to BodyInit for fetch API
 */
export const convertToBodyInit = (value: unknown): BodyInit | null => {
  if (value == null) {
    return null;
  }
  
  if (typeof value === 'string' || value instanceof Blob || value instanceof FormData || 
      value instanceof URLSearchParams || value instanceof ReadableStream || 
      value instanceof ArrayBuffer || ArrayBuffer.isView(value)) {
    return value as BodyInit;
  }
  
  // For objects and any other types, convert to JSON string
  return JSON.stringify(value);
};
