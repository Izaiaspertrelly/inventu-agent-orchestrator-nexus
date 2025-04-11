
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { OpenAIAgentConfig } from "@/hooks/messaging/types/orchestrator-types";
import { Plus, Pencil, Trash2, Bot, Network, Code } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import OpenAIAgentForm from "./OpenAIAgentForm";

interface OpenAIAgentsListProps {
  agents: OpenAIAgentConfig[];
  onCreateAgent: (agent: Omit<OpenAIAgentConfig, 'id'>) => OpenAIAgentConfig | null;
  onUpdateAgent: (id: string, agent: Partial<OpenAIAgentConfig>) => OpenAIAgentConfig | null;
  onDeleteAgent: (id: string) => boolean;
}

const OpenAIAgentsList: React.FC<OpenAIAgentsListProps> = ({
  agents,
  onCreateAgent,
  onUpdateAgent,
  onDeleteAgent
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAgentId, setEditingAgentId] = useState<string | null>(null);
  const [deleteAgentId, setDeleteAgentId] = useState<string | null>(null);
  
  const handleCreateAgent = (agent: Omit<OpenAIAgentConfig, 'id'>) => {
    const newAgent = onCreateAgent(agent);
    if (newAgent) {
      setShowCreateForm(false);
    }
  };
  
  const handleUpdateAgent = (agent: Partial<OpenAIAgentConfig>) => {
    if (editingAgentId) {
      const updated = onUpdateAgent(editingAgentId, agent);
      if (updated) {
        setEditingAgentId(null);
      }
    }
  };
  
  const handleDeleteConfirm = () => {
    if (deleteAgentId) {
      onDeleteAgent(deleteAgentId);
      setDeleteAgentId(null);
    }
  };
  
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'orchestrator':
        return <Network className="h-4 w-4 text-primary" />;
      case 'specialist':
        return <Code className="h-4 w-4 text-amber-500" />;
      case 'assistant':
      default:
        return <Bot className="h-4 w-4 text-green-500" />;
    }
  };
  
  const getRoleBadgeVariant = (role: string): "default" | "secondary" | "outline" | "destructive" => {
    switch (role) {
      case 'orchestrator':
        return 'default';
      case 'specialist':
        return 'secondary';
      case 'assistant':
      default:
        return 'outline';
    }
  };
  
  const editingAgent = editingAgentId 
    ? agents.find(a => a.id === editingAgentId) 
    : undefined;
  
  return (
    <div className="space-y-6">
      {!showCreateForm && !editingAgentId && (
        <div className="flex justify-end mb-4">
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Novo Agente
          </Button>
        </div>
      )}
      
      {showCreateForm && (
        <Card>
          <CardContent className="pt-6">
            <OpenAIAgentForm 
              onSubmit={handleCreateAgent}
              onCancel={() => setShowCreateForm(false)}
            />
          </CardContent>
        </Card>
      )}
      
      {editingAgentId && editingAgent && (
        <Card>
          <CardContent className="pt-6">
            <OpenAIAgentForm
              agent={editingAgent}
              onSubmit={handleUpdateAgent}
              onCancel={() => setEditingAgentId(null)}
            />
          </CardContent>
        </Card>
      )}
      
      {!showCreateForm && !editingAgentId && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agents.length === 0 ? (
            <div className="col-span-full p-8 text-center border rounded-md bg-muted/20">
              <p className="text-muted-foreground">Nenhum agente configurado. Crie seu primeiro agente para começar.</p>
            </div>
          ) : (
            agents.map(agent => (
              <Card key={agent.id} className="overflow-hidden">
                <CardContent className="pt-6 pb-2">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-2">
                      <div className={`p-2 rounded-md ${
                        agent.role === 'orchestrator' ? 'bg-primary/20' : 
                        agent.role === 'specialist' ? 'bg-amber-500/20' :
                        'bg-green-500/20'
                      }`}>
                        {getRoleIcon(agent.role)}
                      </div>
                      <div>
                        <h3 className="font-medium">{agent.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">{agent.description || 'Sem descrição'}</p>
                      </div>
                    </div>
                    <Badge variant={getRoleBadgeVariant(agent.role)}>
                      {agent.role === 'orchestrator' ? 'Orquestrador' : 
                       agent.role === 'specialist' ? 'Especialista' : 
                       'Assistente'}
                    </Badge>
                  </div>
                  
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Modelo:</span>
                      <span className="font-mono">{agent.model}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ferramentas:</span>
                      <span>{agent.tools?.length || 0}</span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between border-t pt-2 pb-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setEditingAgentId(agent.id)}
                    className="flex items-center gap-1.5 text-xs"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Editar
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setDeleteAgentId(agent.id)}
                    className="flex items-center gap-1.5 text-xs text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Excluir
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      )}
      
      <AlertDialog open={deleteAgentId !== null} onOpenChange={() => setDeleteAgentId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir agente</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este agente? Esta ação não pode ser desfeita.
              {deleteAgentId && agents.find(a => a.id === deleteAgentId)?.name && (
                <p className="font-medium mt-2">
                  Agente: {agents.find(a => a.id === deleteAgentId)?.name}
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

export default OpenAIAgentsList;
