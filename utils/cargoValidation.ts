import { CargoFormData, CargoType } from "@/components/CargoFormItem";

interface ValidationRule {
  validate: (value: any, data: CargoFormData) => boolean;
  message: string;
}

interface ValidationRules {
  [key: string]: ValidationRule[];
}

// 定义验证规则
const validationRules: ValidationRules = {
  cargoType: [
    {
      validate: (value) => value !== undefined && value !== "",
      message: "Cargo type is required"
    },
    {
      validate: (value) => isValidCargoType(value),
      message: "Invalid cargo type"
    }
  ],
  packageCount: [
    {
      validate: (value) => value !== undefined && value !== "",
      message: "Number of packages is required"
    },
    {
      validate: (value) => !isNaN(Number(value)) && Number(value) > 0,
      message: "Number of packages must be a positive number"
    }
  ],
  containerNumber: [
    {
      validate: (value) => value === undefined || value === "" || /^[A-Z0-9]{7,11}$/.test(value),
      message: "Container number must be 7-11 characters long and contain only uppercase letters and numbers"
    }
  ],
  masterBillNumber: [
    {
      validate: (value) => value === undefined || value === "" || /^[A-Z0-9]{5,20}$/.test(value),
      message: "Master bill number must be 5-20 characters long and contain only uppercase letters and numbers"
    }
  ],
  houseBillNumber: [
    {
      validate: (value) => value === undefined || value === "" || /^[A-Z0-9]{5,20}$/.test(value),
      message: "House bill number must be 5-20 characters long and contain only uppercase letters and numbers"
    }
  ]
};

// 验证单个字段
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

// 验证整个表单
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