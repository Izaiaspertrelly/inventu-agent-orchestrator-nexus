
import React, { useState, useEffect } from "react";
import SettingsTabs from "@/components/settings/SettingsTabs";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProfileDialog from "@/components/ProfileDialog";

const Settings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  
  // Redirect non-admin users back to home
  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/admin")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">
            Configurações do Sistema
          </h1>
        </div>
        
        <Avatar
          className="w-10 h-10 cursor-pointer" 
          onClick={() => setProfileDialogOpen(true)}
        >
          {user?.profileImage ? (
            <AvatarImage src={user.profileImage} alt={user?.name || "User"} />
          ) : (
            <AvatarFallback className="bg-primary/10 text-primary">
              <User className="h-5 w-5" />
            </AvatarFallback>
          )}
        </Avatar>
      </div>
      
      <SettingsTabs />
      
      <ProfileDialog 
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
      />
    </div>
  );
};

export default Settings;
