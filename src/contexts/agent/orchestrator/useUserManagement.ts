
import { useOrchestratorState } from "./useOrchestratorState";

export const useUserManagement = () => {
  const { orchestratorState, updateOrchestratorState } = useOrchestratorState();
  
  // Create user database
  const createUserDatabase = (userId: string, userData = {}) => {
    if (orchestratorState.users?.[userId]) {
      console.log(`Database for user ${userId} already exists`);
      return false;
    }
    
    updateOrchestratorState({
      users: {
        ...orchestratorState.users,
        [userId]: {
          created: new Date(),
          memory: [],
          preferences: {},
          ...userData
        }
      }
    });
    
    console.log(`Created database for user ${userId}`);
    return true;
  };
  
  return {
    createUserDatabase
  };
};
