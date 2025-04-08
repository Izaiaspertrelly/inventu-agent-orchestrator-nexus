
import React from "react";
import { MCPTool } from "@/types";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import MCPToolCard from "./MCPToolCard";
import MCPToolDialog from "./MCPToolDialog";

interface MCPToolsListProps {
  tools: MCPTool[];
  toolDialogOpen: boolean;
  setToolDialogOpen: (open: boolean) => void;
  newTool: Partial<MCPTool>;
  setNewTool: React.Dispatch<React.SetStateAction<Partial<MCPTool>>>;
  onAddTool: () => void;
  onDeleteTool: (id: string) => void;
}

const MCPToolsList: React.FC<MCPToolsListProps> = ({
  tools,
  toolDialogOpen,
  setToolDialogOpen,
  newTool,
  setNewTool,
  onAddTool,
  onDeleteTool,
}) => {
  return (
    <div className="pt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Ferramentas MCP</h3>
        <MCPToolDialog
          open={toolDialogOpen}
          onOpenChange={setToolDialogOpen}
          newTool={newTool}
          setNewTool={setNewTool}
          onAddTool={onAddTool}
        >
          <Button className="inventu-btn">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Ferramenta
          </Button>
        </MCPToolDialog>
      </div>

      {tools.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Nenhuma ferramenta MCP configurada ainda. Adicione uma para começar.
        </div>
      ) : (
        <div className="space-y-4">
          {tools.map((tool) => (
            <MCPToolCard 
              key={tool.id} 
              tool={tool} 
              onDelete={onDeleteTool} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MCPToolsList;
