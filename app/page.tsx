// app/page.tsx
"use client";

import { useState } from "react";
import CargoFormItem, { CargoFormData } from "@/components/CargoFormItem";

export default function HomePage() {
  const [cargoItems, setCargoItems] = useState<CargoFormData[]>([
    {
      cargo_type: "LCL",
      number_of_packages: 1,
      container_number: "",
      master_bill_of_lading_number: "",
      house_bill_of_lading_number: "",
    },
  ]);
  const [ediOutput, setEdiOutput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDownload = () => {
    const blob = new Blob([ediOutput], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cargo_message.edi";
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(ediOutput);
      alert("Copied!");
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };
  

  const handleChange = (index: number, updated: CargoFormData) => {
    const newItems = [...cargoItems];
    newItems[index] = updated;
    setCargoItems(newItems);
  };

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

  const handleDelete = (index: number) => {
    if (cargoItems.length > 1) {
      setCargoItems((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setEdiOutput("");
    try {
      const response = await fetch("http://localhost:8000/generate-edi", {
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

  return (
    <main>
      <h1 className="text-2xl font-bold mb-6">Cargo EDI Generator</h1>
      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Left form list with scroll */}
        <div className="space-y-4">
        <h2 className="text-xl font-semibold">Cargo Information</h2>
          {cargoItems.map((item, index) => (
            <CargoFormItem
              key={index}
              index={index}
              data={item}
              onChange={handleChange}
              onDelete={cargoItems.length > 1 ? () => handleDelete(index) : undefined}
            />
          ))}

          <div className="flex flex-col gap-3 sticky bottom-0 bg-white pb-4 pt-2">
            <button
              type="button"
              onClick={handleAdd}
              className="w-full bg-white border border-gray-800 text-gray-800 py-2 rounded-md text-sm hover:bg-gray-100 transition"
            >
              Add Cargo Item
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-gray-800 text-white py-2 rounded-md text-sm hover:bg-gray-700 transition"
            >
              {loading ? "Generating..." : "Generate EDI"}
            </button>
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </div>
        </div>

        {/* Right: EDI output */}
        <div className="space-y-2 w-full">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Generated EDI Message</h2>
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="text-sm underline text-gray-600 hover:text-black"
            >
              Download .edi
            </button>
          </div>

        </div>
          <textarea
            className="w-full h-150 border border-gray-300 rounded-md p-3 text-sm font-mono resize-none"
            value={ediOutput}
            readOnly
            placeholder="EDI string will appear here..."
          />
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 text-xs px-2 py-1 border border-gray-300 rounded bg-white hover:bg-gray-100 transition"
            >
              Copy
            </button>
        </div>
        
      </div>

    </main>
  );
}
