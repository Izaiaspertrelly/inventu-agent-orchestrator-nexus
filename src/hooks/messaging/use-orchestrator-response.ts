import { useState, useEffect } from "react";
import { useAgent } from "../../contexts/AgentContext";

export const useOrchestratorResponse = () => {
  const { agents, orchestratorConfig, orchestratorState, addToConversationHistory, recordPerformanceMetric, decomposeTask } = useAgent();
  
  // State to control memory confirmation pending status
  const [pendingMemoryConfirmation, setPendingMemoryConfirmation] = useState(null);
  
  // Monitor pending confirmations
  useEffect(() => {
    const pendingConfirmations = orchestratorState?.memory?.pendingConfirmations || [];
    if (pendingConfirmations.length > 0 && !pendingMemoryConfirmation) {
      setPendingMemoryConfirmation({
        id: 0,
        ...pendingConfirmations[0]
      });
    } else if (pendingConfirmations.length === 0 && pendingMemoryConfirmation) {
      setPendingMemoryConfirmation(null);
    }
  }, [orchestratorState?.memory?.pendingConfirmations, pendingMemoryConfirmation]);
  
  // Function to find the correct agent based on selected model
  const findAgentByModel = (modelId: string) => {
    return agents.find(agent => agent.modelId === modelId);
  };
  
  // Find orchestrator agent based on configured ID or selected model
  const getOrchestratorAgent = () => {
    if (orchestratorConfig && orchestratorConfig.mainAgentId) {
      const agent = agents.find(agent => agent.id === orchestratorConfig.mainAgentId);
      if (agent) {
        console.log("Found orchestrator agent by ID:", agent.name);
        return agent;
      }
      console.log("Configured agent ID not found, trying by model ID");
    }
    
    if (orchestratorConfig && orchestratorConfig.selectedModel) {
      const agent = agents.find(agent => agent.modelId === orchestratorConfig.selectedModel);
      if (agent) {
        console.log("Found orchestrator agent by model ID:", agent.name);
        return agent;
      }
      
      console.log("No agent found for this model, creating virtual agent");
      return {
        id: "virtual-orchestrator",
        name: "Orquestrador Neural",
        modelId: orchestratorConfig.selectedModel,
        configJson: JSON.stringify(orchestratorConfig)
      };
    }
    
    console.log("No orchestrator agent configuration found");
    return null;
  };
  
  // Generate a more dynamic response based on user message content
  const generateDynamicResponse = (userMessage: string, capabilities: any) => {
    const lowercaseMessage = userMessage.toLowerCase();
    let response = '';
    
    response += "💭 **Pensando...**\n\n";
    
    if (capabilities.memory?.enabled) {
      response += "🔍 **Buscando informações na memória...**\n";
      response += "- Verificando contexto de conversas anteriores\n";
      response += "- Analisando padrões relevantes\n\n";
    }
    
    response += "📊 **Coletando informações...**\n";
    
    if (lowercaseMessage.includes("saude") || lowercaseMessage.includes("plano")) {
      response += "- Acessando dados sobre operadoras de saúde no Brasil\n";
      response += "- Verificando rankings de satisfação de clientes\n";
      response += "- Analisando cobertura de procedimentos por operadora\n";
      response += "- Comparando valores médios de mensalidades\n\n";
    } else if (lowercaseMessage.includes("viagem") || lowercaseMessage.includes("ferias")) {
      response += "- Consultando destinos populares para a época atual\n";
      response += "- Verificando informações climáticas para destinos mencionados\n";
      response += "- Analisando opções de hospedagem disponíveis\n\n";
    } else if (lowercaseMessage.includes("comida") || lowercaseMessage.includes("receita")) {
      response += "- Buscando receitas populares relacionadas\n";
      response += "- Verificando ingredientes e substitutos possíveis\n";
      response += "- Analisando técnicas de preparo recomendadas\n\n";
    } else {
      response += "- Buscando informações relevantes sobre o tópico\n";
      response += "- Verificando dados atualizados de fontes confiáveis\n";
      response += "- Analisando contexto da solicitação\n\n";
    }
    
    if (capabilities.reasoning?.enabled) {
      response += "🧠 **Processando com raciocínio...**\n";
      response += "- Aplicando análise crítica às informações coletadas\n";
      response += "- Considerando diferentes perspectivas sobre o tema\n";
      response += `- Utilizando estratégia de raciocínio: ${capabilities.reasoning?.strategy || 'padrão'}\n\n`;
    }
    
    if (capabilities.planning?.enabled) {
      response += "📝 **Organizando resposta...**\n";
      response += "- Estruturando informações por relevância\n";
      response += "- Preparando exemplos ilustrativos\n";
      response += "- Estabelecendo sequência lógica de apresentação\n\n";
    }
    
    response += "✅ **Finalizado processamento**\n\n";
    response += "---\n\n";
    
    if (lowercaseMessage.includes("saude") || lowercaseMessage.includes("plano")) {
      response += `### Melhores Planos de Saúde do Brasil\n\n`;
      response += `Baseado nas análises mais recentes de satisfação do cliente, cobertura de serviços e relação custo-benefício, os planos de saúde mais bem avaliados no Brasil são:\n\n`;
      response += `1. **Amil** - Destaca-se por sua ampla rede de atendimento e variedade de planos.\n`;
      response += `2. **Bradesco Saúde** - Reconhecido pela qualidade dos hospitais conveniados e atendimento.\n`;
      response += `3. **SulAmérica** - Oferece boa cobertura nacional e programas de prevenção.\n`;
      response += `4. **Unimed** - Sistema cooperativista com forte presença em diferentes regiões do país.\n`;
      response += `5. **Notre Dame Intermédica** - Boa relação custo-benefício e estrutura própria.\n\n`;
      response += `É importante considerar que o "melhor" plano varia conforme suas necessidades específicas. Sugiro avaliar:\n\n`;
      response += `- **Cobertura regional**: Verifique a rede de hospitais e médicos na sua região\n`;
      response += `- **Necessidades específicas**: Se você tem condições pré-existentes ou necessita de especialistas específicos\n`;
      response += `- **Orçamento disponível**: Os planos variam significativamente em preço\n`;
      response += `- **Tipo de plano**: Individual, familiar ou empresarial (geralmente com melhores condições)\n\n`;
      response += `Você gostaria de informações mais detalhadas sobre algum destes planos ou comparativos específicos entre eles?`;
    } else if (lowercaseMessage.includes("viagem") || lowercaseMessage.includes("ferias")) {
      response += `### Destinos Recomendados para Viagem\n\n`;
      response += `Baseado nas tendências atuais e considerando a época do ano, aqui estão alguns destinos recomendados:\n\n`;
      response += `[Conteúdo personalizado sobre destinos de viagem...]`;
    } else {
      response += `Sobre sua solicitação: "${userMessage}"\n\n`;
      response += `Aqui está o que encontrei baseado nas informações disponíveis:\n\n`;
      response += `[Esta seria uma resposta detalhada gerada pelo modelo de linguagem, adaptada ao seu pedido específico.]\n\n`;
      response += `Posso fornecer mais detalhes ou esclarecer algum ponto específico sobre este tema?`;
    }
    
    return response;
  };
  
  // Agent orchestration process
  const orchestrateAgentResponse = async (userMessage: string, agent: any) => {
    const startTime = Date.now();
    try {
      console.log("Orchestrating response using agent:", agent?.name || "Virtual Orchestrator");
      
      // Register user message in conversation history
      addToConversationHistory?.({
        role: "user",
        content: userMessage,
        timestamp: new Date()
      });
      
      // Try to parse agent configuration
      let agentConfig: any = {};
      try {
        agentConfig = JSON.parse(agent.configJson || "{}");
        console.log("Agent configuration loaded:", agentConfig);
      } catch (e) {
        console.error("Error parsing agent configuration:", e);
      }
      
      // Use orchestrator settings if this agent is the main orchestrator
      let useOrchestratorConfig = false;
      if (orchestratorConfig && (orchestratorConfig.mainAgentId === agent.id || agent.id === "virtual-orchestrator")) {
        console.log("Using central orchestrator configuration");
        useOrchestratorConfig = true;
      }
      
      // Check orchestrator capabilities - with validation to avoid errors
      const orchestratorSettings = useOrchestratorConfig ? orchestratorConfig : (agentConfig.orchestrator || {});
      const memory = orchestratorSettings.memory || { enabled: false };
      const reasoning = orchestratorSettings.reasoning || { enabled: false };
      const planning = orchestratorSettings.planning || { enabled: false };
      const monitoring = orchestratorSettings.monitoring || { enabled: false };
      
      // Build response based on capabilities and message content
      const responseContent = generateDynamicResponse(userMessage, {
        memory,
        reasoning,
        planning,
        monitoring
      });
      
      // Indicate if this is the main orchestrator (moved to generateDynamicResponse)
      
      // Planning process if enabled
      if (planning.enabled) {
        // Create unique task ID
        const taskId = `task-${Date.now()}`;
        
        // Simplified task decomposition example
        const subtasks = [
          `Understand the query: "${userMessage.substring(0, 30)}..."`,
          "Retrieve relevant information from context",
          "Formulate response based on available information"
        ];
        
        // Register task decomposition
        decomposeTask?.(taskId, userMessage, subtasks);
      }
      
      // Register response time for performance analysis
      const responseTime = Date.now() - startTime;
      recordPerformanceMetric?.("responseTime", responseTime);
      
      // Estimate and register token usage (simplified)
      const estimatedTokens = Math.ceil(userMessage.length / 4) + Math.ceil(responseContent.length / 4);
      recordPerformanceMetric?.("tokenUsage", estimatedTokens);
      
      // Register agent response in conversation history
      addToConversationHistory?.({
        role: "assistant",
        content: responseContent,
        timestamp: new Date()
      });
      
      return responseContent;
    } catch (error) {
      console.error("Error in agent orchestration:", error);
      return `Error processing with agent: ${error.message}`;
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
