import React from "react";
import { TextInput } from "@/components/shared/TextInput";

interface IPackageCountInputProps {
  value?: number;
  onChange: (value: number) => void;
  onBlur: (value: string) => void;
  error?: string;
  index: number;
  "data-testid"?: string;
}

const PackageCountInput: React.FC<IPackageCountInputProps> = ({
  value,
  onChange,
  onBlur,
  error,
  index,
  "data-testid": dataTestId
}) => {
  return (
    <TextInput
      label="Number of Packages"
      type="number"
      min={1}
      max={5000}
      value={value ?? ""}
      onChange={(e) => {
        const val = e.target.value;
        onChange(val === "" ? undefined : Number(val));
      }}
      onBlur={(e) => onBlur(e.target.value)}
      placeholder="Enter number of packages"
      error={error}
      data-form-index={index}
      data-field="packageCount"
      data-testid={dataTestId}
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