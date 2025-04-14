import React from "react";
import { CargoType } from "@/types/cargo";
import { cn } from "@/lib/utils";

interface ICargoTypeSelectProps {
  value?: CargoType;
  onChange: (value: CargoType | undefined) => void;
  onBlur: (value: string) => void;
  error?: string;
  index: number;
  "data-testid"?: string;
}

const CargoTypeSelect: React.FC<ICargoTypeSelectProps> = ({
  value,
  onChange,
  onBlur,
  error,
  index,
  "data-testid": dataTestId
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
      <label className="block text-sm font-medium mb-1">Cargo Type</label>
      <select
        className={cn(
          "w-full h-9 border border-input rounded-md shadow-sm px-3 py-1 text-sm",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          "transition-colors",
          value ? 'text-foreground' : 'text-muted-foreground'
        )}
        value={value || ""}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={(e) => onBlur(e.target.value)}
        data-form-index={index}
        data-field="cargoType"
        data-testid={dataTestId}
      >
        <option value="" disabled className="text-muted-foreground">Select cargo type</option>
        <option value="FCX" className="text-foreground">FCX</option>
        <option value="LCL" className="text-foreground">LCL</option>
        <option value="FCL" className="text-foreground">FCL</option>
      </select>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default CargoTypeSelect; 