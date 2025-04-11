
import React, { useState } from "react";
import { useOpenAIAgents } from "@/hooks/use-openai-agents";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Users, Loader2 } from "lucide-react";
import { OpenAIAgentConfig, OpenAIAgentTeam } from "@/hooks/messaging/types/orchestrator-types";
import OpenAIAgentsList from "./agents/OpenAIAgentsList";
import OpenAIAgentTeamsList from "./agents/OpenAIAgentTeamsList";

const OpenAIAgentsConfig: React.FC = () => {
  const { 
    agents, 
    teams, 
    isLoading, 
    createAgent, 
    updateAgent, 
    deleteAgent,
    createTeam,
    updateTeam,
    deleteTeam 
  } = useOpenAIAgents();
  
  const [activeTab, setActiveTab] = useState("agents");
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="agents" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Agentes
          </TabsTrigger>
          <TabsTrigger value="teams" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Equipes
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="agents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configuração de Agentes OpenAI</CardTitle>
            </CardHeader>
            <CardContent>
              <OpenAIAgentsList 
                agents={agents}
                onCreateAgent={createAgent}
                onUpdateAgent={updateAgent}
                onDeleteAgent={deleteAgent}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="teams" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Equipes de Agentes OpenAI</CardTitle>
            </CardHeader>
            <CardContent>
              <OpenAIAgentTeamsList
                teams={teams}
                agents={agents}
                onCreateTeam={createTeam}
                onUpdateTeam={updateTeam}
                onDeleteTeam={deleteTeam}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OpenAIAgentsConfig;
