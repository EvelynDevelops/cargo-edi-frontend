import React, { useState } from "react";
import { CargoType } from "@/types/cargo";
import { cn } from "@/lib/utils";
import ChevronDownIcon from "../../public/icons/ChevronDownIcon";

interface ICargoTypeSelectProps {
  value?: CargoType;
  onChange: (value: CargoType | undefined) => void;
  onBlur: (value: string) => void;
  error?: string;
  index: number;
  "data-testid"?: string;
}

interface IOption {
  value: CargoType | "";
  label: string;
}

const OPTIONS: IOption[] = [
  { value: "", label: "Select cargo type" },
  { value: "FCX", label: "FCX" },
  { value: "LCL", label: "LCL" },
  { value: "FCL", label: "FCL" }
];

const CargoTypeSelect: React.FC<ICargoTypeSelectProps> = ({
  value,
  onChange,
  onBlur,
  error,
  index,
  "data-testid": dataTestId
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (newValue: string) => {
    if (newValue === "") {
      onChange(undefined);
    } else if (newValue === "FCL" || newValue === "LCL" || newValue === "FCX") {
      onChange(newValue);
    }
    setIsOpen(false);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsOpen(false);
      onBlur(value || "");
    }, 100);
  };

  const currentOption = OPTIONS.find(option => option.value === value) || OPTIONS[0];

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-1">Cargo Type</label>
      <div
        className={cn(
          "relative w-full h-9 border rounded-md shadow-sm px-3 py-2 text-sm",
          "focus-within:ring-1 focus-within:ring-gray-400 focus-within:border-gray-400",
          "transition-all duration-200 cursor-pointer",
          isOpen ? "border-gray-400 ring-1 ring-gray-400" : "border-gray-300 hover:border-gray-400",
          error ? "border-red-500 focus-within:ring-red-500 focus-within:border-red-500" : ""
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <span className={value ? "text-gray-900" : "text-gray-500"}>
            {currentOption.label}
          </span>
          <ChevronDownIcon 
            className={cn(
              "h-4 w-4 text-gray-400 transition-transform duration-200",
              isOpen ? "transform rotate-180" : ""
            )}
            isActive={isOpen}
            color="#9CA3AF" 
          />
        </div>
        
        {/* Hidden native select for accessibility and testing */}
        <select
          className="sr-only"
          value={value || ""}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          data-form-index={index}
          data-field="cargoType"
          data-testid={dataTestId}
        >
          {OPTIONS.map(option => (
            <option key={option.value} value={option.value} disabled={option.value === ""}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Custom dropdown */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
          <ul className="py-0.5 max-h-60 overflow-auto">
            {OPTIONS.filter(option => option.value !== "").map(option => (
              <li 
                key={option.value}
                className={cn(
                  "px-3 py-1 text-sm cursor-pointer hover:bg-gray-100",
                  option.value === value ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-900"
                )}
                onClick={() => handleChange(option.value)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default CargoTypeSelect;