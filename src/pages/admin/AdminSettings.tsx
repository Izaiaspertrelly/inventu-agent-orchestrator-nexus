
import React, { useState } from "react";
import AdminSystemSettings from "@/components/admin/AdminSystemSettings";
import SettingsLayout from "@/components/layouts/SettingsLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import OpenAIMultiAgentPanel from "./components/openai/OpenAIMultiAgentPanel";
import OrchestratorSection from "./components/OrchestratorSection";
import { Bot, Brain } from "lucide-react";

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("system");
  
  return (
    <SettingsLayout>
      <div className="container max-w-6xl py-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Admin Settings</CardTitle>
            <CardDescription>
              Configure system settings, agents, and integrations
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="orchestrator" className="flex items-center justify-center gap-1.5">
              <Brain className="h-4 w-4" />
              Neural Orchestrator
            </TabsTrigger>
            <TabsTrigger value="openai" className="flex items-center justify-center gap-1.5">
              <Bot className="h-4 w-4" />
              OpenAI Multi-Agent
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="system" className="pt-4">
            <AdminSystemSettings />
          </TabsContent>
          
          <TabsContent value="orchestrator" className="pt-4">
            <OrchestratorSection />
          </TabsContent>
          
          <TabsContent value="openai" className="pt-4">
            <OpenAIMultiAgentPanel />
          </TabsContent>
        </Tabs>
      </div>
    </SettingsLayout>
  );
};

export default AdminSettings;
