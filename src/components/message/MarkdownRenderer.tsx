
import React from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <ReactMarkdown
      className="prose prose-sm dark:prose-invert max-w-none"
      components={{
        h3: ({ node, ...props }) => <h3 className="text-base font-bold mt-3 mb-2" {...props} />,
        ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-2" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-2" {...props} />,
        li: ({ node, ...props }) => <li className="my-1" {...props} />,
        p: ({ node, ...props }) => <p className="my-2" {...props} />,
        hr: ({ node, ...props }) => <hr className="my-3 border-muted" {...props} />,
        strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
        code: ({ node, className, children, ...props }) => {
          // Check if this is an inline code block by checking the className
          const isInline = !className;
          
          if (isInline) {
            return <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono" {...props}>{children}</code>;
          }
          return (
            <pre className="bg-muted p-3 rounded-md overflow-x-auto">
              <code className="text-sm font-mono" {...props}>{children}</code>
            </pre>
          );
        }
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
