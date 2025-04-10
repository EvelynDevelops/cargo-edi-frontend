"use client";

import React, { useState, useEffect } from "react";

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
  onValidate?: (index: number, isValid: boolean) => void;
};

const CargoFormItem: React.FC<Props> = ({ index, data, onChange, onDelete, onValidate }) => {
  const [errors, setErrors] = useState({
    container_number: "",
    master_bill_of_lading_number: "",
    house_bill_of_lading_number: "",
    number_of_packages: "",
  });

  // Check if all fields are valid (used to call onValidate)
  const validateAllFields = (updated: CargoFormData) => {
    const fieldsToCheck: (keyof CargoFormData)[] = [
      "container_number",
      "master_bill_of_lading_number",
      "house_bill_of_lading_number",
    ];
    
    return fieldsToCheck.every((field) => {
      const val = updated[field];
      return !val || /^[a-zA-Z0-9]*$/.test(val as string);
    });    
  };

  // Trigger validation report to parent when errors change
  useEffect(() => {
    if (onValidate) {
      const isValid = Object.values(errors).every((e) => e === "");
      onValidate(index, isValid);
    }
  }, [errors, index, onValidate]);

  const handleFieldChange = (field: keyof CargoFormData, value: any) => {
    const updated = { ...data, [field]: value };

    if (
      ["container_number", "master_bill_of_lading_number", "house_bill_of_lading_number"].includes(field)
    ) {
      const isValid = value === "" || /^[a-zA-Z0-9]*$/.test(value);
      setErrors((prev) => ({
        ...prev,
        [field]: isValid ? "" : `${field.replaceAll("_", " ")} can only contain letters and numbers`,
      }));
    } else if (field === "number_of_packages") {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }

    onChange(index, updated);
  };

  const handleBlur = (field: keyof CargoFormData, value: any) => {
    if (field === "number_of_packages") {
      if (value === "" || value < 1) {
        setErrors((prev) => ({
          ...prev,
          [field]: "Number of packages must be at least 1",
        }));
      }
    }
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
        {/* Cargo Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cargo Type</label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={data.cargo_type}
            onChange={(e) => handleFieldChange("cargo_type", e.target.value)}
          >
            <option value="FCX">FCX</option>
            <option value="LCL">LCL</option>
            <option value="FCL">FCL</option>
          </select>
        </div>

        {/* Number of Packages */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Number of Packages</label>
          <input
            type="number"
            min={1}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={data.number_of_packages || ""}
            onChange={(e) => handleFieldChange("number_of_packages", e.target.value === "" ? "" : Number(e.target.value))}
            onBlur={(e) => handleBlur("number_of_packages", e.target.value === "" ? "" : Number(e.target.value))}
          />
          {errors.number_of_packages && (
            <p className="text-red-500 text-sm mt-1">{errors.number_of_packages}</p>
          )}
        </div>

        {/* Container Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Container Number (Optional)</label>
          <input
            type="text"
            value={data.container_number || ""}
            onChange={(e) => handleFieldChange("container_number", e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            placeholder="Enter container number"
          />
          {errors.container_number && (
            <p className="text-red-500 text-sm mt-1">{errors.container_number}</p>
          )}
        </div>

        {/* Master Bill */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Master Bill of Lading Number (Optional)</label>
          <input
            type="text"
            value={data.master_bill_of_lading_number || ""}
            onChange={(e) => handleFieldChange("master_bill_of_lading_number", e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            placeholder="Enter master bill number"
          />
          {errors.master_bill_of_lading_number && (
            <p className="text-red-500 text-sm mt-1">{errors.master_bill_of_lading_number}</p>
          )}
        </div>

        {/* House Bill */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">House Bill of Lading Number (Optional)</label>
          <input
            type="text"
            value={data.house_bill_of_lading_number || ""}
            onChange={(e) => handleFieldChange("house_bill_of_lading_number", e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            placeholder="Enter house bill number"
          />
          {errors.house_bill_of_lading_number && (
            <p className="text-red-500 text-sm mt-1">{errors.house_bill_of_lading_number}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CargoFormItem;
