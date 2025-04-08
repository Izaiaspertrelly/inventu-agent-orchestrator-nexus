
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
    <div className="flex min-h-screen bg-[#F5F5F7]">
      <div className="relative w-full max-w-md m-auto p-0.5 rounded-3xl">
        {/* Subtle gradient background effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 opacity-70 blur-xl"></div>
        
        {/* Frosted glass container */}
        <div className="relative bg-white/60 backdrop-blur-xl p-10 rounded-3xl z-10 shadow-lg border border-white/30">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <img 
                src="/lovable-uploads/bf93da3a-d818-497c-9071-b99f24e499f2.png" 
                alt="Inventu Logo" 
                className="h-16 w-auto"
              />
            </div>
            <p className="text-gray-600 text-apple-lg font-apple-sf">
              Super Agent
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-apple-sf text-apple-sm">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="bg-white/50 backdrop-blur-sm border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-blue-400 rounded-xl h-12 font-apple-sf text-apple-base"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-apple-sf text-apple-sm">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="bg-white/50 backdrop-blur-sm border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-blue-400 rounded-xl h-12 font-apple-sf text-apple-base"
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-white/40 border-none text-gray-700 hover:bg-white/70 py-4 rounded-xl backdrop-blur-sm font-apple-medium text-apple-sm transition-all shadow-sm mt-4"
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
