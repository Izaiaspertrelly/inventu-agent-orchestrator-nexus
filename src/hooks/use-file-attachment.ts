
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

export function useFileAttachment() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleAttachmentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast({
        title: "Arquivo selecionado",
        description: `${file.name} (${Math.round(file.size / 1024)} KB)`,
      });
    }
  };
  
  const clearSelectedFile = () => {
    setSelectedFile(null);
  };

  return {
    selectedFile,
    fileInputRef,
    handleAttachmentClick,
    handleFileSelect,
    clearSelectedFile,
  };
}
