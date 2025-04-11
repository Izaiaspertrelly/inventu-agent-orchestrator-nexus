
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, Settings } from "lucide-react";

interface SettingsLayoutProps {
  children: React.ReactNode;
  title?: string;
  backTo?: string;
  backLabel?: string;
}

const SettingsLayout: React.FC<SettingsLayoutProps> = ({
  children,
  title = "Configurações",
  backTo = "/",
  backLabel = "Voltar"
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-muted/30">
      <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex items-center justify-between h-14 px-4">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-muted-foreground"
            onClick={handleBack}
          >
            <ChevronLeft className="h-4 w-4" />
            {backLabel}
          </Button>
          
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <h1 className="text-sm font-medium">{title}</h1>
          </div>
          
          <div className="w-20" /> {/* Espaçador para centralizar o título */}
        </div>
      </header>
      
      <main className="flex-1 container py-6 md:py-8 px-4">
        {children}
      </main>
    </div>
  );
};

export default SettingsLayout;
