
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { OpenAIAgentConfig, OpenAIAgentTeam } from "@/hooks/messaging/types/orchestrator-types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Network, Users, X, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface OpenAIAgentTeamFormProps {
  team?: OpenAIAgentTeam;
  agents: OpenAIAgentConfig[];
  onSubmit: (team: Omit<OpenAIAgentTeam, 'id'>) => void;
  onCancel: () => void;
}

const OpenAIAgentTeamForm: React.FC<OpenAIAgentTeamFormProps> = ({
  team,
  agents,
  onSubmit,
  onCancel
}) => {
  const [name, setName] = useState(team?.name || "");
  const [description, setDescription] = useState(team?.description || "");
  const [orchestratorId, setOrchestratorId] = useState(team?.orchestratorId || "");
  const [assistantIds, setAssistantIds] = useState<string[]>(team?.assistantIds || []);
  const [selectedAssistantId, setSelectedAssistantId] = useState<string>("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedTeam: Omit<OpenAIAgentTeam, 'id'> = {
      name,
      description,
      orchestratorId,
      assistantIds
    };
    
    onSubmit(updatedTeam);
  };
  
  const addAssistant = () => {
    if (selectedAssistantId && !assistantIds.includes(selectedAssistantId)) {
      setAssistantIds([...assistantIds, selectedAssistantId]);
      setSelectedAssistantId("");
    }
  };
  
  const removeAssistant = (id: string) => {
    setAssistantIds(assistantIds.filter(a => a !== id));
  };
  
  // Filtramos os agentes por função
  const orchestrators = agents.filter(a => a.role === 'orchestrator');
  const availableAssistants = agents.filter(a => 
    (a.role === 'specialist' || a.role === 'assistant') && 
    !assistantIds.includes(a.id)
  );
  const selectedAssistants = assistantIds
    .map(id => agents.find(a => a.id === id))
    .filter(a => a !== undefined);
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome da Equipe</Label>
          <Input
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            placeholder="Ex: Equipe de Análise de Dados"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Descreva brevemente o propósito desta equipe"
            rows={2}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <Network className="h-4 w-4 text-primary" />
            <Label htmlFor="orchestratorId">Agente Orquestrador</Label>
          </div>
          
          {orchestrators.length > 0 ? (
            <Select value={orchestratorId} onValueChange={setOrchestratorId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um orquestrador" />
              </SelectTrigger>
              <SelectContent>
                {orchestrators.map(orch => (
                  <SelectItem key={orch.id} value={orch.id}>
                    {orch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 p-3 rounded-md text-sm">
              Nenhum agente orquestrador disponível. Crie um agente com função de orquestrador primeiro.
            </div>
          )}
        </div>
        
        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-primary" />
            <Label>Assistentes da Equipe</Label>
          </div>
          
          <div className="flex gap-2">
            <Select value={selectedAssistantId} onValueChange={setSelectedAssistantId} disabled={availableAssistants.length === 0}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Selecione um assistente" />
              </SelectTrigger>
              <SelectContent>
                {availableAssistants.map(assistant => (
                  <SelectItem key={assistant.id} value={assistant.id}>
                    {assistant.name} ({assistant.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              type="button"
              onClick={addAssistant}
              disabled={!selectedAssistantId}
            >
              Adicionar
            </Button>
          </div>
          
          {availableAssistants.length === 0 && selectedAssistants.length === 0 && (
            <div className="bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 p-3 rounded-md text-sm">
              Nenhum agente assistente ou especialista disponível. Crie pelo menos um agente com função de assistente ou especialista.
            </div>
          )}
          
          {selectedAssistants.length > 0 && (
            <div className="border rounded-md mt-4 divide-y">
              {selectedAssistants.map(assistant => (
                <div key={assistant?.id} className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{assistant?.name}</p>
                        <Badge variant={assistant?.role === 'specialist' ? 'secondary' : 'outline'}>
                          {assistant?.role === 'specialist' ? 'Especialista' : 'Assistente'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{assistant?.model}</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => assistant && removeAssistant(assistant.id)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remover</span>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          type="submit" 
          className="flex items-center gap-2"
          disabled={!orchestratorId || assistantIds.length === 0}
        >
          <Save className="h-4 w-4" />
          {team ? 'Atualizar' : 'Criar'} Equipe
        </Button>
      </div>
    </form>
  );
};

export default OpenAIAgentTeamForm;
