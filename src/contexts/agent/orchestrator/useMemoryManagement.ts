
import { useOrchestratorState } from "./useOrchestratorState";
import { MemoryEntry } from "./types";

export const useMemoryManagement = () => {
  const { orchestratorState, updateOrchestratorState } = useOrchestratorState();
  
  // Add memory entry for specific user
  const addMemoryEntry = (userId: string, entry: MemoryEntry) => {
    const users = orchestratorState.users || {};
    const userMemory = users[userId]?.memory || [];
    
    const updatedUsers = {
      ...users,
      [userId]: {
        ...users[userId],
        memory: [...userMemory, entry]
      }
    };
    
    updateOrchestratorState({
      users: updatedUsers
    });
  };
  
  // Request confirmation for memory entry
  const requestMemoryConfirmation = (userId: string, entry: { key: string, value: any, source: string, label?: string }) => {
    const pendingConfirmations = orchestratorState.memory?.pendingConfirmations || [];
    
    updateOrchestratorState({
      memory: {
        ...orchestratorState.memory,
        pendingConfirmations: [...pendingConfirmations, { userId, entry, timestamp: new Date() }]
      }
    });
    
    return { userId, entry };
  };
  
  // Process memory confirmation
  const processMemoryConfirmation = (confirmationId: number, approved: boolean) => {
    const pendingConfirmations = orchestratorState.memory?.pendingConfirmations || [];
    
    if (pendingConfirmations[confirmationId]) {
      const { userId, entry } = pendingConfirmations[confirmationId];
      
      if (approved) {
        addMemoryEntry(userId, { ...entry, timestamp: new Date() });
      }
      
      // Remove from pending
      const updatedPending = pendingConfirmations.filter((_, index) => index !== confirmationId);
      
      updateOrchestratorState({
        memory: {
          ...orchestratorState.memory,
          pendingConfirmations: updatedPending
        }
      });
    }
  };
  
  return {
    requestMemoryConfirmation,
    processMemoryConfirmation,
    addMemoryEntry
  };
};
