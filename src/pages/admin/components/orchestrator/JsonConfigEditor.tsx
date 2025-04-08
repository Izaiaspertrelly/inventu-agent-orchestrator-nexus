
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface JsonConfigEditorProps {
  configJson: string;
  setConfigJson: (value: string) => void;
}

const JsonConfigEditor: React.FC<JsonConfigEditorProps> = ({ configJson, setConfigJson }) => {
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

export default JsonConfigEditor;
