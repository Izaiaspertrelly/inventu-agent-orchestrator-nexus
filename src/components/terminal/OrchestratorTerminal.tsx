
import React, { useEffect, useRef } from "react";
import { ArrowUpDown, X, Terminal, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { v4 as uuidv4 } from 'uuid';

export interface TerminalLine {
  id: string;
  content: string;
  type: "command" | "output" | "error" | "info" | "success";
  timestamp: Date;
}

interface OrchestratorTerminalProps {
  isOpen: boolean;
  onMinimize: () => void;
  lines: TerminalLine[];
  isProcessing: boolean;
  minimized?: boolean;
}

const OrchestratorTerminal: React.FC<OrchestratorTerminalProps> = ({
  isOpen,
  onMinimize,
  lines = [],
  isProcessing,
  minimized = false
}) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom on new lines
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [lines]);
  
  if (minimized) {
    return (
      <div className="fixed bottom-4 right-4 shadow-lg rounded-md border bg-background z-50">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Terminal do Orquestrador</span>
            <Badge variant="outline" className="ml-1">{lines.length} linhas</Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={onMinimize} className="h-6 w-6 p-0">
            <ArrowUpDown className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    );
  }
  
  const getLineColor = (type: string) => {
    switch (type) {
      case "command": return "text-primary font-bold";
      case "output": return "text-foreground";
      case "error": return "text-destructive";
      case "info": return "text-blue-500";
      case "success": return "text-green-500";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className={`flex flex-col h-full border-l bg-black/95 text-white`}>
      <div className="flex items-center justify-between p-2 border-b border-white/20">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4" />
          <h3 className="text-sm font-medium">Orquestrador Neural • Terminal</h3>
          {isProcessing && <Zap className="h-4 w-4 text-amber-400 animate-pulse" />}
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={onMinimize} className="h-7 w-7 p-0 hover:bg-white/10">
            <ArrowUpDown className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onMinimize} className="h-7 w-7 p-0 hover:bg-white/10">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-2" ref={scrollAreaRef}>
        <div className="font-mono text-xs space-y-1">
          {lines.map((line) => (
            <div key={line.id} className={`${getLineColor(line.type)}`}>
              <span className="text-white/50">
                [{new Date(line.timestamp).toLocaleTimeString()}]
              </span>{" "}
              {line.content}
            </div>
          ))}
          
          {isProcessing && (
            <div className="text-amber-400">
              <span className="text-white/50">
                [{new Date().toLocaleTimeString()}]
              </span>{" "}
              Processando...
            </div>
          )}
          
          {lines.length === 0 && !isProcessing && (
            <div className="text-white/50 italic">
              Terminal do Orquestrador Neural. Aguardando eventos...
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default OrchestratorTerminal;
