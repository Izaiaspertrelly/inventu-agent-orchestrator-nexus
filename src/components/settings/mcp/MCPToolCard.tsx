
import React from "react";
import { Trash } from "lucide-react";
import { MCPTool } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface MCPToolCardProps {
  tool: MCPTool;
  onDelete: (id: string) => void;
}

const MCPToolCard: React.FC<MCPToolCardProps> = ({ tool, onDelete }) => {
  return (
    <Card key={tool.id}>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle>{tool.name}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(tool.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>{tool.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Método:</span>
            <span>{tool.method}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Endpoint:</span>
            <span>{tool.endpoint}</span>
          </div>
          {tool.parameters && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Parâmetros:</span>
              <span className="truncate max-w-[200px]">{tool.parameters}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Chave:</span>
            <span>{tool.authKey ? "••••••••" : "Não configurada"}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MCPToolCard;
