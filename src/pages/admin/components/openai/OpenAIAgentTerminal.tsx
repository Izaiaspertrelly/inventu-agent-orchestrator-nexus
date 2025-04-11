
import React from 'react';
import OrchestratorTerminal, { TerminalLine } from "@/components/terminal/OrchestratorTerminal";
import { v4 as uuidv4 } from 'uuid';

interface OpenAIAgentTerminalProps {
  isMinimized: boolean;
  onMinimize: () => void;
}

const OpenAIAgentTerminal: React.FC<OpenAIAgentTerminalProps> = ({
  isMinimized,
  onMinimize
}) => {
  // Exemplo de linhas para o terminal
  const [lines, setLines] = React.useState<TerminalLine[]>([
    {
      id: uuidv4(),
      content: "Sistema Multi-Agente OpenAI inicializado",
      type: "command",
      timestamp: new Date()
    },
    {
      id: uuidv4(),
      content: "Aguardando comandos...",
      type: "info",
      timestamp: new Date()
    }
  ]);
  
  return (
    <OrchestratorTerminal
      isOpen={true}
      onMinimize={onMinimize}
      lines={lines}
      isProcessing={false}
      minimized={isMinimized}
    />
  );
};

export default OpenAIAgentTerminal;
