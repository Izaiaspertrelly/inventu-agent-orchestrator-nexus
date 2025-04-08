
import React from "react";
import { Button } from "@/components/ui/button";

interface SaveButtonProps {
  handleSaveOrchestrator: () => void;
}

const SaveButton: React.FC<SaveButtonProps> = ({ handleSaveOrchestrator }) => {
  return (
    <Button 
      onClick={handleSaveOrchestrator} 
      className="w-full"
    >
      Salvar Configuração do Orquestrador Neural
    </Button>
  );
};

export default SaveButton;
