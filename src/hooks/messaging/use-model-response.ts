
import { useState } from "react";
import { useAgent } from "../../contexts/AgentContext";

export const useModelResponse = () => {
  const { models } = useAgent();
  
  // Gera resposta baseada no modelo selecionado
  const generateModelBasedResponse = (userMessage: string, selectedModelId: string, agent: any | null) => {
    // Se um agente foi encontrado e está configurado, use o agente
    if (agent) {
      return `Usando ${agent.name} para processar: "${userMessage}"`;
    }
    
    // Fallback para o comportamento anterior se nenhum agente for encontrado
    switch(selectedModelId) {
      case "minimax":
        return `Usando MiniMax para processar seu pedido: "${userMessage}"`;
      case "deepseek-r1":
        return `Analisando profundamente com DeepSeek R1: "${userMessage}"`;
      case "ideogram":
        return `Gerando visualização com Ideogram baseado em: "${userMessage}"`;
      default:
        return `Processando sua solicitação: "${userMessage}"`;
    }
  };
  
  // Recupera informações do modelo
  const getModelInfo = (modelId: string) => {
    return models.find(m => m.id === modelId);
  };
  
  return {
    generateModelBasedResponse,
    getModelInfo
  };
};
