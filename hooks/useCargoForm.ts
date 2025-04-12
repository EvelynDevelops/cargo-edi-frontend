import { useState, useEffect } from "react";
import { CargoFormData, CargoFormErrors, CargoType } from "@/components/CargoFormItem";
import { validateField } from "@/utils/cargoValidation";

interface UseCargoFormProps {
  index: number;
  data: CargoFormData;
  onChange: (index: number, updated: CargoFormData) => void;
  onValidate?: (index: number, isValid: boolean) => void;
}

export const useCargoForm = ({ index, data, onChange, onValidate }: UseCargoFormProps) => {
  const [errors, setErrors] = useState<CargoFormErrors>({
    cargo_type: "",
    package_count: "",
    container_number: "",
    master_bill_number: "",
    house_bill_number: ""
  });

  // 当错误变化时，触发验证报告给父组件
  useEffect(() => {
    if (onValidate) {
      const isValid = Object.values(errors).every((e) => e === "");
      onValidate(index, isValid);
    }
  }, [errors, index, onValidate]);

  const handleFieldChange = (field: keyof CargoFormData, value: string | number) => {
    const updated = { ...data };
    const newErrors = { ...errors };
    
    if (field === "package_count") {
      const numValue = value === "" ? undefined : Number(value);
      updated[field] = numValue;
      
      // 使用验证模块验证字段
      newErrors[field] = validateField(field, value, data);
    } else if (field !== "cargo_type" && typeof value === "string") {
      // always update the value, even if it is invalid
      if (value === "" || value.trim() === "") {
        (updated as any)[field] = undefined;
      } else {
        (updated as any)[field] = value;
      }
      
      // 使用验证模块验证字段
      newErrors[field] = validateField(field, value, data);
    } else if (field === "cargo_type") {
      const newValue = value === "" ? undefined : value as CargoType;
      updated.cargo_type = newValue;
      
      // 使用验证模块验证字段
      newErrors[field] = validateField(field, value, data);
    }

    setErrors(newErrors);
    onChange(index, updated);
  };

  const handleBlur = (field: keyof CargoFormData, value: any) => {
    const newErrors = { ...errors };
    
    if (field === "package_count") {
      newErrors[field] = validateField(field, value, data);
    } else if (field === "cargo_type") {
      newErrors[field] = validateField(field, value, data);
    }
    
    setErrors(newErrors);
  };

  const setFieldErrors = (newErrors: CargoFormErrors) => {
    setErrors(newErrors);
  };

  return {
    errors,
    handleFieldChange,
    handleBlur,
    setFieldErrors
  };
}; 