
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MCPConfigCardProps {
  serverUrl: string;
  apiKey: string;
  setServerUrl: (url: string) => void;
  setApiKey: (key: string) => void;
  onSave: () => void;
}

const MCPConfigCard: React.FC<MCPConfigCardProps> = ({
  serverUrl,
  apiKey,
  setServerUrl,
  setApiKey,
  onSave,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuração do Servidor MCP</CardTitle>
        <CardDescription>
          Configure o servidor MCP para permitir que o agente utilize ferramentas externas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mcpServerUrl">URL do Servidor MCP</Label>
            <Input
              id="mcpServerUrl"
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
              placeholder="https://seu-servidor-mcp.com"
            />
            <p className="text-xs text-muted-foreground">
              Exemplo: https://server.smithery.ai/@seu-usuario/seu-servidor
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="mcpApiKey">Chave de API do MCP</Label>
            <Input
              id="mcpApiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Chave de acesso ao servidor MCP"
            />
            <p className="text-xs text-muted-foreground">
              A chave definida no arquivo smithery.yaml (campo apiKey)
            </p>
          </div>
          <Button className="inventu-btn" onClick={onSave}>
            <Save className="mr-2 h-4 w-4" />
            Salvar Configuração
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MCPConfigCard;
