
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ConfigJsonProps {
  configJson: string;
  onConfigJsonChange: (configJson: string) => void;
}

const ConfigJson: React.FC<ConfigJsonProps> = ({
  configJson,
  onConfigJsonChange
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="configJson">Configuração JSON</Label>
        <span className="text-xs text-muted-foreground">Estrutura do agente</span>
      </div>
      <Textarea
        id="configJson"
        value={configJson}
        onChange={(e) => onConfigJsonChange(e.target.value)}
        className="font-mono h-64"
        placeholder="{}"
      />
    </div>
  );
};

export default ConfigJson;
