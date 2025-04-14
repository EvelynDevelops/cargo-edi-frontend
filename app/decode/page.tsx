"use client";

import EdiTextEditor from "@/components/edi/EdiTextEditor";
import DecoderLayout from "@/components/layouts/DecoderLayout";
import { useDecodePage } from "@/hooks/useDecodePage";

/**
 * Decode page component for parsing existing EDI messages
 */
export default function DecodePage() {
  const {
    // References
    decoderRef,
    
    // State
    decoded,
    loading,
    error,
    errorLogs,
    
    // Handlers
    handleDecode,
    handleDownloadJson,
    handleClearAll,
    handleInputChange,
    handleCopy,
    handleDecodeClick,
    setError
  } = useDecodePage();

  return (
    <DecoderLayout
      decoded={decoded}
      loading={loading}
      error={error}
      onClearAll={handleClearAll}
      onDecode={handleDecodeClick}
      onDownload={handleDownloadJson}
      onCopy={handleCopy}
    >
      <EdiTextEditor 
        ref={decoderRef} 
        onDecode={handleDecode}
        onInputChange={handleInputChange}
        loading={loading}
        error={error}
        errorLogs={errorLogs}
        setError={setError}
      />
    </DecoderLayout>
  );
}
