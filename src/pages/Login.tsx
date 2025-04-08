
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha email e senha",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      toast({
        title: "Falha no login",
        description: "Email ou senha incorretos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-black">
      <div className="relative w-full max-w-md m-auto p-0.5 rounded-2xl">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-blue-400 opacity-90 animate-border-glow"></div>
        
        <div className="relative bg-black/80 backdrop-blur-xl p-8 rounded-2xl z-10">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-2">
              <img 
                src="/lovable-uploads/bf93da3a-d818-497c-9071-b99f24e499f2.png" 
                alt="Inventu Logo" 
                className="h-16 w-auto"
              />
            </div>
            <p className="text-white/80 text-apple-lg font-apple-sf">
              Super Agent
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/90 font-apple-sf text-apple-sm">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="bg-black/80 border-white/20 text-white placeholder:text-white/40 focus:border-blue-500 font-apple-sf text-apple-base"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/90 font-apple-sf text-apple-sm">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="bg-black/80 border-white/20 text-white placeholder:text-white/40 focus:border-blue-500 font-apple-sf text-apple-base"
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/10 py-6 rounded-xl backdrop-blur-sm mt-6 font-apple-medium text-apple-base transition-all"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
