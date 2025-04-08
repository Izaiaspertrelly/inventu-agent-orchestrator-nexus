
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, UserCog, Layers, Code } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AgentsSection from "./components/AgentsSection";
import ModelsSection from "./components/ModelsSection";
import MCPSection from "./components/MCPSection";

const AdminSettings = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Configurações do Administrador</h1>
        </div>
      </div>

      <Tabs defaultValue="agents" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="agents" className="flex items-center gap-2">
            <UserCog className="h-4 w-4" />
            Agentes
          </TabsTrigger>
          <TabsTrigger value="models" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Modelos de IA
          </TabsTrigger>
          <TabsTrigger value="mcp" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Servidor MCP
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-6">
          <AgentsSection />
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          <ModelsSection />
        </TabsContent>

        <TabsContent value="mcp" className="space-y-6">
          <MCPSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
