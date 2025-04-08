
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, LogOut, MessageSquare, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import SettingsTabs from "@/components/settings/SettingsTabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ProfileDialog from "@/components/ProfileDialog";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

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
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              onClick={() => navigate("/")}
            >
              Voltar para Aplicação
            </Button>
            
            <Button 
              variant="ghost" 
              className="h-10 w-10 rounded-full p-0"
              onClick={() => setProfileDialogOpen(true)}
            >
              <Avatar className="h-8 w-8">
                {user?.profileImage ? (
                  <AvatarImage 
                    src={user.profileImage} 
                    alt={user?.name || "User Profile"} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <AvatarFallback className="h-8 w-8">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                )}
              </Avatar>
            </Button>
            
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
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

      {/* Chat float button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setChatOpen(!chatOpen)}
          className="h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90"
        >
          {chatOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageSquare className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Floating chat */}
      {chatOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-card shadow-xl rounded-lg border border-border/50 flex flex-col z-40 overflow-hidden">
          <div className="p-3 border-b border-border/50 bg-card flex justify-between items-center">
            <h3 className="font-medium">Chat de Teste</h3>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => setChatOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 p-3 overflow-y-auto bg-background/50 flex flex-col gap-3">
            <div className="bg-primary/10 p-3 rounded-lg max-w-[80%] self-start">
              <p className="text-sm">Olá! Este é um chat de teste para o painel administrativo.</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg max-w-[80%] self-start">
              <p className="text-sm">Use este chat para testar modificações no sistema.</p>
            </div>
            <div className="bg-primary p-3 rounded-lg text-primary-foreground max-w-[80%] self-end">
              <p className="text-sm">Entendi, isso vai ajudar a verificar mudanças em tempo real!</p>
            </div>
          </div>
          <div className="p-3 border-t border-border/50 bg-card flex gap-2">
            <input 
              type="text" 
              className="flex-1 px-3 py-2 rounded-md border border-border/50 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Digite uma mensagem..."
            />
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              Enviar
            </Button>
          </div>
        </div>
      )}

      {/* Profile Dialog */}
      <ProfileDialog 
        open={profileDialogOpen} 
        onOpenChange={setProfileDialogOpen} 
      />
    </div>
  );
};

export default AdminDashboard;
