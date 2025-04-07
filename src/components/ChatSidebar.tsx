
import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/contexts/ChatContext";
import { cn } from "@/lib/utils";
import { Plus, MessageSquare, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const ChatSidebar: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { chats, activeChat, setActiveChat, createNewChat } = useChat();

  const isAdmin = user?.role === "admin";

  return (
    <div className="flex flex-col w-64 h-full bg-sidebar border-r dark">
      <div className="p-4">
        <Button
          onClick={createNewChat}
          className="w-full inventu-btn py-6"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova conversa
        </Button>
      </div>
      
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 py-2">
          {chats.map((chat) => (
            <button
              key={chat.id}
              className={cn(
                "w-full text-left rounded-lg p-3 text-sm transition-colors hover:bg-sidebar-accent/50",
                activeChat?.id === chat.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground"
              )}
              onClick={() => setActiveChat(chat.id)}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="h-4 w-4" />
                <span className="truncate">
                  {chat.title || "Nova conversa"}
                </span>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-border/50">
        {isAdmin && (
          <Button
            variant="outline"
            className="w-full justify-start mb-2"
            onClick={() => navigate("/admin")}
          >
            <Settings className="mr-2 h-4 w-4" />
            Configurações Admin
          </Button>
        )}
        
        <div className="flex items-center gap-4 py-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            {user?.name.charAt(0)}
          </div>
          <div className="flex-1 truncate">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
