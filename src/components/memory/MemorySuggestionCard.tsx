
import React from "react";
import { Database, Check, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAgent } from "@/contexts/AgentContext";

interface MemorySuggestionCardProps {
  suggestion: {
    id: number;
    userId: string;
    entry: {
      key: string;
      value: string;
      label: string;
      source: string;
    };
    timestamp: Date;
  };
  onAccept: () => void;
  onDecline: () => void;
}

const MemorySuggestionCard: React.FC<MemorySuggestionCardProps> = ({
  suggestion,
  onAccept,
  onDecline
}) => {
  return (
    <Card className="border border-primary/20 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-1 p-1.5 bg-primary/10 rounded-full">
              <Database className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Memorizar informação?</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Detectamos uma informação útil para suas futuras interações:
              </p>
              <div className="mt-2 bg-primary/10 p-2 rounded-md">
                <p className="text-sm">
                  <span className="font-medium">{suggestion.entry.label}:</span> {suggestion.entry.value}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-1.5">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-7 w-7 rounded-full hover:bg-destructive/10 hover:text-destructive"
              onClick={onDecline}
            >
              <X className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-7 w-7 rounded-full hover:bg-primary/10"
              onClick={onAccept}
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MemorySuggestionCard;
