
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface ResourcesConfigurationProps {
  optimizeResources: boolean;
  setOptimizeResources: (value: boolean) => void;
  maxTokens: string;
  setMaxTokens: (value: string) => void;
  handleUpdateConfig: () => void;
}

const ResourcesConfiguration: React.FC<ResourcesConfigurationProps> = ({
  optimizeResources,
  setOptimizeResources,
  maxTokens,
  setMaxTokens,
  handleUpdateConfig,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Gerenciamento de Recursos</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Configure como o orquestrador gerencia recursos computacionais como tokens e 
          tempo de processamento.
        </p>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">Otimização de Recursos</h4>
          <p className="text-sm text-muted-foreground">
            Permite que o orquestrador otimize automaticamente o uso de recursos com base no desempenho
          </p>
        </div>
        <Switch 
          checked={optimizeResources}
          onCheckedChange={setOptimizeResources}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="max-tokens">Limite Máximo de Tokens ({maxTokens})</Label>
        <div className="flex space-x-4">
          <Slider
            value={[parseInt(maxTokens)]}
            min={1000}
            max={8000}
            step={100}
            onValueChange={(values) => setMaxTokens(values[0].toString())}
            className="flex-1"
          />
          <Input 
            id="max-tokens"
            value={maxTokens}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (!isNaN(value) && value >= 0) {
                setMaxTokens(value.toString());
              }
            }}
            className="w-20"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Define o número máximo de tokens que o orquestrador pode usar em uma única interação
        </p>
      </div>
      
      <Button 
        variant="outline" 
        onClick={handleUpdateConfig}
      >
        Atualizar Configuração
      </Button>
    </div>
  );
};

export default ResourcesConfiguration;
