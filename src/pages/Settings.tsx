
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCog, Layers, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Configurações do Usuário</h1>
      </div>

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
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Informações do Perfil</h2>
            <p>Aqui você poderá editar suas informações pessoais.</p>
          </div>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Preferências do Usuário</h2>
            <p>Configure suas preferências de uso do sistema.</p>
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Integrações</h2>
            <p>Gerencie suas integrações com outros serviços.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
