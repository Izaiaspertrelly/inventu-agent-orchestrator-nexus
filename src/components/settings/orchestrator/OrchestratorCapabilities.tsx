
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OrchestratorCapabilitiesProps {
  memoryEnabled: boolean;
  setMemoryEnabled: (enabled: boolean) => void;
  memoryType: string;
  setMemoryType: (type: string) => void;
  reasoningEnabled: boolean;
  setReasoningEnabled: (enabled: boolean) => void;
  reasoningDepth: string;
  setReasoningDepth: (depth: string) => void;
  planningEnabled: boolean;
  setPlanningEnabled: (enabled: boolean) => void;
  onUpdateConfig: () => void;
}

const OrchestratorCapabilities: React.FC<OrchestratorCapabilitiesProps> = ({
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
  onUpdateConfig,
}) => {
  return (
    <div className="border-t pt-4">
      <h3 className="text-lg font-medium mb-4">Capacidades do Orquestrador</h3>
      
      <div className="space-y-6">
        {/* Memória */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Memória</h4>
            <p className="text-sm text-muted-foreground">
              Permite ao agente lembrar de interações anteriores
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
          </div>
        )}
        
        {/* Raciocínio */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Raciocínio</h4>
            <p className="text-sm text-muted-foreground">
              Permite ao agente raciocinar sobre informações
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
          </div>
        )}
        
        {/* Planejamento */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Planejamento</h4>
            <p className="text-sm text-muted-foreground">
              Permite ao agente planejar ações futuras
            </p>
          </div>
          <Switch 
            checked={planningEnabled}
            onCheckedChange={setPlanningEnabled}
          />
        </div>
      </div>
      
      <Button 
        variant="outline" 
        onClick={onUpdateConfig}
        className="mt-4"
      >
        Atualizar Configuração
      </Button>
    </div>
  );
};

export default OrchestratorCapabilities;
