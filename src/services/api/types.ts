
// Types for HTTP requests and responses
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface RequestConfig extends RequestInit {
  params?: Record<string, string>;
  withCredentials?: boolean;
  body?: unknown;  // Adding the body property to allow passing data
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}
