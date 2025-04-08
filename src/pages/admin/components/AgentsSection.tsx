
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAgent } from "@/contexts/AgentContext";
import { Agent } from "@/types";
import { v4 as uuidv4 } from "uuid";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash } from "lucide-react";
import AgentDialog from "./AgentDialog";

const AgentsSection: React.FC = () => {
  const { toast } = useToast();
  const {
    models,
    mcpConfig,
    agents,
    addAgent,
    updateAgent,
    removeAgent,
  } = useAgent();
  
  // Dialog states
  const [agentDialogOpen, setAgentDialogOpen] = useState(false);
  const [editAgentDialogOpen, setEditAgentDialogOpen] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  
  // Form states
  const [newAgent, setNewAgent] = useState<Partial<Agent>>({
    name: "",
    description: "",
    modelId: "",
    configJson: "{\n  \"parameters\": {},\n  \"instructions\": \"\"\n}",
    toolIds: [],
  });

  const handleAddAgent = () => {
    const agent: Agent = {
      id: uuidv4(),
      name: newAgent.name || "",
      description: newAgent.description || "",
      modelId: newAgent.modelId || "",
      configJson: newAgent.configJson || "{}",
      toolIds: newAgent.toolIds || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    addAgent(agent);
    setAgentDialogOpen(false);
    setNewAgent({
      name: "",
      description: "",
      modelId: "",
      configJson: "{\n  \"parameters\": {},\n  \"instructions\": \"\"\n}",
      toolIds: [],
    });
    
    toast({
      title: "Agente adicionado",
      description: `${agent.name} foi adicionado com sucesso`,
    });
  };

  const handleUpdateAgent = () => {
    if (selectedAgentId) {
      updateAgent(selectedAgentId, {
        name: newAgent.name,
        description: newAgent.description,
        modelId: newAgent.modelId,
        configJson: newAgent.configJson,
        toolIds: newAgent.toolIds,
        updatedAt: new Date(),
      });
      
      setEditAgentDialogOpen(false);
      setSelectedAgentId(null);
      
      toast({
        title: "Agente atualizado",
        description: `${newAgent.name} foi atualizado com sucesso`,
      });
    }
  };

  const openEditAgentDialog = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (agent) {
      setSelectedAgentId(agentId);
      setNewAgent({
        name: agent.name,
        description: agent.description,
        modelId: agent.modelId,
        configJson: agent.configJson,
        toolIds: agent.toolIds,
      });
      setEditAgentDialogOpen(true);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Agentes Configurados</h2>
        <Button className="inventu-btn" onClick={() => setAgentDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Agente
        </Button>
      </div>

      {agents && agents.length > 0 ? (
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Ferramentas</TableHead>
                <TableHead>Última Atualização</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agents.map((agent) => {
                const modelName = models.find(m => m.id === agent.modelId)?.name || "Desconhecido";
                const toolNames = agent.toolIds
                  .map(toolId => mcpConfig.tools.find(t => t.id === toolId)?.name || "")
                  .filter(Boolean)
                  .join(", ");
                  
                return (
                  <TableRow key={agent.id}>
                    <TableCell className="font-medium">{agent.name}</TableCell>
                    <TableCell>{modelName}</TableCell>
                    <TableCell>
                      {toolNames || <span className="text-muted-foreground">Nenhuma</span>}
                    </TableCell>
                    <TableCell>{new Date(agent.updatedAt).toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openEditAgentDialog(agent.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            removeAgent(agent.id);
                            toast({
                              title: "Agente removido",
                              description: `${agent.name} foi removido com sucesso`,
                            });
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum agente configurado ainda. Adicione um para começar.
        </div>
      )}
      
      <AgentDialog
        open={agentDialogOpen}
        onOpenChange={setAgentDialogOpen}
        models={models}
        mcpTools={mcpConfig.tools}
        agent={newAgent}
        setAgent={setNewAgent}
        onSave={handleAddAgent}
        isEditing={false}
      />
      
      <AgentDialog
        open={editAgentDialogOpen}
        onOpenChange={setEditAgentDialogOpen}
        models={models}
        mcpTools={mcpConfig.tools}
        agent={newAgent}
        setAgent={setNewAgent}
        onSave={handleUpdateAgent}
        isEditing={true}
      />
    </>
  );
};

export default AgentsSection;
