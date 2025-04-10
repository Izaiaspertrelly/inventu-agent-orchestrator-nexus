
import React, { useRef, useEffect, useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Terminal, Minimize2, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';
import DraggableContainer from '../draggable/DraggableContainer';

export interface TerminalLine {
  id: string;
  content: string;
  type: 'command' | 'output' | 'error' | 'info' | 'success';
  timestamp: Date;
}

interface OrchestratorTerminalProps {
  isOpen: boolean;
  onMinimize: () => void;
  lines: TerminalLine[];
  isProcessing: boolean;
  title?: string;
  minimized: boolean;
}

const OrchestratorTerminal: React.FC<OrchestratorTerminalProps> = ({
  isOpen,
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
  
  // Render a small floating terminal when minimized
  if (minimized) {
    return (
      <DraggableContainer 
        isMinimized={minimized}
        className="bg-black/90 backdrop-blur-sm rounded-lg w-36 h-20 border border-gray-700" // Reduced width and height
        attachToSearchBar={true} // Attach to search bar
      >
        <div className="w-full h-full flex flex-col">
          <div className="h-5 rounded-t-lg flex items-center justify-between px-1 bg-gray-800/90 border-b border-gray-700">
            <div className="flex items-center gap-1">
              <Terminal className="h-2 w-2 text-green-500" /> {/* Smaller icon */}
              <span className="text-[0.5rem] font-mono text-gray-300 truncate">terminal:</span>
            </div>
            <button 
              onClick={onMinimize}
              className="p-0.5 hover:bg-gray-700/60 rounded-sm transition-colors"
            >
              <Maximize2 className="h-1.5 w-1.5 text-gray-400" /> {/* Smaller icon */}
            </button>
          </div>
          <div className="bg-black/90 flex-1 rounded-b-lg p-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="font-mono text-[0.5rem] text-green-500 font-medium space-y-0.5">
                {linesArray.length > 0 ? (
                  linesArray.slice(-3).map((line) => ( // Reduced number of lines
                    <div 
                      key={line.id} 
                      className={cn(
                        "truncate",
                        line.type === 'command' && "text-blue-400",
                        line.type === 'output' && "text-green-400",
                        line.type === 'error' && "text-red-400",
                        line.type === 'info' && "text-yellow-300",
                        line.type === 'success' && "text-emerald-400",
                      )}
                    >
                      {line.type === 'command' && (
                        <span className="text-gray-400">$ </span>
                      )}
                      {line.content}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-[0.5rem]">
                    <span className="text-gray-400">$ </span>
                    Terminal pronto
                  </div>
                )}
                {isProcessing && (
                  <div className="flex gap-0.5 text-green-400 items-center text-[0.5rem]">
                    <span className="text-gray-400">$ </span>
                    <span>processing</span>
                    <span className="inline-block w-0.5 h-1 bg-green-400 animate-pulse ml-0.5"></span>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DraggableContainer>
    );
  }

  return (
    <div className="h-full flex flex-col bg-secondary/10 border-l border-border">
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
            <Minimize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="bg-black/90 backdrop-blur-md flex-1 h-[calc(100%-3rem)]" ref={scrollRef}>
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
    </div>
  );
};

export default OrchestratorTerminal;
