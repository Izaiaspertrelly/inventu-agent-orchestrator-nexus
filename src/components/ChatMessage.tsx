
import React from "react";
import { Message } from "@/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === "user";

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
            : "apple-blur rounded-tl-sm"
        )}
      >
        <div className="text-sm leading-relaxed">{message.content}</div>
      </div>
      
      <div className={cn("flex mt-1.5 text-xs", isUser ? "justify-end" : "justify-start")}>
        <div className="flex items-center gap-2">
          {!isUser && message.modelUsed && (
            <Badge variant="outline" className="text-xs font-normal bg-background/40 backdrop-blur-sm">
              Modelo: {message.modelUsed}
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
