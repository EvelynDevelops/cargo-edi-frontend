"use client";

import React from "react";
import CopyButton from "@/components/ui/CopyButton";
import { Button } from "@/components/ui/Button";

/**
 * Props for the OutputPanel component
 */
interface OutputPanelProps {
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
const OutputPanel: React.FC<OutputPanelProps> = ({
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
      <div className="bg-white border border-gray-300 rounded-xl p-4 min-h-135 max-h-full overflow-auto relative">
        <pre className={`text-sm font-mono whitespace-pre-wrap ${
          ediOutput ? 'text-black' : 'text-gray-400'
        }`}>
          {ediOutput || placeholder || DEFAULT_PLACEHOLDER}
        </pre>
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
