"use client";

import { useRef, useState } from "react";
import EdiDecoder from "@/components/EdiTextEditor";
import { CargoFormData } from "@/components/CargoFormItem";
import OutputPanel from "../../components/OutputPanel";
import { Button } from "@/components/ui/Button";

// Define response types
interface IApiResponse {
  cargo_items?: any[];
  logs?: string[];
  error?: string;
  message?: string;
  detail?: {
    message?: string;
    logs?: string[];
  };
}

export default function DecodePage() {
  const decoderRef = useRef<{ handleDecode: () => void; handleClear: () => void; getInput: () => string }>(null);
  const [decoded, setDecoded] = useState<CargoFormData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleDecode = async (input: string) => {
    if (!input || input.trim() === '') {
      setError('Please enter EDI content before decoding');
      return;
    }

    setLoading(true);
    setError("");
    try {
      // Make API request to decode EDI message
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/decode-edi`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ edi: input }),
      });
      
      let responseText = await res.text();
      let responseData: IApiResponse;
      
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        if (!res.ok) {
          // Handle empty line error
          if (responseText.includes("Empty lines are not allowed")) {
            throw new Error("Empty lines are not allowed between EDI segments");
          }
          // Handle other validation errors
          if (responseText.includes("Invalid EDI format")) {
            const errorDetails = responseText.match(/\[(.*?)\]/g);
            if (errorDetails) {
              // Remove brackets and quotes, split into individual error messages
              const cleanErrors = errorDetails
                .map(detail => detail.slice(1, -1))
                .join(", ");
              throw new Error(cleanErrors);
            }
          }
          throw new Error(responseText);
        }
      }
      
      if (!res.ok) {
        const errorMessage = responseData?.error || responseData?.message || responseData?.detail?.message || "Failed to decode EDI";
        // Check if the error detail contains logs and extract the last error message
        if (responseData?.detail?.logs && Array.isArray(responseData.detail.logs)) {
          const logs = responseData.detail.logs;
          const lastErrorLog = logs.filter(log => log.includes("ERROR")).pop();
          if (lastErrorLog) {
            // Extract the actual error message without timestamp and file info
            const errorMatch = lastErrorLog.match(/ERROR - .*? - (.*)/);
            if (errorMatch && errorMatch[1]) {
              throw new Error(errorMatch[1]);
            } else {
              throw new Error(lastErrorLog);
            }
          }
        }
        throw new Error(errorMessage);
      }
      
      if (responseData.cargo_items) {
        setDecoded(responseData.cargo_items);
      }
    } catch (err: any) {
      console.error("Error decoding EDI:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = () => {
    setDecoded([]);
  };

  const handleClearAll = () => {
    setDecoded([]);
    setError("");
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
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              type="button"
            >
              Clear All
            </Button>
          </div>
          <EdiDecoder 
            ref={decoderRef} 
            onDecode={handleDecode} 
            onInputChange={handleInputChange}
            loading={loading}
            error={error}
            setError={setError}
          />
          <div className="flex flex-col gap-3 sticky bottom-0 bg-transparent pb-4 pt-2">
            <Button
              variant="default"
              onClick={() => decoderRef.current?.handleDecode()}
              className="w-full"
              disabled={loading}
              type="button"
            >
              {loading ? "Decoding..." : "Decode EDI"}
            </Button>
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
