"use client";

import React from "react";

type Props = {
  ediOutput: string;
  onDownload: () => void;
  onCopy: () => void;
};

const EdiOutputPanel: React.FC<Props> = ({ ediOutput, onDownload, onCopy }) => {
  return (
    <div className="space-y-2 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Generated EDI Message</h2>
        <div className="flex gap-2">
          <button
            onClick={onDownload}
            className="text-sm underline text-gray-600 hover:text-black"
          >
            Download .edi
          </button>
        </div>
      </div>

      <div className="relative">
        <textarea
          className="w-full h-150 border border-gray-300 rounded-md p-3 text-sm font-mono resize-none"
          value={ediOutput}
          readOnly
          placeholder="EDI string will appear here..."
        />
        <button
          onClick={onCopy}
          className="absolute top-2 right-2 text-xs px-2 py-1 border border-gray-300 rounded bg-white hover:bg-gray-100 transition"
        >
          Copy
        </button>
      </div>
    </div>
  );
};

export default EdiOutputPanel;
