
import React from "react";
import { Label } from "@/components/ui/label";
import { MCPTool } from "@/types";

interface ToolsSelectionProps {
  toolIds: string[];
  mcpTools: MCPTool[];
  onToolsChange: (toolIds: string[]) => void;
}

const ToolsSelection: React.FC<ToolsSelectionProps> = ({
  toolIds,
  mcpTools,
  onToolsChange
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="agentTools">Ferramentas MCP</Label>
      <div className="border rounded-md p-4">
        {mcpTools.length > 0 ? (
          mcpTools.map((tool) => (
            <div key={tool.id} className="flex items-center space-x-2 mb-2">
              <input
                type="checkbox"
                id={`tool-${tool.id}`}
                checked={toolIds?.includes(tool.id) || false}
                onChange={(e) => {
                  if (e.target.checked) {
                    onToolsChange([...(toolIds || []), tool.id]);
                  } else {
                    onToolsChange(toolIds?.filter(id => id !== tool.id) || []);
                  }
                }}
              />
              <Label htmlFor={`tool-${tool.id}`}>{tool.name}</Label>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            Nenhuma ferramenta MCP configurada. Adicione ferramentas na aba MCP.
          </p>
        )}
      </div>
    </div>
  );
};

export default ToolsSelection;
