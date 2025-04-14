import { useState, useEffect } from "react";
import { generateEdi } from "@/services/api/edi";
import { useCargoFormList } from "@/hooks/useCargoFormList";
import { useClipboard } from "@/hooks/useClipboard";
import { useFileDownload } from "@/hooks/useFileDownload";

/**
 * Custom hook for handling Home page business logic
 */
export function useHomePageLogic() {
  const {
    cargoItems,
    formErrors,
    formRefs,
    handleChange,
    handleAdd,
    handleDelete,
    handleClearAll: clearAllForms,
    validateAllInputs,
    registerFormRef,
  } = useCargoFormList();

  // Output and state handling
  const [ediOutput, setEdiOutput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { copyToClipboard } = useClipboard(setError);
  const { downloadFile } = useFileDownload();

  // Clear ediOutput when form data changes
  useEffect(() => {
    setEdiOutput("");
  }, [cargoItems]);

  // Download EDI result as .edi file
  const handleDownload = () => {
    // Create more descriptive filename with date, time and cargo info
    const now = new Date();
    const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const time = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
    const cargoCount = cargoItems.length;
    const cargoTypes = [...new Set(cargoItems.map(item => item.cargoType))].filter(Boolean).join('_');
    
    // Generate filename with pattern: cargo_YYYY-MM-DD_HH-MM-SS_COUNT_TYPES.edi
    const filename = `cargo_${date}_${time}_${cargoCount}${cargoTypes ? `_${cargoTypes}` : ''}.edi`;
    
    downloadFile(ediOutput, {
      type: "text/plain;charset=utf-8",
      filename
    });
  };

  // Custom clear all handler that also clears output
  const handleClearAll = () => {
    clearAllForms();
    setEdiOutput("");
    setError("");
  };

  // Copy EDI output to clipboard
  const handleCopy = async () => {
    if (ediOutput) {
      try {
        const success = await copyToClipboard(ediOutput);
        if (!success) {
          setError("Failed to copy to clipboard");
        }
      } catch (err: any) {
        setError(err.message || "Failed to copy to clipboard");
      }
    }
  };

  // Submit and generate EDI if all inputs are valid
  const handleSubmit = async () => {
    if (!validateAllInputs()) {
      return;
    }

    setLoading(true);
    setError("");
    setEdiOutput("");

    try {
      const ediResult = await generateEdi(cargoItems);
      setEdiOutput(ediResult);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Modal control functions
  const handleOpenModal = () => {
    if (validateAllInputs()) {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return {
    // Form data and management
    cargoItems,
    formErrors,
    formRefs,
    handleChange,
    handleAdd,
    handleDelete,
    registerFormRef,
    
    // Output state
    ediOutput,
    loading,
    error,
    
    // Modal state
    isModalOpen,
    
    // Action handlers
    handleDownload,
    handleClearAll,
    handleCopy,
    handleSubmit,
    handleOpenModal,
    handleCloseModal
  };
} 