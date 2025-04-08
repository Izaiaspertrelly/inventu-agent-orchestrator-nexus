
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import SuggestionBar from "@/components/SuggestionBar";

const Index: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    // Navigate to the chat page when search is submitted
    navigate("/chat");
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background dark p-4">
      <div className="max-w-3xl w-full text-center">
        <div className="mb-8">
          <img 
            src="/lovable-uploads/5c33ad20-fb0e-41b1-ae4a-ef5922b7de8b.png" 
            alt="Super Agent Logo" 
            className="w-32 h-32 object-contain mx-auto mb-6"
          />
          <h1 className="text-4xl font-bold mb-2 tracking-tight">
            Inventu Super Agent
          </h1>
          <p className="text-lg text-muted-foreground">
            Seu assistente inteligente para resolver qualquer problema
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="mb-12">
          <div className="relative">
            <Input
              className="w-full py-6 px-4 pl-12 rounded-full text-lg bg-secondary/10 backdrop-blur-sm border border-border focus:border-primary"
              placeholder="No que posso te ajudar hoje?"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              autoFocus
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Button 
              type="submit" 
              variant="default" 
              size="icon" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </Button>
          </div>
        </form>
        
        <div className="w-full">
          <SuggestionBar />
        </div>
      </div>
    </div>
  );
};

export default Index;
