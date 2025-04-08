
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertCircle, Check } from "lucide-react";

interface ConfigJsonProps {
  configJson: string;
  onConfigJsonChange: (configJson: string) => void;
}

const ConfigJson: React.FC<ConfigJsonProps> = ({
  configJson,
  onConfigJsonChange
}) => {
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const formatJson = () => {
    try {
      const parsed = JSON.parse(configJson);
      const formatted = JSON.stringify(parsed, null, 2);
      onConfigJsonChange(formatted);
      setIsValid(true);
      setErrorMessage("");
    } catch (e) {
      setIsValid(false);
      setErrorMessage("JSON inválido");
    }
  };

  useEffect(() => {
    try {
      JSON.parse(configJson);
      setIsValid(true);
      setErrorMessage("");
    } catch (e) {
      setIsValid(false);
      setErrorMessage("JSON inválido");
    }
  }, [configJson]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="configJson">Configuração JSON</Label>
        <div className="flex items-center gap-2">
          {isValid ? (
            <span className="text-xs flex items-center text-green-500">
              <Check className="h-3 w-3 mr-1" /> Válido
            </span>
          ) : (
            <span className="text-xs flex items-center text-red-500">
              <AlertCircle className="h-3 w-3 mr-1" /> {errorMessage}
            </span>
          )}
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={formatJson}
          >
            Formatar
          </Button>
        </div>
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
