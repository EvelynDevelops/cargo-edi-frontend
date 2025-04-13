"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { CargoFormData } from "@/components/CargoFormItem";
import OutputPanel from "@/components/OutputPanel";

interface DecoderLayoutProps {
  decoded: CargoFormData[];
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
    <main>
      <main className="pt-16"></main>
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
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
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