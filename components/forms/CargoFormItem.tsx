"use client";

import React, { forwardRef, useImperativeHandle } from "react";
import { TextInput } from "../shared/TextInput";
import { useCargoForm } from "@/hooks/useCargoForm";
import CargoFormHeader from "./CargoFormHeader";
import CargoTypeSelect from "@/components/forms/CargoTypeSelect";
import PackageCountInput from "@/components/forms/PackageCountInput";   
import { ICargoFormData, CargoType, ICargoValidationErrors } from "@/types/cargo";

interface ICargoFormItemProps {
  index: number;
  data: ICargoFormData;
  errors?: ICargoValidationErrors;
  onChange: (index: number, updated: ICargoFormData) => void;
  onDelete?: () => void;
  onValidate?: (index: number, isValid: boolean) => void;
}

export interface CargoFormRef {
  setFieldErrors: (errors: ICargoValidationErrors) => void;
}

const CargoFormItem = forwardRef<CargoFormRef, ICargoFormItemProps>(({ 
  index, 
  data, 
  errors = {}, 
  onChange, 
  onDelete, 
  onValidate
}, ref) => {
  const { handleFieldChange, handleBlur, setFieldErrors } = useCargoForm({
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
          data-testid={`cargoType-${index}`}
        />

        {/* Number of Packages */}
        <PackageCountInput
          value={data.packageCount}
          onChange={(value) => handleFieldChange("packageCount", value)}
          onBlur={(value) => handleBlur("packageCount", value)}
          error={errors.packageCount}
          index={index}
          data-testid={`packageCount-${index}`}
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
          data-testid={`containerNumber-${index}`}
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
          data-testid={`masterBillNumber-${index}`}
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
          data-testid={`houseBillNumber-${index}`}
        />
      </div>
    </div>
  );
});

CargoFormItem.displayName = "CargoFormItem";

export default CargoFormItem;
