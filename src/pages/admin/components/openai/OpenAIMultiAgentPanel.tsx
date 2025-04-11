
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Bot, Network, Terminal, Settings, Zap, ArrowUpDown } from "lucide-react";
import OpenAIAgentsConfig from "./OpenAIAgentsConfig";
import OpenAIAgentTerminal from "./OpenAIAgentTerminal";

const OpenAIMultiAgentPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("config");
  const [showTerminal, setShowTerminal] = useState<boolean>(false);
  const [terminalMinimized, setTerminalMinimized] = useState<boolean>(false);
  
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            OpenAI Multi-Agent Orchestration
          </CardTitle>
          <CardDescription className="text-base max-w-3xl">
            Configure and orchestrate multiple OpenAI agents working together to solve complex tasks.
            This system uses the official OpenAI Agents Python SDK for multi-agent orchestration.
          </CardDescription>
        </CardHeader>
      </Card>
      
      {/* Main Controls */}
      <div className="flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="config" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Agent Configuration
              </TabsTrigger>
              <TabsTrigger value="orchestration" className="flex items-center gap-2">
                <Network className="h-4 w-4" />
                Orchestration
              </TabsTrigger>
            </TabsList>
            
            <Button
              variant={showTerminal ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setShowTerminal(!showTerminal);
                setTerminalMinimized(false);
              }}
              className="flex items-center gap-2"
            >
              <Terminal className="h-4 w-4" />
              {showTerminal ? "Hide Terminal" : "Show Terminal"}
            </Button>
          </div>
        </Tabs>
      </div>
      
      {/* Terminal Section (when visible) */}
      {showTerminal && !terminalMinimized && (
        <Card className="border border-muted mb-4">
          <CardHeader className="py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Terminal className="h-4 w-4" />
                Multi-Agent Terminal
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTerminalMinimized(true)}
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-60">
              <OpenAIAgentTerminal 
                isMinimized={false}
                onMinimize={() => setTerminalMinimized(true)}
              />
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Main Content Tabs */}
      <TabsContent value="config" className="m-0">
        <OpenAIAgentsConfig />
      </TabsContent>
      
      <TabsContent value="orchestration" className="m-0">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Network className="h-5 w-5" />
              Multi-Agent Orchestration
            </CardTitle>
            <CardDescription>
              Control and monitor multi-agent teams based on your configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    Agent Team Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Deploy your configured agent teams to handle tasks and answer queries
                  </p>
                  
                  <div className="space-y-4">
                    {terminalMinimized ? (
                      <Button 
                        onClick={() => setTerminalMinimized(false)}
                        variant="outline"
                        className="w-full"
                      >
                        <Terminal className="h-4 w-4 mr-2" />
                        Maximize Terminal
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => {
                          setShowTerminal(true);
                          setTerminalMinimized(false);
                        }}
                        variant="default"
                        className="w-full"
                      >
                        <Terminal className="h-4 w-4 mr-2" />
                        Open Terminal
                      </Button>
                    )}
                    
                    <p className="text-xs text-muted-foreground">
                      Use the terminal to interact with your agent teams directly
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Bot className="h-4 w-4 text-primary" />
                    Agent SDK Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    This system uses the official OpenAI Agents Python SDK for multi-agent orchestration
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Documentation:</span>
                      <a 
                        href="https://openai.github.io/openai-agents-python/multi_agent/" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        OpenAI Agents Python
                      </a>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Version:</span>
                      <span className="text-sm">0.4.0</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Status:</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        Connected
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {!showTerminal && (
              <Button 
                onClick={() => {
                  setShowTerminal(true);
                  setTerminalMinimized(false);
                }}
                className="w-full"
              >
                <Terminal className="h-4 w-4 mr-2" />
                Open Multi-Agent Terminal
              </Button>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      {/* Floating minimized terminal if applicable */}
      {showTerminal && terminalMinimized && (
        <OpenAIAgentTerminal
          isMinimized={true}
          onMinimize={() => setTerminalMinimized(false)}
        />
      )}
    </div>
  );
};

export default OpenAIMultiAgentPanel;
