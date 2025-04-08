
import React from "react";

interface LogoProps {
  size?: number;
}

const InventuLogo: React.FC<LogoProps> = ({ size = 36 }) => {
  return (
    <img 
      src="/lovable-uploads/52453eae-2c49-45b2-9778-516573d927f3.png" 
      alt="Logo" 
      className="h-auto"
      style={{ width: size, height: size }}
    />
  );
};

export default InventuLogo;
