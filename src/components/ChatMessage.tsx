
import React, { useState, useEffect, useRef } from "react";
import { Message } from "@/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  message: Message;
}

// Componente para mostrar passos de processamento com animação
const ProcessingSteps = ({ content }: { content: string }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [displayContent, setDisplayContent] = useState("");
  const [finalContent, setFinalContent] = useState("");
  const [animationComplete, setAnimationComplete] = useState(false);
  const stepsRef = useRef<string[]>([]);
  
  useEffect(() => {
    // Extrai os passos do texto baseado em padrões comuns
    const steps: string[] = [];
    
    // Primeiro, verificamos se o conteúdo contém os marcadores de "Pensando...", "Coletando informações", etc.
    const thinkingMatch = content.match(/💭 \*\*Pensando\.\.\.\*\*\n\n([\s\S]*?)(?=🔍|\📊|\🧠|✅|\-\-\-|$)/);
    if (thinkingMatch) steps.push(thinkingMatch[0].trim());
    
    const memoryMatch = content.match(/🔍 \*\*Buscando informações na memória\.\.\.\*\*([\s\S]*?)(?=📊|\🧠|✅|\-\-\-|$)/);
    if (memoryMatch) steps.push(memoryMatch[0].trim());
    
    const collectingMatch = content.match(/📊 \*\*Coletando informações\.\.\.\*\*([\s\S]*?)(?=🧠|✅|\-\-\-|$)/);
    if (collectingMatch) steps.push(collectingMatch[0].trim());
    
    const reasoningMatch = content.match(/🧠 \*\*Processando com raciocínio\.\.\.\*\*([\s\S]*?)(?=📝|✅|\-\-\-|$)/);
    if (reasoningMatch) steps.push(reasoningMatch[0].trim());
    
    const planningMatch = content.match(/📝 \*\*Organizando resposta\.\.\.\*\*([\s\S]*?)(?=✅|\-\-\-|$)/);
    if (planningMatch) steps.push(planningMatch[0].trim());
    
    const finishedMatch = content.match(/✅ \*\*Finalizado processamento\*\*([\s\S]*?)(?=\-\-\-|$)/);
    if (finishedMatch) steps.push(finishedMatch[0].trim());
    
    // Extrai o conteúdo final após o separador "---"
    const finalContentMatch = content.match(/---\n\n([\s\S]*)/);
    const extractedFinalContent = finalContentMatch ? finalContentMatch[1] : content;
    
    // Se não encontramos passos, mostra todo o conteúdo diretamente
    if (steps.length === 0) {
      setAnimationComplete(true);
      setDisplayContent(content);
      return;
    }
    
    stepsRef.current = steps;
    setFinalContent(extractedFinalContent);
    
    // Inicia a animação com o primeiro passo
    setDisplayContent(steps[0]);
    
    // Configura um temporizador para avançar pelos passos
    const timer = setInterval(() => {
      setCurrentStep(prevStep => {
        if (prevStep >= steps.length - 1) {
          clearInterval(timer);
          // Quando todos os passos foram exibidos, mostrar o conteúdo final
          setTimeout(() => {
            setDisplayContent(extractedFinalContent);
            setAnimationComplete(true);
          }, 1000);
          return prevStep;
        }
        const nextStep = prevStep + 1;
        setDisplayContent(steps[nextStep]);
        return nextStep;
      });
    }, 2000); // 2 segundos por passo
    
    return () => clearInterval(timer);
  }, [content]);
  
  return (
    <div className="space-y-2">
      {!animationComplete ? (
        <>
          <div className="text-sm bg-secondary/30 rounded-md p-3 animate-pulse">
            <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none">
              {displayContent}
            </ReactMarkdown>
          </div>
          <div className="flex gap-1">
            {stepsRef.current.map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "h-1.5 rounded-full flex-1 transition-all duration-300",
                  i === currentStep ? "bg-primary" : 
                  i < currentStep ? "bg-primary/40" : "bg-muted"
                )}
              />
            ))}
          </div>
        </>
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
          {displayContent}
        </ReactMarkdown>
      )}
    </div>
  );
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === "user";
  const isProcessing = message.content.includes("💭 **Pensando...**") || 
                       message.content.includes("🔍 **Buscando informações");

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
          ) : isProcessing ? (
            <ProcessingSteps content={message.content} />
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
