
// Lista dos 20 principais provedores de IA
export const AI_PROVIDERS = [
  { id: "openai", name: "OpenAI" },
  { id: "anthropic", name: "Anthropic" },
  { id: "google", name: "Google AI" },
  { id: "meta", name: "Meta AI" },
  { id: "cohere", name: "Cohere" },
  { id: "mistral", name: "Mistral AI" },
  { id: "perplexity", name: "Perplexity" },
  { id: "microsoft", name: "Microsoft" },
  { id: "nvidia", name: "NVIDIA" },
  { id: "stability", name: "Stability AI" },
  { id: "deepmind", name: "DeepMind" },
  { id: "huggingface", name: "HuggingFace" },
  { id: "adept", name: "Adept AI" },
  { id: "inflection", name: "Inflection AI" },
  { id: "midjourney", name: "Midjourney" },
  { id: "amazon", name: "Amazon Bedrock" },
  { id: "replicate", name: "Replicate" },
  { id: "databricks", name: "Databricks" },
  { id: "ibm", name: "IBM" },
  { id: "baidu", name: "Baidu" }
];

// Endpoints para buscar modelos de cada provedor
export const PROVIDER_MODEL_ENDPOINTS = {
  "openai": "/api/models/openai",
  "anthropic": "/api/models/anthropic",
  "google": "/api/models/google",
  "meta": "/api/models/meta",
  "cohere": "/api/models/cohere",
  "mistral": "/api/models/mistral",
  "perplexity": "/api/models/perplexity",
  "microsoft": "/api/models/microsoft",
  "nvidia": "/api/models/nvidia",
  "stability": "/api/models/stability",
  "deepmind": "/api/models/deepmind",
  "huggingface": "/api/models/huggingface",
  "adept": "/api/models/adept",
  "inflection": "/api/models/inflection",
  "midjourney": "/api/models/midjourney",
  "amazon": "/api/models/amazon",
  "replicate": "/api/models/replicate",
  "databricks": "/api/models/databricks",
  "ibm": "/api/models/ibm",
  "baidu": "/api/models/baidu"
};
