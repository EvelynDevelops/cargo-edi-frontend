"use client";

import React, { forwardRef, useImperativeHandle } from "react";
import { TextInput } from "./ui/TextInput";
import { useCargoForm } from "@/hooks/useCargoForm";
import CargoFormHeader from "./forms/CargoFormHeader";
import CargoTypeSelect from "./forms/CargoTypeSelect";
import PackageCountInput from "./forms/PackageCountInput";

export type CargoType = "FCX" | "LCL" | "FCL";

export interface CargoFormData {
  id?: string;
  cargo_type?: CargoType;
  package_count?: number;
  container_number?: string;
  master_bill_number?: string;
  house_bill_number?: string;
}

export interface CargoFormErrors {
  cargo_type: string;
  package_count: string;
  container_number: string;
  master_bill_number: string;
  house_bill_number: string;
}

interface Props {
  index: number;
  data: CargoFormData;
  onChange: (index: number, updated: CargoFormData) => void;
  onDelete?: () => void;
  onValidate?: (index: number, isValid: boolean) => void;
}

export interface CargoFormRef {
  setFieldErrors: (errors: CargoFormErrors) => void;
}

const CargoFormItem = forwardRef<CargoFormRef, Props>(({ 
  index, 
  data, 
  onChange, 
  onDelete, 
  onValidate
}, ref) => {
  const { errors, handleFieldChange, handleBlur, setFieldErrors } = useCargoForm({
    index,
    data,
    onChange,
    onValidate
  });

  useImperativeHandle(ref, () => ({
    setFieldErrors
  }));

  return (
    <div className="bg-white border border-gray-300 rounded-xl px-6 py-6 mb-6">
      <CargoFormHeader index={index} onDelete={onDelete} />

      <div className="flex flex-col gap-4">
        {/* Cargo Type */}
        <CargoTypeSelect
          value={data.cargo_type}
          onChange={(value) => handleFieldChange("cargo_type", value)}
          onBlur={(value) => handleBlur("cargo_type", value)}
          error={errors.cargo_type}
          index={index}
        />

        {/* Number of Packages */}
        <PackageCountInput
          value={data.package_count}
          onChange={(value) => handleFieldChange("package_count", value)}
          onBlur={(value) => handleBlur("package_count", value)}
          error={errors.package_count}
          index={index}
        />

        {/* Container Number */}
        <TextInput
          label="Container Number (Optional)"
          value={data.container_number ?? ""}
          onChange={(e) => handleFieldChange("container_number", e.target.value)}
          onBlur={(e) => handleBlur("container_number", e.target.value)}
          placeholder="Enter container number (optional)"
          error={errors.container_number}
          data-form-index={index}
          data-field="container_number"
        />

        {/* Master Bill */}
        <TextInput
          label="Master Bill Number (Optional)"
          value={data.master_bill_number ?? ""}
          onChange={(e) => handleFieldChange("master_bill_number", e.target.value)}
          onBlur={(e) => handleBlur("master_bill_number", e.target.value)}
          placeholder="Enter master bill number (optional)"
          error={errors.master_bill_number}
          data-form-index={index}
          data-field="master_bill_number"
        />

        {/* House Bill */}
        <TextInput
          label="House Bill Number (Optional)"
          value={data.house_bill_number ?? ""}
          onChange={(e) => handleFieldChange("house_bill_number", e.target.value)}
          onBlur={(e) => handleBlur("house_bill_number", e.target.value)}
          placeholder="Enter house bill number (optional)"
          error={errors.house_bill_number}
          data-form-index={index}
          data-field="house_bill_number"
        />
      </div>
    </div>
  );
});

export default CargoFormItem;
