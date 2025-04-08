
import { Message, Chat } from "../types";

export interface ChatContextType {
  chats: Chat[];
  activeChat: Chat | null;
  setActiveChat: (chatId: string) => void;
  createNewChat: () => void;
  sendMessage: (content: string) => Promise<void>;
  removeChat: (chatId: string) => void;
}

export interface ToolCall {
  toolId: string;
  params: any;
}
