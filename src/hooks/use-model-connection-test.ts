
import { useState } from 'react';
import { useToast } from './use-toast';

export const useModelConnectionTest = () => {
  const { toast } = useToast();
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [connectionMessage, setConnectionMessage] = useState<string>('');

  const testModelConnection = async (providerId: string, modelId: string, apiKey: string) => {
    if (!modelId || !providerId || !apiKey) {
      toast({
        title: "Dados insuficientes",
        description: "É necessário selecionar um provedor, um modelo e ter uma chave de API configurada.",
        variant: "destructive"
      });
      return;
    }
    
    console.log(`Testando conexão com o modelo ${modelId} do provedor ${providerId}`);
    setConnectionStatus('loading');
    setConnectionMessage('Conectando ao serviço de IA...');
    
    try {
      // Construir a URL de teste com base no provedor
      let testUrl = '';
      let headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      };
      
      let body: any = {};
      
      // Configurar requisição com base no provedor
      switch(providerId.toLowerCase()) {
        case 'openai':
          testUrl = 'https://api.openai.com/v1/chat/completions';
          body = {
            model: modelId,
            messages: [{role: "user", content: "Teste de conexão com o Orquestrador Neural. Responda apenas com 'ok'."}],
            max_tokens: 5
          };
          break;
          
        case 'anthropic':
          testUrl = 'https://api.anthropic.com/v1/messages';
          headers = {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
          };
          body = {
            model: modelId,
            messages: [{role: "user", content: "Teste de conexão com o Orquestrador Neural. Responda apenas com 'ok'."}],
            max_tokens: 5
          };
          break;
          
        case 'googleai':
          testUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;
          headers = {
            'Content-Type': 'application/json'
          };
          body = {
            contents: [{role: "user", parts: [{text: "Teste de conexão com o Orquestrador Neural. Responda apenas com 'ok'."}]}]
          };
          break;
          
        default:
          throw new Error(`Provedor ${providerId} não suportado para teste de conexão.`);
      }
      
      console.log(`Conectando a ${testUrl}`);
      
      const response = await fetch(testUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });
      
      // Analisar resposta
      const data = await response.json();
      console.log('Resposta do serviço de IA:', data);
      
      if (!response.ok) {
        throw new Error(`Erro na API: ${data.error?.message || response.statusText}`);
      }
      
      setConnectionStatus('success');
      setConnectionMessage(`Conexão estabelecida com sucesso ao modelo ${modelId}. A API respondeu corretamente.`);
      
      toast({
        title: "Conexão estabelecida",
        description: `O modelo ${modelId} está configurado e respondendo corretamente.`
      });
      
    } catch (error: any) {
      console.error('Erro ao testar conexão com o modelo:', error);
      
      setConnectionStatus('error');
      setConnectionMessage(`Falha na conexão: ${error.message || 'Erro desconhecido'}`);
      
      toast({
        title: "Erro na conexão",
        description: error.message || "Não foi possível conectar ao serviço de IA",
        variant: "destructive"
      });
    }
  };
  
  return {
    connectionStatus,
    connectionMessage, 
    testModelConnection
  };
};
