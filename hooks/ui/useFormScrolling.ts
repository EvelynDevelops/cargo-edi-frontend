import { ICargoFormData } from "@/types/cargo";

interface ScrollToOptions {
  formIndex: number;
  field?: keyof ICargoFormData;
}

/**
 * Hook for handling form scrolling and error highlighting
 * Provides utilities to scroll to and highlight form elements
 */
export function useFormScrolling() {
  /**
   * Scrolls to a form item with optional field focus
   */
  const scrollToFormItem = ({ formIndex, field }: ScrollToOptions) => {
    const formElement = document.querySelector(`[data-cargo-form-index="${formIndex}"]`);
    
    if (formElement) {
      const scrollToForm = () => {
        try {
          // Get form element position
          const rect = formElement.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          
          // Calculate target position with appropriate spacing
          const headerHeight = 80; // Estimated height of top navigation/header
          const targetY = rect.top + scrollTop - headerHeight - 20; // Additional 20px as top margin
          
          // Use smooth scrolling
          window.scrollTo({
            top: targetY,
            behavior: 'smooth'
          });
          
          // Add highlight effect to the form item
          highlightElement(formElement);
          
          // If we have a specific field, focus it after scrolling to the form
          if (field) {
            const fieldElement = document.querySelector(`[data-form-index="${formIndex}"][data-field="${field}"]`);
            if (fieldElement) {
              setTimeout(() => {
                (fieldElement as HTMLElement).focus();
              }, 600);
            }
          }
        } catch (err) {
          console.error('Error during smooth scroll to form:', err);
          
          // Fallback: direct scrollIntoView
          fallbackScroll(formElement, formIndex, field);
        }
      };
      
      // Ensure scrolling executes in the next frame to avoid layout issues
      requestAnimationFrame(scrollToForm);
      return true;
    } 
    
    // Fallback to field-level scrolling if form element isn't found
    if (field) {
      return scrollToField(formIndex, field);
    }
    
    return false;
  };
  
  /**
   * Scrolls directly to a specific field
   */
  const scrollToField = (formIndex: number, field: keyof ICargoFormData) => {
    const element = document.querySelector(`[data-form-index="${formIndex}"][data-field="${field}"]`);
    if (element) {
      const scrollToElement = () => {
        try {
          const rect = element.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const headerHeight = 80;
          const targetY = rect.top + scrollTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetY,
            behavior: 'smooth'
          });
          
          setTimeout(() => {
            (element as HTMLElement).focus();
            highlightElement(element);
          }, 500);
        } catch (err) {
          console.error('Error during field scroll:', err);
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
          setTimeout(() => (element as HTMLElement).focus(), 300);
        }
      };
      
      requestAnimationFrame(scrollToElement);
      return true;
    }
    
    return false;
  };
  
  /**
   * Fallback scrolling mechanism when primary method fails
   */
  const fallbackScroll = (
    formElement: Element, 
    formIndex: number, 
    field?: keyof ICargoFormData
  ) => {
    if (field) {
      const fieldElement = document.querySelector(`[data-form-index="${formIndex}"][data-field="${field}"]`);
      if (fieldElement) {
        fieldElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        setTimeout(() => (fieldElement as HTMLElement).focus(), 300);
        return;
      }
    }
    
    // Last resort fallback
    formElement.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  };
  
  /**
   * Adds a temporary highlight effect to an element
   */
  const highlightElement = (element: Element) => {
    element.classList.add('highlight-error');
    setTimeout(() => {
      element.classList.remove('highlight-error');
    }, 1500);
  };
  
  return {
    scrollToFormItem,
    scrollToField
  };
} 