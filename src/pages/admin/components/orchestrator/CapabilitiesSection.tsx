
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

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
      
      <div className="space-y-6">
        {/* Memória */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Memória</h4>
            <p className="text-sm text-muted-foreground">
              Permite ao orquestrador lembrar de interações anteriores
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
              Permite ao orquestrador raciocinar sobre informações
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
              Permite ao orquestrador planejar ações futuras
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
        onClick={handleUpdateConfig}
        className="mt-4"
      >
        Atualizar Configuração
      </Button>
    </div>
  );
};

export default CapabilitiesSection;
