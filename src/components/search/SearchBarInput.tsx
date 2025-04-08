
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  isSuperAgentEnabled: boolean;
  onClick?: (e: React.MouseEvent) => void;
  placeholder?: string;
}

const SearchBarInput: React.FC<SearchBarInputProps> = ({
  value,
  onChange,
  onKeyDown,
  isSuperAgentEnabled,
  onClick,
  placeholder = "Dê uma tarefa para Inventor trabalhar..."
}) => {
  return (
    <div className="flex-1 relative">
      <Input 
        className={`w-full py-3 px-4 pl-10 rounded-full text-base backdrop-blur-sm border-0 
          ${isSuperAgentEnabled 
            ? 'bg-primary text-primary-foreground placeholder:text-primary-foreground/70' 
            : 'bg-transparent placeholder:text-foreground/50'}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onClick={onClick}
      />
      <Search 
        className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 
          ${isSuperAgentEnabled ? 'text-primary-foreground/70' : 'text-foreground/50'}`} 
      />
    </div>
  );
};

export default SearchBarInput;
