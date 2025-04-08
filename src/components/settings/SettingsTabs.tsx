
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCog, Layers, Code } from "lucide-react";
import ProfileTab from "./ProfileTab";
import PreferencesTab from "./PreferencesTab";
import IntegrationsTab from "./IntegrationsTab";

const SettingsTabs = () => {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="profile" className="flex items-center gap-2">
          <UserCog className="h-4 w-4" />
          Perfil
        </TabsTrigger>
        <TabsTrigger value="preferences" className="flex items-center gap-2">
          <Layers className="h-4 w-4" />
          Preferências
        </TabsTrigger>
        <TabsTrigger value="integrations" className="flex items-center gap-2">
          <Code className="h-4 w-4" />
          Integrações
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="space-y-6">
        <ProfileTab />
      </TabsContent>

      <TabsContent value="preferences" className="space-y-6">
        <PreferencesTab />
      </TabsContent>

      <TabsContent value="integrations" className="space-y-6">
        <IntegrationsTab />
      </TabsContent>
    </Tabs>
  );
};

export default SettingsTabs;
