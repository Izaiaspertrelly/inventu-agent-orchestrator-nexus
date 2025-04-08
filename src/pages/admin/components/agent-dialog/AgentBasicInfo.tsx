
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AgentBasicInfoProps {
  name: string;
  description: string;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
}

const AgentBasicInfo: React.FC<AgentBasicInfoProps> = ({
  name,
  description,
  onNameChange,
  onDescriptionChange
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="agentName">Nome do Agente</Label>
        <Input
          id="agentName"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Nome do agente"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="agentDescription">Descrição</Label>
        <Textarea
          id="agentDescription"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Descrição do propósito do agente"
        />
      </div>
    </>
  );
};

export default AgentBasicInfo;
