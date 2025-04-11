"use client";

import React from "react";
import CopyButton from "./CopyButton";

type Props = {
  ediOutput: string;
  onDownload: () => void;
  onCopy: () => void;
  title: string;
  downloadText: string;
  placeholder?: string;
};

const OutputPanel: React.FC<Props> = ({ ediOutput, onDownload, onCopy, title, downloadText, placeholder }) => {
  const defaultPlaceholder = "EDI string will appear here...";

  return (
    <div className="space-y-2 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        {ediOutput && (
          <div className="flex gap-2">
            <button
              onClick={onDownload}
              className="text-sm text-gray-800 border border-gray-300 px-3 py-1 rounded hover:bg-gray-100 hover:border-gray-400 transition"
            >
              {downloadText}
            </button>
          </div>
        )}
      </div>
      <div className="bg-white border border-gray-300 rounded-xl p-4 min-h-135 max-h-full overflow-auto relative">
        <pre className={`text-sm font-mono whitespace-pre-wrap ${ediOutput ? 'text-black' : 'text-gray-400'}`}>
          {ediOutput || placeholder || defaultPlaceholder}
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
