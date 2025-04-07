
import React from "react";

interface LogoProps {
  size?: number;
}

const InventuLogo: React.FC<LogoProps> = ({ size = 36 }) => {
  return (
    <div className="flex items-center gap-2">
      <div 
        className="rounded-xl bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <span className="text-white font-bold" style={{ fontSize: size * 0.6 }}>i</span>
      </div>
      <span className="font-semibold text-xl">
        <span className="text-primary">inven</span>
        <span className="text-white">tu</span>
      </span>
    </div>
  );
};

export default InventuLogo;
