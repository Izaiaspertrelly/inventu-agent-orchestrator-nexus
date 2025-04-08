
import { useState } from "react";
import { useAgent } from "../../contexts/AgentContext";
import { extractToolCalls } from "../../utils/chatUtils";
import { useToast } from "../use-toast";

export const useToolExecutor = () => {
  const { toast } = useToast();
  const { mcpConfig, executeMCPTool } = useAgent();
  
  const executeToolsFromMessage = async (userMessage: string) => {
    // Detect if tool execution is required
    const toolCalls = extractToolCalls(userMessage);
    const toolsUsed: string[] = [];
    let responseContent = "";
    
    // Check if MCP is configured
    const isMCPConfigured = mcpConfig && mcpConfig.serverUrl && mcpConfig.serverUrl.length > 0;
    
    // Execute any required tools if MCP is configured
    if (toolCalls.length > 0 && isMCPConfigured) {
      for (const call of toolCalls) {
        try {
          // Find the matching tool in the MCP config
          const matchingTool = mcpConfig.tools.find(t => t.id === call.toolId);
          
          if (matchingTool) {
            // Fixed: Pass the tool object instead of just the ID
            const result = await executeMCPTool(matchingTool, call.params);
            toolsUsed.push(call.toolId);
            
            if (result.success) {
              responseContent += `[Ferramenta: ${result.toolName}] ${JSON.stringify(result.result)}\n\n`;
            } else {
              responseContent += `[Erro na Ferramenta: ${result.toolName}] ${result.error}\n\n`;
            }
          }
        } catch (error) {
          console.error("Falha na execução da ferramenta:", error);
          responseContent += `Falha ao executar ferramenta: ${call.toolId}. `;
        }
      }
    }
    
    return { toolsUsed, responseContent };
  };

  const processFileUpload = (file: File | null | undefined) => {
    let responseContent = "";
    
    // Handle file uploads
    if (file) {
      const fileType = file.type;
      const isImage = fileType.startsWith('image/');
      
      if (isImage) {
        responseContent += `[Analisando imagem: ${file.name}]\n`;
      } else {
        responseContent += `[Analisando arquivo: ${file.name}]\n`;
      }
    }
    
    return responseContent;
  };
  
  return {
    executeToolsFromMessage,
    processFileUpload
  };
};
