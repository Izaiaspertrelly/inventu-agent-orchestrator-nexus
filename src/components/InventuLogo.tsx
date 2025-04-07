
import React from "react";

interface LogoProps {
  size?: number;
}

const InventuLogo: React.FC<LogoProps> = ({ size = 36 }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="rounded-xl bg-gradient-to-br from-inventu-primary to-inventu-accent p-1 text-white font-bold" style={{ width: size, height: size }}>
        <div className="flex items-center justify-center h-full">
          <span>I</span>
        </div>
      </div>
      <span className="font-semibold inventu-gradient-text text-xl">Inventu</span>
    </div>
  );
};

export default InventuLogo;
