import React from "react";
import { CargoType } from "@/types/cargo";

interface CargoTypeSelectProps {
  value?: CargoType;
  onChange: (value: CargoType | undefined) => void;
  onBlur: (value: string) => void;
  error?: string;
  index: number;
}

const CargoTypeSelect: React.FC<CargoTypeSelectProps> = ({
  value,
  onChange,
  onBlur,
  error,
  index
}) => {
  const handleChange = (value: string) => {
    if (value === "") {
      onChange(undefined);
    } else if (value === "FCL" || value === "LCL" || value === "FCX") {
      onChange(value);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Cargo Type</label>
      <select
        className={`w-full border border-gray-300 rounded-md px-3 py-2 text-sm ${value ? 'text-gray-900' : 'text-gray-500'}`}
        value={value || ""}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={(e) => onBlur(e.target.value)}
        data-form-index={index}
        data-field="cargoType"
      >
        <option value="" disabled className="text-gray-500">Select cargo type</option>
        <option value="FCX" className="text-gray-900">FCX</option>
        <option value="LCL" className="text-gray-900">LCL</option>
        <option value="FCL" className="text-gray-900">FCL</option>
      </select>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default CargoTypeSelect; 