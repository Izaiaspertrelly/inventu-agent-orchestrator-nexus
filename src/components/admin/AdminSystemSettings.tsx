
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
import AgentsTab from "../settings/AgentsTab";
import MCPTab from "../settings/MCPTab";
import ApiConfigTab from "../settings/ApiConfigTab";
import { Database, Code, Users, BarChart, Server, Brain } from "lucide-react";

interface SettingModuleProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  active: boolean;
  isPrimary?: boolean;
}

const SettingModule: React.FC<SettingModuleProps> = ({
  title,
  description,
  icon,
  onClick,
  active,
  isPrimary = false,
}) => {
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        active ? 'ring-2 ring-primary border-primary' : ''
      } ${isPrimary ? 'border-2 border-primary bg-primary/5' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${active ? 'bg-primary text-primary-foreground' : isPrimary ? 'bg-primary/20' : 'bg-muted'}`}>
            {icon}
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
          {isPrimary && (
            <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
              Principal
            </span>
          )}
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
      title: "Orquestrador Neural",
      description: "Configure o cérebro central que governa todo o sistema e integra suas capacidades.",
      icon: <Brain className="h-5 w-5" />,
      component: <OrchestratorTab />,
      isPrimary: true
    },
    {
      id: "agents",
      title: "Agentes",
      description: "Administre os agentes especialistas que são coordenados pelo orquestrador.",
      icon: <Users className="h-5 w-5" />,
      component: <AgentsTab />
    },
    {
      id: "models",
      title: "Modelos",
      description: "Gerencie modelos de inteligência artificial usados pelos agentes.",
      icon: <BarChart className="h-5 w-5" />,
      component: <ModelsTab />
    },
    {
      id: "mcp",
      title: "MCP",
      description: "Configure o Processador Central de Mensagens para ferramentas externas.",
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
            isPrimary={module.isPrimary}
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
