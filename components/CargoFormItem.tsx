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
  cargoType?: CargoType;
  packageCount?: number;
  containerNumber?: string;
  masterBillNumber?: string;
  houseBillNumber?: string;
}

export interface CargoFormErrors {
  cargoType: string;
  packageCount: string;
  containerNumber: string;
  masterBillNumber: string;
  houseBillNumber: string;
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
          value={data.cargoType}
          onChange={(value) => handleFieldChange("cargoType", value)}
          onBlur={(value) => handleBlur("cargoType", value)}
          error={errors.cargoType}
          index={index}
        />

        {/* Number of Packages */}
        <PackageCountInput
          value={data.packageCount}
          onChange={(value) => handleFieldChange("packageCount", value)}
          onBlur={(value) => handleBlur("packageCount", value)}
          error={errors.packageCount}
          index={index}
        />

        {/* Container Number */}
        <TextInput
          label="Container Number (Optional)"
          value={data.containerNumber ?? ""}
          onChange={(e) => handleFieldChange("containerNumber", e.target.value)}
          onBlur={(e) => handleBlur("containerNumber", e.target.value)}
          placeholder="Enter container number (optional)"
          error={errors.containerNumber}
          data-form-index={index}
          data-field="containerNumber"
        />

        {/* Master Bill */}
        <TextInput
          label="Master Bill Number (Optional)"
          value={data.masterBillNumber ?? ""}
          onChange={(e) => handleFieldChange("masterBillNumber", e.target.value)}
          onBlur={(e) => handleBlur("masterBillNumber", e.target.value)}
          placeholder="Enter master bill number (optional)"
          error={errors.masterBillNumber}
          data-form-index={index}
          data-field="masterBillNumber"
        />

        {/* House Bill */}
        <TextInput
          label="House Bill Number (Optional)"
          value={data.houseBillNumber ?? ""}
          onChange={(e) => handleFieldChange("houseBillNumber", e.target.value)}
          onBlur={(e) => handleBlur("houseBillNumber", e.target.value)}
          placeholder="Enter house bill number (optional)"
          error={errors.houseBillNumber}
          data-form-index={index}
          data-field="houseBillNumber"
        />
      </div>
    </div>
  );
});

export default CargoFormItem;
