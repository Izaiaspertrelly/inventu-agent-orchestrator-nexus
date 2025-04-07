import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Image, Clock } from "lucide-react";
import { useChat } from "@/contexts/ChatContext";

const ChatInput: React.FC = () => {
  const { sendMessage } = useChat();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || isLoading) return;
    
    setIsLoading(true);
    try {
      await sendMessage(message);
      setMessage("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t bg-card/50">
      <div className="flex items-end gap-2">
        <Textarea
          placeholder="Digite uma mensagem..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[60px] resize-none"
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="icon"
          className="h-[60px] w-[60px] rounded-full bg-primary hover:bg-primary/90"
          disabled={isLoading || !message.trim()}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
};

export default ChatInput;
