
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileTab from "./ProfileTab";
import OrchestratorTab from "./OrchestratorTab";
import ModelsTab from "./ModelsTab";
import ToolsTab from "./ToolsTab";
import AgentsTab from "./AgentsTab";
import MCPTab from "./MCPTab";
import ApiConfigTab from "./ApiConfigTab";

const SettingsTabs = () => {
  return (
    <Tabs defaultValue="profile" className="space-y-6">
      <TabsList>
        <TabsTrigger value="profile">Perfil</TabsTrigger>
        <TabsTrigger value="orchestrator">Orquestrador</TabsTrigger>
        <TabsTrigger value="models">Modelos</TabsTrigger>
        <TabsTrigger value="tools">Ferramentas</TabsTrigger>
        <TabsTrigger value="agents">Agentes</TabsTrigger>
        <TabsTrigger value="mcp">MCP</TabsTrigger>
        <TabsTrigger value="api">API</TabsTrigger>
      </TabsList>
      
      <TabsContent value="profile">
        <ProfileTab />
      </TabsContent>
      
      <TabsContent value="orchestrator">
        <OrchestratorTab />
      </TabsContent>
      
      <TabsContent value="models">
        <ModelsTab />
      </TabsContent>
      
      <TabsContent value="tools">
        <ToolsTab />
      </TabsContent>
      
      <TabsContent value="agents">
        <AgentsTab />
      </TabsContent>
      
      <TabsContent value="mcp">
        <MCPTab />
      </TabsContent>
      
      <TabsContent value="api">
        <ApiConfigTab />
      </TabsContent>
    </Tabs>
  );
};

export default SettingsTabs;
