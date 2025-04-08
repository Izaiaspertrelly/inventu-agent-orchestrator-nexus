import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, User, ChevronDown, ExternalLink } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import ProfileDialog from "@/components/ProfileDialog";
import AdminSystemSettings from "@/components/admin/AdminSystemSettings";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);

  // Handle logout
  const handleLogout = () => {
    logout();
    toast({
      title: "Sessão encerrada",
      description: "Você foi desconectado com sucesso.",
    });
    navigate("/login");
  };
  
  // Handle navigation to user application
  const goToUserInterface = () => {
    console.log("Navigating to home page from admin dashboard");
    try {
      navigate("/");
      console.log("Navigation successful");
    } catch (error) {
      console.error("Navigation error:", error);
      toast({
        title: "Erro de Navegação",
        description: "Não foi possível navegar para a página inicial.",
        variant: "destructive"
      });
    }
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
          
          <div className="flex items-center gap-3">
            <Button 
              onClick={goToUserInterface} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Ir para Aplicação
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 pr-2">
                  <Avatar className="h-8 w-8">
                    {user?.profileImage ? (
                      <AvatarImage src={user.profileImage} alt={user?.name || "User"} />
                    ) : (
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span className="text-sm font-medium">{user?.name || "Usuário"}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => setProfileDialogOpen(true)}>
                  Meu Perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={goToUserInterface}>
                  Ir para Aplicação
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Sistema</CardTitle>
              <CardDescription>
                Gerencie todos os aspectos do sistema através dos módulos abaixo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdminSystemSettings />
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Profile Dialog */}
      <ProfileDialog 
        open={profileDialogOpen} 
        onOpenChange={setProfileDialogOpen} 
      />
    </div>
  );
};

export default AdminDashboard;
