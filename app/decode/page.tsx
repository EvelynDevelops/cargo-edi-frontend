"use client";

import { useRef } from "react";
import EdiTextEditor from "@/components/EdiTextEditor";
import DecoderLayout from "@/components/decoder/DecoderLayout";
import { useEdiDecoder } from "@/hooks/useEdiDecoder";
import { useClipboard } from "@/hooks/useClipboard";
import { useFileDownload } from "@/hooks/useFileDownload";

export default function DecodePage() {
  const decoderRef = useRef<{ handleDecode: () => void; handleClear: () => void; getInput: () => string }>(null);
  const { decoded, loading, error, handleDecode, setError, clearDecoded } = useEdiDecoder();
  const { copyToClipboard } = useClipboard(setError);
  const { downloadJson } = useFileDownload();

  const handleDownloadJson = () => {
    downloadJson(decoded, `decoded_edi_${Date.now()}.json`);
  };

  const handleClearAll = () => {
    if (decoderRef.current) {
      decoderRef.current.handleClear();
    }
    clearDecoded();
  };

  const handleCopy = async () => {
    const text = JSON.stringify(decoded, null, 2);
    const success = await copyToClipboard(text);
    if (success) {
      setError("");
    }
  };

  return (
    <DecoderLayout
      decoded={decoded}
      loading={loading}
      error={error}
      onClearAll={handleClearAll}
      onDecode={() => decoderRef.current?.handleDecode()}
      onDownload={handleDownloadJson}
      onCopy={handleCopy}
    >
      <EdiTextEditor 
        ref={decoderRef} 
        onDecode={handleDecode}
        onInputChange={clearDecoded}
        loading={loading}
        error={error}
        setError={setError}
      />
    </DecoderLayout>
  );
}
