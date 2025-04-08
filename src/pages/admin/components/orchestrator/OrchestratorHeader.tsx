
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
        O Orquestrador Neural é a camada central e inteligente responsável por comandar, direcionar e conectar 
        todos os fluxos de raciocínio, ação e execução de um ecossistema de agentes de IA. Ele atua como o 
        "cérebro executivo" da arquitetura, integrando diferentes contextos, entradas, intenções e ferramentas 
        em uma única malha neural operacional.
      </p>
    </div>
  );
};

export default OrchestratorHeader;
