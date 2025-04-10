
import React from "react";
import { Message } from "@/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import ProcessingSteps from "@/components/message/ProcessingSteps";
import MarkdownRenderer from "@/components/message/MarkdownRenderer";

interface ChatMessageProps {
  message: Message;
}

// Check if message is from Orchestrator
const isOrchestratorMessage = (message: Message) => {
  return message.content.includes("💭 **Pensando...**") || 
         message.content.includes("🔍 **Buscando informações") ||
         message.content.includes("🧠 **Processando com raciocínio") ||
         (message.modelUsed && message.modelUsed.toLowerCase().includes("orchestrator"));
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === "user";
  const isProcessing = message.content.includes("💭 **Pensando...**") || 
                       message.content.includes("🔍 **Buscando informações");
  const isOrchestrator = !isUser && isOrchestratorMessage(message);

  return (
    <div
      className={cn(
        "mb-4 max-w-[85%]",
        isUser ? "ml-auto" : "mr-auto"
      )}
    >
      <div
        className={cn(
          "rounded-2xl p-4 shadow-sm",
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-sm"
            : isOrchestrator
              ? "bg-gradient-to-br from-violet-500/10 to-blue-500/10 border border-violet-500/20 rounded-tl-sm"
              : "apple-blur rounded-tl-sm"
        )}
      >
        <div className="text-sm leading-relaxed">
          {isUser ? (
            message.content
          ) : isProcessing ? (
            <ProcessingSteps content={message.content} />
          ) : (
            <MarkdownRenderer content={message.content} />
          )}
        </div>
      </div>
      
      <div className={cn("flex mt-1.5 text-xs", isUser ? "justify-end" : "justify-start")}>
        <div className="flex items-center gap-2">
          {!isUser && message.modelUsed && (
            <Badge 
              variant="outline" 
              className={cn(
                "text-xs font-normal bg-background/40 backdrop-blur-sm",
                isOrchestrator && "bg-violet-500/10 text-violet-500 border-violet-500/30"
              )}
            >
              {isOrchestrator ? "Orquestrador Neural" : `Modelo: ${message.modelUsed}`}
            </Badge>
          )}
          
          {!isUser && message.toolsUsed && message.toolsUsed.length > 0 && (
            <Badge variant="outline" className="text-xs font-normal bg-background/40 backdrop-blur-sm">
              Ferramentas: {message.toolsUsed.join(", ")}
            </Badge>
          )}
          
          <span className="text-muted-foreground">
            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
