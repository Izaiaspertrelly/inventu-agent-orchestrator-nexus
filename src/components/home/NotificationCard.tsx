
import React from "react";
import { Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAgent } from "@/contexts/AgentContext";
import { useLocalStorage } from "@/hooks/use-local-storage";

const NotificationCard: React.FC = () => {
  const { toast } = useToast();
  const { updateOrchestratorConfig, orchestratorConfig } = useAgent();
  const [showNotification, setShowNotification] = useLocalStorage("orchestrator-memory-notification", true);

  const handleAccept = () => {
    try {
      // Update orchestratorConfig to enable memory user prompts
      const updatedConfig = {
        ...orchestratorConfig,
        memory: {
          ...(orchestratorConfig?.memory || {}),
          enabled: true,
          userPromptEnabled: true
        }
      };
      
      // Save the updated configuration
      updateOrchestratorConfig(updatedConfig);
      
      // Show success message
      toast({
        title: "Autorização concedida",
        description: "O Orquestrador Neural agora pode salvar informações úteis na memória",
      });
      
      // Hide notification
      setShowNotification(false);
    } catch (error) {
      console.error("Erro ao atualizar configuração:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar as preferências",
        variant: "destructive"
      });
    }
  };

  const handleDecline = () => {
    try {
      // Update orchestratorConfig to disable memory user prompts
      const updatedConfig = {
        ...orchestratorConfig,
        memory: {
          ...(orchestratorConfig?.memory || {}),
          enabled: true, // Keep memory enabled but don't prompt
          userPromptEnabled: false
        }
      };
      
      // Save the updated configuration
      updateOrchestratorConfig(updatedConfig);
      
      // Show info message
      toast({
        title: "Autorização recusada",
        description: "O Orquestrador não irá solicitar confirmações para memória",
      });
      
      // Hide notification
      setShowNotification(false);
    } catch (error) {
      console.error("Erro ao atualizar configuração:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar as preferências",
        variant: "destructive"
      });
    }
  };

  // If notification was already responded to, don't show
  if (!showNotification) {
    return null;
  }

  return (
    <div className="w-full p-3 rounded-2xl bg-secondary/30 backdrop-blur-sm border border-border/40 flex items-center">
      <div className="rounded-xl bg-secondary/70 p-2 mr-3">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5z"></path>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
      </div>
      <div className="flex-1">
        <p className="text-sm">
          Autorize o Inventor a confirmar alguns de seus planos nos principais marcos
        </p>
      </div>
      <div className="flex items-center gap-2 ml-3">
        <button 
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-secondary/70 hover:bg-secondary/90 text-foreground text-xs transition-colors"
          onClick={handleDecline}
        >
          <X className="h-3 w-3" />
          <span>Recusar</span>
        </button>
        <button 
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs transition-colors"
          onClick={handleAccept}
        >
          <Check className="h-3 w-3" />
          <span>Aceitar</span>
        </button>
      </div>
    </div>
  );
};

export default NotificationCard;
