
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAgent } from "@/contexts/AgentContext";
import { MCPTool } from "@/types";
import { v4 as uuidv4 } from "uuid";
import MCPConfigCard from "./mcp/MCPConfigCard";
import MCPToolsList from "./mcp/MCPToolsList";

const MCPTab = () => {
  const { toast } = useToast();
  const { mcpConfig, updateMCPConfig, addMCPTool, removeMCPTool } = useAgent();
  
  const [mcpServerUrl, setMcpServerUrl] = useState(mcpConfig.serverUrl);
  const [mcpApiKey, setMcpApiKey] = useState(mcpConfig.apiKey || "");
  
  const [toolDialogOpen, setToolDialogOpen] = useState(false);
  
  const [newTool, setNewTool] = useState<Partial<MCPTool>>({
    name: "",
    description: "",
    endpoint: "",
    method: "GET",
    parameters: "",
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
    if (!newTool.name || !newTool.endpoint) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e endpoint são obrigatórios",
        variant: "destructive",
      });
      return;
    }
    
    const tool: MCPTool = {
      id: uuidv4(),
      name: newTool.name || "Nova Ferramenta",
      description: newTool.description || "Descrição da ferramenta",
      endpoint: newTool.endpoint || "/api/tool",
      method: (newTool.method as "GET" | "POST" | "PUT" | "DELETE") || "GET",
      parameters: newTool.parameters || "",
      authKey: newTool.authKey,
    };
    
    addMCPTool(tool);
    setToolDialogOpen(false);
    setNewTool({
      name: "",
      description: "",
      endpoint: "",
      method: "GET",
      parameters: "",
      authKey: "",
    });
    
    toast({
      title: "Ferramenta adicionada",
      description: `${tool.name} foi adicionada com sucesso`,
    });
  };

  const handleDeleteTool = (id: string) => {
    removeMCPTool(id);
    toast({
      title: "Ferramenta removida",
      description: "A ferramenta foi removida com sucesso",
    });
  };

  return (
    <div className="space-y-6">
      <MCPConfigCard
        serverUrl={mcpServerUrl}
        apiKey={mcpApiKey}
        setServerUrl={setMcpServerUrl}
        setApiKey={setMcpApiKey}
        onSave={handleUpdateMCPConfig}
      />
      
      <MCPToolsList
        tools={mcpConfig.tools}
        toolDialogOpen={toolDialogOpen}
        setToolDialogOpen={setToolDialogOpen}
        newTool={newTool}
        setNewTool={setNewTool}
        onAddTool={handleAddTool}
        onDeleteTool={handleDeleteTool}
      />
    </div>
  );
};

export default MCPTab;
