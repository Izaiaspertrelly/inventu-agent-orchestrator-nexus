
import { useChatTerminalEmitter } from "./use-chat-terminal-emitter";

/**
 * Hook for detecting important information in user messages
 */
export const useInformationDetector = () => {
  const { emitTerminalEvent } = useChatTerminalEmitter();
  
  // Detect potentially important information for memory
  const detectImportantInformation = (userMessage: string) => {
    emitTerminalEvent("Analisando informações importantes na mensagem...", 'info');
    
    // Example patterns for detecting important information
    const patterns = [
      { regex: /minha\s+api\s+[é:]?\s+([^\s.,]+)/i, key: 'api_key', label: 'API Key' },
      { regex: /uso\s+(o\s+)?([^\s.,]+)\s+para/i, key: 'tool_usage', label: 'Ferramenta utilizada' },
      { regex: /meu\s+(?:nome|usuário)\s+[é:]?\s+([^\s.,]+)/i, key: 'username', label: 'Nome de usuário' },
      { regex: /(?:trabalho|empresa)\s+[é:]?\s+([^\s.,]+)/i, key: 'company', label: 'Empresa' }
    ];
    
    const detectedInfo = [];
    
    for (const pattern of patterns) {
      const match = userMessage.match(pattern.regex);
      if (match && match[1]) {
        detectedInfo.push({
          key: pattern.key,
          value: match[1],
          label: pattern.label,
          source: 'message_analysis'
        });
        emitTerminalEvent(`Detectado ${pattern.label}: ${match[1]}`, 'success');
      }
    }
    
    return detectedInfo;
  };
  
  return {
    detectImportantInformation
  };
};
