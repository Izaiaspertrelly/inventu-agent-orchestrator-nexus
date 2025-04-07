
// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  avatarUrl?: string;
}

// Authentication related types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// AI Model related types
export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  capabilities: string[];
  apiKey?: string;
}

// Chat related types
export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant" | "system";
  createdAt: Date;
  modelUsed?: string;
  toolsUsed?: string[];
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

// MCP Server related types
export interface MCPTool {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  authKey?: string;
}

export interface MCPServerConfig {
  serverUrl: string;
  apiKey?: string;
  tools: MCPTool[];
}

// Categories
export interface Category {
  id: string;
  name: string;
  description?: string;
}
