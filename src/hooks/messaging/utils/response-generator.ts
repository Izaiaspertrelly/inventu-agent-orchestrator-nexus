
import { OrchestratorCapabilities } from "../types/orchestrator-types";

/**
 * Generates a dynamic response based on user message content and orchestrator capabilities
 */
export const generateDynamicResponse = (userMessage: string, capabilities: OrchestratorCapabilities): string => {
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
