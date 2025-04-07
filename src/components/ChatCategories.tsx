
import React from "react";

const categories = [
  "Destaques",
  "Pesquisa",
  "Vida",
  "Análise de Dados",
  "Educação",
  "Produtividade",
  "Que diabos"
];

const ChatCategories = () => {
  const [activeCategory, setActiveCategory] = React.useState("Destaques");

  return (
    <div className="p-4 flex items-center justify-center overflow-x-auto">
      <div className="flex gap-2">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === category
                ? "bg-primary/10 text-primary"
                : "hover:bg-secondary/20"
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatCategories;
