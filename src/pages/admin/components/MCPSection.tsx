
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAgent } from "@/contexts/AgentContext";
import { MCPTool } from "@/types";
import { v4 as uuidv4 } from "uuid";
import MCPConfigCard from "@/components/settings/mcp/MCPConfigCard";
import MCPToolsList from "@/components/settings/mcp/MCPToolsList";
import MCPToolDialog from "@/components/settings/mcp/MCPToolDialog";

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
  const [isEditing, setIsEditing] = useState(false);
  
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
    
    if (isEditing && newTool.id) {
      // Update existing tool
      const updatedTool: MCPTool = {
        id: newTool.id,
        name: newTool.name || "Nova Ferramenta",
        description: newTool.description || "Descrição da ferramenta",
        endpoint: newTool.endpoint || "/api/tool",
        method: newTool.method as "GET" | "POST" | "PUT" | "DELETE" || "GET",
        parameters: newTool.parameters || "",
        authKey: newTool.authKey,
      };
      
      // First remove the old one
      removeMCPTool(updatedTool.id);
      // Then add the updated one
      addMCPTool(updatedTool);
      
      toast({
        title: "Ferramenta atualizada",
        description: `${updatedTool.name} foi atualizada com sucesso`,
      });
    } else {
      // Add new tool
      const tool: MCPTool = {
        id: uuidv4(),
        name: newTool.name || "Nova Ferramenta",
        description: newTool.description || "Descrição da ferramenta",
        endpoint: newTool.endpoint || "/api/tool",
        method: newTool.method as "GET" | "POST" | "PUT" | "DELETE" || "GET",
        parameters: newTool.parameters || "",
        authKey: newTool.authKey,
      };
      
      addMCPTool(tool);
      
      toast({
        title: "Ferramenta adicionada",
        description: `${tool.name} foi adicionada com sucesso`,
      });
    }
    
    setToolDialogOpen(false);
    setIsEditing(false);
    setNewTool({
      name: "",
      description: "",
      endpoint: "",
      method: "GET",
      parameters: "",
      authKey: "",
    });
  };

  const handleDeleteTool = (id: string) => {
    removeMCPTool(id);
    toast({
      title: "Ferramenta removida",
      description: "A ferramenta foi removida com sucesso",
    });
  };

  const handleEditTool = (tool: MCPTool) => {
    setIsEditing(true);
    setNewTool({ ...tool });
    setToolDialogOpen(true);
  };

  return (
    <>
      <MCPConfigCard
        serverUrl={mcpServerUrl}
        apiKey={mcpApiKey}
        setServerUrl={setMcpServerUrl}
        setApiKey={setMcpApiKey}
        onSave={handleUpdateMCPConfig}
      />
      
      <div className="pt-6">
        <MCPToolsList
          tools={mcpConfig.tools}
          toolDialogOpen={toolDialogOpen}
          setToolDialogOpen={setToolDialogOpen}
          newTool={newTool}
          setNewTool={setNewTool}
          onAddTool={handleAddTool}
          onDeleteTool={handleDeleteTool}
          onEditTool={handleEditTool}
        />
      </div>
    </>
  );
};

export default MCPSection;
