import { useState, useRef } from "react";
import { ICargoFormData, ICargoValidationErrors } from "@/types/cargo";
import { CargoFormRef } from "@/components/forms/CargoFormItem";

/**
 * Hook for managing cargo form items state
 * Handles adding, removing, and updating form items
 */
export function useCargoFormState() {
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

  // Create empty form item
  const createEmptyFormItem = (id: number): ICargoFormData => ({
    id,
    cargoType: undefined,
    packageCount: undefined,
    containerNumber: "",
    masterBillNumber: "",
    houseBillNumber: "",
  });

  // Handle form item changes
  const handleChange = (index: number, updated: ICargoFormData) => {
    const newItems = [...cargoItems];
    newItems[index] = updated;
    setCargoItems(newItems);
  };

  // Add new form item
  const handleAdd = () => {
    const newId = nextId + 1;
    setCargoItems(prev => [...prev, createEmptyFormItem(newId)]);
    setNextId(newId);
  };

  // Delete form item
  const handleDelete = (index: number) => {
    if (cargoItems.length > 1) {
      const newItems = [...cargoItems];
      newItems.splice(index, 1);
      setCargoItems(newItems);
      
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
    setCargoItems([createEmptyFormItem(1)]);
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

  return {
    // State
    cargoItems,
    formErrors,
    formRefs,
    
    // Actions
    handleChange,
    handleAdd,
    handleDelete,
    handleClearAll,
    registerFormRef,
    
    // Internal state setters (for use by other hooks)
    setFormErrors
  };
} 