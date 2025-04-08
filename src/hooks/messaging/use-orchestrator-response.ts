
import { useState, useEffect } from "react";
import { useAgent } from "../../contexts/AgentContext";

export const useOrchestratorResponse = () => {
  const { agents, orchestratorConfig, orchestratorState, addToConversationHistory, recordPerformanceMetric, decomposeTask } = useAgent();
  
  // Estado para controlar pendência de confirmações de memória
  const [pendingMemoryConfirmation, setPendingMemoryConfirmation] = useState(null);
  
  // Monitorar confirmações pendentes
  useEffect(() => {
    const pendingConfirmations = orchestratorState?.memory?.pendingConfirmations || [];
    if (pendingConfirmations.length > 0 && !pendingMemoryConfirmation) {
      // Pegar a primeira confirmação pendente
      setPendingMemoryConfirmation({
        id: 0,
        ...pendingConfirmations[0]
      });
    } else if (pendingConfirmations.length === 0 && pendingMemoryConfirmation) {
      // Limpar quando não há mais confirmações pendentes
      setPendingMemoryConfirmation(null);
    }
  }, [orchestratorState?.memory?.pendingConfirmations]);
  
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
    const startTime = Date.now();
    try {
      console.log("Orquestrando resposta usando agente:", agent?.name);
      
      // Registrar a mensagem do usuário no histórico de conversas
      addToConversationHistory?.({
        role: "user",
        content: userMessage,
        timestamp: new Date()
      });
      
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
      const monitoring = orchestratorSettings.monitoring || { enabled: false };
      
      let responseContent = "";
      
      // Indicar se este é o orquestrador principal
      if (useOrchestratorConfig) {
        responseContent += `[Orquestrador Neural] `;
      } else {
        responseContent += `[Agente: ${agent.name}] `;
      }
      
      // Processo de planejamento se habilitado
      if (planning.enabled) {
        // Criar um ID único para a tarefa
        const taskId = `task-${Date.now()}`;
        
        // Exemplo simplificado de decomposição de tarefas
        const subtasks = [
          `Entender a consulta: "${userMessage.substring(0, 30)}..."`,
          "Recuperar informações relevantes do contexto",
          "Formular resposta com base nas informações disponíveis"
        ];
        
        // Registrar a decomposição da tarefa
        decomposeTask?.(taskId, userMessage, subtasks);
        
        responseContent += `[Planejamento] Decompondo tarefa em ${subtasks.length} subtarefas. `;
      }
      
      // Processar com memória se habilitado
      if (memory.enabled) {
        const historyCount = orchestratorState?.conversationHistory?.length || 0;
        responseContent += `[Memória ${memory.type}] Processando com contexto de ${historyCount} mensagens anteriores. `;
      }
      
      // Processar com raciocínio se habilitado
      if (reasoning.enabled) {
        const depth = reasoning.depth || 1;
        responseContent += `[Raciocínio profundidade ${depth}] Analisando consulta com raciocínio ${reasoning.strategy}. `;
      }
      
      // Monitoramento e adaptação se habilitados
      if (monitoring.enabled) {
        const optimizedTokens = orchestratorSettings.resources?.optimizeUsage 
          ? `Uso otimizado de tokens (max: ${orchestratorSettings.resources?.maxTokens || 2000}). `
          : "";
        
        responseContent += `[Monitoramento] ${optimizedTokens}`;
      }
      
      // Construir resposta principal baseada no agente
      responseContent += `\n\nAnalisando sua solicitação: "${userMessage}"\n\n`;
      
      if (planning.enabled) {
        responseContent += "Dividi esta tarefa em passos menores para melhor processamento.\n\n";
      }
      
      // Simular uma resposta baseada na consulta (em uma implementação real, isso viria do modelo)
      responseContent += `Baseado na sua consulta, aqui está minha resposta como ${useOrchestratorConfig ? "Orquestrador Neural" : agent.name}:\n\n`;
      
      if (userMessage.toLowerCase().includes("api") || userMessage.toLowerCase().includes("chave")) {
        responseContent += "Observei que você mencionou uma API ou chave. Vou guardar esta informação para referência futura, se você autorizar.";
      } else if (userMessage.toLowerCase().includes("ajuda") || userMessage.toLowerCase().includes("como")) {
        responseContent += "Estou aqui para ajudar! Vejo que você está procurando assistência. Vou utilizar todas as ferramentas disponíveis para resolver sua dúvida da melhor forma possível.";
      } else {
        responseContent += "Processando sua solicitação com as ferramentas e conhecimento disponíveis para gerar a melhor resposta possível.";
      }
      
      // Registrar o tempo de resposta para análise de desempenho
      const responseTime = Date.now() - startTime;
      recordPerformanceMetric?.("responseTime", responseTime);
      
      // Estimar e registrar o uso aproximado de tokens (simplificado)
      const estimatedTokens = Math.ceil(userMessage.length / 4) + Math.ceil(responseContent.length / 4);
      recordPerformanceMetric?.("tokenUsage", estimatedTokens);
      
      // Registrar a resposta do agente no histórico de conversas
      addToConversationHistory?.({
        role: "assistant",
        content: responseContent,
        timestamp: new Date()
      });
      
      return responseContent;
    } catch (error) {
      console.error("Erro na orquestração do agente:", error);
      return `Erro ao processar com o agente: ${error.message}`;
    }
  };

  return {
    findAgentByModel,
    getOrchestratorAgent,
    orchestrateAgentResponse,
    pendingMemoryConfirmation,
    setPendingMemoryConfirmation
  };
};
