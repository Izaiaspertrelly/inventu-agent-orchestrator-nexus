
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
  containerClassName?: string;
  inputClassName?: string;
}

const SearchBarInput: React.FC<SearchBarInputProps> = ({
  value,
  onChange,
  onKeyDown,
  isSuperAgentEnabled,
  onClick,
  placeholder = "Dê uma tarefa para o Inventor trabalhar...",
  containerClassName = "",
  inputClassName = ""
}) => {
  return (
    <div className={`flex-1 relative ${containerClassName}`}>
      <Input 
        className={`w-full pl-10 pr-24 py-3 rounded-full text-base backdrop-blur-sm border-0 
          ${isSuperAgentEnabled 
            ? 'bg-primary text-primary-foreground placeholder:text-primary-foreground/70' 
            : 'bg-transparent placeholder:text-foreground/50'} 
          text-ellipsis overflow-hidden ${inputClassName}`}
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
