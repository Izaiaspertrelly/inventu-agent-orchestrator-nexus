
import { useState } from "react";
import { DEFAULT_ORCHESTRATOR_CONFIG } from "./defaults";
import { OrchestratorConfig } from "./types";
import { useToast } from "@/hooks/use-toast";

export const useOrchestratorConfig = () => {
  const { toast } = useToast();
  
  // Orchestrator config
  const [orchestratorConfig, setOrchestratorConfig] = useState<OrchestratorConfig>(() => {
    try {
      const savedConfig = localStorage.getItem("inventu_orchestrator_config");
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        if (parsedConfig && typeof parsedConfig === 'object' && Object.keys(parsedConfig).length > 0) {
          console.log("Configuração do orquestrador carregada:", parsedConfig);
          
          // Garantir que as flags enabled sejam interpretadas corretamente
          if (parsedConfig.memory) {
            parsedConfig.memory.enabled = parsedConfig.memory.enabled !== false;
          }
          
          if (parsedConfig.reasoning) {
            parsedConfig.reasoning.enabled = parsedConfig.reasoning.enabled !== false;
          }
          
          if (parsedConfig.planning) {
            parsedConfig.planning.enabled = parsedConfig.planning.enabled === true;
          }
          
          return parsedConfig;
        }
      }
    } catch (e) {
      console.error("Erro ao carregar configuração do orquestrador:", e);
    }
    console.log("Usando configuração padrão do orquestrador");
    return DEFAULT_ORCHESTRATOR_CONFIG;
  });

  const updateOrchestratorConfig = (config: Partial<OrchestratorConfig>) => {
    // Garantir que as propriedades obrigatórias estão presentes
    const updatedConfig = {
      ...DEFAULT_ORCHESTRATOR_CONFIG, // Usar default para garantir que todas as propriedades existam
      ...orchestratorConfig,
      ...config,
      name: "Orquestrador Neural", // Nome fixo
      description: "O Orquestrador Neural é a camada central e inteligente responsável por comandar, direcionar e conectar todos os fluxos de raciocínio, ação e execução de um ecossistema de agentes de IA." // Descrição fixa
    };
    
    // Garantir que as flags enabled sejam tratadas corretamente
    if (updatedConfig.memory) {
      updatedConfig.memory.enabled = updatedConfig.memory.enabled !== false;
    }
    
    if (updatedConfig.reasoning) {
      updatedConfig.reasoning.enabled = updatedConfig.reasoning.enabled !== false;
    }
    
    if (updatedConfig.planning) {
      updatedConfig.planning.enabled = updatedConfig.planning.enabled === true;
    }
    
    console.log("Salvando configuração do orquestrador:", updatedConfig);
    localStorage.setItem("inventu_orchestrator_config", JSON.stringify(updatedConfig));
    setOrchestratorConfig(updatedConfig);
    
    toast({
      title: "Orquestrador Neural Atualizado",
      description: "A configuração do orquestrador foi salva com sucesso"
    });
  };

  return {
    orchestratorConfig,
    updateOrchestratorConfig,
  };
};
