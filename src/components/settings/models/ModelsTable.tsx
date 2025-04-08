
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { AIModel } from "@/types";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

interface ModelsTableProps {
  models: AIModel[];
  onRemoveModel: (id: string) => void;
}

const ModelsTable: React.FC<ModelsTableProps> = ({ models, onRemoveModel }) => {
  const { toast } = useToast();

  const handleRemoveModel = (model: AIModel) => {
    onRemoveModel(model.id);
    toast({
      title: "Provedor removido",
      description: `${model.provider} foi removido com sucesso`,
    });
  };

  if (models.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum provedor configurado ainda. Adicione um para começar.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Provedor</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>API Key</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {models.map((model) => (
          <TableRow key={model.id}>
            <TableCell className="font-medium">{model.provider}</TableCell>
            <TableCell>{model.description}</TableCell>
            <TableCell>
              {model.apiKey ? "••••••••" : "Não configurada"}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleRemoveModel(model)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ModelsTable;
