/**
 * Hook for handling clipboard operations
 */
export function useClipboard(onError?: (error: string) => void) {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      if (onError) {
        onError("Failed to copy to clipboard. Please check browser permissions.");
      }
      return false;
    }
  };

  return {
    copyToClipboard
  };
} 