
import React from "react";

interface SidebarIconProps {
  className?: string;
  onClick?: () => void;
}

const SidebarIcon: React.FC<SidebarIconProps> = ({ className, onClick }) => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    onClick={onClick}
    style={{ cursor: onClick ? 'pointer' : 'default' }}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
    <line x1="9" y1="3" x2="9" y2="21" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export default SidebarIcon;
