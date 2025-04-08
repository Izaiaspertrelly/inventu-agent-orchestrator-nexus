
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layers, Code, SlidersHorizontal, Database, UserCog } from "lucide-react";
import OrchestratorTab from "./OrchestratorTab";
import ModelsTab from "./ModelsTab";
import ToolsTab from "./ToolsTab";
import AgentsTab from "./AgentsTab";
import MCPTab from "./MCPTab";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const SettingsTabs = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  
  return (
    <Tabs defaultValue="orchestrator" className="w-full">
      <div className="flex items-center justify-between mb-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="lg:hidden">Selecionar Configuração</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onSelect={() => (document.querySelector('[data-radix-tabs-trigger="orchestrator"]') as HTMLElement)?.click()}>
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Orquestrador
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => (document.querySelector('[data-radix-tabs-trigger="models"]') as HTMLElement)?.click()}>
              <Layers className="mr-2 h-4 w-4" />
              Modelos
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => (document.querySelector('[data-radix-tabs-trigger="tools"]') as HTMLElement)?.click()}>
              <Code className="mr-2 h-4 w-4" />
              Ferramentas
            </DropdownMenuItem>
            {isAdmin && (
              <>
                <DropdownMenuItem onSelect={() => (document.querySelector('[data-radix-tabs-trigger="agents"]') as HTMLElement)?.click()}>
                  <UserCog className="mr-2 h-4 w-4" />
                  Agentes
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => (document.querySelector('[data-radix-tabs-trigger="mcp"]') as HTMLElement)?.click()}>
                  <Database className="mr-2 h-4 w-4" />
                  Servidor MCP
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <TabsList className="hidden lg:flex">
          <TabsTrigger value="orchestrator" className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Orquestrador
          </TabsTrigger>
          <TabsTrigger value="models" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Modelos
          </TabsTrigger>
          <TabsTrigger value="tools" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Ferramentas
          </TabsTrigger>
          {isAdmin && (
            <>
              <TabsTrigger value="agents" className="flex items-center gap-2">
                <UserCog className="h-4 w-4" />
                Agentes
              </TabsTrigger>
              <TabsTrigger value="mcp" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Servidor MCP
              </TabsTrigger>
            </>
          )}
        </TabsList>
      </div>

      <TabsContent value="orchestrator" className="space-y-6">
        <OrchestratorTab />
      </TabsContent>

      <TabsContent value="models" className="space-y-6">
        <ModelsTab />
      </TabsContent>

      <TabsContent value="tools" className="space-y-6">
        <ToolsTab />
      </TabsContent>
      
      {isAdmin && (
        <>
          <TabsContent value="agents" className="space-y-6">
            <AgentsTab />
          </TabsContent>
          <TabsContent value="mcp" className="space-y-6">
            <MCPTab />
          </TabsContent>
        </>
      )}
    </Tabs>
  );
};

export default SettingsTabs;
