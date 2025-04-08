
import React from "react";

interface LogoProps {
  size?: number;
}

const InventuLogo: React.FC<LogoProps> = ({ size = 64 }) => {
  return (
    <img 
      src="/lovable-uploads/52453eae-2c49-45b2-9778-516573d927f3.png" 
      alt="Logo" 
      className="object-cover"
      style={{ 
        width: size, 
        height: size * 1.5, // Make it taller vertically
        objectFit: 'cover'
      }}
    />
  );
};

export default InventuLogo;
