
import React, { useState } from "react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "destaques", name: "Destaques" },
  { id: "pesquisa", name: "Pesquisa" },
  { id: "vida", name: "Vida" },
  { id: "analise", name: "Análise de Dados" },
  { id: "educacao", name: "Educação" },
  { id: "produtividade", name: "Produtividade" },
];

const ChatCategories: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("destaques");

  return (
    <div className="overflow-x-auto py-4 px-2">
      <div className="flex space-x-2">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            className={cn(
              "category-pill whitespace-nowrap",
              activeCategory === category.id ? "active" : ""
            )}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatCategories;
