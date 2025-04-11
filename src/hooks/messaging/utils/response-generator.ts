
/**
 * Generate a dynamic response based on user message and orchestrator capabilities
 */
export const generateDynamicResponse = (
  userMessage: string,
  capabilities: {
    memory?: { enabled: boolean; type?: string };
    reasoning?: { enabled: boolean; depth?: number };
    planning?: { enabled: boolean };
    monitoring?: { enabled: boolean };
  }
): string => {
  // Extract topics from user message
  const lowerCaseMessage = userMessage.toLowerCase();
  
  // Analyze the message content
  const isQuestion = lowerCaseMessage.includes("?");
  const topics = extractTopicsFromMessage(lowerCaseMessage);
  
  // Generate a relevant response based on the message content
  let response = "";
  
  // Handle different types of messages
  if (lowerCaseMessage.startsWith("qual") || lowerCaseMessage.startsWith("quais")) {
    // Questions starting with "qual" or "quais" in Portuguese
    if (lowerCaseMessage.includes("plano de saude") || lowerCaseMessage.includes("plano de saúde")) {
      response = `Para determinar o melhor plano de saúde no Brasil, é necessário considerar diversos fatores como:

1. **Cobertura**: Diferentes operadoras oferecem coberturas distintas para procedimentos médicos.
2. **Rede credenciada**: A disponibilidade de hospitais e médicos na sua região é essencial.
3. **Custo-benefício**: O preço deve ser compatível com os serviços oferecidos.
4. **Reputação**: O histórico de atendimento e satisfação dos clientes é um indicador importante.

Algumas operadoras bem avaliadas incluem Amil, Bradesco Saúde, SulAmérica, Unimed e Notre Dame Intermédica, mas a "melhor" depende das suas necessidades específicas como localização, orçamento, e necessidades médicas particulares.`;
    } else if (lowerCaseMessage.includes("carro")) {
      response = "Determinar o melhor carro depende muito do seu propósito, orçamento e preferências pessoais. Carros populares no Brasil incluem modelos da Fiat, Volkswagen, Chevrolet e Toyota, cada um com seus pontos fortes em economia, conforto, desempenho ou tecnologia.";
    } else {
      response = `Para responder à sua pergunta sobre "${extractMainTopic(userMessage)}", preciso considerar vários fatores para fornecer uma recomendação adequada. Posso ajudar com mais detalhes se você especificar seu orçamento, necessidades principais e outras prioridades.`;
    }
  } else if (isQuestion) {
    response = generateAnswerBasedOnTopic(topics);
  } else {
    // For statements or commands
    response = `Entendi sua mensagem sobre "${extractMainTopic(userMessage)}". ${generateRelevantFollowup(topics)}`;
  }
  
  // Add memory context if enabled
  if (capabilities.memory?.enabled) {
    response += " Baseio esta resposta nas informações que tenho disponíveis no momento.";
  }
  
  // Add reasoning if enabled
  if (capabilities.reasoning?.enabled) {
    const depth = capabilities.reasoning.depth || 1;
    if (depth >= 2) {
      response += " Esta análise considera múltiplos fatores e suas interrelações para uma resposta mais completa.";
    }
  }
  
  return response;
};

// Helper functions
const extractTopicsFromMessage = (message: string): string[] => {
  // Extract potential topics from the message
  const commonTopics = [
    "saúde", "plano", "carro", "viagem", "educação", "investimento", 
    "celular", "computador", "casa", "apartamento", "alimentação", 
    "esporte", "lazer", "trabalho", "carreira"
  ];
  
  return commonTopics.filter(topic => message.includes(topic));
};

const extractMainTopic = (message: string): string => {
  // Simple logic to extract what seems to be the main topic
  const words = message.split(" ");
  
  // Remove common question words in Portuguese
  const filteredWords = words.filter(word => 
    !["qual", "quais", "como", "onde", "quando", "por", "que", "o", "a", "os", "as", "é", "são", "do", "da", "dos", "das"].includes(word.toLowerCase())
  );
  
  // Return a few words that might represent the topic
  if (filteredWords.length > 2) {
    return filteredWords.slice(0, 3).join(" ");
  }
  return filteredWords.join(" ") || "seu assunto";
};

const generateAnswerBasedOnTopic = (topics: string[]): string => {
  if (topics.includes("saúde") || topics.includes("plano")) {
    return "Os melhores planos de saúde dependem de diversos fatores como região, orçamento, e necessidades médicas específicas. Operadoras como Amil, Bradesco Saúde, SulAmérica, Unimed e Notre Dame Intermédica são bem avaliadas no mercado brasileiro.";
  }
  
  if (topics.includes("carro")) {
    return "A escolha do melhor carro varia conforme suas necessidades. Para economia, modelos como HB20 e Mobi são populares. Para famílias, SUVs como T-Cross e Creta oferecem mais espaço. Marcas como Toyota e Honda destacam-se em confiabilidade.";
  }
  
  if (topics.includes("investimento")) {
    return "Estratégias de investimento devem considerar seu perfil de risco, objetivos financeiros e horizonte de tempo. Opções populares no Brasil incluem Tesouro Direto, CDBs, fundos de investimento, e ações para perfis mais arrojados.";
  }
  
  return "Sua pergunta requer uma análise específica. Para uma resposta mais precisa, poderia fornecer mais detalhes sobre o que está procurando?";
};

const generateRelevantFollowup = (topics: string[]): string => {
  if (topics.length === 0) {
    return "Como posso ajudá-lo com mais informações sobre esse assunto?";
  }
  
  if (topics.includes("saúde") || topics.includes("plano")) {
    return "Posso ajudar com informações sobre coberturas, redes credenciadas, ou comparações entre diferentes operadoras de saúde?";
  }
  
  if (topics.includes("carro")) {
    return "Gostaria de saber mais sobre modelos específicos, comparações de preço, ou dicas para compra de carros novos ou usados?";
  }
  
  if (topics.includes("investimento")) {
    return "Posso fornecer mais detalhes sobre tipos específicos de investimentos ou estratégias para diferentes objetivos financeiros?";
  }
  
  return "Gostaria de obter informações mais específicas sobre esse tema?";
};
