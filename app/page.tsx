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

  const handleSubmit = () => {
    console.log("Submitting cargo items:", cargoItems);
    // TODO: Send to backend API to generate EDI
  };

  return (
    <main className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Cargo EDI Generator</h1>

      {cargoItems.map((item, index) => (
        <CargoFormItem
          key={index}
          index={index}
          data={item}
          onChange={handleChange}
          onDelete={cargoItems.length > 1 ? () => handleDelete(index) : undefined}
        />
      ))}

      <div className="mt-6 flex flex-col gap-2">
        <button
          type="button"
          onClick={handleAdd}
          className="w-full bg-gray-800 text-white py-2 rounded-md text-sm hover:bg-gray-700 transition"
        >
          Add Cargo Item
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full bg-white border border-gray-800 text-gray-800 py-2 rounded-md text-sm hover:bg-gray-100 transition"
        >
          Generate EDI
        </button>
      </div>
    </main>
  );
}
