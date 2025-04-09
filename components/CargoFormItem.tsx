// components/CargoFormItem.tsx
"use client";

import React from "react";

export type CargoFormData = {
  cargo_type: "FCX" | "LCL" | "FCL";
  number_of_packages: number;
  container_number?: string;
  master_bill_of_lading_number?: string;
  house_bill_of_lading_number?: string;
};

type Props = {
  index: number;
  data: CargoFormData;
  onChange: (index: number, updated: CargoFormData) => void;
  onDelete?: () => void;
};

const CargoFormItem: React.FC<Props> = ({ index, data, onChange, onDelete }) => {
  const handleFieldChange = (field: keyof CargoFormData, value: any) => {
    const updated = { ...data, [field]: value };
    onChange(index, updated);
  };

  return (
    <div className="bg-white border border-gray-300 rounded-xl px-6 py-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Cargo Item #{index + 1}</h3>
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="border border-red-500 text-red-500 text-sm px-3 py-1 rounded hover:bg-red-50 transition"
          >
            Delete
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm text-gray-700 font-medium mb-1">Cargo Type</label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={data.cargo_type}
            onChange={(e) => handleFieldChange("cargo_type", e.target.value)}
          >
            <option value="FCX">FCX</option>
            <option value="LCL">LCL</option>
            <option value="FCL">FCL</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 font-medium mb-1">Number of Packages</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={data.number_of_packages}
            onChange={(e) => handleFieldChange("number_of_packages", Number(e.target.value))}
            placeholder="Enter number of packages"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 font-medium mb-1">Container Number (Optional)</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={data.container_number || ""}
            onChange={(e) => handleFieldChange("container_number", e.target.value)}
            placeholder="Enter container number"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 font-medium mb-1">Master Bill of Lading Number (Optional)</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={data.master_bill_of_lading_number || ""}
            onChange={(e) => handleFieldChange("master_bill_of_lading_number", e.target.value)}
            placeholder="Enter master bill number"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 font-medium mb-1">House Bill of Lading Number (Optional)</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={data.house_bill_of_lading_number || ""}
            onChange={(e) => handleFieldChange("house_bill_of_lading_number", e.target.value)}
            placeholder="Enter house bill number"
          />
        </div>
      </div>
    </div>
  );
};

export default CargoFormItem;
