import { useState, useRef } from "react";
import { ICargoFormData, ICargoValidationErrors } from "@/types/cargo"; 
import { validateForm } from "@/utils/cargoValidation";
import { CargoFormRef } from "@/components/forms/CargoFormItem";

export const useCargoFormList = () => {
  // Manage cargo form list
  const [nextId, setNextId] = useState(1);
  const [cargoItems, setCargoItems] = useState<ICargoFormData[]>([{
    id: 1,
    cargoType: undefined,
    packageCount: undefined,
    containerNumber: "",
    masterBillNumber: "",
    houseBillNumber: "",
  }]);

  // Manage form errors
  const [formErrors, setFormErrors] = useState<{ [key: number]: ICargoValidationErrors }>({});
  
  // Manage form references
  const formRefs = useRef<(CargoFormRef | null)[]>([]);

  // Handle form item changes
  const handleChange = (index: number, updated: ICargoFormData) => {
    const newItems = [...cargoItems];
    newItems[index] = updated;
    setCargoItems(newItems);
  };

  // Add new form item
  const handleAdd = () => {
    setCargoItems(prev => [...prev, {
      id: nextId + 1,
      cargoType: undefined,
      packageCount: undefined,
      containerNumber: "",
      masterBillNumber: "",
      houseBillNumber: "",
    }]);
    setNextId(prev => prev + 1);
  };

  // Delete form item
  const handleDelete = (index: number) => {
    if (cargoItems.length > 1) {
      setCargoItems(prev => prev.filter((_, i) => i !== index));
      // Clear corresponding error messages
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[index];
        // Readjust indices
        const adjustedErrors: typeof newErrors = {};
        Object.entries(newErrors).forEach(([key, value]) => {
          const numKey = Number(key);
          if (numKey > index) {
            adjustedErrors[numKey - 1] = value;
          } else {
            adjustedErrors[numKey] = value;
          }
        });
        return adjustedErrors;
      });
    }
  };

  // Clear all forms
  const handleClearAll = () => {
    setCargoItems([{
      id: 1,
      cargoType: undefined,
      packageCount: undefined,
      containerNumber: "",
      masterBillNumber: "",
      houseBillNumber: "",
    }]);
    setNextId(1);
    setFormErrors({});
    formRefs.current.forEach(ref => {
      if (ref) {
        ref.setFieldErrors({
          cargoType: "",
          packageCount: "",
          containerNumber: "",
          masterBillNumber: "",
          houseBillNumber: "",
        });
      }
    });
  };

  // Register form reference
  const registerFormRef = (index: number, ref: CargoFormRef | null) => {
    formRefs.current[index] = ref;
  };

  // Validate all form items
  const validateAllInputs = () => {
    let hasErrors = false;
    const newErrors: { [key: number]: ICargoValidationErrors } = {};
    let firstErrorField: { index: number; field: keyof ICargoFormData } | null = null;

    cargoItems.forEach((item, index) => {
      const validationErrors = validateForm(item);
      const errors: ICargoValidationErrors = { 
        cargoType: validationErrors.cargoType || "",
        packageCount: validationErrors.packageCount || "",
        containerNumber: validationErrors.containerNumber || "",
        masterBillNumber: validationErrors.masterBillNumber || "",
        houseBillNumber: validationErrors.houseBillNumber || ""
      };
      
      if (Object.values(errors).some(error => error !== "")) {
        hasErrors = true;
        newErrors[index] = errors;

        // Record the first error field
        if (!firstErrorField) {
          for (const [field, error] of Object.entries(errors)) {
            if (error) {
              firstErrorField = { index, field: field as keyof ICargoFormData };
              break;
            }
          }
        }
      }
    });

    // Update errors for all form items
    Object.entries(newErrors).forEach(([index, errors]) => {
      const formRef = formRefs.current[Number(index)];
      if (formRef) {
        formRef.setFieldErrors(errors);
      }
    });

    // Scroll to the first error field
    if (firstErrorField) {
      const element = document.querySelector(`[data-form-index="${firstErrorField.index}"][data-field="${firstErrorField.field}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        (element as HTMLElement).focus();
      }
    }

    setFormErrors(newErrors);
    return !hasErrors;
  };

  return {
    cargoItems,
    formErrors,
    formRefs: formRefs.current,
    handleChange,
    handleAdd,
    handleDelete,
    handleClearAll,
    validateAllInputs,
    registerFormRef,
  };
}; 