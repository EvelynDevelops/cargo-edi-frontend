"use client";

import { useState } from "react";
import CargoFormItem, { CargoFormData } from "@/components/CargoFormItem";
import EdiOutputPanel from "@/components/EdiOutputPanel";
import ConfirmationModal from "@/components/ConfirmationModal";

export default function HomePage() {
  // Initial cargo items list
  const [cargoItems, setCargoItems] = useState<CargoFormData[]>([
    {
      cargo_type: "LCL",
      number_of_packages: 1,
      container_number: "",
      master_bill_of_lading_number: "",
      house_bill_of_lading_number: "",
    },
  ]);

  // Output and state handling
  const [ediOutput, setEdiOutput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check if string only contains letters and numbers
  const isAlphaNumeric = (text: string) => /^[a-zA-Z0-9]*$/.test(text);

  // Download EDI result as .edi file
  const handleDownload = () => {
    const blob = new Blob([ediOutput], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cargo_message.edi";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Copy EDI output to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(ediOutput);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  // Update cargoItems list when user edits a form field
  const handleChange = (index: number, updated: CargoFormData) => {
    const newItems = [...cargoItems];
    newItems[index] = updated;
    setCargoItems(newItems);
    // clear the output due to form changes
    setEdiOutput("");
  };

  // Add a new cargo item
  const handleAdd = () => {
    setCargoItems((prev) => [
      ...prev,
      {
        cargo_type: "LCL",
        number_of_packages: 1,
        container_number: "",
        master_bill_of_lading_number: "",
        house_bill_of_lading_number: "",
      },
    ]);
  };

  // Remove a cargo item
  const handleDelete = (index: number) => {
    if (cargoItems.length > 1) {
      setCargoItems((prev) => prev.filter((_, i) => i !== index));
      // clear the form data
      setEdiOutput("");
    }
  };

  // Validate all optional fields before submission
  const validateAllInputs = (): boolean => {
    for (let i = 0; i < cargoItems.length; i++) {
      const item = cargoItems[i];
      if (
        (item.container_number && !isAlphaNumeric(item.container_number)) ||
        (item.master_bill_of_lading_number && !isAlphaNumeric(item.master_bill_of_lading_number)) ||
        (item.house_bill_of_lading_number && !isAlphaNumeric(item.house_bill_of_lading_number))
      ) {
        return false;
      }
    }
    return true;
  };

  // Submit and generate EDI if all inputs are valid
  const handleSubmit = async () => {
    const isValid = validateAllInputs();
    if (!isValid) {
      alert("Some fields contain invalid characters. Please correct them as indicated in red before submitting.");
      return;
    }

    setLoading(true);
    setError("");
    setEdiOutput("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate-edi`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cargoItems),
      });

      if (!response.ok) {
        throw new Error("Failed to generate EDI");
      }

      const data = await response.json();
      setEdiOutput(data.edi);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Open confirmation modal
  const handleOpenModal = () => {
    const isValid = validateAllInputs();
    if (!isValid) {
      alert("Some fields contain invalid characters. Please correct them as indicated in red before submitting.");
      return;
    }
    setIsModalOpen(true);
  };

  // Close confirmation modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Clear all cargo items
  const handleClearAll = () => {
    setCargoItems([
      {
        cargo_type: "LCL",
        number_of_packages: 1,
        container_number: "",
        master_bill_of_lading_number: "",
        house_bill_of_lading_number: "",
      },
    ]);
    setEdiOutput("");
  };

  return (
    <main>
      <h1 className="text-2xl font-bold mb-6">Cargo EDI Generator</h1>
      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Left: Cargo input forms */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Cargo Information</h2>
            <button
              type="button"
              onClick={handleClearAll}
              className="text-sm text-gray-800 border border-gray-300 px-3 py-1 rounded hover:bg-gray-100 hover:border-gray-400 transition"
            >
              Clear All
            </button>
          </div>

          {/* List of CargoFormItem components */}
          {cargoItems.map((item, index) => (
            <CargoFormItem
              key={index}
              index={index}
              data={item}
              onChange={handleChange}
              onDelete={cargoItems.length > 1 ? () => handleDelete(index) : undefined}
            />
          ))}

          {/* Add / Submit buttons */}
          <div className="flex flex-col gap-3 sticky bottom-0 bg-transparent pb-4 pt-2">
            <button
              type="button"
              onClick={handleAdd}
              className="w-full bg-white border border-gray-800 text-gray-800 py-2 rounded-md text-sm hover:bg-gray-100 transition"
            >
              Add Cargo Item
            </button>
            <button
              type="button"
              onClick={handleOpenModal}
              className="w-full bg-gray-800 text-white py-2 rounded-md text-sm hover:bg-gray-700 transition"
            >
              {loading ? "Generating..." : "Generate EDI"}
            </button>
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </div>
        </div>

        {/* Right: EDI Output with download */}
        <EdiOutputPanel
          ediOutput={ediOutput}
          onDownload={handleDownload}
          onCopy={handleCopy}
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
