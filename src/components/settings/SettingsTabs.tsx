
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCog, Layers, Code, SlidersHorizontal } from "lucide-react";
import ProfileTab from "./ProfileTab";
import OrchestratorTab from "./OrchestratorTab";
import ModelsTab from "./ModelsTab";
import ToolsTab from "./ToolsTab";

const SettingsTabs = () => {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="profile" className="flex items-center gap-2">
          <UserCog className="h-4 w-4" />
          Perfil
        </TabsTrigger>
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
      </TabsList>

      <TabsContent value="profile" className="space-y-6">
        <ProfileTab />
      </TabsContent>

      <TabsContent value="orchestrator" className="space-y-6">
        <OrchestratorTab />
      </TabsContent>

      <TabsContent value="models" className="space-y-6">
        <ModelsTab />
      </TabsContent>

      <TabsContent value="tools" className="space-y-6">
        <ToolsTab />
      </TabsContent>
    </Tabs>
  );
};

export default SettingsTabs;
