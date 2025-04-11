"use client";

import { useRef, useState } from "react";
import EdiDecoder from "@/components/EdiDecoder";
import CargoCard from "@/components/CargoCard";
import { CargoFormData } from "@/components/CargoFormItem";
import OutputPanel from "../../components/OutputPanel";

export default function DecodePage() {
  const decoderRef = useRef<{ handleDecode: () => void; handleClear: () => void }>(null);
  const [decoded, setDecoded] = useState<CargoFormData[]>([]);
  const [loading, setLoading] = useState(false);

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(decoded, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `decoded_edi_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDecode = () => {
    if (decoderRef.current) {
      decoderRef.current.handleDecode();
    }
  };

  const handleInputChange = () => {
    setDecoded([]);
  };

  const handleClearAll = () => {
    setDecoded([]);
    if (decoderRef.current) {
      decoderRef.current.handleClear();
    }
  };

  return (
    <main>
      <main className="pt-16"></main>
      <h1 className="text-2xl font-bold mb-6">Decode Existing EDI</h1>
      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Left: Decoder area */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">EDI Input</h2>
            <button
              onClick={handleClearAll}
              className="text-sm text-gray-800 border border-gray-300 px-3 py-1 rounded hover:bg-gray-100 hover:border-gray-400 transition"
            >
              Clear All
            </button>
          </div>
          <EdiDecoder ref={decoderRef} onDecode={setDecoded} onInputChange={handleInputChange} />
          <div className="flex flex-col gap-3 sticky bottom-0 bg-transparent pb-4 pt-2">
            <button
              onClick={handleDecode}
              className="w-full bg-gray-800 text-white py-2 rounded-md text-sm hover:bg-gray-700 transition"
            >
              {loading ? "Decoding..." : "Decode EDI"}
            </button>
          </div>
        </div>

        {/* Right: Output Panel */}
        <OutputPanel
          ediOutput={decoded.length > 0 ? JSON.stringify(decoded, null, 2) : ""}
          onDownload={handleDownloadJson}
          onCopy={() => navigator.clipboard.writeText(JSON.stringify(decoded, null, 2))}
          title="Decoded EDI Message"
          downloadText="Download JSON"
          placeholder="Decoded EDI will appear here in JSON format..."
        />
      </div>
    </main>
  );
}
