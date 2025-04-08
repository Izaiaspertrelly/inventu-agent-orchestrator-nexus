
import { Message, Chat } from "../types";

export interface ChatContextType {
  chats: Chat[];
  activeChat: Chat | null;
  isProcessing: boolean;
  setActiveChat: (chatId: string) => void;
  createNewChat: () => Chat;
  sendMessage: (content: string, file?: File | null) => Promise<void>;
  removeChat: (chatId: string) => void;
}

export interface ToolCall {
  toolId: string;
  params: any;
}
