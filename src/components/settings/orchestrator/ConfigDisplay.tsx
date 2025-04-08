
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ConfigDisplayProps {
  configJson: string;
  setConfigJson: (config: string) => void;
}

const ConfigDisplay: React.FC<ConfigDisplayProps> = ({
  configJson,
  setConfigJson,
}) => {
  return (
    <div className="border-t pt-4 space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="orchestrator-config">Configuração JSON do Orquestrador</Label>
        <span className="text-xs text-muted-foreground">Edição avançada</span>
      </div>
      <Textarea
        id="orchestrator-config"
        value={configJson}
        onChange={(e) => setConfigJson(e.target.value)}
        className="font-mono h-64"
      />
    </div>
  );
};

export default ConfigDisplay;
