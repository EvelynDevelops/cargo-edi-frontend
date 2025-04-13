import { useState } from 'react';
import { CargoFormData } from '@/components/CargoFormItem';
import { IApiResponse, IDecodeRequest } from '@/types/api';

interface UseEdiDecoderResult {
  decoded: CargoFormData[];
  loading: boolean;
  error: string;
  handleDecode: (input: string) => Promise<void>;
  setError: (error: string) => void;
  clearDecoded: () => void;
}

/**
 * Hook for handling EDI decoding operations
 */
export function useEdiDecoder(): UseEdiDecoderResult {
  const [decoded, setDecoded] = useState<CargoFormData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const clearDecoded = () => {
    setDecoded([]);
    setError("");
  };

  const handleDecode = async (input: string) => {
    if (!input || input.trim() === '') {
      setError('Please enter EDI content before decoding');
      return;
    }

    setLoading(true);
    setError("");
    try {
      const request: IDecodeRequest = { edi: input };
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/edi/decode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });
      
      let responseText = await res.text();
      let responseData: IApiResponse;
      
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        if (!res.ok) {
          if (responseText.includes("Empty lines are not allowed")) {
            throw new Error("Empty lines are not allowed between EDI segments");
          }
          if (responseText.includes("Invalid EDI format")) {
            const errorDetails = responseText.match(/\[(.*?)\]/g);
            if (errorDetails) {
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
        if (responseData?.detail?.logs && Array.isArray(responseData.detail.logs)) {
          const logs = responseData.detail.logs;
          const lastErrorLog = logs.filter(log => log.includes("ERROR")).pop();
          if (lastErrorLog) {
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    decoded,
    loading,
    error,
    handleDecode,
    setError,
    clearDecoded
  };
} 