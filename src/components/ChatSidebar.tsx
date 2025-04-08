
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/contexts/ChatContext";
import { cn } from "@/lib/utils";
import { 
  Plus, 
  MessageSquare, 
  Settings, 
  Search, 
  Bell, 
  ChevronLeft,
  ChevronRight,
  File,
  Briefcase,
  Code,
  BarChart,
  Book,
  User,
  LogOut,
  ChevronDown
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ProfileDialog from "@/components/ProfileDialog";
import { useToast } from "@/hooks/use-toast";

const ChatSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { chats, activeChat, setActiveChat } = useChat();
  const { toast } = useToast();
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  
  // Start collapsed if on the chat page, expanded otherwise
  const [collapsed, setCollapsed] = useState(() => {
    return location.pathname === "/chat";
  });

  const isAdmin = user?.role === "admin";
  
  // Effect to update collapsed state when route changes
  useEffect(() => {
    if (location.pathname === "/chat") {
      setCollapsed(true);
    }
  }, [location.pathname]);
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Sessão encerrada",
      description: "Você foi desconectado com sucesso.",
    });
    navigate("/login");
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleNewTask = () => {
    navigate("/");
  };

  const sampleChats = [
    { 
      icon: <File className="h-4 w-4" />, 
      title: "Documento de Orientação", 
      subtitle: "Prezado Izaias, Conclui todas as...", 
      time: "há 2 dias" 
    },
    { 
      icon: <BarChart className="h-4 w-4" />, 
      title: "Análise de Dados", 
      subtitle: "Conforme solicitado, adicionei os...", 
      time: "há 9 horas" 
    },
    { 
      icon: <Code className="h-4 w-4" />, 
      title: "Problemas com Acesso", 
      subtitle: "Para completar a solução, preparar...", 
      time: "há 30 minutos" 
    },
    { 
      icon: <Briefcase className="h-4 w-4" />, 
      title: "Apresentação de Negócios", 
      subtitle: "Conforme solicitado, adicionei os...", 
      time: "há 9 horas" 
    }
  ];

  return (
    <div className={cn(
      "flex flex-col h-full bg-sidebar border-r border-border/50 transition-all duration-300",
      collapsed ? "w-16" : "w-72"
    )}>
      <div className={cn(
        "flex items-center p-4 border-b border-border/50",
        collapsed ? "justify-center" : "justify-between"
      )}>
        {!collapsed && (
          <div className="flex items-center">
            {/* Logo or other content can go here */}
          </div>
        )}
        <div className="flex items-center">
          {!collapsed && (
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <Bell className="h-4 w-4 text-sidebar-foreground" />
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "h-8 w-8 rounded-full",
              collapsed && "ml-0"
            )}
            onClick={toggleSidebar}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4 text-sidebar-foreground" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-sidebar-foreground" />
            )}
          </Button>
        </div>
      </div>

      {!collapsed ? (
        <>
          <div className="p-4">
            <Button
              onClick={handleNewTask}
              className="w-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center py-5 rounded-full shadow-md"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova tarefa
            </Button>
          </div>
          
          <div className="px-4 mb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sidebar-foreground/60" />
              <Input className="bg-sidebar-accent/30 pl-10 h-9 text-sidebar-foreground rounded-full" placeholder="Pesquisar..." />
            </div>
          </div>
          
          <ScrollArea className="flex-1 px-2">
            <div className="space-y-2 py-2">
              {chats.map((chat) => {
                // Find a sample chat to use its icon (for demo only)
                const sampleChat = sampleChats[Math.floor(Math.random() * sampleChats.length)];
                
                return (
                  <button
                    key={chat.id}
                    className={cn(
                      "w-full text-left rounded-xl p-3 text-sm transition-colors hover:bg-sidebar-accent/50",
                      activeChat?.id === chat.id
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground"
                    )}
                    onClick={() => setActiveChat(chat.id)}
                  >
                    <div className="flex items-start">
                      <div className="h-8 w-8 rounded-xl bg-primary/10 mr-3 flex items-center justify-center text-primary">
                        {sampleChat.icon || <MessageSquare className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <span className="font-medium truncate">
                            {chat.title || "Nova conversa"}
                          </span>
                          <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">
                            {sampleChat.time || "agora"}
                          </span>
                        </div>
                        <p className="text-xs text-sidebar-foreground/70 truncate mt-1">
                          {sampleChat.subtitle || "Iniciar nova conversa..."}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t border-border/50">
            {isAdmin && (
              <Button
                variant="outline"
                className="w-full justify-start mb-3 rounded-xl"
                onClick={() => navigate("/admin")}
              >
                <Settings className="mr-2 h-4 w-4" />
                Configurações Admin
              </Button>
            )}
            
            <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-3 py-2 px-2 rounded-xl hover:bg-sidebar-accent/50 cursor-pointer transition-colors">
                    <Avatar className="w-10 h-10">
                      {user?.profileImage ? (
                        <AvatarImage src={user.profileImage} alt={user?.name || "User"} />
                      ) : (
                        <AvatarFallback className="bg-primary/10 text-primary">
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium leading-none truncate">{user?.name || "Usuário"}</p>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Perfil</span>
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <ProfileDialog />
            </Dialog>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col items-center gap-4 py-4">
            <Button
              onClick={handleNewTask}
              className="bg-primary hover:bg-primary/90 text-white flex items-center justify-center w-10 h-10 rounded-full shadow-md"
              title="Nova tarefa"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              title="Pesquisar"
            >
              <Search className="h-4 w-4 text-sidebar-foreground" />
            </Button>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="flex flex-col items-center gap-2 py-2">
              {chats.map((chat) => {
                const sampleChat = sampleChats[Math.floor(Math.random() * sampleChats.length)];
                
                return (
                  <button
                    key={chat.id}
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                      activeChat?.id === chat.id
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    )}
                    onClick={() => setActiveChat(chat.id)}
                    title={chat.title || "Nova conversa"}
                  >
                    <div className="flex items-center justify-center text-primary">
                      {sampleChat.icon || <MessageSquare className="h-4 w-4" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
          
          <div className="flex flex-col items-center gap-2 p-4 border-t border-border/50">
            {isAdmin && (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl"
                onClick={() => navigate("/admin")}
                title="Configurações Admin"
              >
                <Settings className="h-4 w-4" />
              </Button>
            )}
            
            <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
              <DialogTrigger asChild>
                <Avatar className="w-8 h-8 cursor-pointer" title={user?.name || "Usuário"}>
                  {user?.profileImage ? (
                    <AvatarImage src={user.profileImage} alt={user?.name || "User"} />
                  ) : (
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  )}
                </Avatar>
              </DialogTrigger>
              <ProfileDialog />
            </Dialog>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatSidebar;
