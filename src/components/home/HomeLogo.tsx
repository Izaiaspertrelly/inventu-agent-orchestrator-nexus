
import React from "react";

interface HomeLogoProps {
  userName?: string;
}

const HomeLogo: React.FC<HomeLogoProps> = ({ userName }) => {
  return (
    <>
      <div className="flex justify-center mb-2">
        <div className="relative w-32 h-32">
          <img 
            src="/lovable-uploads/5c33ad20-fb0e-41b1-ae4a-ef5922b7de8b.png" 
            alt="Super Agent Logo" 
            className="w-32 h-32 object-contain"
          />
        </div>
      </div>
      
      <div className="flex flex-col items-center mb-2">
        <h1 className="text-4xl font-bold mb-2 tracking-tight">
          <span className="text-gray-400">Olá</span> {userName ? userName : "Usuário"}
        </h1>
      </div>
    </>
  );
};

export default HomeLogo;
