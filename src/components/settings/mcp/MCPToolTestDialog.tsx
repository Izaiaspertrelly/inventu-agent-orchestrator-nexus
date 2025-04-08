
import React, { useState } from "react";
import { MCPTool } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MCPToolTestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tool: MCPTool | null;
  onTest: (parameters: string) => Promise<any>;
}

const MCPToolTestDialog: React.FC<MCPToolTestDialogProps> = ({
  open,
  onOpenChange,
  tool,
  onTest,
}) => {
  const [parameters, setParameters] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  // Initialize parameters from tool when dialog opens
  React.useEffect(() => {
    if (tool && open) {
      setParameters(tool.parameters || "{}");
      setResult(null);
    }
  }, [tool, open]);

  const handleTest = async () => {
    if (!tool) return;
    
    try {
      setLoading(true);
      setResult(null);
      
      const response = await onTest(parameters);
      setResult(response);
    } catch (error) {
      console.error("Error testing tool:", error);
      setResult({ error: String(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Testar Ferramenta: {tool?.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Parâmetros (JSON)</h4>
            <Textarea
              value={parameters}
              onChange={(e) => setParameters(e.target.value)}
              placeholder='{"param1": "value1", "param2": "value2"}'
              rows={5}
              className="font-mono text-sm"
            />
          </div>
          
          {result && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Resultado</h4>
              <ScrollArea className="h-60 w-full border rounded-md p-4">
                <pre className="text-sm font-mono whitespace-pre-wrap break-all">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </ScrollArea>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button 
            type="button" 
            onClick={handleTest} 
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testando...
              </>
            ) : (
              'Executar Teste'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MCPToolTestDialog;
