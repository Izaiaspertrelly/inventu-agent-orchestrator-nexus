
import { useState } from "react";
import { AIModel } from "@/types";

// Default models
const DEFAULT_MODELS: AIModel[] = [
  {
    id: "minimax",
    name: "MiniMax",
    provider: "MiniMax",
    providerId: "minimax",
    description: "General purpose model with large context window",
    capabilities: ["general", "summarization", "translation"],
  },
  {
    id: "deepseek-r1",
    name: "DeepSeek R1",
    provider: "DeepSeek",
    providerId: "deepseek",
    description: "Model specializing in deep reasoning and analysis",
    capabilities: ["reasoning", "research", "analysis"],
  },
  {
    id: "ideogram",
    name: "Ideogram",
    provider: "Ideogram",
    providerId: "ideogram",
    description: "Image generation and vision model",
    capabilities: ["image-generation", "vision", "creative"],
  },
];

export const useModels = () => {
  const [models, setModels] = useState<AIModel[]>(() => {
    const savedModels = localStorage.getItem("inventu_models");
    return savedModels ? JSON.parse(savedModels) : DEFAULT_MODELS;
  });

  const updateLocalStorage = (updatedModels: AIModel[]) => {
    localStorage.setItem("inventu_models", JSON.stringify(updatedModels));
  };

  const addModel = (model: AIModel) => {
    setModels((prev) => {
      const updated = [...prev, model];
      updateLocalStorage(updated);
      return updated;
    });
  };

  const updateModel = (id: string, modelUpdate: Partial<AIModel>) => {
    setModels((prev) => {
      const updated = prev.map((model) => 
        model.id === id ? { ...model, ...modelUpdate } : model
      );
      updateLocalStorage(updated);
      return updated;
    });
  };

  const removeModel = (id: string) => {
    setModels((prev) => {
      const updated = prev.filter((model) => model.id !== id);
      updateLocalStorage(updated);
      return updated;
    });
  };

  return {
    models,
    addModel,
    updateModel,
    removeModel,
  };
};
