
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress"; 

interface OrchestratorMonitoringProps {
  enableMonitoring: boolean;
  setEnableMonitoring: (value: boolean) => void;
  adaptiveBehavior: boolean;
  setAdaptiveBehavior: (value: boolean) => void;
  orchestratorState: any;
  handleUpdateConfig: () => void;
}

const OrchestratorMonitoring: React.FC<OrchestratorMonitoringProps> = ({
  enableMonitoring,
  setEnableMonitoring,
  adaptiveBehavior,
  setAdaptiveBehavior,
  orchestratorState,
  handleUpdateConfig,
}) => {
  // Calcular métricas de desempenho
  const responseTimeHistory = orchestratorState?.performanceMetrics?.responseTime || [];
  const tokenUsageHistory = orchestratorState?.performanceMetrics?.tokenUsage || [];
  
  const avgResponseTime = responseTimeHistory.length > 0
    ? responseTimeHistory.reduce((a: number, b: number) => a + b, 0) / responseTimeHistory.length
    : 0;
  
  const avgTokenUsage = tokenUsageHistory.length > 0
    ? tokenUsageHistory.reduce((a: number, b: number) => a + b, 0) / tokenUsageHistory.length
    : 0;
  
  const successRate = orchestratorState?.performanceMetrics?.successRate || 100;
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Monitoramento do Orquestrador</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Configure como o orquestrador monitora seu próprio desempenho e se adapta para otimizar resultados.
        </p>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">Monitoramento Ativo</h4>
          <p className="text-sm text-muted-foreground">
            Permite que o orquestrador monitore seu desempenho e uso de recursos
          </p>
        </div>
        <Switch 
          checked={enableMonitoring}
          onCheckedChange={setEnableMonitoring}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">Comportamento Adaptativo</h4>
          <p className="text-sm text-muted-foreground">
            Permite que o orquestrador ajuste automaticamente seu comportamento com base em métricas
          </p>
        </div>
        <Switch 
          checked={adaptiveBehavior}
          onCheckedChange={setAdaptiveBehavior}
          disabled={!enableMonitoring}
        />
      </div>
      
      {enableMonitoring && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Tempo de Resposta</Label>
                  <span className="text-sm font-medium">{avgResponseTime.toFixed(0)}ms</span>
                </div>
                <Progress value={Math.min(100, (avgResponseTime / 5000) * 100)} />
                <p className="text-xs text-muted-foreground">
                  Tempo médio de processamento das últimas interações
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Uso de Tokens</Label>
                  <span className="text-sm font-medium">{avgTokenUsage.toFixed(0)}</span>
                </div>
                <Progress value={Math.min(100, (avgTokenUsage / 2000) * 100)} />
                <p className="text-xs text-muted-foreground">
                  Média de tokens utilizados por interação
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Taxa de Sucesso</Label>
                  <span className="text-sm font-medium">{successRate.toFixed(1)}%</span>
                </div>
                <Progress value={successRate} />
                <p className="text-xs text-muted-foreground">
                  Percentual de interações concluídas sem erros
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      <Button 
        variant="outline" 
        onClick={handleUpdateConfig}
      >
        Atualizar Configuração
      </Button>
    </div>
  );
};

export default OrchestratorMonitoring;
