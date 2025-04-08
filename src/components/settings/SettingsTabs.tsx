
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  UserCog, 
  Layers, 
  Code, 
  SlidersHorizontal, 
  Menu 
} from "lucide-react";
import ProfileTab from "./ProfileTab";
import OrchestratorTab from "./OrchestratorTab";
import ModelsTab from "./ModelsTab";
import ToolsTab from "./ToolsTab";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const SettingsTabs = () => {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <div className="flex items-center justify-between mb-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onSelect={() => document.querySelector('[data-radix-tabs-trigger="profile"]')?.click()}>
              <UserCog className="mr-2 h-4 w-4" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => document.querySelector('[data-radix-tabs-trigger="orchestrator"]')?.click()}>
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Orquestrador
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => document.querySelector('[data-radix-tabs-trigger="models"]')?.click()}>
              <Layers className="mr-2 h-4 w-4" />
              Modelos
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => document.querySelector('[data-radix-tabs-trigger="tools"]')?.click()}>
              <Code className="mr-2 h-4 w-4" />
              Ferramentas
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <TabsList className="ml-4">
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
      </div>

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
