"use client";

import { CargoFormData } from "@/components/CargoFormItem";
import { Button } from "@/components/ui/Button";
import EdiOutputPanel from "@/components/OutputPanel";

interface HomeLayoutProps {
  cargoItems: CargoFormData[];
  loading: boolean;
  error: string;
  ediOutput: string;
  onClearAll: () => void;
  onAdd: () => void;
  onGenerate: () => void;
  onDownload: () => void;
  onCopy: () => void;
  children: React.ReactNode;
}

/**
 * Home Layout Component
 * Handles the layout and structure of the home page
 */
export default function HomeLayout({
  cargoItems,
  loading,
  error,
  ediOutput,
  onClearAll,
  onAdd,
  onGenerate,
  onDownload,
  onCopy,
  children
}: HomeLayoutProps) {
  return (
    <main className="pt-16">
      <h1 className="text-2xl font-bold mb-6">Cargo EDI Generator</h1>
      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Left: Cargo input forms */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Cargo Information</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={onClearAll}
              type="button"
            >
              Clear All
            </Button>
          </div>

          {/* List of CargoFormItem components */}
          {children}

          {/* Add / Submit buttons */}
          <div className="flex flex-col gap-3 sticky bottom-0 bg-transparent pb-4 pt-2">
            <Button
              variant="outline"
              onClick={onAdd}
              className="w-full"
              type="button"
            >
              Add Cargo Item
            </Button>
            <Button
              variant="default"
              onClick={onGenerate}
              className="w-full"
              disabled={loading}
              type="button"
            >
              {loading ? "Generating..." : "Generate EDI"}
            </Button>
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </div>
        </div>

        {/* Right: EDI Output with download */}
        <EdiOutputPanel
          ediOutput={ediOutput}
          onDownload={onDownload}
          onCopy={onCopy}
          title="Generated EDI Message"
          downloadText="Download .edi"
        />
      </div>
    </main>
  );
} 