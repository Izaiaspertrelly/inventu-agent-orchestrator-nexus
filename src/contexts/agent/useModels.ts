
import { useState } from "react";
import { AIModel } from "@/types";

// Default models
const DEFAULT_MODELS: AIModel[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    providerId: "openai",
    description: "Modelo mais avançado da OpenAI com capacidade multimodal",
    capabilities: ["general", "vision", "reasoning", "creative"],
  },
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    provider: "OpenAI",
    providerId: "openai",
    description: "Modelo eficiente para a maioria das tarefas",
    capabilities: ["general", "summarization", "translation"],
  },
  {
    id: "claude-3-opus",
    name: "Claude 3 Opus",
    provider: "Anthropic",
    providerId: "anthropic",
    description: "Modelo de alta capacidade da Anthropic",
    capabilities: ["general", "reasoning", "analysis"],
  },
  {
    id: "gemini-pro",
    name: "Gemini Pro",
    provider: "Google",
    providerId: "google",
    description: "Modelo avançado do Google AI",
    capabilities: ["general", "reasoning", "creative"],
  },
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
