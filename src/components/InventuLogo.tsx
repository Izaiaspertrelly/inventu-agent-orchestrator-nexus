
import React from "react";

interface LogoProps {
  size?: number;
}

const InventuLogo: React.FC<LogoProps> = ({ size = 36 }) => {
  return (
    <div className="flex items-center gap-2">
      <img 
        src="/lovable-uploads/52453eae-2c49-45b2-9778-516573d927f3.png" 
        alt="InventuAI Logo" 
        className="h-auto"
        style={{ width: size, height: size }}
      />
      <span className="font-semibold text-xl">
        <span className="text-primary">InventuAI</span>
      </span>
    </div>
  );
};

export default InventuLogo;
