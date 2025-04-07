
import React from "react";

interface LogoProps {
  size?: number;
}

const InventuLogo: React.FC<LogoProps> = ({ size = 36 }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="font-semibold text-xl">
        <span className="text-inventu-primary">inven</span>
        <span className="text-white">tu</span>
      </span>
    </div>
  );
};

export default InventuLogo;
