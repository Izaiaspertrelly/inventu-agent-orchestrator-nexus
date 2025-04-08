
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAgent } from "@/contexts/AgentContext";
import { Brain, MessageCircle, ListTodo, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Define a more specific task type to help with type safety
interface Task {
  id: string;
  task?: string;
  subtasks?: any[];
}

const OrchestratorMonitoring: React.FC = () => {
  const { orchestratorState, orchestratorConfig } = useAgent();
  
  // Contadores
  const messageCount = orchestratorState?.conversations?.length || 0;
  const taskCount = orchestratorState?.tasks?.length || 0;
  const memoryCount = Object.values(orchestratorState?.users || {}).reduce(
    (total: number, user: any) => total + (user?.memory?.length || 0), 
    0
  );
  const userCount = Object.keys(orchestratorState?.users || {}).length;
  
  // Métricas
  const responseTimeMetrics = orchestratorState?.metrics?.responseTime || [];
  const tokenUsageMetrics = orchestratorState?.metrics?.tokenUsage || [];
  
  const avgResponseTime = responseTimeMetrics.length > 0
    ? responseTimeMetrics.reduce((sum: number, metric: any) => sum + metric.value, 0) / responseTimeMetrics.length
    : 0;
    
  const avgTokenUsage = tokenUsageMetrics.length > 0
    ? tokenUsageMetrics.reduce((sum: number, metric: any) => sum + metric.value, 0) / tokenUsageMetrics.length
    : 0;
  
  // Helper function to safely format dates with proper typing
  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR');
  };
  
  // Renderiza as informações da data da tarefa de forma segura
  const renderTaskDate = (task: Task | null | undefined): JSX.Element => {
    if (!task || typeof task !== 'object' || !task.id) {
      return <span>Data desconhecida</span>;
    }
    
    try {
      const taskIdParts = task.id.split('-');
      if (taskIdParts.length > 1) {
        const datePart = taskIdParts[1];
        if (datePart) {
          return <span>{formatDate(datePart)}</span>;
        }
      }
      return <span>Data desconhecida</span>;
    } catch (error) {
      return <span>Data desconhecida</span>;
    }
  };
  
  // Ensure tasks is an array or provide fallback
  const recentTasks = Array.isArray(orchestratorState?.tasks) 
    ? orchestratorState.tasks.slice(-3).reverse() 
    : [];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conversas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{messageCount}</div>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tarefas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{taskCount}</div>
              <ListTodo className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Memória</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{memoryCount}</div>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{userCount}</div>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Estado do Orquestrador Neural</CardTitle>
          <CardDescription>Visão geral das métricas e status do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tempo médio de resposta</span>
                <span className="text-sm text-muted-foreground">{avgResponseTime.toFixed(0)} ms</span>
              </div>
              <Progress value={Math.min(avgResponseTime / 50, 100)} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Uso médio de tokens</span>
                <span className="text-sm text-muted-foreground">{avgTokenUsage.toFixed(0)} tokens</span>
              </div>
              <Progress value={Math.min(avgTokenUsage / 40, 100)} className="h-2" />
            </div>
            
            <div className="border-t pt-4 mt-4">
              <h4 className="font-medium mb-2">Capacidades ativas</h4>
              <div className="flex flex-wrap gap-2">
                {orchestratorConfig?.memory?.enabled && (
                  <Badge variant="outline" className="bg-blue-50">Memória</Badge>
                )}
                {orchestratorConfig?.reasoning?.enabled && (
                  <Badge variant="outline" className="bg-green-50">Raciocínio</Badge>
                )}
                {orchestratorConfig?.planning?.enabled && (
                  <Badge variant="outline" className="bg-amber-50">Planejamento</Badge>
                )}
                {orchestratorConfig?.multiAgent?.enabled && (
                  <Badge variant="outline" className="bg-purple-50">Multi-Agente</Badge>
                )}
              </div>
            </div>
            
            {recentTasks.length > 0 && (
              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium mb-2">Tarefas recentes</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {recentTasks.map((task: Task, index: number) => (
                    <div key={index} className="bg-muted/50 p-2 rounded-md">
                      <div className="text-sm font-medium">
                        {task && task.task ? 
                          `${task.task.substring(0, 60)}${task.task.length > 60 ? '...' : ''}` : 
                          'Tarefa sem descrição'}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Subtasks: {task && task.subtasks ? task.subtasks.length : 0} • {renderTaskDate(task)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrchestratorMonitoring;
