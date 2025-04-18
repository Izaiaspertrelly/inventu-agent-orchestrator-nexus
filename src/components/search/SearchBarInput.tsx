
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
  disabled?: boolean;
}

const SearchBarInput: React.FC<SearchBarInputProps> = ({
  value,
  onChange,
  onKeyDown,
  isSuperAgentEnabled,
  onClick,
  placeholder = "Dê uma tarefa para o Inventor trabalhar...",
  containerClassName = "",
  inputClassName = "",
  disabled = false
}) => {
  return (
    <div className={`relative flex-1 ${containerClassName}`}>
      <Input 
        className={`w-full min-w-[400px] max-w-[600px] pl-10 pr-20 py-3 rounded-full text-base backdrop-blur-sm border-0 
          ${isSuperAgentEnabled 
            ? 'bg-primary text-primary-foreground placeholder:text-primary-foreground/70' 
            : 'bg-transparent placeholder:text-foreground/50'} 
          text-ellipsis overflow-hidden whitespace-nowrap ${disabled ? 'opacity-70' : ''} ${inputClassName}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onClick={onClick}
        disabled={disabled}
      />
      <Search 
        className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 
          ${isSuperAgentEnabled ? 'text-primary-foreground/70' : 'text-foreground/50'}
          ${disabled ? 'opacity-50' : ''}`} 
      />
    </div>
  );
};

export default SearchBarInput;
