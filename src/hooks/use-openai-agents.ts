
import { useState, useEffect, useCallback } from 'react';
import { OpenAIAgentService } from '@/services/openai-agent-service';
import { OpenAIAgentConfig, OpenAIAgentTeam, OpenAIRunStatus } from '@/hooks/messaging/types/orchestrator-types';
import { useToast } from '@/hooks/use-toast';

export const useOpenAIAgents = () => {
  const { toast } = useToast();
  const [agents, setAgents] = useState<OpenAIAgentConfig[]>([]);
  const [teams, setTeams] = useState<OpenAIAgentTeam[]>([]);
  const [activeRuns, setActiveRuns] = useState<OpenAIRunStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const service = OpenAIAgentService.getInstance();
  
  // Carregar dados iniciais
  useEffect(() => {
    setAgents(service.getAgents());
    setTeams(service.getTeams());
    setActiveRuns(service.getRuns ? service.getRuns() : []);
    setIsLoading(false);
    
    // Escutar atualizações nos runs
    const handleRunUpdate = (event: CustomEvent<OpenAIRunStatus>) => {
      const run = event.detail;
      setActiveRuns(prev => {
        const newRuns = prev.filter(r => r.id !== run.id);
        return [...newRuns, run];
      });
      
      // Notificar o usuário sobre mudanças de status
      if (run.status === 'completed') {
        toast({
          title: 'Execução concluída',
          description: `A equipe concluiu o processamento da consulta`
        });
      } else if (run.status === 'failed') {
        toast({
          title: 'Falha na execução',
          description: run.error || 'Ocorreu um erro ao processar a consulta',
          variant: 'destructive'
        });
      }
    };
    
    document.addEventListener('openai-run-update', handleRunUpdate as EventListener);
    
    return () => {
      document.removeEventListener('openai-run-update', handleRunUpdate as EventListener);
    };
  }, [toast]);
  
  // Funções de gerenciamento de agentes
  const createAgent = useCallback((agent: Omit<OpenAIAgentConfig, 'id'>) => {
    try {
      const newAgent = service.createAgent(agent);
      setAgents(prev => [...prev, newAgent]);
      toast({
        title: 'Agente criado',
        description: `O agente ${agent.name} foi criado com sucesso`
      });
      return newAgent;
    } catch (error) {
      toast({
        title: 'Erro ao criar agente',
        description: String(error),
        variant: 'destructive'
      });
      return null;
    }
  }, [service, toast]);
  
  const updateAgent = useCallback((id: string, updates: Partial<OpenAIAgentConfig>) => {
    try {
      const updatedAgent = service.updateAgent(id, updates);
      if (updatedAgent) {
        setAgents(prev => prev.map(a => a.id === id ? updatedAgent : a));
        toast({
          title: 'Agente atualizado',
          description: `O agente ${updatedAgent.name} foi atualizado com sucesso`
        });
      }
      return updatedAgent;
    } catch (error) {
      toast({
        title: 'Erro ao atualizar agente',
        description: String(error),
        variant: 'destructive'
      });
      return null;
    }
  }, [service, toast]);
  
  const deleteAgent = useCallback((id: string) => {
    try {
      const success = service.deleteAgent(id);
      if (success) {
        setAgents(prev => prev.filter(a => a.id !== id));
        setTeams(prev => {
          // Atualizar times que usavam este agente
          return prev.map(team => {
            if (team.orchestratorId === id) {
              return { ...team, orchestratorId: '' };
            }
            if (team.assistantIds.includes(id)) {
              return { 
                ...team, 
                assistantIds: team.assistantIds.filter(aid => aid !== id) 
              };
            }
            return team;
          });
        });
        toast({
          title: 'Agente excluído',
          description: 'O agente foi excluído com sucesso'
        });
      }
      return success;
    } catch (error) {
      toast({
        title: 'Erro ao excluir agente',
        description: String(error),
        variant: 'destructive'
      });
      return false;
    }
  }, [service, toast]);
  
  // Funções de gerenciamento de times
  const createTeam = useCallback((team: Omit<OpenAIAgentTeam, 'id'>) => {
    try {
      const newTeam = service.createTeam(team);
      setTeams(prev => [...prev, newTeam]);
      toast({
        title: 'Equipe criada',
        description: `A equipe ${team.name} foi criada com sucesso`
      });
      return newTeam;
    } catch (error) {
      toast({
        title: 'Erro ao criar equipe',
        description: String(error),
        variant: 'destructive'
      });
      return null;
    }
  }, [service, toast]);
  
  const updateTeam = useCallback((id: string, updates: Partial<OpenAIAgentTeam>) => {
    try {
      const updatedTeam = service.updateTeam(id, updates);
      if (updatedTeam) {
        setTeams(prev => prev.map(t => t.id === id ? updatedTeam : t));
        toast({
          title: 'Equipe atualizada',
          description: `A equipe ${updatedTeam.name} foi atualizada com sucesso`
        });
      }
      return updatedTeam;
    } catch (error) {
      toast({
        title: 'Erro ao atualizar equipe',
        description: String(error),
        variant: 'destructive'
      });
      return null;
    }
  }, [service, toast]);
  
  const deleteTeam = useCallback((id: string) => {
    try {
      const success = service.deleteTeam(id);
      if (success) {
        setTeams(prev => prev.filter(t => t.id !== id));
        toast({
          title: 'Equipe excluída',
          description: 'A equipe foi excluída com sucesso'
        });
      }
      return success;
    } catch (error) {
      toast({
        title: 'Erro ao excluir equipe',
        description: String(error),
        variant: 'destructive'
      });
      return false;
    }
  }, [service, toast]);
  
  // Função para executar consulta com time de agentes
  const runTeam = useCallback(async (teamId: string, query: string) => {
    try {
      const run = await service.runAgentTeam(teamId, query);
      setActiveRuns(prev => [...prev, run]);
      toast({
        title: 'Execução iniciada',
        description: 'A equipe está processando sua consulta'
      });
      return run;
    } catch (error) {
      toast({
        title: 'Erro ao iniciar execução',
        description: String(error),
        variant: 'destructive'
      });
      return null;
    }
  }, [service, toast]);
  
  return {
    agents,
    teams,
    activeRuns,
    isLoading,
    createAgent,
    updateAgent,
    deleteAgent,
    createTeam,
    updateTeam,
    deleteTeam,
    runTeam,
    getTeamRuns: useCallback((teamId: string) => {
      return service.getRunsForTeam(teamId);
    }, [service])
  };
};
