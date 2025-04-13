"use client";

import { useState } from "react";
import CargoFormItem from "@/components/CargoFormItem";
import EdiOutputPanel from "@/components/OutputPanel";
import ConfirmationModal from "@/components/ConfirmationModal";
import { Button } from "@/components/ui/Button";
import { prepareRequestData, processResponseData } from "@/utils/caseConverter";
import { useCargoFormList } from "@/hooks/useCargoFormList";
import { useClipboard } from "@/hooks/useClipboard";
import { useFileDownload } from "@/hooks/useFileDownload";
import { generateEdi } from "@/services/edi";

export default function HomePage() {
  const {
    cargoItems,
    formErrors,
    formRefs,
    handleChange,
    handleAdd,
    handleDelete,
    handleClearAll,
    validateAllInputs,
    registerFormRef,
  } = useCargoFormList();

  // Output and state handling
  const [ediOutput, setEdiOutput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { copyToClipboard } = useClipboard();
  const { downloadFile } = useFileDownload();

  // Download EDI result as .edi file
  const handleDownload = () => {
    downloadFile(ediOutput, {
      type: "text/plain;charset=utf-8",
      filename: "cargo_message.edi"
    });
  };

  // Copy EDI output to clipboard
  const handleCopy = async () => {
    await copyToClipboard(ediOutput);
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
    <main className="pt-16">
      <h1 className="text-2xl font-bold mb-6">Cargo EDI Generator</h1>
      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Left: Cargo input forms */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Cargo Information</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              type="button"
            >
              Clear All
            </Button>
          </div>

          {/* List of CargoFormItem components */}
          {cargoItems.map((item, index) => (
            <CargoFormItem
              key={index}
              index={index}
              data={item}
              errors={formErrors[index]}
              onChange={handleChange}
              onDelete={cargoItems.length > 1 ? () => handleDelete(index) : undefined}
              ref={(ref) => registerFormRef(index, ref)}
            />
          ))}

          {/* Add / Submit buttons */}
          <div className="flex flex-col gap-3 sticky bottom-0 bg-transparent pb-4 pt-2">
            <Button
              variant="outline"
              onClick={handleAdd}
              className="w-full"
              type="button"
            >
              Add Cargo Item
            </Button>
            <Button
              variant="default"
              onClick={handleOpenModal}
              className="w-full"
              disabled={loading}
              type="button"
            >
              {loading ? "Generating..." : "Generate EDI"}
            </Button>
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </div>
        </div>

        {/* Right: EDI Output with download */}
        <EdiOutputPanel
          ediOutput={ediOutput}
          onDownload={handleDownload}
          onCopy={handleCopy}
          title="Generated EDI Message"
          downloadText="Download .edi"
        />
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleSubmit}
        cargoItems={cargoItems}
      />
    </main>
  );
}
