
import React, { useState, useEffect } from "react";
import { useChat } from "@/contexts/ChatContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import SuggestionBar from "@/components/SuggestionBar";
import ProfileDialog from "@/components/ProfileDialog";

// Import our newly created components
import HomeAppSidebar from "@/components/home/HomeAppSidebar";
import SearchForm from "@/components/home/SearchForm";
import HomeLogo from "@/components/home/HomeLogo";
import SidebarToggleButton from "@/components/home/SidebarToggleButton";
import UserHeaderActions from "@/components/home/UserHeaderActions";
import KnowledgeDialog from "@/components/memory/KnowledgeDialog";

const Index = () => {
  const { isProcessing } = useChat();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [knowledgeDialogOpen, setKnowledgeDialogOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  useEffect(() => {
    if (user && user.role === "admin") {
      navigate("/admin");
    }
  }, [user, navigate]);
  
  return (
    <SidebarProvider defaultOpen={sidebarOpen} open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="flex min-h-screen w-full bg-background">
        <HomeAppSidebar 
          sidebarOpen={sidebarOpen} 
          onSidebarToggle={toggleSidebar} 
          onProfileDialogOpen={() => setProfileDialogOpen(true)}
          onKnowledgeDialogOpen={() => setKnowledgeDialogOpen(true)}
        />
        
        <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
          <UserHeaderActions 
            onOpenProfileDialog={() => setProfileDialogOpen(true)} 
            onOpenKnowledgeDialog={() => setKnowledgeDialogOpen(true)}
          />
          <SidebarToggleButton onClick={toggleSidebar} />

          <div className="text-center max-w-2xl">            
            <HomeLogo userName={user?.name} />
            <SearchForm isProcessing={isProcessing} />
            
            <div className="mt-12 w-full">
              <SuggestionBar />
            </div>
          </div>
        </div>
      </div>
      
      <ProfileDialog 
        open={profileDialogOpen} 
        onOpenChange={setProfileDialogOpen} 
      />
      
      <KnowledgeDialog
        open={knowledgeDialogOpen}
        onOpenChange={setKnowledgeDialogOpen}
      />
    </SidebarProvider>
  );
};

export default Index;
