
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { OpenAIAgentConfig, OpenAIAgentTool } from "@/hooks/messaging/types/orchestrator-types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, X, Wrench, Save } from "lucide-react";

interface OpenAIAgentFormProps {
  agent?: OpenAIAgentConfig;
  onSubmit: (agent: Omit<OpenAIAgentConfig, 'id'>) => void;
  onCancel: () => void;
}

const OpenAIAgentForm: React.FC<OpenAIAgentFormProps> = ({
  agent,
  onSubmit,
  onCancel
}) => {
  const [name, setName] = useState(agent?.name || "");
  const [description, setDescription] = useState(agent?.description || "");
  const [instructions, setInstructions] = useState(agent?.instructions || "");
  const [model, setModel] = useState(agent?.model || "gpt-4o");
  const [role, setRole] = useState<OpenAIAgentConfig['role']>(agent?.role || 'assistant');
  const [tools, setTools] = useState<OpenAIAgentTool[]>(agent?.tools || []);
  const [showToolForm, setShowToolForm] = useState(false);
  const [newTool, setNewTool] = useState<Partial<OpenAIAgentTool>>({
    id: crypto.randomUUID(),
    name: '',
    description: '',
    type: 'function',
    parameters: {}
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedAgent: Omit<OpenAIAgentConfig, 'id'> = {
      name,
      description,
      instructions,
      model,
      role,
      tools
    };
    
    onSubmit(updatedAgent);
  };
  
  const addTool = () => {
    if (newTool.name) {
      setTools([...tools, newTool as OpenAIAgentTool]);
      setNewTool({
        id: crypto.randomUUID(),
        name: '',
        description: '',
        type: 'function',
        parameters: {}
      });
      setShowToolForm(false);
    }
  };
  
  const removeTool = (id: string) => {
    setTools(tools.filter(t => t.id !== id));
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Agente</Label>
            <Input
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="Ex: Assistente de Pesquisa"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Função</Label>
            <Select value={role} onValueChange={value => setRole(value as OpenAIAgentConfig['role'])}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="orchestrator">Orquestrador</SelectItem>
                <SelectItem value="specialist">Especialista</SelectItem>
                <SelectItem value="assistant">Assistente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Descreva brevemente o propósito deste agente"
            rows={2}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="instructions">Instruções</Label>
          <Textarea
            id="instructions"
            value={instructions}
            onChange={e => setInstructions(e.target.value)}
            placeholder="Instruções detalhadas para o agente seguir"
            rows={4}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="model">Modelo</Label>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o modelo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4o">GPT-4o</SelectItem>
              <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
              <SelectItem value="gpt-4.5-preview">GPT-4.5 Preview</SelectItem>
              <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
              <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Ferramentas ({tools.length})</Label>
            {!showToolForm && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowToolForm(true)}
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Adicionar ferramenta
              </Button>
            )}
          </div>
          
          {showToolForm && (
            <div className="border rounded-md p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="toolName">Nome da Ferramenta</Label>
                  <Input
                    id="toolName"
                    value={newTool.name}
                    onChange={e => setNewTool({...newTool, name: e.target.value})}
                    placeholder="Ex: search_database"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="toolType">Tipo</Label>
                  <Select 
                    value={newTool.type} 
                    onValueChange={value => setNewTool({...newTool, type: value as OpenAIAgentTool['type']})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="function">Função</SelectItem>
                      <SelectItem value="retrieval">Recuperação</SelectItem>
                      <SelectItem value="code_interpreter">Interpretador de código</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="toolDescription">Descrição</Label>
                <Textarea
                  id="toolDescription"
                  value={newTool.description}
                  onChange={e => setNewTool({...newTool, description: e.target.value})}
                  placeholder="Descreva o que a ferramenta faz"
                  rows={2}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowToolForm(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={addTool}
                  disabled={!newTool.name}
                >
                  Adicionar
                </Button>
              </div>
            </div>
          )}
          
          {tools.length > 0 ? (
            <div className="border rounded-md divide-y">
              {tools.map(tool => (
                <div key={tool.id} className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{tool.name}</p>
                      <p className="text-xs text-muted-foreground">{tool.type}</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTool(tool.id)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remover</span>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center border rounded-md p-4 text-muted-foreground">
              Nenhuma ferramenta adicionada
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          {agent ? 'Atualizar' : 'Criar'} Agente
        </Button>
      </div>
    </form>
  );
};

export default OpenAIAgentForm;
