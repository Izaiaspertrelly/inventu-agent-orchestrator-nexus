
import { useState } from "react";
import { useAgent } from "../../contexts/AgentContext";

export const useOrchestratorResponse = () => {
  const { agents, orchestratorConfig } = useAgent();
  
  // Função para encontrar o agente correto baseado no modelo selecionado
  const findAgentByModel = (modelId: string) => {
    return agents.find(agent => agent.modelId === modelId);
  };
  
  // Encontrar o agente orquestrador baseado no ID configurado
  const getOrchestratorAgent = () => {
    if (!orchestratorConfig || !orchestratorConfig.mainAgentId) {
      return null;
    }
    return agents.find(agent => agent.id === orchestratorConfig.mainAgentId);
  };
  
  // Processo de orquestração de agentes
  const orchestrateAgentResponse = async (userMessage: string, agent: any) => {
    try {
      console.log("Orquestrando resposta usando agente:", agent?.name);
      
      // Tentar analisar a configuração do agente
      let agentConfig: any = {};
      try {
        agentConfig = JSON.parse(agent.configJson || "{}");
        console.log("Configuração do agente carregada:", agentConfig);
      } catch (e) {
        console.error("Erro ao analisar configuração do agente:", e);
      }
      
      // Usar configurações do orquestrador se este agente for o orquestrador principal
      let useOrchestratorConfig = false;
      if (orchestratorConfig && orchestratorConfig.mainAgentId === agent.id) {
        console.log("Este agente é o orquestrador principal, usando configurações centrais");
        useOrchestratorConfig = true;
      }
      
      // Verificar capacidades do orquestrador - com validação para evitar o erro
      const orchestratorSettings = useOrchestratorConfig ? orchestratorConfig : (agentConfig.orchestrator || {});
      const memory = orchestratorSettings.memory || { enabled: false };
      const reasoning = orchestratorSettings.reasoning || { enabled: false };
      const planning = orchestratorSettings.planning || { enabled: false };
      
      let responseContent = "";
      
      // Indicar se este é o orquestrador principal
      if (useOrchestratorConfig) {
        responseContent += `[Orquestrador Neural] `;
      } else {
        responseContent += `[Agente: ${agent.name}] `;
      }
      
      // Processar com memória se habilitado
      if (memory.enabled) {
        responseContent += `[Memória ${memory.type}] Memória processada. `;
      }
      
      // Processar com raciocínio se habilitado
      if (reasoning.enabled) {
        const depth = reasoning.depth || 1;
        responseContent += `[Raciocínio profundidade ${depth}] Analisando consulta com raciocínio. `;
      }
      
      // Processar com planejamento se habilitado
      if (planning.enabled) {
        responseContent += `[Planejamento] Criando plano de ação. `;
      }
      
      return responseContent;
    } catch (error) {
      console.error("Erro na orquestração do agente:", error);
      return `Erro ao processar com o agente: ${error.message}`;
    }
  };

  return {
    findAgentByModel,
    getOrchestratorAgent,
    orchestrateAgentResponse
  };
};
