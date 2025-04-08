
import React from "react";
import { CardDescription, CardTitle } from "@/components/ui/card";

const OrchestratorHeader: React.FC = () => {
  return (
    <>
      <CardTitle>Configuração do Orquestrador Neural</CardTitle>
      <CardDescription>
        O orquestrador é o cérebro central que coordena todos os outros componentes do sistema.
      </CardDescription>
    </>
  );
};

export default OrchestratorHeader;
