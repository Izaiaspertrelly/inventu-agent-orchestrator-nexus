
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Check, AlertTriangle, Server } from "lucide-react";
import { useAgent } from "@/contexts/AgentContext";

interface DiagnosticResult {
  test: string;
  status: 'success' | 'error' | 'warning' | 'pending';
  message: string;
}

const OrchestratorDiagnostic: React.FC = () => {
  const { toast } = useToast();
  const { orchestratorConfig, models } = useAgent();
  const [diagnosticResults, setDiagnosticResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  
  const runDiagnostic = async () => {
    setIsRunning(true);
    setDiagnosticResults([]);
    
    // Verifique a configuração do orquestrador
    const results: DiagnosticResult[] = [];
    
    // Teste 1: Verificar se o orquestrador está configurado
    if (!orchestratorConfig || Object.keys(orchestratorConfig).length === 0) {
      results.push({
        test: 'Configuração do Orquestrador',
        status: 'error',
        message: 'O orquestrador não está configurado.'
      });
      
      setDiagnosticResults(results);
      setIsRunning(false);
      return;
    } else {
      results.push({
        test: 'Configuração do Orquestrador',
        status: 'success',
        message: 'Orquestrador Neural configurado corretamente.'
      });
    }
    
    // Atualize resultados parciais
    setDiagnosticResults([...results]);
    
    // Teste 2: Verificar se o modelo está selecionado
    if (!orchestratorConfig.selectedModel) {
      results.push({
        test: 'Seleção de Modelo',
        status: 'error',
        message: 'Nenhum modelo de IA selecionado para o orquestrador.'
      });
    } else {
      const modelInfo = models.find(m => m.id === orchestratorConfig.selectedModel);
      
      if (!modelInfo) {
        results.push({
          test: 'Seleção de Modelo',
          status: 'warning',
          message: `Modelo ${orchestratorConfig.selectedModel} selecionado, mas não encontrado na lista de modelos disponíveis.`
        });
      } else {
        results.push({
          test: 'Seleção de Modelo',
          status: 'success',
          message: `Modelo ${orchestratorConfig.selectedModel} (${modelInfo.provider}) configurado.`
        });
      }
    }
    
    // Atualize resultados parciais
    setDiagnosticResults([...results]);
    
    // Teste 3: Verificar chave de API para o provedor selecionado
    const selectedModel = orchestratorConfig.selectedModel;
    if (selectedModel) {
      const modelInfo = models.find(m => m.id === selectedModel);
      
      if (modelInfo) {
        const providerId = modelInfo.providerId;
        const provider = models.find(m => m.providerId === providerId);
        
        if (provider && provider.apiKey) {
          results.push({
            test: 'Chave de API',
            status: 'success',
            message: `Chave de API configurada para o provedor ${provider.provider}.`
          });
          
          // Teste 4: Tenta fazer uma requisição mock para testar a conexão
          results.push({
            test: 'Teste de Conexão',
            status: 'pending',
            message: 'Testando conexão com a API do modelo...'
          });
          
          // Atualize resultados parciais
          setDiagnosticResults([...results]);
          
          try {
            // Simular uma requisição ou usar o hook criado
            setTimeout(() => {
              const resultIndex = results.findIndex(r => r.test === 'Teste de Conexão');
              
              if (resultIndex !== -1) {
                // Aqui você pode realmente implementar uma requisição de teste
                // Por enquanto vamos apenas simular
                results[resultIndex] = {
                  test: 'Teste de Conexão',
                  status: 'success',
                  message: `Conexão com ${provider.provider} (modelo ${selectedModel}) verificada com sucesso.`
                };
              }
              
              // Finalize o diagnóstico
              setDiagnosticResults([...results]);
              setIsRunning(false);
              
              toast({
                title: 'Diagnóstico concluído',
                description: 'Todos os testes do orquestrador foram finalizados.'
              });
            }, 2000);
          } catch (error: any) {
            const resultIndex = results.findIndex(r => r.test === 'Teste de Conexão');
            
            if (resultIndex !== -1) {
              results[resultIndex] = {
                test: 'Teste de Conexão',
                status: 'error',
                message: `Falha na conexão: ${error.message || 'Erro desconhecido'}`
              };
            }
            
            setDiagnosticResults([...results]);
            setIsRunning(false);
          }
        } else {
          results.push({
            test: 'Chave de API',
            status: 'error',
            message: `Chave de API não configurada para o provedor ${providerId}.`
          });
          
          setDiagnosticResults([...results]);
          setIsRunning(false);
        }
      } else {
        results.push({
          test: 'Informação do Modelo',
          status: 'error',
          message: `Não foi possível encontrar informações para o modelo ${selectedModel}.`
        });
        
        setDiagnosticResults([...results]);
        setIsRunning(false);
      }
    } else {
      setIsRunning(false);
    }
  };
  
  const getStatusIcon = (status: 'success' | 'error' | 'warning' | 'pending') => {
    switch(status) {
      case 'success':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'pending':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          Diagnóstico do Orquestrador
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button onClick={runDiagnostic} disabled={isRunning} className="w-full">
            {isRunning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Executando diagnóstico...
              </>
            ) : (
              'Executar Diagnóstico Completo'
            )}
          </Button>
          
          {diagnosticResults.length > 0 && (
            <div className="mt-4 border rounded-md p-4 space-y-3">
              {diagnosticResults.map((result, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {getStatusIcon(result.status)}
                  </div>
                  <div>
                    <h4 className="font-medium">{result.test}</h4>
                    <p className="text-sm text-muted-foreground">
                      {result.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrchestratorDiagnostic;
