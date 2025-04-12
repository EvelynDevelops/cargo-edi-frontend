import React from "react";
import { TextInput } from "@/components/ui/TextInput";

interface PackageCountInputProps {
  value?: number;
  onChange: (value: number) => void;
  onBlur: (value: string) => void;
  error?: string;
  index: number;
}

const PackageCountInput: React.FC<PackageCountInputProps> = ({
  value,
  onChange,
  onBlur,
  error,
  index
}) => {
  return (
    <TextInput
      label="Number of Packages"
      type="number"
      min={1}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
      onBlur={(e) => onBlur(e.target.value)}
      placeholder="Enter number of packages"
      error={error}
      data-form-index={index}
      data-field="package_count"
      onKeyDown={(e) => {
        if (e.key === '.') {
          e.preventDefault();
        }
      }}
      onInput={(e) => {
        const input = e.target as HTMLInputElement;
        input.value = input.value.replace(/[^\d]/g, '');
      }}
    />
  );
};

export default PackageCountInput; 