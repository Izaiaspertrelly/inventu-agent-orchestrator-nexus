
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import SettingsTabs from "@/components/settings/SettingsTabs";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { toast } = useToast();

  // Handle logout
  const handleLogout = () => {
    logout();
    toast({
      title: "Sessão encerrada",
      description: "Você foi desconectado com sucesso.",
    });
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 p-4 bg-card">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/5c33ad20-fb0e-41b1-ae4a-ef5922b7de8b.png" 
              alt="Logo" 
              className="w-8 h-8 object-contain"
            />
            <h1 className="text-xl font-bold">Painel Administrativo</h1>
          </div>
          
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main content */}
      <div className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-card p-6 rounded-lg shadow-sm border border-border/50">
            <h2 className="text-2xl font-semibold mb-6">Configurações do Sistema</h2>
            <SettingsTabs />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
