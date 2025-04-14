"use client";

import React from "react";
import CopyButton from "@/components/shared/CopyButton";
import { Button } from "@/components/shared/Button";
import { cn } from "@/lib/utils";

/**
 * Props for the OutputPanel component
 */
interface IOutputPanelProps {
  ediOutput: string;
  onDownload: () => void;
  onCopy: () => void;
  title: string;
  downloadText: string;
  placeholder?: string;
}

/**
 * Default placeholder text when no custom placeholder is provided
 */
const DEFAULT_PLACEHOLDER = "EDI string will appear here...";

/**
 * OutputPanel Component
 * Displays EDI output with copy and download functionality
 */
const OutputPanel: React.FC<IOutputPanelProps> = ({
  ediOutput,
  onDownload,
  onCopy,
  title,
  downloadText,
  placeholder
}) => {
  return (
    <div className="space-y-2 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        {ediOutput && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onDownload}
              type="button"
            >
              {downloadText}
            </Button>
          </div>
        )}
      </div>
      <div className={cn(
        "rounded-md border border-input shadow-sm p-4 min-h-135 max-h-full overflow-auto relative",
        "bg-transparent transition-colors"
      )}>
        <pre className={cn(
          "text-sm font-mono whitespace-pre-wrap",
          ediOutput ? 'text-foreground' : 'text-muted-foreground'
        )}>
          {ediOutput || placeholder || DEFAULT_PLACEHOLDER}
        </pre>
        {/* Copy button placed at the top-right corner of the text box */}
        {ediOutput && (
          <div className="absolute top-2 right-2">
            <CopyButton onCopy={onCopy} />
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputPanel;
