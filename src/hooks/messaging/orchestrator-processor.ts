
import { AgentInfo } from "./types/orchestrator-types";
import { generateDynamicResponse } from "./utils/response-generator";
import { v4 as uuidv4 } from 'uuid';

/**
 * Processa uma mensagem do usuário usando o agente orquestrador
 */
export const orchestrateAgentResponse = async (
  userMessage: string,
  agent: AgentInfo,
  addToConversationHistory?: (message: { role: string; content: string; timestamp: Date }) => void,
  decomposeTask?: (taskId: string, task: string, subtasks: string[]) => void,
  recordPerformanceMetric?: (metric: "responseTime" | "tokenUsage", value: number) => void
): Promise<string> => {
  const startTime = Date.now();
  
  // Emissor de eventos do terminal
  const emitTerminalEvent = (content: string, type: 'command' | 'output' | 'error' | 'info' | 'success') => {
    const event = new CustomEvent('terminal-update', { 
      detail: { content, type } 
    });
    document.dispatchEvent(event);
  };
  
  try {
    console.log("Orchestrating response using agent:", agent?.name || "Virtual Orchestrator");
    emitTerminalEvent(`Orquestrando resposta com ${agent?.name || "Orquestrador Neural"}`, 'info');
    
    // Registrar mensagem do usuário no histórico de conversas
    if (addToConversationHistory) {
      addToConversationHistory({
        role: "user",
        content: userMessage,
        timestamp: new Date()
      });
    }
    
    // Tentar analisar a configuração do agente
    let agentConfig: any = {};
    try {
      agentConfig = JSON.parse(agent.configJson || "{}");
      console.log("Agent configuration loaded:", agentConfig);
    } catch (e) {
      console.error("Error parsing agent configuration:", e);
    }
    
    // Usar configurações do orquestrador se este agente for o orquestrador principal
    const isMainOrchestrator = agent.id === "virtual-orchestrator";
    
    // Verificar capacidades do orquestrador - com validação para evitar erros
    const orchestratorSettings = isMainOrchestrator ? JSON.parse(agent.configJson || "{}") : (agentConfig.orchestrator || {});
    const memory = orchestratorSettings.memory || { enabled: false };
    const reasoning = orchestratorSettings.reasoning || { enabled: false };
    const planning = orchestratorSettings.planning || { enabled: false };
    const monitoring = orchestratorSettings.monitoring || { enabled: false };
    
    // Mostrar acesso à memória no terminal
    if (memory.enabled) {
      emitTerminalEvent("Acessando memória de contexto...", 'info');
      await new Promise(resolve => setTimeout(resolve, 500));
      emitTerminalEvent("Memória carregada com sucesso", 'success');
    }
    
    // Mostrar processo de raciocínio no terminal
    if (reasoning.enabled) {
      emitTerminalEvent("Iniciando processo de raciocínio...", 'info');
      await new Promise(resolve => setTimeout(resolve, 700));
      emitTerminalEvent(`Profundidade de raciocínio: ${reasoning.depth || 2}`, 'output');
      await new Promise(resolve => setTimeout(resolve, 300));
      emitTerminalEvent("Raciocínio concluído", 'success');
    }
    
    // Construir resposta com base nas capacidades e conteúdo da mensagem
    emitTerminalEvent("Gerando resposta para o usuário...", 'info');
    const responseContent = generateDynamicResponse(userMessage, {
      memory,
      reasoning,
      planning,
      monitoring
    });
    
    // Processo de planejamento, se ativado
    if (planning.enabled) {
      // Criar ID de tarefa único
      const taskId = `task-${Date.now()}`;
      emitTerminalEvent("Planejando execução da tarefa...", 'info');
      
      // Exemplo simplificado de decomposição de tarefas
      const subtasks = [
        `Understand the query: "${userMessage.substring(0, 30)}..."`,
        "Retrieve relevant information from context",
        "Formulate response based on available information"
      ];
      
      // Mostrar subtarefas no terminal
      emitTerminalEvent(`Decompondo tarefa em ${subtasks.length} subtarefas:`, 'output');
      for (let i = 0; i < subtasks.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 300));
        emitTerminalEvent(`Subtarefa ${i+1}: ${subtasks[i]}`, 'output');
      }
      
      // Registrar decomposição de tarefas
      if (decomposeTask) {
        decomposeTask(taskId, userMessage, subtasks);
      }
      emitTerminalEvent("Planejamento concluído", 'success');
    }
    
    // Registrar tempo de resposta para análise de desempenho
    const responseTime = Date.now() - startTime;
    if (recordPerformanceMetric) {
      recordPerformanceMetric("responseTime", responseTime);
    }
    emitTerminalEvent(`Tempo de resposta: ${responseTime}ms`, 'output');
    
    // Estimar e registrar uso de tokens (simplificado)
    const estimatedTokens = Math.ceil(userMessage.length / 4) + Math.ceil(responseContent.length / 4);
    if (recordPerformanceMetric) {
      recordPerformanceMetric("tokenUsage", estimatedTokens);
    }
    emitTerminalEvent(`Tokens utilizados (estimado): ${estimatedTokens}`, 'output');
    
    // Registrar resposta do agente no histórico de conversas
    if (addToConversationHistory) {
      addToConversationHistory({
        role: "assistant",
        content: responseContent,
        timestamp: new Date()
      });
    }
    
    emitTerminalEvent("Processamento concluído com sucesso", 'success');
    console.log("Resposta gerada pelo orquestrador:", responseContent);
    return responseContent;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error in agent orchestration:", errorMessage);
    emitTerminalEvent(`Erro: ${errorMessage}`, 'error');
    return `Erro ao processar com o agente: ${errorMessage}`;
  }
};
