
import React from "react";
import { Paperclip, ToggleRight, ToggleLeft, Minimize } from "lucide-react";

interface SearchBarActionsProps {
  isSuperAgentEnabled: boolean;
  onToggleSuperAgent: (e: React.MouseEvent) => void;
  onClose: (e: React.MouseEvent) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const SearchBarActions: React.FC<SearchBarActionsProps> = ({
  isSuperAgentEnabled,
  onToggleSuperAgent,
  onClose,
  onSubmit
}) => {
  return (
    <div className="flex items-center gap-1.5 pl-2">
      <div 
        className={`flex items-center gap-1 bg-secondary/50 hover:bg-secondary/70 px-2 py-1 rounded-full transition-colors cursor-pointer text-xs ${isSuperAgentEnabled ? 'text-blue-500 font-semibold' : ''}`}
        onClick={(e) => { e.stopPropagation(); onToggleSuperAgent(e); }}
        title="Ativar/Desativar God Mode"
      >
        {isSuperAgentEnabled ? 
          <ToggleRight className="h-3 w-3" /> : 
          <ToggleLeft className="h-3 w-3" />
        }
        <span className="font-medium">God Mode</span>
      </div>
      
      <button 
        type="button"
        className="bg-secondary/50 hover:bg-secondary/70 text-foreground p-1.5 rounded-full transition-colors"
        title="Anexar arquivo"
        onClick={(e) => e.stopPropagation()}
      >
        <Paperclip className="h-4 w-4" />
      </button>
      
      <button 
        type="submit"
        className="bg-primary hover:bg-primary/90 text-primary-foreground p-1.5 rounded-full transition-colors"
        onClick={(e) => onSubmit(e)}
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
      
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onClose(e); }}
        className="bg-secondary/50 hover:bg-secondary/90 text-foreground p-1.5 rounded-full transition-colors"
        title="Minimizar barra de pesquisa"
      >
        <Minimize className="h-4 w-4" />
      </button>
    </div>
  );
};

export default SearchBarActions;
