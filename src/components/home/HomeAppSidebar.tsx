
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Database, Home, MessageCircle, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SidebarIcon from "@/components/icons/SidebarIcon";

interface HomeAppSidebarProps {
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
  onProfileDialogOpen: () => void;
  onKnowledgeDialogOpen?: () => void; // Make this optional for backward compatibility
}

const HomeAppSidebar: React.FC<HomeAppSidebarProps> = ({ 
  sidebarOpen, 
  onSidebarToggle,
  onProfileDialogOpen,
  onKnowledgeDialogOpen
}) => {
  const navigate = useNavigate();

  return (
    <Sidebar className="border-r border-border/40">
      <SidebarHeader className="h-14 flex items-center px-4">
        {sidebarOpen ? (
          <div className="flex items-center gap-2">
            <SidebarIcon />
            <span className="font-semibold">Inventor</span>
          </div>
        ) : (
          <SidebarIcon />
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <Button
            variant="ghost"
            className={`w-full justify-${sidebarOpen ? "start" : "center"} mb-1`}
            onClick={() => navigate("/")}
          >
            <Home className="h-5 w-5 mr-2" />
            {sidebarOpen && <span>Início</span>}
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-${sidebarOpen ? "start" : "center"} mb-1`}
            onClick={() => navigate("/chat")}
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            {sidebarOpen && <span>Chat</span>}
          </Button>
          {onKnowledgeDialogOpen && (
            <Button
              variant="ghost"
              className={`w-full justify-${sidebarOpen ? "start" : "center"} mb-1`}
              onClick={onKnowledgeDialogOpen}
            >
              <Database className="h-5 w-5 mr-2" />
              {sidebarOpen && <span>Conhecimento</span>}
            </Button>
          )}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-border/40 p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={onProfileDialogOpen}
          >
            <User className="h-5 w-5" />
          </Button>
          {sidebarOpen && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => navigate("/settings")}
            >
              <Settings className="h-5 w-5" />
            </Button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default HomeAppSidebar;
