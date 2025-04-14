import { useCargoFormState } from "./useCargoFormState";
import { useCargoFormValidation } from "./useCargoFormValidation";

/**
 * Main hook for cargo form list management
 * Integrates form state and validation
 */
export function useCargoFormList() {
  // Get form state management
  const {
    cargoItems,
    formErrors,
    formRefs,
    handleChange,
    handleAdd,
    handleDelete,
    handleClearAll,
    registerFormRef,
    setFormErrors
  } = useCargoFormState();
  
  // Get validation logic
  const { validateAllInputs } = useCargoFormValidation({
    cargoItems,
    formRefs,
    setFormErrors
  });
  
  return {
    // State
    cargoItems,
    formErrors,
    formRefs: formRefs.current,
    
    // Form management
    handleChange,
    handleAdd,
    handleDelete,
    handleClearAll,
    registerFormRef,
    
    // Validation
    validateAllInputs
  };
} 