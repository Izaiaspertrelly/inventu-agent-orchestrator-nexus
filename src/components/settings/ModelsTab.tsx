
import React, { useState } from "react";
import { useAgent } from "@/contexts/AgentContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import AddModelForm from "./models/AddModelForm";
import ModelsTable from "./models/ModelsTable";
import ModelAssignment from "./models/ModelAssignment";

const ModelsTab = () => {
  const { models, agents, addModel, removeModel, updateAgent } = useAgent();
  const [modelDialogOpen, setModelDialogOpen] = useState(false);

  const handleAssignModel = (agentId: string, modelId: string, modelParamsJson: string) => {
    // Obter o agente existente
    const agent = agents.find(a => a.id === agentId);
    
    if (!agent) {
      throw new Error("Agente não encontrado");
    }
    
    // Parse a configuração existente
    let configJson = {};
    try {
      configJson = JSON.parse(agent.configJson);
    } catch (e) {
      configJson = {};
    }
    
    // Parse parâmetros do modelo
    let modelConfig = {};
    try {
      modelConfig = JSON.parse(modelParamsJson);
    } catch (e) {
      console.error("Erro ao analisar parâmetros do modelo:", e);
      modelConfig = {
        temperature: 0.7,
        top_p: 1
      };
    }
    
    // Atualizar a configuração com o modelo selecionado
    configJson = {
      ...configJson,
      model: {
        id: modelId,
        parameters: modelConfig
      }
    };
    
    // Atualizar o agente
    updateAgent(agentId, {
      modelId: modelId,
      configJson: JSON.stringify(configJson),
      updatedAt: new Date()
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Modelos de IA Disponíveis</CardTitle>
              <CardDescription>
                Selecione e configure os modelos de linguagem a serem usados pelos agentes
              </CardDescription>
            </div>
            <Button onClick={() => setModelDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Modelo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ModelsTable 
            models={models}
            onRemoveModel={removeModel}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Atribuição de Modelos aos Agentes</CardTitle>
          <CardDescription>
            Atribua e configure os modelos de IA para cada agente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ModelAssignment 
            agents={agents}
            models={models}
            onAssignModel={handleAssignModel}
          />
        </CardContent>
      </Card>

      {/* Form para adicionar modelo */}
      <AddModelForm 
        open={modelDialogOpen}
        onOpenChange={setModelDialogOpen}
        onAddModel={addModel}
      />
    </div>
  );
};

export default ModelsTab;
