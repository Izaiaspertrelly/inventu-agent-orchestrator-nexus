
import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Database, User } from "lucide-react";

interface UserHeaderActionsProps {
  onOpenProfileDialog: () => void;
  onOpenKnowledgeDialog: () => void;
}

const UserHeaderActions: React.FC<UserHeaderActionsProps> = ({ 
  onOpenProfileDialog,
  onOpenKnowledgeDialog
}) => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="absolute top-5 right-5 flex items-center gap-2">
      <Button 
        variant="ghost" 
        size="icon"
        className="rounded-full"
        onClick={onOpenKnowledgeDialog}
      >
        <Database className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        className="rounded-full"
        onClick={onOpenProfileDialog}
      >
        <User className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default UserHeaderActions;
