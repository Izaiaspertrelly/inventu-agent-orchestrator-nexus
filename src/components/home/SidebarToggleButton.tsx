
import React from "react";
import { Button } from "@/components/ui/button";
import SidebarIcon from "@/components/icons/SidebarIcon";

interface SidebarToggleButtonProps {
  onClick: () => void;
}

const SidebarToggleButton: React.FC<SidebarToggleButtonProps> = ({ onClick }) => {
  return (
    <div className="absolute top-4 left-4">
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-10 w-10 rounded-full hover:bg-accent/50"
        onClick={onClick}
      >
        <SidebarIcon className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default SidebarToggleButton;
