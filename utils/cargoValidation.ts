import { CargoFormData, CargoType } from "@/components/CargoFormItem";

interface ValidationRule {
  validate: (value: any, data: CargoFormData) => boolean;
  message: string;
}

interface ValidationRules {
  [key: string]: ValidationRule[];
}

// Validation rules
const validationRules: ValidationRules = {
  cargoType: [
    {
      validate: (value) => value !== undefined && value !== "",
      message: "Cargo type is required"
    },
    {
      validate: (value) => isValidCargoType(value),
      message: "Please select a valid cargo type"
    }
  ],
  packageCount: [
    {
      validate: (value) => value !== undefined && value !== "",
      message: "Number of packages is required"
    },
    {
      validate: (value) => !isNaN(Number(value)) && Number.isInteger(Number(value)) && Number(value) >= 1,
      message: "Number of packages must be a positive integer"
    }
  ],
  containerNumber: [
    {
      validate: (value) => value === "" || /^[A-Za-z0-9]+$/.test(value),
      message: "Container number can only contain letters and numbers"
    }
  ],
  masterBillNumber: [
    {
      validate: (value) => value === "" || /^[A-Za-z0-9]+$/.test(value),
      message: "Master bill number can only contain letters and numbers"
    }
  ],
  houseBillNumber: [
    {
      validate: (value) => value === "" || /^[A-Za-z0-9]+$/.test(value),
      message: "House bill number can only contain letters and numbers"
    }
  ]
};

// Validate a single field
export const validateField = (field: keyof CargoFormData, value: any, data: CargoFormData): string => {
  const rules = validationRules[field];
  if (!rules) return "";

  for (const rule of rules) {
    if (!rule.validate(value, data)) {
      return rule.message;
    }
  }

  return "";
};

// Validate the entire form
export const validateForm = (data: CargoFormData): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};

  for (const field in validationRules) {
    const value = data[field as keyof CargoFormData];
    const error = validateField(field as keyof CargoFormData, value, data);
    if (error) {
      errors[field] = error;
    }
  }

  return errors;
};

export const isValidCargoType = (value: string): value is CargoType => {
  return ["FCX", "LCL", "FCL"].includes(value);
}; 