
import { v4 as uuidv4 } from 'uuid';
import { createBotMessage } from "../../utils/chatUtils";

/**
 * Hook for chat processor utility functions
 */
export const useChatProcessorUtils = () => {
  // Generate a unique user ID
  const generateUserId = () => {
    return uuidv4();
  };
  
  // Create a bot message with proper formatting
  const createFormattedBotMessage = (
    content: string,
    modelId: string,
    toolsUsed?: string[]
  ) => {
    return createBotMessage(content, modelId, toolsUsed);
  };
  
  return {
    generateUserId,
    createFormattedBotMessage
  };
};
