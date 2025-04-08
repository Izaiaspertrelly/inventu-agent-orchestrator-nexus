
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
            <div className="ml-4 space-y-2">
              <Label htmlFor="reasoning-depth">Profundidade de Raciocínio</Label>
              <Select
                value={reasoningDepth}
                onValueChange={setReasoningDepth}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a profundidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Básico (1 passo)</SelectItem>
                  <SelectItem value="2">Intermediário (2 passos)</SelectItem>
                  <SelectItem value="3">Avançado (3+ passos)</SelectItem>
                </SelectContent>
              </Select>
              
              <p className="text-xs text-muted-foreground mt-2">
                Profundidade maior permite análises mais complexas, mas consome mais tokens e aumenta o tempo de resposta
              </p>
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
              <p className="text-xs text-muted-foreground mt-2">
                O planejamento permite que o orquestrador quebre problemas complexos em passos mais simples
                e delegue esses passos para agentes especializados quando necessário
              </p>
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
