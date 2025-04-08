
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAgent } from "@/contexts/AgentContext";
import { AIModel } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash } from "lucide-react";
import ModelDialog from "./ModelDialog";

const ModelsSection: React.FC = () => {
  const { toast } = useToast();
  const { models, addModel, updateModel, removeModel } = useAgent();
  
  const [modelDialogOpen, setModelDialogOpen] = useState(false);
  const [newModel, setNewModel] = useState<Partial<AIModel>>({
    name: "",
    provider: "",
    description: "",
    apiKey: "",
    capabilities: [],
  });

  const handleAddModel = () => {
    const model: AIModel = {
      id: uuidv4(),
      name: newModel.name || "Novo Modelo",
      provider: newModel.provider || "Provedor",
      providerId: newModel.provider?.toLowerCase().replace(/\s+/g, '-') || uuidv4(),
      description: newModel.description || "Descrição do modelo",
      capabilities: newModel.capabilities || [],
      apiKey: newModel.apiKey,
    };
    
    addModel(model);
    setModelDialogOpen(false);
    setNewModel({
      name: "",
      provider: "",
      description: "",
      apiKey: "",
      capabilities: [],
    });
    
    toast({
      title: "Modelo adicionado",
      description: `${model.name} foi adicionado com sucesso`,
    });
  };

  const handleUpdateModel = (modelId: string, field: keyof AIModel, value: string) => {
    updateModel(modelId, { [field]: value });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Modelos de IA Configurados</h2>
        <Button className="inventu-btn" onClick={() => setModelDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Modelo
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {models.map((model) => (
          <Card key={model.id}>
            <CardHeader>
              <CardTitle>{model.name}</CardTitle>
              <CardDescription>{model.provider}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <p className="text-sm text-muted-foreground">{model.description}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`apiKey-${model.id}`}>Chave de API</Label>
                  <div className="flex gap-2">
                    <Input
                      id={`apiKey-${model.id}`}
                      type="password"
                      value={model.apiKey || ""}
                      onChange={(e) =>
                        handleUpdateModel(model.id, "apiKey", e.target.value)
                      }
                      placeholder="Adicionar chave de API"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        removeModel(model.id);
                        toast({
                          title: "Modelo removido",
                          description: `${model.name} foi removido com sucesso`,
                        });
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <ModelDialog
        open={modelDialogOpen}
        onOpenChange={setModelDialogOpen}
        model={newModel}
        setModel={setNewModel}
        onSave={handleAddModel}
      />
    </>
  );
};

export default ModelsSection;
