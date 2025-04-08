
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/services/api";
import { Save, CheckCircle, AlertCircle } from "lucide-react";

const ApiConfigTab = () => {
  const { toast } = useToast();
  
  // State para configurações da API
  const [baseUrl, setBaseUrl] = useState("");
  const [token, setToken] = useState("");
  const [testStatus, setTestStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  
  // Carregar configurações salvas no localStorage
  useEffect(() => {
    const savedBaseUrl = localStorage.getItem("inventu_api_base_url");
    const savedToken = localStorage.getItem("inventu_api_token");
    
    if (savedBaseUrl) setBaseUrl(savedBaseUrl);
    if (savedToken) setToken(savedToken);
  }, []);
  
  // Salvar configurações
  const handleSaveConfig = () => {
    try {
      // Normalize the URL (remove trailing slash)
      const normalizedUrl = baseUrl.trim().endsWith('/')
        ? baseUrl.trim().slice(0, -1)
        : baseUrl.trim();
        
      localStorage.setItem("inventu_api_base_url", normalizedUrl);
      if (token) {
        localStorage.setItem("inventu_api_token", token);
        api.setAuthToken(token);
      }
      
      toast({
        title: "Configuração salva",
        description: "As configurações da API foram salvas com sucesso",
      });
    } catch (error) {
      console.error("Error saving API config:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as configurações da API",
        variant: "destructive",
      });
    }
  };
  
  // Testar conexão com a API
  const handleTestConnection = async () => {
    if (!baseUrl) {
      toast({
        title: "URL da API não configurada",
        description: "Por favor, insira a URL da API para testar a conexão",
        variant: "destructive",
      });
      return;
    }
    
    setTestStatus("loading");
    
    try {
      // Normalize URL for testing
      const testUrl = baseUrl.trim().endsWith('/')
        ? baseUrl.trim().slice(0, -1)
        : baseUrl.trim();
      
      console.log(`Testing API connection to: ${testUrl}`);
      
      const response = await fetch(testUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` }),
        },
        mode: 'cors',
      });
      
      console.log(`API test response status: ${response.status}`);
      
      if (response.ok) {
        setTestStatus("success");
        toast({
          title: "Conexão bem-sucedida",
          description: "A API está respondendo corretamente",
        });
      } else {
        setTestStatus("error");
        const errorText = await response.text();
        console.log(`API error response: ${errorText}`);
        
        toast({
          title: "Erro na conexão",
          description: `Status: ${response.status} - ${response.statusText}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("API connection test error:", error);
      setTestStatus("error");
      toast({
        title: "Erro na conexão",
        description: "Não foi possível conectar à API. Verifique a URL e sua conexão",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuração da API</CardTitle>
          <CardDescription>
            Configure os parâmetros de conexão para as requisições HTTP
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiBaseUrl">URL Base da API</Label>
              <Input
                id="apiBaseUrl"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://api.exemplo.com/v1"
              />
              <p className="text-xs text-muted-foreground">
                Exemplo: https://server.smithery.ai/@seu-usuario/seu-servidor
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="apiToken">Token de Autenticação</Label>
              <Input
                id="apiToken"
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Seu token de autenticação (opcional)"
              />
            </div>
            <div className="flex space-x-2 pt-2">
              <Button className="inventu-btn" onClick={handleSaveConfig}>
                <Save className="mr-2 h-4 w-4" />
                Salvar Configuração
              </Button>
              <Button 
                variant={testStatus === "error" ? "destructive" : "outline"} 
                onClick={handleTestConnection}
                disabled={testStatus === "loading"}
              >
                {testStatus === "success" && (
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                )}
                {testStatus === "error" && (
                  <AlertCircle className="mr-2 h-4 w-4" />
                )}
                {testStatus === "loading" ? "Testando..." : "Testar Conexão"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiConfigTab;
