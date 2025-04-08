
import React from "react";
import { Agent } from "@/types";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AgentSelectorProps {
  agents: Agent[];
  mainAgent: string;
  setMainAgent: (value: string) => void;
}

const AgentSelector: React.FC<AgentSelectorProps> = ({ agents, mainAgent, setMainAgent }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="mainAgent">Agente Principal</Label>
      <Select
        value={mainAgent}
        onValueChange={setMainAgent}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecione um agente principal" />
        </SelectTrigger>
        <SelectContent>
          {agents.map((agent) => (
            <SelectItem key={agent.id} value={agent.id}>
              {agent.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-sm text-muted-foreground">
        Este é o agente que será responsável pela tomada de decisões primárias e delegação de tarefas.
      </p>
    </div>
  );
};

export default AgentSelector;
