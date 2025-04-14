"use client";

import { useState, useEffect } from "react";
import CargoFormItem from "@/components/forms/CargoFormItem";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import { generateEdi } from "@/services/api/edi";
import { useCargoFormList } from "@/hooks/useCargoFormList";
import { useClipboard } from "@/hooks/useClipboard";
import { useFileDownload } from "@/hooks/useFileDownload";
import HomeLayout from "@/components/layouts/HomeLayout";

export default function HomePage() {
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
    downloadFile(ediOutput, {
      type: "text/plain;charset=utf-8",
      filename: "cargo_message.edi"
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

  // Open confirmation modal
  const handleOpenModal = () => {
    if (validateAllInputs()) {
      setIsModalOpen(true);
    }
  };

  // Close confirmation modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <HomeLayout
        cargoItems={cargoItems}
        loading={loading}
        error={error}
        ediOutput={ediOutput}
        onClearAll={handleClearAll}
        onAdd={handleAdd}
        onGenerate={handleOpenModal}
        onDownload={handleDownload}
        onCopy={handleCopy}
      >
        {cargoItems.map((item, index) => (
          <CargoFormItem
            key={item.id}
            index={index}
            data={item}
            errors={formErrors[index]}
            onChange={handleChange}
            onDelete={cargoItems.length > 1 ? () => handleDelete(index) : undefined}
            ref={(ref) => registerFormRef(index, ref)}
          />
        ))}
      </HomeLayout>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleSubmit}
        cargoItems={cargoItems}
      />
    </>
  );
}
