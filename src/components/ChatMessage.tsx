
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
        "mb-4 max-w-[80%]",
        isUser ? "ml-auto" : "mr-auto"
      )}
    >
      <div
        className={cn(
          "rounded-xl p-4",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-card text-card-foreground"
        )}
      >
        <div className="text-sm">{message.content}</div>
      </div>
      
      <div className={cn("flex mt-1 text-xs", isUser ? "justify-end" : "justify-start")}>
        <div className="flex items-center gap-2">
          {!isUser && message.modelUsed && (
            <Badge variant="outline" className="text-xs font-normal">
              Modelo: {message.modelUsed}
            </Badge>
          )}
          
          {!isUser && message.toolsUsed && message.toolsUsed.length > 0 && (
            <Badge variant="outline" className="text-xs font-normal">
              Ferramentas: {message.toolsUsed.join(", ")}
            </Badge>
          )}
          
          <span className="text-muted-foreground">
            {new Date(message.createdAt).toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
