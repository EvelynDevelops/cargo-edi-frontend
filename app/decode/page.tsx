"use client";

import { useRef, useState } from "react";
import EdiDecoder from "@/components/EdiDecoder";
import CargoCard from "@/components/CargoCard";
import { CargoFormData } from "@/components/CargoFormItem";

export default function DecodePage() {
  const decoderRef = useRef<{ handleDecode: () => void }>(null);
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

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-bold">Decode Existing EDI</h1>

      <div className={`grid gap-6 ${decoded.length > 0 ? "grid-cols-4" : ""}`}>
        {/* Left: Decoder area */}
        <div className={`${decoded.length > 0 ? "col-span-1" : "col-span-4"}`}>
          <h2 className="text-xl font-semibold">EDI Input</h2>
          <EdiDecoder ref={decoderRef} onDecode={setDecoded} />
          <button
            onClick={() => decoderRef.current?.handleDecode()}
            className="w-full mt-4 bg-gray-800 text-white py-2 rounded-md text-sm hover:bg-gray-700 transition"
          >
             {loading ? "Decoding..." : "Decode EDI"}
          </button>
        </div>

        {/* Right: Cards + JSON */}
        {decoded.length > 0 && (
          <div className="col-span-3 space-y-4">
            {/* Header with download */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Decoded Cargo Details</h2>
              <button
                onClick={handleDownloadJson}
                className="text-sm underline text-gray-600 hover:text-black"
              >
                Download JSON
              </button>
            </div>

            {/* Card list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {decoded.map((item, idx) => (
                <CargoCard key={idx} data={item} index={idx} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
