
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Brain, Code, FileCode, Network, Bot, Settings, Plus, Trash2, Save, Loader2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Agent {
  id: string;
  name: string;
  role: string;
  model: string;
  systemPrompt: string;
  tools: string[];
}

interface Group {
  id: string;
  name: string;
  description: string;
  agents: string[];
  coordinator: string;
}

const DEFAULT_AGENT: Agent = {
  id: "",
  name: "",
  role: "",
  model: "gpt-4o",
  systemPrompt: "",
  tools: []
};

const AVAILABLE_MODELS = [
  { id: "gpt-4o-mini", name: "GPT-4o Mini - Fast & Efficient" },
  { id: "gpt-4o", name: "GPT-4o - Balanced" },
  { id: "gpt-4.5-preview", name: "GPT-4.5 Preview - Most Advanced" },
];

const AVAILABLE_TOOLS = [
  { id: "code_interpreter", name: "Code Interpreter", description: "Execute code and analyze data" },
  { id: "file_search", name: "File Search", description: "Search through files and documents" },
  { id: "web_search", name: "Web Search", description: "Search the internet for information" },
  { id: "knowledge_retrieval", name: "Knowledge Retrieval", description: "Retrieve information from knowledge bases" },
  { id: "function_calling", name: "Function Calling", description: "Call custom functions" },
];

export const OpenAIAgentsConfig: React.FC = () => {
  const { toast } = useToast();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [currentAgent, setCurrentAgent] = useState<Agent>({...DEFAULT_AGENT});
  const [currentGroup, setCurrentGroup] = useState<Group>({
    id: "", 
    name: "", 
    description: "", 
    agents: [],
    coordinator: ""
  });
  const [activeTab, setActiveTab] = useState<string>("agents");
  const [isCreatingAgent, setIsCreatingAgent] = useState<boolean>(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [apiKeyConfigured, setApiKeyConfigured] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>("");

  // Load saved configuration from localStorage on component mount
  useEffect(() => {
    const savedAgents = localStorage.getItem("openai_agents");
    const savedGroups = localStorage.getItem("openai_agent_groups");
    const savedApiKey = localStorage.getItem("openai_api_key");
    
    if (savedAgents) {
      try {
        setAgents(JSON.parse(savedAgents));
      } catch (e) {
        console.error("Error parsing saved agents:", e);
      }
    }
    
    if (savedGroups) {
      try {
        setGroups(JSON.parse(savedGroups));
      } catch (e) {
        console.error("Error parsing saved groups:", e);
      }
    }
    
    if (savedApiKey) {
      setApiKeyConfigured(true);
      setApiKey(savedApiKey);
    }
  }, []);

  const handleSaveAgent = () => {
    if (!currentAgent.name || !currentAgent.role) {
      toast({
        title: "Validation Error",
        description: "Agent name and role are required",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    
    // Create a new ID if this is a new agent
    const agentToSave = {
      ...currentAgent,
      id: currentAgent.id || `agent-${Date.now()}`
    };
    
    // Update or add the agent
    const updatedAgents = currentAgent.id 
      ? agents.map(a => a.id === currentAgent.id ? agentToSave : a)
      : [...agents, agentToSave];
    
    setAgents(updatedAgents);
    localStorage.setItem("openai_agents", JSON.stringify(updatedAgents));
    
    toast({
      title: "Agent Saved",
      description: `${agentToSave.name} has been saved successfully`,
    });
    
    setCurrentAgent({...DEFAULT_AGENT});
    setIsCreatingAgent(false);
    setIsSaving(false);
  };

  const handleSaveGroup = () => {
    if (!currentGroup.name || currentGroup.agents.length === 0 || !currentGroup.coordinator) {
      toast({
        title: "Validation Error",
        description: "Group name, at least one agent, and a coordinator are required",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    
    // Create a new ID if this is a new group
    const groupToSave = {
      ...currentGroup,
      id: currentGroup.id || `group-${Date.now()}`
    };
    
    // Update or add the group
    const updatedGroups = currentGroup.id 
      ? groups.map(g => g.id === currentGroup.id ? groupToSave : g)
      : [...groups, groupToSave];
    
    setGroups(updatedGroups);
    localStorage.setItem("openai_agent_groups", JSON.stringify(updatedGroups));
    
    toast({
      title: "Group Saved",
      description: `${groupToSave.name} has been saved successfully`,
    });
    
    setCurrentGroup({id: "", name: "", description: "", agents: [], coordinator: ""});
    setIsCreatingGroup(false);
    setIsSaving(false);
  };

  const editAgent = (agent: Agent) => {
    setCurrentAgent(agent);
    setIsCreatingAgent(true);
  };

  const editGroup = (group: Group) => {
    setCurrentGroup(group);
    setIsCreatingGroup(true);
  };

  const deleteAgent = (agentId: string) => {
    const updatedAgents = agents.filter(a => a.id !== agentId);
    setAgents(updatedAgents);
    localStorage.setItem("openai_agents", JSON.stringify(updatedAgents));
    
    // Also remove this agent from any groups
    const updatedGroups = groups.map(group => ({
      ...group,
      agents: group.agents.filter(id => id !== agentId),
      coordinator: group.coordinator === agentId ? "" : group.coordinator
    }));
    setGroups(updatedGroups);
    localStorage.setItem("openai_agent_groups", JSON.stringify(updatedGroups));
    
    toast({
      title: "Agent Deleted",
      description: "The agent has been removed",
    });
  };

  const deleteGroup = (groupId: string) => {
    const updatedGroups = groups.filter(g => g.id !== groupId);
    setGroups(updatedGroups);
    localStorage.setItem("openai_agent_groups", JSON.stringify(updatedGroups));
    
    toast({
      title: "Group Deleted",
      description: "The group has been removed",
    });
  };

  const saveApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key",
        variant: "destructive",
      });
      return;
    }
    
    localStorage.setItem("openai_api_key", apiKey);
    setApiKeyConfigured(true);
    
    toast({
      title: "API Key Saved",
      description: "Your OpenAI API key has been saved",
    });
  };

  const toggleAgentTool = (toolId: string) => {
    setCurrentAgent(prev => {
      const toolExists = prev.tools.includes(toolId);
      return {
        ...prev,
        tools: toolExists 
          ? prev.tools.filter(t => t !== toolId)
          : [...prev.tools, toolId]
      };
    });
  };

  return (
    <div className="space-y-6">
      {/* API Key Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            API Configuration
          </CardTitle>
          <CardDescription>
            Configure your OpenAI API key to enable multi-agent orchestration
          </CardDescription>
        </CardHeader>
        <CardContent>
          {apiKeyConfigured ? (
            <Alert className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900">
              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertTitle>API Key Configured</AlertTitle>
              <AlertDescription>
                Your OpenAI API key has been saved. You can now configure agents and groups.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">OpenAI API Key</Label>
                <Input 
                  id="api-key" 
                  type="password" 
                  placeholder="Enter your OpenAI API key" 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Your API key is stored locally and never sent to our servers. 
                  You'll need an API key with access to GPT-4 models.
                </p>
              </div>
              <Button onClick={saveApiKey}>Save API Key</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Configuration Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="agents" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Agents
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex items-center gap-2">
            <Network className="h-4 w-4" />
            Groups
          </TabsTrigger>
        </TabsList>

        {/* Agents Tab */}
        <TabsContent value="agents" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Configured Agents</h3>
            <Button 
              onClick={() => {
                setCurrentAgent({...DEFAULT_AGENT});
                setIsCreatingAgent(true);
              }}
              disabled={isCreatingAgent}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Agent
            </Button>
          </div>

          {isCreatingAgent ? (
            <Card>
              <CardHeader>
                <CardTitle>{currentAgent.id ? "Edit Agent" : "Create New Agent"}</CardTitle>
                <CardDescription>Configure this agent's capabilities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="agent-name">Agent Name</Label>
                    <Input 
                      id="agent-name" 
                      value={currentAgent.name} 
                      onChange={(e) => setCurrentAgent({...currentAgent, name: e.target.value})}
                      placeholder="E.g., Code Assistant"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="agent-role">Role</Label>
                    <Input 
                      id="agent-role" 
                      value={currentAgent.role} 
                      onChange={(e) => setCurrentAgent({...currentAgent, role: e.target.value})}
                      placeholder="E.g., Code Expert"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="agent-model">Model</Label>
                  <Select 
                    value={currentAgent.model} 
                    onValueChange={(value) => setCurrentAgent({...currentAgent, model: value})}
                  >
                    <SelectTrigger id="agent-model">
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_MODELS.map(model => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="system-prompt">System Prompt</Label>
                  <Textarea 
                    id="system-prompt" 
                    value={currentAgent.systemPrompt} 
                    onChange={(e) => setCurrentAgent({...currentAgent, systemPrompt: e.target.value})}
                    placeholder="You are a helpful assistant specialized in..."
                    className="min-h-32"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Available Tools</Label>
                  <div className="space-y-2">
                    {AVAILABLE_TOOLS.map(tool => (
                      <div key={tool.id} className="flex items-center space-x-2 p-2 border rounded-md">
                        <Switch 
                          id={`tool-${tool.id}`}
                          checked={currentAgent.tools.includes(tool.id)}
                          onCheckedChange={() => toggleAgentTool(tool.id)}
                        />
                        <div>
                          <Label htmlFor={`tool-${tool.id}`} className="font-medium">
                            {tool.name}
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            {tool.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreatingAgent(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveAgent}
                  disabled={isSaving}
                >
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Agent
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <>
              {agents.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center text-center py-8">
                      <Bot className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No Agents Configured</h3>
                      <p className="text-muted-foreground mt-2 mb-4">
                        Create your first agent to start building your multi-agent system
                      </p>
                      <Button 
                        onClick={() => {
                          setCurrentAgent({...DEFAULT_AGENT});
                          setIsCreatingAgent(true);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add your first agent
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {agents.map(agent => (
                    <Card key={agent.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{agent.name}</CardTitle>
                        <CardDescription>{agent.role}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Brain className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{AVAILABLE_MODELS.find(m => m.id === agent.model)?.name || agent.model}</span>
                        </div>
                        
                        {agent.tools.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {agent.tools.map(toolId => {
                              const tool = AVAILABLE_TOOLS.find(t => t.id === toolId);
                              return tool ? (
                                <span 
                                  key={toolId}
                                  className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full"
                                >
                                  {tool.name}
                                </span>
                              ) : null;
                            })}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="flex gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => editAgent(agent)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          className="flex-1"
                          onClick={() => deleteAgent(agent.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* Groups Tab */}
        <TabsContent value="groups" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Agent Groups</h3>
            <Button 
              onClick={() => {
                setCurrentGroup({id: "", name: "", description: "", agents: [], coordinator: ""});
                setIsCreatingGroup(true);
              }}
              disabled={isCreatingGroup || agents.length === 0}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Group
            </Button>
          </div>

          {agents.length === 0 && (
            <Alert className="bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900">
              <AlertTitle>No Agents Available</AlertTitle>
              <AlertDescription>
                You need to create agents before you can create agent groups.
              </AlertDescription>
            </Alert>
          )}

          {isCreatingGroup && agents.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>{currentGroup.id ? "Edit Group" : "Create New Group"}</CardTitle>
                <CardDescription>Configure this agent group</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="group-name">Group Name</Label>
                    <Input 
                      id="group-name" 
                      value={currentGroup.name} 
                      onChange={(e) => setCurrentGroup({...currentGroup, name: e.target.value})}
                      placeholder="E.g., Development Team"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="group-description">Description</Label>
                    <Textarea 
                      id="group-description" 
                      value={currentGroup.description} 
                      onChange={(e) => setCurrentGroup({...currentGroup, description: e.target.value})}
                      placeholder="A team of agents focused on..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Group Agents</Label>
                    <div className="border rounded-md p-2 space-y-2">
                      {agents.map(agent => (
                        <div key={agent.id} className="flex items-center space-x-2 p-2 border rounded-md">
                          <Switch 
                            id={`agent-${agent.id}`}
                            checked={currentGroup.agents.includes(agent.id)}
                            onCheckedChange={() => {
                              setCurrentGroup(prev => {
                                const isSelected = prev.agents.includes(agent.id);
                                return {
                                  ...prev,
                                  agents: isSelected 
                                    ? prev.agents.filter(id => id !== agent.id)
                                    : [...prev.agents, agent.id],
                                  // If this agent was the coordinator and is being removed, reset coordinator
                                  coordinator: isSelected && prev.coordinator === agent.id ? "" : prev.coordinator
                                };
                              });
                            }}
                          />
                          <div>
                            <Label htmlFor={`agent-${agent.id}`} className="font-medium">
                              {agent.name}
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              {agent.role}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="coordinator">Coordinator Agent</Label>
                    <Select 
                      value={currentGroup.coordinator} 
                      onValueChange={(value) => setCurrentGroup({...currentGroup, coordinator: value})}
                      disabled={currentGroup.agents.length === 0}
                    >
                      <SelectTrigger id="coordinator">
                        <SelectValue placeholder="Select a coordinator agent" />
                      </SelectTrigger>
                      <SelectContent>
                        {agents
                          .filter(agent => currentGroup.agents.includes(agent.id))
                          .map(agent => (
                            <SelectItem key={agent.id} value={agent.id}>
                              {agent.name}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      The coordinator agent is responsible for managing the group and delegating tasks.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreatingGroup(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveGroup}
                  disabled={isSaving || currentGroup.agents.length === 0 || !currentGroup.coordinator}
                >
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Group
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <>
              {groups.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center text-center py-8">
                      <Network className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No Agent Groups Configured</h3>
                      <p className="text-muted-foreground mt-2 mb-4">
                        Create groups to orchestrate multiple agents working together
                      </p>
                      {agents.length > 0 && (
                        <Button 
                          onClick={() => {
                            setCurrentGroup({id: "", name: "", description: "", agents: [], coordinator: ""});
                            setIsCreatingGroup(true);
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add your first group
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {groups.map(group => (
                    <Card key={group.id}>
                      <CardHeader>
                        <CardTitle>{group.name}</CardTitle>
                        <CardDescription>{group.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Coordinator</h4>
                            <div className="flex items-center gap-2 p-2 bg-secondary/20 rounded-md">
                              <Bot className="h-4 w-4" />
                              {agents.find(a => a.id === group.coordinator)?.name || "Unknown Agent"}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-2">Agents ({group.agents.length})</h4>
                            <div className="flex flex-wrap gap-1">
                              {group.agents.map(agentId => {
                                const agent = agents.find(a => a.id === agentId);
                                return agent ? (
                                  <span 
                                    key={agentId}
                                    className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full"
                                  >
                                    {agent.name}
                                  </span>
                                ) : null;
                              })}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => editGroup(group)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          className="flex-1"
                          onClick={() => deleteGroup(group.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OpenAIAgentsConfig;
