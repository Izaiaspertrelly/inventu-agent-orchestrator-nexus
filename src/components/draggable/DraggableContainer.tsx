
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
  attachToSearchBar?: boolean; // New prop to indicate if it should be attached to search bar
}

const DraggableContainer: React.FC<DraggableContainerProps> = ({
  children,
  isMinimized,
  initialPosition = { x: 0, y: 0 },
  className = "",
  style = {},
  attachToSearchBar = false, // Default is not attached
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
    
    // Only center position if not attached to search bar
    if (!attachToSearchBar) {
      centerPosition();
      
      window.addEventListener('resize', centerPosition);
      return () => {
        window.removeEventListener('resize', centerPosition);
      };
    }
  }, [isMinimized, attachToSearchBar]);

  // Find the search bar element and position relative to it when attached
  useEffect(() => {
    if (attachToSearchBar && isMinimized) {
      const positionRelativeToSearchBar = () => {
        const searchBarElement = document.querySelector('.neo-blur') as HTMLElement;
        if (searchBarElement && containerRef.current) {
          const searchBarRect = searchBarElement.getBoundingClientRect();
          const terminalWidth = containerRef.current.offsetWidth;
          
          // Position the terminal at the bottom right of the search bar
          setPosition({
            x: searchBarRect.right - terminalWidth - 10,
            y: searchBarRect.bottom + 5
          });
        }
      };
      
      positionRelativeToSearchBar();
      
      // Observe search bar position changes
      const observer = new MutationObserver(positionRelativeToSearchBar);
      const searchBarElement = document.querySelector('.neo-blur');
      if (searchBarElement) {
        observer.observe(searchBarElement, { 
          attributes: true, 
          attributeFilter: ['style'] 
        });
      }
      
      // Also reposition on resize
      window.addEventListener('resize', positionRelativeToSearchBar);
      
      return () => {
        observer.disconnect();
        window.removeEventListener('resize', positionRelativeToSearchBar);
      };
    }
  }, [attachToSearchBar, isMinimized]);

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
    if (!isDragging || attachToSearchBar) return; // Don't allow dragging when attached
    
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
    if (isDragging && !attachToSearchBar) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, attachToSearchBar]);

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
        onMouseDown={attachToSearchBar ? undefined : handleMouseDown}
        style={{ 
          cursor: attachToSearchBar ? "default" : isDragging ? "grabbing" : "grab",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default DraggableContainer;
