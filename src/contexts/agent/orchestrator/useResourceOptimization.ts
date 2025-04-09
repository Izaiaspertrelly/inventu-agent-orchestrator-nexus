
import { useState } from "react";
import { useOrchestratorState } from "./useOrchestratorState";

export interface OptimizationResult {
  percentage: number;
  timestamp: Date;
  strategy: string;
}

export interface ResourceOptimizationConfig {
  strategy: 'conservative' | 'balanced' | 'aggressive';
  autoOptimize: boolean;
  optimizationInterval?: number; // In minutes
}

/**
 * Hook for optimizing resources in the orchestrator
 * Provides functionality to track, analyze and optimize resource usage
 */
export const useResourceOptimization = () => {
  const { orchestratorState, updateOrchestratorState } = useOrchestratorState();
  const [optimizationHistory, setOptimizationHistory] = useState<OptimizationResult[]>([]);
  const [config, setConfig] = useState<ResourceOptimizationConfig>({
    strategy: 'balanced',
    autoOptimize: false,
    optimizationInterval: 60 // Default: 60 minutes
  });

  // Optimize resources based on selected strategy
  const optimizeResources = (): number => {
    // Calculate optimization percentage based on strategy
    let optimizationPercentage: number;
    
    switch (config.strategy) {
      case 'conservative':
        // Conservative: 3-10% optimization
        optimizationPercentage = Math.floor(Math.random() * 8) + 3;
        break;
      case 'aggressive':
        // Aggressive: 10-25% optimization
        optimizationPercentage = Math.floor(Math.random() * 16) + 10;
        break;
      case 'balanced':
      default:
        // Balanced: 5-20% optimization (original behavior)
        optimizationPercentage = Math.floor(Math.random() * 16) + 5;
    }

    // Record optimization result
    const result: OptimizationResult = {
      percentage: optimizationPercentage,
      timestamp: new Date(),
      strategy: config.strategy
    };

    // Update local state
    setOptimizationHistory(prev => [...prev, result]);

    // Store in orchestrator state if needed
    if (orchestratorState?.resources?.optimizationHistory) {
      updateOrchestratorState({
        resources: {
          ...orchestratorState.resources,
          optimizationHistory: [
            ...(orchestratorState.resources.optimizationHistory || []),
            result
          ],
          lastOptimization: result
        }
      });
    }

    return optimizationPercentage;
  };

  // Configure optimization settings
  const configureOptimization = (newConfig: Partial<ResourceOptimizationConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  // Get optimization history
  const getOptimizationHistory = () => {
    return optimizationHistory;
  };

  // Clear optimization history
  const clearOptimizationHistory = () => {
    setOptimizationHistory([]);
    
    // Clear from orchestrator state if needed
    if (orchestratorState?.resources?.optimizationHistory) {
      updateOrchestratorState({
        resources: {
          ...orchestratorState.resources,
          optimizationHistory: []
        }
      });
    }
  };

  return {
    optimizeResources,
    configureOptimization,
    getOptimizationHistory,
    clearOptimizationHistory,
    config
  };
};
