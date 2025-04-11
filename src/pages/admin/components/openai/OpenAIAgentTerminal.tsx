
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, StopCircle, Brain, Bot, Network, Command, Send } from "lucide-react";
import { OrchestratorTerminal, TerminalLine } from "@/components/terminal/OrchestratorTerminal";
import { useAgent } from "@/contexts/AgentContext";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';

interface OpenAIAgentTerminalProps {
  isMinimized?: boolean;
  onMinimize?: () => void;
}

export const OpenAIAgentTerminal: React.FC<OpenAIAgentTerminalProps> = ({ 
  isMinimized = false,
  onMinimize = () => {}
}) => {
  const { toast } = useToast();
  const { orchestratorConfig } = useAgent();

  const [isOpen, setIsOpen] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [userInput, setUserInput] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [groups, setGroups] = useState<any[]>([]);
  
  // Load agent groups from localStorage
  useEffect(() => {
    const savedGroups = localStorage.getItem("openai_agent_groups");
    if (savedGroups) {
      try {
        setGroups(JSON.parse(savedGroups));
        // Auto-select first group if available
        const parsedGroups = JSON.parse(savedGroups);
        if (parsedGroups.length > 0 && !selectedGroup) {
          setSelectedGroup(parsedGroups[0].id);
        }
      } catch (e) {
        console.error("Error parsing saved groups:", e);
      }
    }
  }, []);

  // Check if OpenAI API key is configured
  const [apiKeyConfigured, setApiKeyConfigured] = useState(false);
  useEffect(() => {
    const savedApiKey = localStorage.getItem("openai_api_key");
    setApiKeyConfigured(!!savedApiKey);
  }, []);

  const addTerminalLine = (content: string, type: 'command' | 'output' | 'error' | 'info' | 'success') => {
    const newLine: TerminalLine = {
      id: uuidv4(),
      content,
      type,
      timestamp: new Date()
    };
    
    setTerminalLines(prev => [...prev, newLine]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userInput.trim()) return;
    if (!apiKeyConfigured) {
      toast({
        title: "API Key Required",
        description: "Please configure your OpenAI API key in the Agents Configuration tab",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedGroup) {
      toast({
        title: "No Group Selected",
        description: "Please select an agent group to process your request",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Find the selected group details
    const group = groups.find(g => g.id === selectedGroup);
    if (!group) {
      addTerminalLine("Error: Selected group not found", "error");
      setIsProcessing(false);
      return;
    }
    
    // Add user input to terminal
    addTerminalLine(userInput, "command");
    
    try {
      // Simulate the orchestrator and agent processes
      addTerminalLine(`Initializing multi-agent orchestration with group: ${group.name}`, "info");
      await new Promise(r => setTimeout(r, 800));
      
      // Get coordinator and agents
      const coordinator = localStorage.getItem("openai_agents") 
        ? JSON.parse(localStorage.getItem("openai_agents")!).find((a: any) => a.id === group.coordinator)
        : null;
        
      if (coordinator) {
        addTerminalLine(`Coordinator agent '${coordinator.name}' analyzing request...`, "info");
        await new Promise(r => setTimeout(r, 1000));
        
        // Show task delegation
        addTerminalLine(`Coordinator breaking down task into subtasks...`, "info");
        await new Promise(r => setTimeout(r, 800));
        
        // Simulate delegation to different agents
        const agentIds = group.agents.filter((id: string) => id !== coordinator.id);
        const agents = localStorage.getItem("openai_agents")
          ? JSON.parse(localStorage.getItem("openai_agents")!).filter((a: any) => agentIds.includes(a.id))
          : [];
          
        if (agents.length > 0) {
          // Show delegation to each agent
          for (const agent of agents) {
            addTerminalLine(`Delegating subtask to agent '${agent.name}'...`, "info");
            await new Promise(r => setTimeout(r, 600));
          }
          
          // Simulate processing
          addTerminalLine("Processing request with multi-agent collaboration...", "info");
          await new Promise(r => setTimeout(r, 1500));
          
          // Show agent responses
          for (const agent of agents) {
            addTerminalLine(`Agent '${agent.name}' completed subtask`, "success");
            await new Promise(r => setTimeout(r, 400));
          }
          
          // Final coordinator synthesis
          addTerminalLine(`Coordinator '${coordinator.name}' synthesizing responses...`, "info");
          await new Promise(r => setTimeout(r, 1000));
        }
        
        // Generate a simulated response
        const responses = [
          `Based on our analysis, the optimal approach to "${userInput}" would involve the following steps...`,
          `I've analyzed your request "${userInput}" and my recommendation is to...`,
          `After careful consideration of "${userInput}", the multi-agent system has determined that...`
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addTerminalLine(randomResponse, "output");
        
        // Completion message
        addTerminalLine("Multi-agent orchestration completed successfully", "success");
      } else {
        addTerminalLine("Error: Coordinator agent not found", "error");
      }
    } catch (error) {
      console.error("Error in agent orchestration:", error);
      addTerminalLine(`Error: ${error instanceof Error ? error.message : "Unknown error occurred"}`, "error");
    } finally {
      setIsProcessing(false);
      setUserInput("");
    }
  };

  const clearTerminal = () => {
    setTerminalLines([]);
  };

  // Set up event listeners for keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+L or Cmd+K to clear terminal
      if ((e.ctrlKey || e.metaKey) && (e.key === 'l' || e.key === 'k')) {
        e.preventDefault();
        clearTerminal();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="h-full">
      <OrchestratorTerminal
        isOpen={isOpen}
        onMinimize={onMinimize}
        lines={terminalLines}
        isProcessing={isProcessing}
        title="OpenAI Multi-Agent Orchestrator"
        minimized={isMinimized}
      />
      
      {!isMinimized && (
        <Card className="mt-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Command className="h-5 w-5" />
              Agent Orchestration Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Select
                  value={selectedGroup}
                  onValueChange={setSelectedGroup}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select an agent group" />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.map(group => (
                      <SelectItem key={group.id} value={group.id}>
                        <div className="flex items-center gap-2">
                          <Network className="h-4 w-4" />
                          {group.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={clearTerminal}
                  title="Clear Terminal (Ctrl+L)"
                >
                  <Command className="h-4 w-4" />
                </Button>
              </div>
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <Textarea
                  value={userInput}
                  onChange={e => setUserInput(e.target.value)}
                  placeholder="Type a command for the multi-agent system..."
                  className="min-h-24 font-mono text-sm"
                  disabled={isProcessing || !apiKeyConfigured || !selectedGroup}
                />
                
                <div className="flex justify-end gap-2">
                  {isProcessing ? (
                    <Button variant="destructive" onClick={() => setIsProcessing(false)}>
                      <StopCircle className="mr-2 h-4 w-4" />
                      Stop Processing
                    </Button>
                  ) : (
                    <Button 
                      type="submit" 
                      disabled={!userInput.trim() || !apiKeyConfigured || !selectedGroup}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Send Command
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OpenAIAgentTerminal;
