
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAgent } from "@/contexts/AgentContext";
import { MCPTool } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash, Save } from "lucide-react";
import ToolDialog from "./ToolDialog";

const MCPSection: React.FC = () => {
  const { toast } = useToast();
  const {
    mcpConfig,
    updateMCPConfig,
    addMCPTool,
    removeMCPTool,
  } = useAgent();
  
  const [mcpServerUrl, setMcpServerUrl] = useState(mcpConfig.serverUrl);
  const [mcpApiKey, setMcpApiKey] = useState(mcpConfig.apiKey || "");
  const [toolDialogOpen, setToolDialogOpen] = useState(false);
  const [newTool, setNewTool] = useState<Partial<MCPTool>>({
    name: "",
    description: "",
    endpoint: "",
    authKey: "",
  });

  const handleUpdateMCPConfig = () => {
    updateMCPConfig({
      serverUrl: mcpServerUrl,
      apiKey: mcpApiKey,
    });
    
    toast({
      title: "Configuração atualizada",
      description: "As configurações do servidor MCP foram atualizadas com sucesso",
    });
  };

  const handleAddTool = () => {
    const tool: MCPTool = {
      id: uuidv4(),
      name: newTool.name || "Nova Ferramenta",
      description: newTool.description || "Descrição da ferramenta",
      endpoint: newTool.endpoint || "/api/tool",
      authKey: newTool.authKey,
    };
    
    addMCPTool(tool);
    setToolDialogOpen(false);
    setNewTool({
      name: "",
      description: "",
      endpoint: "",
      authKey: "",
    });
    
    toast({
      title: "Ferramenta adicionada",
      description: `${tool.name} foi adicionada com sucesso`,
    });
  };

  return (
    <>
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
                value={mcpServerUrl}
                onChange={(e) => setMcpServerUrl(e.target.value)}
                placeholder="https://seu-servidor-mcp.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mcpApiKey">Chave de API do MCP</Label>
              <Input
                id="mcpApiKey"
                type="password"
                value={mcpApiKey}
                onChange={(e) => setMcpApiKey(e.target.value)}
                placeholder="Chave de acesso ao servidor MCP"
              />
            </div>
            <Button className="inventu-btn" onClick={handleUpdateMCPConfig}>
              <Save className="mr-2 h-4 w-4" />
              Salvar Configuração
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Ferramentas MCP</h3>
          <Button className="inventu-btn" onClick={() => setToolDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Ferramenta
          </Button>
        </div>

        {mcpConfig.tools.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma ferramenta MCP configurada ainda. Adicione uma para começar.
          </div>
        ) : (
          <div className="space-y-4">
            {mcpConfig.tools.map((tool) => (
              <Card key={tool.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle>{tool.name}</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        removeMCPTool(tool.id);
                        toast({
                          title: "Ferramenta removida",
                          description: `${tool.name} foi removida com sucesso`,
                        });
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Endpoint:</span>
                      <span>{tool.endpoint}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Chave:</span>
                      <span>{tool.authKey ? "••••••••" : "Não configurada"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <ToolDialog
        open={toolDialogOpen}
        onOpenChange={setToolDialogOpen}
        tool={newTool}
        setTool={setNewTool}
        onSave={handleAddTool}
      />
    </>
  );
};

export default MCPSection;
