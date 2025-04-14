"use client";

import { useRef } from "react";
import EdiTextEditor from "@/components/edi/EdiTextEditor";
import DecoderLayout from "@/components/layouts/DecoderLayout";
import { useEdiDecoder } from "@/hooks/useEdiDecoder";
import { useClipboard } from "@/hooks/useClipboard";
import { useFileDownload } from "@/hooks/useFileDownload";

export default function DecodePage() {
  const decoderRef = useRef<{ handleDecode: () => void; handleClear: () => void; getInput: () => string }>(null);
  const { decoded, loading, error, errorLogs, handleDecode, setError, clearDecoded } = useEdiDecoder();
  const { copyToClipboard } = useClipboard(setError);
  const { downloadJson } = useFileDownload();

  const handleDownloadJson = () => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0].replace(/:/g, '-');
    const itemCount = decoded.length;
    
    const filename = `decoded_${date}_${time}_${itemCount}items.json`;
    
    downloadJson(decoded, filename);
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
        errorLogs={errorLogs}
        setError={setError}
      />
    </DecoderLayout>
  );
}
