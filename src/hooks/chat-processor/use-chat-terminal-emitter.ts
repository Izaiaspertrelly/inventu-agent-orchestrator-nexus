
/**
 * Hook for emitting terminal events
 */
export const useChatTerminalEmitter = () => {
  // Emitter for terminal update events
  const emitTerminalEvent = (content: string, type: 'command' | 'output' | 'error' | 'info' | 'success') => {
    const event = new CustomEvent('terminal-update', { 
      detail: { content, type } 
    });
    document.dispatchEvent(event);
  };
  
  return {
    emitTerminalEvent
  };
};
