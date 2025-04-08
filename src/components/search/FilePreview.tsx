
import React from "react";
import { Paperclip, X } from "lucide-react";

interface FilePreviewProps {
  file: File;
  onClear: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, onClear }) => {
  return (
    <div className="px-4 py-2 bg-secondary/30 rounded-lg mt-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Paperclip className="h-4 w-4" />
        <span className="text-sm truncate max-w-[250px]">{file.name}</span>
        <span className="text-xs text-muted-foreground">({Math.round(file.size / 1024)} KB)</span>
      </div>
      <button 
        onClick={onClear}
        className="text-muted-foreground hover:text-destructive"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default FilePreview;
