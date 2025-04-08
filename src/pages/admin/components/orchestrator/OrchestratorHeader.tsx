
import React from "react";
import { Brain } from "lucide-react";

const OrchestratorHeader: React.FC = () => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Brain className="h-6 w-6 text-primary" />
        <h3 className="text-2xl font-semibold">Orquestrador Neural</h3>
      </div>
      <p className="text-muted-foreground">
        O Orquestrador Neural é o centro de controle que gerencia a memória, o estado, 
        o raciocínio e o planejamento do sistema. Ele coordena o fluxo de informações entre 
        modelos e ferramentas, mantém o histórico de interações, decompõe tarefas complexas, 
        monitora o desempenho e gerencia recursos computacionais.
      </p>
    </div>
  );
};

export default OrchestratorHeader;
