import { ICargoFormData, CargoType } from "@/types/cargo";

interface IValidationRule {
  validate: (value: any, data: ICargoFormData) => boolean;
  message: string;
}

interface IValidationRules {
  [key: string]: IValidationRule[];
}

// Validation rules
const IValidationRules: IValidationRules = {
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
export const validateField = (field: keyof ICargoFormData, value: any, data: ICargoFormData): string => {
  const rules = IValidationRules[field];
  if (!rules) return "";

  for (const rule of rules) {
    if (!rule.validate(value, data)) {
      return rule.message;
    }
  }

  return "";
};

// Validate the entire form
export const validateForm = (data: ICargoFormData): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};

  for (const field in IValidationRules) {
    const value = data[field as keyof ICargoFormData];
    const error = validateField(field as keyof ICargoFormData, value, data);
    if (error) {
      errors[field] = error;
    }
  }

  return errors;
};

export const isValidCargoType = (value: string): value is CargoType => {
  return ["FCX", "LCL", "FCL"].includes(value);
}; 