
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
            <img 
              src="/lovable-uploads/e1128db6-4e54-486b-8625-bbba595f0242.png" 
              alt="Inventu Logo" 
              className="mx-auto h-24 w-24 object-contain mb-4"
            />
            <p className="text-white/80 text-lg">
              Super Agent
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/90">Email</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="bg-black/80 border-[0.5px] border-blue-500/30 text-white placeholder:text-white/40 focus:border-blue-500 transition-all duration-300"
                />
                <div className="absolute inset-0 rounded-md pointer-events-none border border-blue-500/20 shadow-[0_0_10px_1px_rgba(33,150,243,0.3)] blur-[1px] transition-opacity opacity-0 peer-focus:opacity-100"></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/90">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="bg-black/80 border-[0.5px] border-blue-500/30 text-white placeholder:text-white/40 focus:border-blue-500 transition-all duration-300"
                />
                <div className="absolute inset-0 rounded-md pointer-events-none border border-blue-500/20 shadow-[0_0_10px_1px_rgba(33,150,243,0.3)] blur-[1px] transition-opacity opacity-0 peer-focus:opacity-100"></div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button
                type="submit"
                className="inline-flex justify-center items-center px-4 py-2 bg-transparent text-white border-none hover:bg-white/10 rounded-lg transition-colors duration-300 ease-in-out"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
