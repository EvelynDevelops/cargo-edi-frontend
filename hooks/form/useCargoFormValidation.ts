import { ICargoFormData, ICargoValidationErrors } from "@/types/cargo";
import { validateForm } from "@/utils/cargoValidation";
import { useFormScrolling } from "../ui/useFormScrolling";

interface ValidationResult {
  isValid: boolean;
  errors: { [key: number]: ICargoValidationErrors };
  firstErrorIndex: number | null;
  firstErrorField: { index: number; field: keyof ICargoFormData } | null;
}

interface UseCargoFormValidationProps {
  cargoItems: ICargoFormData[];
  formRefs: { current: any[] };
  setFormErrors: (errors: { [key: number]: ICargoValidationErrors }) => void;
}

/**
 * Hook for cargo form validation
 * Manages validation logic, error detection, and scrolling to errors
 */
export function useCargoFormValidation({
  cargoItems,
  formRefs,
  setFormErrors
}: UseCargoFormValidationProps) {
  const { scrollToFormItem } = useFormScrolling();

  /**
   * Validates a single form item
   */
  const validateFormItem = (
    item: ICargoFormData, 
    index: number
  ): ICargoValidationErrors | null => {
    const validationErrors = validateForm(item);
    const errors: ICargoValidationErrors = { 
      cargoType: validationErrors.cargoType || "",
      packageCount: validationErrors.packageCount || "",
      containerNumber: validationErrors.containerNumber || "",
      masterBillNumber: validationErrors.masterBillNumber || "",
      houseBillNumber: validationErrors.houseBillNumber || ""
    };
    
    // Check if there are any errors
    if (Object.values(errors).some(error => error !== "")) {
      return errors;
    }
    
    return null;
  };

  /**
   * Validates all form items and collects errors
   */
  const validateAllForms = (): ValidationResult => {
    let hasErrors = false;
    const newErrors: { [key: number]: ICargoValidationErrors } = {};
    let firstErrorIndex: number | null = null;
    let firstErrorField: { index: number; field: keyof ICargoFormData } | null = null;

    // Validate each form item
    cargoItems.forEach((item, index) => {
      const errors = validateFormItem(item, index);
      
      if (errors) {
        hasErrors = true;
        newErrors[index] = errors;

        // Record the first error index and field
        if (firstErrorIndex === null) {
          firstErrorIndex = index;
        }
        
        // Find first error field for this form
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

    return {
      isValid: !hasErrors,
      errors: newErrors,
      firstErrorIndex,
      firstErrorField
    };
  };

  /**
   * Updates form UI with error messages
   */
  const updateFormErrors = (errors: { [key: number]: ICargoValidationErrors }) => {
    // Set errors in form components
    Object.entries(errors).forEach(([index, fieldErrors]) => {
      const formRef = formRefs.current[Number(index)];
      if (formRef) {
        formRef.setFieldErrors(fieldErrors);
      }
    });
    
    // Update global error state
    setFormErrors(errors);
  };

  /**
   * Validates all inputs and handles errors
   * Returns true if valid, false if there are errors
   */
  const validateAllInputs = (): boolean => {
    const { isValid, errors, firstErrorIndex, firstErrorField } = validateAllForms();
    
    // Update UI with errors
    updateFormErrors(errors);
    
    // Scroll to first error if any
    if (firstErrorIndex !== null) {
      scrollToFormItem({ 
        formIndex: firstErrorIndex, 
        field: firstErrorField?.field 
      });
    }
    
    return isValid;
  };

  return {
    validateAllInputs,
    validateFormItem
  };
} 