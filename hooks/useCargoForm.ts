import { useState, useEffect } from "react";
import { ICargoFormData, ICargoValidationErrors } from "@/types/cargo";
import { validateField } from "@/utils/cargoValidation";

interface UseCargoFormProps {
  index: number;
  data: ICargoFormData;
  onChange: (index: number, updated: ICargoFormData) => void;
  onValidate?: (index: number, isValid: boolean) => void;
}

export const useCargoForm = ({ index, data, onChange, onValidate }: UseCargoFormProps) => {
  const [errors, setErrors] = useState<ICargoValidationErrors>({
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

  const handleFieldChange = (field: keyof ICargoFormData, value: any) => {
    const updatedData = { ...data, [field]: value };
    onChange(index, updatedData);

    // Validate the field
    const error = validateField(field, value, updatedData);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleBlur = (field: keyof ICargoFormData, value: any) => {
    // Validate the field on blur
    const error = validateField(field, value, data);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const setFieldErrors = (newErrors: ICargoValidationErrors) => {
    setErrors(newErrors);
  };

  return {
    errors,
    handleFieldChange,
    handleBlur,
    setFieldErrors
  };
}; 