import { useState, useEffect } from "react";
import { CargoFormData, CargoValidationErrors } from "@/types/cargo";
import { validateField } from "@/utils/cargoValidation";

interface UseCargoFormProps {
  index: number;
  data: CargoFormData;
  onChange: (index: number, updated: CargoFormData) => void;
  onValidate?: (index: number, isValid: boolean) => void;
}

export const useCargoForm = ({ index, data, onChange, onValidate }: UseCargoFormProps) => {
  const [errors, setErrors] = useState<CargoValidationErrors>({
    cargoType: "",
    packageCount: "",
    containerNumber: "",
    masterBillNumber: "",
    houseBillNumber: ""
  });

  // Report validation status to parent component when errors change
  useEffect(() => {
    if (onValidate) {
      const isValid = Object.values(errors).every(error => !error);
      onValidate(index, isValid);
    }
  }, [errors, index, onValidate]);

  const handleFieldChange = (field: keyof CargoFormData, value: any) => {
    const updatedData = { ...data, [field]: value };
    onChange(index, updatedData);

    // Validate the field
    const error = validateField(field, value, updatedData);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleBlur = (field: keyof CargoFormData, value: any) => {
    // Validate the field on blur
    const error = validateField(field, value, data);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const setFieldErrors = (newErrors: CargoValidationErrors) => {
    setErrors(newErrors);
  };

  return {
    errors,
    handleFieldChange,
    handleBlur,
    setFieldErrors
  };
}; 