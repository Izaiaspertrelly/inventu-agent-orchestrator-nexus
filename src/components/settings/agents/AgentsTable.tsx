
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { Agent, AIModel, MCPTool } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";

interface AgentsTableProps {
  agents: Agent[];
  models: AIModel[];
  mcpTools: MCPTool[];
  onEdit: (agentId: string) => void;
  onDelete: (agentId: string) => void;
}

const AgentsTable: React.FC<AgentsTableProps> = ({
  agents,
  models,
  mcpTools,
  onEdit,
  onDelete,
}) => {
  const { toast } = useToast();

  if (!agents || agents.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum agente configurado ainda. Adicione um para começar.
      </div>
    );
  }

  return (
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
            .map(toolId => mcpTools.find(t => t.id === toolId)?.name || "")
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
                    onClick={() => onEdit(agent.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      onDelete(agent.id);
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
  );
};

export default AgentsTable;
