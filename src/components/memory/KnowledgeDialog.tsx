
import React, { useState } from "react";
import { X, Plus, Trash2, Pencil, Database, Check } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useAgent } from "@/contexts/AgentContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface KnowledgeItem {
  id: string;
  name: string;
  content: string;
  createdAt: Date;
  enabled: boolean;
}

interface KnowledgeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const KnowledgeDialog: React.FC<KnowledgeDialogProps> = ({ open, onOpenChange }) => {
  const { orchestratorState, updateOrchestratorState } = useAgent();
  const [editingItem, setEditingItem] = useState<KnowledgeItem | null>(null);
  const [newItemName, setNewItemName] = useState("");
  const [newItemContent, setNewItemContent] = useState("");
  
  const knowledgeItems: KnowledgeItem[] = orchestratorState?.knowledge?.items || [];
  
  const formatDate = (date: Date): string => {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ptBR });
  };
  
  const handleAddItem = () => {
    if (!newItemName.trim() || !newItemContent.trim()) return;
    
    const newItem: KnowledgeItem = {
      id: `knowledge-${Date.now()}`,
      name: newItemName,
      content: newItemContent,
      createdAt: new Date(),
      enabled: true
    };
    
    const updatedItems = [...knowledgeItems, newItem];
    
    updateOrchestratorState({
      ...orchestratorState,
      knowledge: {
        ...orchestratorState.knowledge,
        items: updatedItems
      }
    });
    
    setNewItemName("");
    setNewItemContent("");
  };
  
  const handleDeleteItem = (id: string) => {
    const updatedItems = knowledgeItems.filter(item => item.id !== id);
    
    updateOrchestratorState({
      ...orchestratorState,
      knowledge: {
        ...orchestratorState.knowledge,
        items: updatedItems
      }
    });
  };
  
  const handleToggleItem = (id: string, enabled: boolean) => {
    const updatedItems = knowledgeItems.map(item => 
      item.id === id ? { ...item, enabled } : item
    );
    
    updateOrchestratorState({
      ...orchestratorState,
      knowledge: {
        ...orchestratorState.knowledge,
        items: updatedItems
      }
    });
  };
  
  const handleSaveEdit = () => {
    if (!editingItem) return;
    
    const updatedItems = knowledgeItems.map(item => 
      item.id === editingItem.id ? editingItem : item
    );
    
    updateOrchestratorState({
      ...orchestratorState,
      knowledge: {
        ...orchestratorState.knowledge,
        items: updatedItems
      }
    });
    
    setEditingItem(null);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Conhecimento
          </DialogTitle>
          <DialogDescription>
            O conhecimento permite que o sistema aprenda suas preferências e práticas recomendadas específicas para cada tarefa. 
            Ele irá lembrar automaticamente do conhecimento relevante quando necessário. 
            Suporta até 20 itens de conhecimento.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 flex justify-end">
          <Button 
            variant="default" 
            className="gap-2"
            onClick={() => {
              setEditingItem({
                id: `knowledge-${Date.now()}`,
                name: "",
                content: "",
                createdAt: new Date(),
                enabled: true
              });
            }}
          >
            <Plus className="h-4 w-4" /> Adicionar conhecimento
          </Button>
        </div>
        
        {editingItem ? (
          <div className="bg-card p-4 rounded-lg border">
            <h3 className="text-lg font-medium mb-2">
              {editingItem.id.includes("knowledge-") && !editingItem.name ? "Novo conhecimento" : "Editar conhecimento"}
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="text-sm font-medium">Nome</label>
                <Input 
                  id="name"
                  value={editingItem.name} 
                  onChange={e => setEditingItem({...editingItem, name: e.target.value})}
                  placeholder="Nome do conhecimento" 
                />
              </div>
              <div>
                <label htmlFor="content" className="text-sm font-medium">Conteúdo</label>
                <Textarea 
                  id="content"
                  value={editingItem.content} 
                  onChange={e => setEditingItem({...editingItem, content: e.target.value})}
                  placeholder="Detalhes do conhecimento" 
                  className="min-h-[150px]"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingItem(null)}>Cancelar</Button>
                <Button onClick={handleSaveEdit}>Salvar</Button>
              </div>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-2 text-muted-foreground text-sm px-2 py-1 font-medium">
                <div className="col-span-3">Nome</div>
                <div className="col-span-6">Conteúdo</div>
                <div className="col-span-1 text-center">Criado em</div>
                <div className="col-span-1 text-center">Status</div>
                <div className="col-span-1 text-center">Ações</div>
              </div>
              
              {knowledgeItems.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum conhecimento foi adicionado ainda.
                </div>
              )}
              
              {knowledgeItems.map(item => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-card p-3 rounded-lg border">
                  <div className="col-span-3 font-medium">{item.name}</div>
                  <div className="col-span-6 text-sm text-muted-foreground line-clamp-2">{item.content}</div>
                  <div className="col-span-1 text-xs text-center">{formatDate(item.createdAt)}</div>
                  <div className="col-span-1 flex justify-center">
                    <Switch 
                      checked={item.enabled} 
                      onCheckedChange={(checked) => handleToggleItem(item.id, checked)}
                    />
                  </div>
                  <div className="col-span-1 flex justify-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setEditingItem(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default KnowledgeDialog;
