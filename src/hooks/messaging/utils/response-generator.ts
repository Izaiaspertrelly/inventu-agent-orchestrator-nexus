
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
    } else if (lowerCaseMessage.includes("banco") || lowerCaseMessage.includes("conta")) {
      response = "Os melhores bancos no Brasil variam conforme suas necessidades financeiras. Bancos tradicionais como Itaú, Bradesco e Santander oferecem ampla rede de agências, enquanto bancos digitais como Nubank, Inter e C6 Bank se destacam por tarifas reduzidas e experiência digital. Para escolher, considere taxas, serviços oferecidos, atendimento ao cliente e conveniência.";
    } else if (lowerCaseMessage.includes("celular") || lowerCaseMessage.includes("smartphone")) {
      response = "A escolha do melhor smartphone depende do seu orçamento e necessidades. Modelos premium incluem iPhone e Samsung Galaxy S, com excelentes câmeras e desempenho. Para custo-benefício, considere Xiaomi, Motorola e Samsung intermediários. Avalie processador, memória, qualidade da câmera, duração da bateria e sistema operacional (iOS ou Android) conforme sua preferência.";
    } else if (lowerCaseMessage.includes("notebook") || lowerCaseMessage.includes("laptop")) {
      response = "A escolha do melhor notebook varia conforme seu uso. Para trabalho básico, modelos com processadores Intel Core i3/i5 ou AMD Ryzen 3/5 são suficientes. Para design ou jogos, busque Core i7/i9 ou Ryzen 7/9 com placa de vídeo dedicada. Marcas confiáveis incluem Dell, Lenovo, HP, Asus e Apple, cada uma com diferentes linhas para variados orçamentos e necessidades.";
    } else {
      response = `Para responder à sua pergunta sobre "${extractMainTopic(userMessage)}", preciso considerar vários fatores para fornecer uma recomendação adequada. Posso ajudar com mais detalhes se você especificar seu orçamento, necessidades principais e outras prioridades.`;
    }
  } else if (lowerCaseMessage.startsWith("como")) {
    // "Como" questions in Portuguese
    if (lowerCaseMessage.includes("invest") || lowerCaseMessage.includes("aplicar")) {
      response = "Para começar a investir, recomendo primeiro estabelecer uma reserva de emergência em investimentos de baixo risco como Tesouro Selic ou CDBs de liquidez diária. Depois, diversifique conforme seu perfil de risco e objetivos financeiros. Renda fixa (Tesouro Direto, CDBs, LCIs/LCAs) é mais segura, enquanto fundos imobiliários, ações e ETFs oferecem maior potencial de retorno com mais risco. Considere também realizar um planejamento financeiro e possivelmente consultar um assessor de investimentos.";
    } else if (lowerCaseMessage.includes("emagrec") || lowerCaseMessage.includes("perder peso")) {
      response = "Para emagrecer de forma saudável, combine alimentação equilibrada (com déficit calórico moderado) e atividade física regular. Priorize proteínas magras, vegetais, frutas e grãos integrais, reduzindo alimentos processados, açúcares e gorduras saturadas. Beba bastante água, pratique exercícios aeróbicos e de resistência, e mantenha consistência. Consulte profissionais de saúde como nutricionista e educador físico para um plano personalizado e seguro.";
    } else if (lowerCaseMessage.includes("aprender") || lowerCaseMessage.includes("estudar")) {
      response = "Para aprender de forma eficaz, utilize técnicas como estudo ativo (fazer perguntas, resumir, explicar para outras pessoas), prática espaçada (revisar em intervalos crescentes), e intercalar diferentes assuntos. Crie um ambiente de estudo adequado, defina metas específicas, use recursos variados (livros, vídeos, aplicativos), e pratique regularmente. A constância é mais importante que longas sessões esporádicas de estudo.";
    } else {
      response = `Para responder como fazer "${extractMainTopic(userMessage)}", precisaria de mais detalhes sobre seu contexto específico. Há diversos métodos e abordagens dependendo da sua situação particular e objetivos.`;
    }
  } else if (lowerCaseMessage.startsWith("onde")) {
    // "Onde" questions in Portuguese
    if (lowerCaseMessage.includes("comprar") || lowerCaseMessage.includes("adquirir")) {
      response = `Para comprar "${extractShoppingItem(lowerCaseMessage)}", você pode considerar lojas físicas especializadas ou grandes varejistas como Magazine Luiza, Americanas, ou Casas Bahia. Online, marketplaces como Mercado Livre, Amazon Brasil e Shopee oferecem ampla variedade de produtos e preços. Compare preços em sites como Zoom ou Buscapé antes de decidir, e verifique a reputação da loja se for comprar online.`;
    } else if (lowerCaseMessage.includes("viajar") || lowerCaseMessage.includes("conhecer")) {
      response = "Há diversos destinos interessantes para viajar, dependendo do seu gosto. No Brasil, praias como as do Nordeste, montanhas como na Serra Gaúcha, ou destinos culturais como Ouro Preto são excelentes opções. Internacionalmente, Europa, Estados Unidos, países da América do Sul ou destinos asiáticos oferecem experiências únicas. Para escolher, considere seu orçamento, tempo disponível, clima desejado e interesses culturais ou de lazer.";
    } else {
      response = `Para responder sobre onde encontrar "${extractMainTopic(userMessage)}", precisaria de mais informações sobre sua localização e preferências específicas.`;
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
    "esporte", "lazer", "trabalho", "carreira", "banco", "notebook",
    "emagrecimento", "aprendizado"
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

const extractShoppingItem = (message: string): string => {
  // Extract what the user might want to buy
  const buyRegex = /(?:comprar|adquirir|encontrar)\s+(?:um|uma|uns|umas|o|a|os|as)?\s*([a-zA-ZÀ-ÿ\s]+)/i;
  const match = message.match(buyRegex);
  
  if (match && match[1]) {
    return match[1].trim();
  }
  
  // Return a generic response if we can't extract
  return "produto desejado";
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
  
  if (topics.includes("celular") || topics.includes("smartphone")) {
    return "Na escolha de um smartphone, considere seu orçamento, sistema operacional preferido (iOS ou Android), qualidade da câmera, duração da bateria e desempenho. Marcas como Apple, Samsung, Xiaomi e Motorola oferecem opções para diferentes perfis de usuário.";
  }
  
  if (topics.includes("viagem")) {
    return "O planejamento de viagem depende do seu orçamento, tempo disponível, e preferências pessoais. Considere destinos nacionais como praias do Nordeste, cidades históricas de Minas Gerais ou a região Sul se buscar experiências variadas no Brasil.";
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
  
  if (topics.includes("celular") || topics.includes("smartphone")) {
    return "Gostaria de comparar modelos específicos, conhecer as novidades do mercado ou entender melhor as especificações técnicas?";
  }
  
  if (topics.includes("viagem")) {
    return "Posso ajudar com dicas de destinos específicos, planejamento de roteiros ou informações sobre custos de viagem?";
  }
  
  return "Gostaria de obter informações mais específicas sobre esse tema?";
};
