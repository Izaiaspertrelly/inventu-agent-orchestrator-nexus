
import React, { useState, useEffect } from "react";
import { Quote } from "lucide-react";

const suggestions = [
  "Criar Episódio de um Minuto de South Park Sobre Notícias Recentes",
  "Encontrar as melhores oportunidades de investimento para 2025",
  "Criar um resumo dos acontecimentos do mês passado",
  "Elaborar um plano de conteúdo para redes sociais",
  "Gerar uma análise detalhada de tendências de mercado",
  "Criar uma apresentação sobre inovação tecnológica",
  "Preparar um relatório de desempenho trimestral"
];

const SuggestionBar: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % suggestions.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleSuggestionClick = () => {
    console.log("Selected suggestion:", suggestions[currentIndex]);
  };
  
  return (
    <div 
      className="relative w-full max-w-3xl mx-auto cursor-pointer"
      onClick={handleSuggestionClick}
    >
      <div className="bg-black/90 text-white py-4 px-6 rounded-full transition-all hover:bg-black/75">
        <p className="text-base font-medium flex items-center justify-center">
          <Quote className="h-5 w-5 flex-shrink-0 text-primary -rotate-180 inline-block mr-0.5" />
          <span className="mx-0.5">{suggestions[currentIndex]}</span>
          <Quote className="h-5 w-5 flex-shrink-0 text-primary inline-block ml-0.5" />
        </p>
      </div>
    </div>
  );
};

export default SuggestionBar;
