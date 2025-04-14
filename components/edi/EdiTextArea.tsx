import React from 'react';
import ErrorLineHighlighter from './ErrorLineHighlighter';
import { cn } from "@/lib/utils";

interface IEdiTextAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  errorLines: number[];
  lines: string[];
}

/**
 * EDI text area component
 * Used for editing and displaying EDI content with error highlighting
 */
const EdiTextArea: React.FC<IEdiTextAreaProps> = ({ 
  value, 
  onChange, 
  textareaRef,
  errorLines,
  lines
}) => {
  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        className={cn(
          "w-full min-h-135 border border-input rounded-md shadow-sm",
          "p-3 text-sm font-mono resize-none overflow-auto",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          "placeholder:text-muted-foreground",
          "transition-colors"
        )}
        placeholder="Paste existing EDI here to parse it"
        onChange={onChange}
        style={{ lineHeight: '21px' }}
      />
      <ErrorLineHighlighter 
        errorLines={errorLines} 
        lineHeight={21} 
        lines={lines} 
      />
    </div>
  );
};

export default EdiTextArea; 