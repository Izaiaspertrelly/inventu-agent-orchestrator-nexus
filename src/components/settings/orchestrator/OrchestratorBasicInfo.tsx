
import React from "react";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Brain } from "lucide-react";

const OrchestratorBasicInfo: React.FC = () => {
  return (
    <Card className="border border-primary/20 bg-primary/5">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/20">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          <Label className="text-xl font-semibold">Orquestrador Neural</Label>
        </div>
        <p className="text-muted-foreground text-sm">
          O Orquestrador Neural é o centro de controle que gerencia a memória, o estado, 
          o raciocínio e o planejamento do sistema. Ele coordena o fluxo de informações entre 
          modelos e ferramentas, mantém o histórico de interações, decompõe tarefas complexas, 
          monitora o desempenho e gerencia recursos computacionais.
        </p>
      </CardContent>
    </Card>
  );
};

export default OrchestratorBasicInfo;
