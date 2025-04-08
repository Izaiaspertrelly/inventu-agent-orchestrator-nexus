
import React from "react";
import { Paperclip, ToggleRight, ToggleLeft } from "lucide-react";

interface SearchBarActionsProps {
  isSuperAgentEnabled: boolean;
  onToggleSuperAgent: (e: React.MouseEvent) => void;
  onSubmit: (e: React.FormEvent) => void;
  onAttachmentClick?: (e: React.MouseEvent) => void;
  fileInputRef?: React.RefObject<HTMLInputElement>;
  onClose?: (e: React.MouseEvent) => void;
}

const SearchBarActions: React.FC<SearchBarActionsProps> = ({
  isSuperAgentEnabled,
  onToggleSuperAgent,
  onSubmit,
  onAttachmentClick,
  fileInputRef
}) => {
  return (
    <div className="flex items-center gap-2 mr-4">
      <div 
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors cursor-pointer text-xs bg-foreground/10 hover:bg-foreground/20 backdrop-blur-md ${isSuperAgentEnabled ? 'text-primary font-semibold' : 'text-foreground'}`}
        onClick={(e) => { e.stopPropagation(); onToggleSuperAgent(e); }}
        title="Ativar/Desativar God Mode"
      >
        {isSuperAgentEnabled ? 
          <ToggleRight className="h-3.5 w-3.5" /> : 
          <ToggleLeft className="h-3.5 w-3.5" />
        }
        <span className="font-medium whitespace-nowrap">God Mode</span>
      </div>
      
      <button 
        type="button"
        className="bg-foreground/10 hover:bg-foreground/20 backdrop-blur-md text-foreground p-2 rounded-full transition-colors"
        title="Anexar arquivo"
        onClick={onAttachmentClick}
      >
        <Paperclip className="h-4 w-4" />
      </button>
      
      {fileInputRef && (
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="image/*,application/pdf,application/msword,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        />
      )}
      
      <button 
        type="submit"
        className="bg-primary hover:bg-primary/90 text-primary-foreground p-2 rounded-full transition-colors shadow-sm"
        onClick={(e) => onSubmit(e)}
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </div>
  );
};

export default SearchBarActions;
