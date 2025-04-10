
import React, { useRef, useEffect, useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Terminal, X, Minimize2, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';

export interface TerminalLine {
  id: string;
  content: string;
  type: 'command' | 'output' | 'error' | 'info' | 'success';
  timestamp: Date;
}

interface OrchestratorTerminalProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
  lines: TerminalLine[];
  isProcessing: boolean;
  title?: string;
  minimized: boolean;
}

const OrchestratorTerminal: React.FC<OrchestratorTerminalProps> = ({
  isOpen,
  onClose,
  onMinimize,
  lines: propLines,
  isProcessing,
  title = "Orquestrador Neural",
  minimized
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [linesArray, setLinesArray] = useState<TerminalLine[]>(propLines);
  
  // Listen for terminal update events
  useEffect(() => {
    const handleTerminalUpdate = (event: any) => {
      if (event && event.detail) {
        const { content, type } = event.detail;
        
        if (content && type) {
          const newLine: TerminalLine = {
            id: uuidv4(),
            content,
            type: type as any,
            timestamp: new Date()
          };
          
          setLinesArray(prevLines => [...prevLines, newLine]);
        }
      }
    };
    
    document.addEventListener('terminal-update', handleTerminalUpdate as EventListener);
    
    return () => {
      document.removeEventListener('terminal-update', handleTerminalUpdate as EventListener);
    };
  }, []);
  
  // Auto-scroll to bottom when new lines are added
  useEffect(() => {
    if (propLines.length !== linesArray.length) {
      setLinesArray(propLines);
    }
  }, [propLines]);
  
  // Auto-scroll to bottom when new lines are added
  useEffect(() => {
    if (scrollRef.current && !minimized) {
      const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [linesArray, minimized]);

  if (!isOpen) return null;

  return (
    <div 
      className={cn(
        "fixed bottom-20 left-1/2 transform -translate-x-1/2 w-[80%] max-w-3xl z-50 transition-all duration-200 ease-in-out shadow-2xl border border-border",
        minimized ? "h-12 rounded-t-lg" : "h-80 rounded-lg"
      )}
    >
      {/* Terminal Header */}
      <div className="bg-secondary/90 backdrop-blur-sm h-12 rounded-t-lg flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-primary" />
          <h3 className="font-medium text-foreground flex items-center gap-2">
            {title}
            {isProcessing && <Loader2 className="h-3.5 w-3.5 text-muted-foreground animate-spin" />}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={onMinimize}
            className="p-1.5 hover:bg-background/60 rounded-md transition-colors"
          >
            {minimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </button>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      {!minimized && (
        <div className="bg-black/90 backdrop-blur-md h-[calc(100%-3rem)] rounded-b-lg" ref={scrollRef}>
          <ScrollArea className="h-full p-4 font-mono text-sm">
            {linesArray.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Terminal pronto para execução
              </div>
            ) : (
              <div className="space-y-1.5">
                {linesArray.map((line) => (
                  <div key={line.id} className={cn(
                    line.type === 'command' && "text-blue-400",
                    line.type === 'output' && "text-green-300",
                    line.type === 'error' && "text-red-400",
                    line.type === 'info' && "text-yellow-300",
                    line.type === 'success' && "text-emerald-400",
                  )}>
                    {line.type === 'command' && (
                      <span className="text-gray-400">$ </span>
                    )}
                    {line.content}
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex gap-1 text-green-300 mt-1 items-center">
                    <span className="text-gray-400">$ </span>
                    <span>Processando</span>
                    <span className="inline-block w-1.5 h-4 bg-green-300 animate-pulse ml-0.5"></span>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default OrchestratorTerminal;
