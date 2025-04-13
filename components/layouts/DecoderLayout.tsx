"use client";

import React from "react";
import { Button } from "@/components/shared/Button";
import { ICargoFormData } from "@/types/cargo";
import OutputPanel from "@/components/shared/OutputPanel";

interface DecoderLayoutProps {
  decoded: ICargoFormData[];
  loading: boolean;
  error: string;
  onClearAll: () => void;
  onDecode: () => void;
  onDownload: () => void;
  onCopy: () => Promise<void>;
  children: React.ReactNode;
}

/**
 * DecoderLayout Component
 * Handles the layout and structure of the decoder page
 */
export default function DecoderLayout({
  decoded,
  loading,
  error,
  onClearAll,
  onDecode,
  onDownload,
  onCopy,
  children
}: DecoderLayoutProps) {
  return (
    <main className="pt-16">
      <h1 className="text-2xl font-bold mb-6">Decode Existing EDI</h1>
      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Left: Decoder area */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">EDI Input</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={onClearAll}
              type="button"
            >
              Clear All
            </Button>
          </div>
          {children}
          <div className="flex flex-col gap-3 sticky bottom-0 bg-transparent pb-4 pt-2">
            <Button
              variant="default"
              onClick={onDecode}
              className="w-full"
              disabled={loading}
              type="button"
            >
              {loading ? "Decoding..." : "Decode EDI"}
            </Button>
          </div>
        </div>

        {/* Right: Output Panel */}
        <div className="space-y-4">
          <OutputPanel
            ediOutput={decoded.length > 0 ? JSON.stringify(decoded, null, 2) : ""}
            onDownload={onDownload}
            onCopy={onCopy}
            title="Decoded EDI Message"
            downloadText="Download JSON"
            placeholder="Decoded EDI will appear here in JSON format..."
          />
        </div>
      </div>
    </main>
  );
} 