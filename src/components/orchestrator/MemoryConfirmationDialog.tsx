
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAgent } from "@/contexts/AgentContext";

interface MemoryConfirmationDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  pendingConfirmation: {
    id: number;
    userId: string;
    entry: {
      key: string;
      value: any;
      label: string;
      source: string;
    };
    timestamp: Date;
  } | null;
}

const MemoryConfirmationDialog: React.FC<MemoryConfirmationDialogProps> = ({
  open,
  setOpen,
  pendingConfirmation
}) => {
  const { processMemoryConfirmation } = useAgent();
  
  const handleConfirm = () => {
    if (pendingConfirmation) {
      processMemoryConfirmation(pendingConfirmation.id, true);
    }
    setOpen(false);
  };
  
  const handleDeny = () => {
    if (pendingConfirmation) {
      processMemoryConfirmation(pendingConfirmation.id, false);
    }
    setOpen(false);
  };
  
  if (!pendingConfirmation) return null;
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Salvar na memória</DialogTitle>
          <DialogDescription>
            O Orquestrador Neural detectou uma informação que pode ser útil para futuras interações.
            Deseja salvar esta informação?
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Informação detectada:</p>
            <div className="bg-secondary/20 p-3 rounded-md">
              <p className="text-sm"><span className="font-medium">{pendingConfirmation.entry.label}:</span> {pendingConfirmation.entry.value}</p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleDeny}>
            Não salvar
          </Button>
          <Button onClick={handleConfirm}>
            Salvar informação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MemoryConfirmationDialog;
