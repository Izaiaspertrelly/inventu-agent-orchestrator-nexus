
import React from "react";
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
  Menu,
  File,
  Briefcase,
  Code,
  BarChart,
  Book,
  User
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import InventuLogo from "@/components/InventuLogo";
import { Input } from "@/components/ui/input";

const ChatSidebar: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { chats, activeChat, setActiveChat, createNewChat } = useChat();

  const isAdmin = user?.role === "admin";
  
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
    <div className="flex flex-col w-72 h-full bg-sidebar border-r border-border/50">
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center">
          <InventuLogo size={32} />
        </div>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <Bell className="h-4 w-4 text-sidebar-foreground" />
          </Button>
        </div>
      </div>

      <div className="p-4">
        <Button
          onClick={createNewChat}
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
        
        <div className="flex items-center gap-3 py-2">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-none truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
