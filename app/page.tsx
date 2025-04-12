"use client";

import { useState, useRef } from "react";
import CargoFormItem, { CargoFormData, CargoFormErrors, CargoFormRef } from "@/components/CargoFormItem";
import EdiOutputPanel from "@/components/OutputPanel";
import ConfirmationModal from "@/components/ConfirmationModal";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  // Initial cargo items list
  const [cargoItems, setCargoItems] = useState<CargoFormData[]>([
    {
      container_number: "",
      master_bill_number: "",
      house_bill_number: "",
    },
  ]);

  // Output and state handling
  const [ediOutput, setEdiOutput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: number]: CargoFormErrors }>({});

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
      //todo: use a formal logging library
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
        container_number: "",
        master_bill_number: "",
        house_bill_number: "",
      },
    ]);
    setEdiOutput("");
  };

  // Remove a cargo item
  const handleDelete = (index: number) => {
    if (cargoItems.length > 1) {
      //splice 
      setCargoItems((prev) => prev.filter((_, i) => i !== index));
      // clear the form data
      setEdiOutput("");
    }
  };

  // Store refs for all form items
  const formRefs = useRef<(CargoFormRef | null)[]>([]);

  // Register form ref
  const registerFormRef = (index: number, ref: CargoFormRef) => {
    formRefs.current[index] = ref;
  };

  // Validate all fields before submission
  const validateAllInputs = () => {
    let hasErrors = false;
    const newErrors: { [key: number]: CargoFormErrors } = {};
    let firstErrorField: { index: number; field: keyof CargoFormData } | null = null;

    cargoItems.forEach((item, index) => {
      const errors = {
        cargo_type: !item.cargo_type ? "Cargo type is required" : "",
        package_count: !item.package_count ? "Package count is required" : "",
        container_number: "",
        master_bill_number: "",
        house_bill_number: "",
      };
      
      // Track first error field
      if (!firstErrorField) {
        for (const [field, error] of Object.entries(errors)) {
          if (error) {
            firstErrorField = { index, field: field as keyof CargoFormData };
            break;
          }
        }
      }
      
      // Check optional fields format
      if (item.container_number && !isAlphaNumeric(item.container_number)) {
        errors.container_number = "Container number can only contain letters and numbers";
        hasErrors = true;
        if (!firstErrorField) {
          firstErrorField = { index, field: 'container_number' };
        }
      }
      
      if (item.master_bill_number && !isAlphaNumeric(item.master_bill_number)) {
        errors.master_bill_number = "Master bill number can only contain letters and numbers";
        hasErrors = true;
        if (!firstErrorField) {
          firstErrorField = { index, field: 'master_bill_number' };
        }
      }
      
      if (item.house_bill_number && !isAlphaNumeric(item.house_bill_number)) {
        errors.house_bill_number = "House bill number can only contain letters and numbers";
        hasErrors = true;
        if (!firstErrorField) {
          firstErrorField = { index, field: 'house_bill_number' };
        }
      }

      if (errors.cargo_type || errors.package_count) {
        hasErrors = true;
      }

      if (Object.values(errors).some(error => error !== "")) {
        newErrors[index] = errors;
      }
    });

    // Update all form items with their errors
    Object.entries(newErrors).forEach(([index, errors]) => {
      const formRef = formRefs.current[Number(index)];
      if (formRef) {
        formRef.setFieldErrors(errors);
      }
    });

    // Scroll to first error if exists
    if (firstErrorField) {
      const element = document.querySelector(`[data-form-index="${firstErrorField.index}"][data-field="${firstErrorField.field}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        (element as HTMLElement).focus();
      }
    }

    return !hasErrors;
  };

  // Submit and generate EDI if all inputs are valid
  const handleSubmit = async () => {
    if (!validateAllInputs()) {
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
        body: JSON.stringify({ cargo_items: cargoItems }),
      });

      if (!response.ok) {
        //161 and 165
        const errorData = await response.json();
        throw new Error(errorData.detail?.message || errorData.message || "Failed to generate EDI");
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
    if (validateAllInputs()) {
      setIsModalOpen(true);
    }
  };

  // Close confirmation modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Clear all cargo items
  const handleClearAll = () => {
    setCargoItems([
      {
        cargo_type: undefined,
        package_count: undefined,
        container_number: "",
        master_bill_number: "",
        house_bill_number: "",
      }
    ]);
    setEdiOutput("");
    setError("");
    setFormErrors({});
    formRefs.current.forEach(ref => {
      if (ref) {
        ref.setFieldErrors({
          cargo_type: "",
          package_count: "",
          container_number: "",
          master_bill_number: "",
          house_bill_number: "",
        });
      }
    });
  };

  // Handle form errors for each cargo item
  const handleSetFieldErrors = (index: number) => (errors: CargoFormErrors) => {
    setFormErrors(prev => ({
      ...prev,
      [index]: errors
    }));
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
              onChange={handleChange}
              onDelete={cargoItems.length > 1 ? () => handleDelete(index) : undefined}
              ref={(el) => {
                if (el) {
                  registerFormRef(index, el);
                }
              }}
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
