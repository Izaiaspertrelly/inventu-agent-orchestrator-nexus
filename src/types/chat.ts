
import { Message, Chat } from "../types";
import { TerminalLine } from "@/components/terminal/OrchestratorTerminal";

export interface ChatContextType {
  chats: Chat[];
  activeChat: Chat | null;
  isProcessing: boolean;
  setActiveChat: (chatId: string) => void;
  createNewChat: () => Chat;
  sendMessage: (content: string, file?: File | null) => Promise<void>;
  removeChat: (chatId: string) => void;
  // Terminal related properties and methods
  terminalOpen: boolean;
  terminalMinimized: boolean;
  terminalLines: TerminalLine[];
  toggleTerminal: () => void;
  closeTerminal: () => void;
  addTerminalLine: (content: string, type: 'command' | 'output' | 'error' | 'info' | 'success') => void;
  clearTerminal: () => void;
}

export interface ToolCall {
  toolId: string;
  params: any;
}
