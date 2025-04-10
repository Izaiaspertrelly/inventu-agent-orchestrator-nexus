
import React, { useState, useRef, useEffect } from "react";

interface Position {
  x: number;
  y: number;
}

interface DraggableContainerProps {
  children: React.ReactNode;
  isMinimized: boolean;
  initialPosition?: Position;
  className?: string;
  style?: React.CSSProperties;
}

const DraggableContainer: React.FC<DraggableContainerProps> = ({
  children,
  isMinimized,
  initialPosition = { x: 0, y: 0 },
  className = "",
  style = {},
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<Position>(initialPosition);
  const [offset, setOffset] = useState<Position>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const centerPosition = () => {
      if (containerRef.current) {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const barWidth = containerRef.current.offsetWidth;
        const barHeight = containerRef.current.offsetHeight;
        
        // For minimized terminal, position it in the top right corner near search bar
        if (isMinimized) {
          const topRightX = windowWidth - barWidth - 20; // 20px from right edge
          const topY = windowHeight - 120; // Positioned above search bar
          
          setPosition({
            x: topRightX,
            y: topY
          });
        } else {
          // Default center position for non-minimized elements
          const centerX = (windowWidth - barWidth) / 2;
          const bottomY = windowHeight - barHeight - 60;
          
          setPosition({
            x: centerX,
            y: bottomY
          });
        }
      }
    };
    
    centerPosition();
    
    window.addEventListener('resize', centerPosition);
    return () => {
      window.removeEventListener('resize', centerPosition);
    };
  }, [isMinimized]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const newX = Math.max(0, Math.min(window.innerWidth - (containerRef.current?.offsetWidth || 300), e.clientX - offset.x));
    const newY = Math.max(0, Math.min(window.innerHeight - (containerRef.current?.offsetHeight || 60), e.clientY - offset.y));
    
    setPosition({
      x: newX,
      y: newY
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div 
      ref={containerRef}
      className={`fixed z-50 shadow-lg ${className}`}
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        transition: isDragging ? 'none' : 'all 0.3s ease',
        ...style
      }}
    >
      <div 
        onMouseDown={handleMouseDown}
        style={{ 
          cursor: isDragging ? "grabbing" : "grab",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default DraggableContainer;
