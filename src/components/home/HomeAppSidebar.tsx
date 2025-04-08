
import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, MessageSquare, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarFooter
} from "@/components/ui/sidebar";
import SidebarIcon from "@/components/icons/SidebarIcon";

interface HomeAppSidebarProps {
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
  onProfileDialogOpen: () => void;
}

const HomeAppSidebar: React.FC<HomeAppSidebarProps> = ({ 
  sidebarOpen, 
  onSidebarToggle,
  onProfileDialogOpen
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  return (
    <Sidebar side="left">
      <SidebarHeader className="px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/5c33ad20-fb0e-41b1-ae4a-ef5922b7de8b.png" 
              alt="Logo" 
              className="w-8 h-8 object-contain"
            />
            <h3 className="font-semibold text-lg">Inventor</h3>
          </div>
          <div>
            <SidebarIcon 
              className="h-5 w-5 text-sidebar-foreground" 
              onClick={onSidebarToggle}
            />
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => navigate("/")} isActive={true} tooltip="Início">
              <Home className="mr-2 h-4 w-4" />
              <span>Início</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => navigate("/chat")} tooltip="Conversas">
              <MessageSquare className="mr-2 h-4 w-4" />
              <span>Conversas</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="px-4 py-6">
        <div 
          className="flex items-center gap-2 hover:bg-sidebar-accent/50 p-2 rounded-lg cursor-pointer"
          onClick={onProfileDialogOpen}
        >
          <Avatar className="h-8 w-8">
            {user?.profileImage ? (
              <AvatarImage src={user.profileImage} alt={user?.name || "User"} />
            ) : (
              <AvatarFallback className="bg-primary/10 text-primary">
                <User className="h-4 w-4" />
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <p className="text-sm font-medium">{user?.name || "Usuário"}</p>
            <p className="text-xs text-muted-foreground">
              {user?.role === "admin" ? "Administrador" : "Plano Básico"}
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default HomeAppSidebar;
