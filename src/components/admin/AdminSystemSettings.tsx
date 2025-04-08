
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrchestratorTab from "../settings/OrchestratorTab";
import ModelsTab from "../settings/ModelsTab";
import ToolsTab from "../settings/ToolsTab";
import AgentsTab from "../settings/AgentsTab";
import MCPTab from "../settings/MCPTab";
import ApiConfigTab from "../settings/ApiConfigTab";
import { Database, Code, Tool, Users, BarChart, Server } from "lucide-react";

interface SettingModuleProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  active: boolean;
}

const SettingModule: React.FC<SettingModuleProps> = ({
  title,
  description,
  icon,
  onClick,
  active,
}) => {
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        active ? 'ring-2 ring-primary border-primary' : ''
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${active ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
            {icon}
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
};

const AdminSystemSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("orchestrator");
  
  const modules = [
    {
      id: "orchestrator",
      title: "Orquestrador",
      description: "Configure como os diferentes componentes do sistema interagem entre si.",
      icon: <Database className="h-5 w-5" />,
      component: <OrchestratorTab />
    },
    {
      id: "models",
      title: "Modelos",
      description: "Gerencie modelos de inteligência artificial e suas configurações.",
      icon: <BarChart className="h-5 w-5" />,
      component: <ModelsTab />
    },
    {
      id: "tools",
      title: "Ferramentas",
      description: "Configure as ferramentas disponíveis para os agentes do sistema.",
      icon: <Tool className="h-5 w-5" />,
      component: <ToolsTab />
    },
    {
      id: "agents",
      title: "Agentes",
      description: "Administre os agentes inteligentes e seus comportamentos.",
      icon: <Users className="h-5 w-5" />,
      component: <AgentsTab />
    },
    {
      id: "mcp",
      title: "MCP",
      description: "Configure o Processador Central de Mensagens.",
      icon: <Code className="h-5 w-5" />,
      component: <MCPTab />
    },
    {
      id: "api",
      title: "API",
      description: "Gerencie configurações de conexão com APIs externas.",
      icon: <Server className="h-5 w-5" />,
      component: <ApiConfigTab />
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((module) => (
          <SettingModule
            key={module.id}
            title={module.title}
            description={module.description}
            icon={module.icon}
            onClick={() => setActiveTab(module.id)}
            active={activeTab === module.id}
          />
        ))}
      </div>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>
            {modules.find(m => m.id === activeTab)?.title}
          </CardTitle>
          <CardDescription>
            {modules.find(m => m.id === activeTab)?.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {modules.find(m => m.id === activeTab)?.component}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSystemSettings;
