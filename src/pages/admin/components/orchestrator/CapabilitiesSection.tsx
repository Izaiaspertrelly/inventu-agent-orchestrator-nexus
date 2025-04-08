
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

interface CapabilitiesSectionProps {
  memoryEnabled: boolean;
  setMemoryEnabled: (value: boolean) => void;
  memoryType: string;
  setMemoryType: (value: string) => void;
  reasoningEnabled: boolean;
  setReasoningEnabled: (value: boolean) => void;
  reasoningDepth: string;
  setReasoningDepth: (value: string) => void;
  planningEnabled: boolean;
  setPlanningEnabled: (value: boolean) => void;
  handleUpdateConfig: () => void;
}

const CapabilitiesSection: React.FC<CapabilitiesSectionProps> = ({
  memoryEnabled,
  setMemoryEnabled,
  memoryType,
  setMemoryType,
  reasoningEnabled,
  setReasoningEnabled,
  reasoningDepth,
  setReasoningDepth,
  planningEnabled,
  setPlanningEnabled,
  handleUpdateConfig,
}) => {
  // Convert string reasoning depth to number for slider
  const reasoningDepthValue = parseInt(reasoningDepth) || 2;
  
  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    setReasoningDepth(value[0].toString());
  };

  return (
    <div className="border-t pt-4">
      <h3 className="text-lg font-medium mb-4">Capacidades Neurais do Orquestrador</h3>
      
      <Tabs defaultValue="memory" className="space-y-4">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="memory">Memória</TabsTrigger>
          <TabsTrigger value="reasoning">Raciocínio</TabsTrigger>
          <TabsTrigger value="planning">Planejamento</TabsTrigger>
        </TabsList>
        
        <TabsContent value="memory" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Memória</h4>
              <p className="text-sm text-muted-foreground">
                Permite ao orquestrador armazenar e recuperar informações de interações anteriores
              </p>
            </div>
            <Switch 
              checked={memoryEnabled}
              onCheckedChange={setMemoryEnabled}
            />
          </div>
          
          {memoryEnabled && (
            <div className="ml-4 space-y-2">
              <Label htmlFor="memory-type">Tipo de Memória</Label>
              <Select
                value={memoryType}
                onValueChange={setMemoryType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de memória" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buffer">Buffer Simples</SelectItem>
                  <SelectItem value="vectordb">Banco de Dados Vetorial</SelectItem>
                  <SelectItem value="summary">Memória com Resumo</SelectItem>
                </SelectContent>
              </Select>
              
              <p className="text-xs text-muted-foreground mt-2">
                {memoryType === "buffer" && "Armazena as últimas mensagens em um buffer circular simples"}
                {memoryType === "vectordb" && "Armazena e recupera informações usando vetores semânticos"}
                {memoryType === "summary" && "Mantém um resumo dinâmico da conversa para economizar contexto"}
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="reasoning" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Raciocínio</h4>
              <p className="text-sm text-muted-foreground">
                Permite ao orquestrador analisar informações com diferentes níveis de profundidade
              </p>
            </div>
            <Switch 
              checked={reasoningEnabled}
              onCheckedChange={setReasoningEnabled}
            />
          </div>
          
          {reasoningEnabled && (
            <div className="ml-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="reasoning-depth">Profundidade de Raciocínio</Label>
                  <Badge variant="outline">{reasoningDepthValue} passos</Badge>
                </div>
                
                <Slider
                  id="reasoning-depth"
                  min={1}
                  max={15}
                  step={1}
                  value={[reasoningDepthValue]}
                  onValueChange={handleSliderChange}
                  className="w-full"
                />
                
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Simples</span>
                  <span>Avançado</span>
                </div>
              </div>
              
              <div className="bg-muted/50 p-3 rounded-md">
                <p className="text-sm">
                  <span className="font-medium">Modo dinâmico:</span> O orquestrador agora ajusta automaticamente a profundidade do raciocínio com base na complexidade da consulta. 
                  O valor configurado ({reasoningDepthValue}) serve como referência, mas o orquestrador pode aumentar ou diminuir o número de passos conforme necessário.
                </p>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="planning" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Planejamento</h4>
              <p className="text-sm text-muted-foreground">
                Permite ao orquestrador decompor tarefas complexas em subtarefas mais simples
              </p>
            </div>
            <Switch 
              checked={planningEnabled}
              onCheckedChange={setPlanningEnabled}
            />
          </div>
          
          {planningEnabled && (
            <div className="ml-4">
              <div className="bg-muted/50 p-3 rounded-md mt-2">
                <p className="text-sm">
                  <span className="font-medium">Planejamento adaptativo:</span> O orquestrador decompõe tarefas em 
                  passos lógicos (5-15 etapas) com base na complexidade da solicitação, priorizando clareza e completude.
                </p>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <Button 
        variant="outline" 
        onClick={handleUpdateConfig}
        className="mt-6"
      >
        Atualizar Configuração
      </Button>
    </div>
  );
};

export default CapabilitiesSection;
