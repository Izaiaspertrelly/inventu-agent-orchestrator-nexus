
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { OpenAIAgentConfig, OpenAIAgentTeam } from "@/hooks/messaging/types/orchestrator-types";
import { Plus, Pencil, Trash2, Users, Network, Play, Clock } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import OpenAIAgentTeamForm from "./OpenAIAgentTeamForm";
import { useOpenAIAgents } from "@/hooks/use-openai-agents";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface OpenAIAgentTeamsListProps {
  teams: OpenAIAgentTeam[];
  agents: OpenAIAgentConfig[];
  onCreateTeam: (team: Omit<OpenAIAgentTeam, 'id'>) => OpenAIAgentTeam | null;
  onUpdateTeam: (id: string, team: Partial<OpenAIAgentTeam>) => OpenAIAgentTeam | null;
  onDeleteTeam: (id: string) => boolean;
}

const OpenAIAgentTeamsList: React.FC<OpenAIAgentTeamsListProps> = ({
  teams,
  agents,
  onCreateTeam,
  onUpdateTeam,
  onDeleteTeam
}) => {
  const { runTeam, getTeamRuns } = useOpenAIAgents();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [deleteTeamId, setDeleteTeamId] = useState<string | null>(null);
  const [runningQuery, setRunningQuery] = useState<{teamId: string, query: string} | null>(null);
  
  const handleCreateTeam = (team: Omit<OpenAIAgentTeam, 'id'>) => {
    const newTeam = onCreateTeam(team);
    if (newTeam) {
      setShowCreateForm(false);
    }
  };
  
  const handleUpdateTeam = (team: Partial<OpenAIAgentTeam>) => {
    if (editingTeamId) {
      const updated = onUpdateTeam(editingTeamId, team);
      if (updated) {
        setEditingTeamId(null);
      }
    }
  };
  
  const handleDeleteConfirm = () => {
    if (deleteTeamId) {
      onDeleteTeam(deleteTeamId);
      setDeleteTeamId(null);
    }
  };
  
  const handleRunTeam = async (teamId: string, query: string) => {
    await runTeam(teamId, query);
    setRunningQuery(null);
  };
  
  const editingTeam = editingTeamId 
    ? teams.find(t => t.id === editingTeamId) 
    : undefined;
  
  return (
    <div className="space-y-6">
      {!showCreateForm && !editingTeamId && (
        <div className="flex justify-end mb-4">
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nova Equipe
          </Button>
        </div>
      )}
      
      {showCreateForm && (
        <Card>
          <CardContent className="pt-6">
            <OpenAIAgentTeamForm 
              agents={agents}
              onSubmit={handleCreateTeam}
              onCancel={() => setShowCreateForm(false)}
            />
          </CardContent>
        </Card>
      )}
      
      {editingTeamId && editingTeam && (
        <Card>
          <CardContent className="pt-6">
            <OpenAIAgentTeamForm
              team={editingTeam}
              agents={agents}
              onSubmit={handleUpdateTeam}
              onCancel={() => setEditingTeamId(null)}
            />
          </CardContent>
        </Card>
      )}
      
      {!showCreateForm && !editingTeamId && (
        <div className="grid grid-cols-1 gap-4">
          {teams.length === 0 ? (
            <div className="p-8 text-center border rounded-md bg-muted/20">
              <p className="text-muted-foreground">Nenhuma equipe configurada. Crie sua primeira equipe para começar.</p>
            </div>
          ) : (
            teams.map(team => {
              const orchestrator = agents.find(a => a.id === team.orchestratorId);
              const assistants = team.assistantIds
                .map(id => agents.find(a => a.id === id))
                .filter(a => a !== undefined);
              const teamRuns = getTeamRuns(team.id) || [];
              
              return (
                <Card key={team.id} className="overflow-hidden">
                  <CardContent className="pt-6 pb-2">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/20 rounded-md">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-lg">{team.name}</h3>
                          <p className="text-sm text-muted-foreground">{team.description || 'Sem descrição'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Network className="h-4 w-4 text-primary" />
                          Orquestrador
                        </h4>
                        {orchestrator ? (
                          <div className="bg-muted/30 p-2 rounded-md">
                            <p className="font-medium text-sm">{orchestrator.name}</p>
                            <p className="text-xs text-muted-foreground">{orchestrator.model}</p>
                          </div>
                        ) : (
                          <div className="bg-amber-100 dark:bg-amber-950/30 p-2 rounded-md">
                            <p className="text-amber-800 dark:text-amber-300 text-sm">Nenhum orquestrador definido</p>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Assistentes ({assistants.length})</h4>
                        {assistants.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {assistants.map(assistant => (
                              <div key={assistant?.id} className="bg-muted/30 p-2 rounded-md">
                                <p className="font-medium text-sm">{assistant?.name}</p>
                                <p className="text-xs text-muted-foreground">{assistant?.role} • {assistant?.model}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-amber-100 dark:bg-amber-950/30 p-2 rounded-md">
                            <p className="text-amber-800 dark:text-amber-300 text-sm">Nenhum assistente adicionado</p>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Execuções recentes
                        </h4>
                        {teamRuns.length > 0 ? (
                          <div className="text-sm">
                            <p>{teamRuns.length} execução(ões) registrada(s)</p>
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            <p>Nenhuma execução registrada</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex flex-wrap items-center justify-between gap-2 border-t pt-2 pb-2">
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setEditingTeamId(team.id)}
                        className="flex items-center gap-1.5 text-xs"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Editar
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setDeleteTeamId(team.id)}
                        className="flex items-center gap-1.5 text-xs text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Excluir
                      </Button>
                    </div>
                    
                    <Popover
                      open={runningQuery?.teamId === team.id}
                      onOpenChange={(open) => {
                        if (!open) setRunningQuery(null);
                      }}
                    >
                      <PopoverTrigger asChild>
                        <Button 
                          size="sm"
                          disabled={!orchestrator || assistants.length === 0}
                          onClick={() => setRunningQuery({ teamId: team.id, query: '' })}
                          className="flex items-center gap-1.5 text-xs"
                        >
                          <Play className="h-3.5 w-3.5" />
                          Executar
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-4">
                        <div className="space-y-4">
                          <h4 className="text-sm font-medium">Executar equipe de agentes</h4>
                          <div className="space-y-2">
                            <label className="text-sm" htmlFor="query">Consulta:</label>
                            <Input
                              id="query"
                              value={runningQuery?.query || ''}
                              onChange={e => setRunningQuery({
                                teamId: runningQuery?.teamId || team.id,
                                query: e.target.value
                              })}
                              placeholder="Digite sua consulta..."
                              className="w-full"
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setRunningQuery(null)}
                            >
                              Cancelar
                            </Button>
                            <Button
                              size="sm"
                              disabled={!runningQuery?.query}
                              onClick={() => runningQuery?.query && handleRunTeam(team.id, runningQuery.query)}
                            >
                              Executar
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </CardFooter>
                </Card>
              );
            })
          )}
        </div>
      )}
      
      <AlertDialog open={deleteTeamId !== null} onOpenChange={() => setDeleteTeamId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir equipe</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta equipe? Esta ação não pode ser desfeita.
              {deleteTeamId && teams.find(t => t.id === deleteTeamId)?.name && (
                <p className="font-medium mt-2">
                  Equipe: {teams.find(t => t.id === deleteTeamId)?.name}
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OpenAIAgentTeamsList;
