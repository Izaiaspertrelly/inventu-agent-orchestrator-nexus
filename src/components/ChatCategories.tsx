
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
    <div className="py-4 px-6 flex items-center justify-center overflow-x-auto apple-blur">
      <div className="flex gap-3">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === category
                ? "bg-primary text-white shadow-md"
                : "bg-secondary/50 hover:bg-secondary text-foreground"
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
