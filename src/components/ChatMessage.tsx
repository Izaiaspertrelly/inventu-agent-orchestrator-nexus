
import React from "react";
import { Message } from "@/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";

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
        <div className="text-sm leading-relaxed">
          {isUser ? (
            message.content
          ) : (
            <ReactMarkdown
              className="prose prose-sm dark:prose-invert max-w-none"
              components={{
                h3: ({ node, ...props }) => <h3 className="text-base font-bold mt-3 mb-2" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-2" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-2" {...props} />,
                li: ({ node, ...props }) => <li className="my-1" {...props} />,
                p: ({ node, ...props }) => <p className="my-2" {...props} />,
                hr: ({ node, ...props }) => <hr className="my-3 border-muted" {...props} />,
                strong: ({ node, ...props }) => <strong className="font-bold" {...props} />
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
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
