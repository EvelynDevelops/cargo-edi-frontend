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
  cargo_type: [
    {
      validate: (value) => !!value,
      message: "Cargo type is required"
    }
  ],
  package_count: [
    {
      validate: (value) => !!value,
      message: "Number of packages is required"
    },
    {
      validate: (value) => !isNaN(Number(value)) && Number(value) > 0,
      message: "Number of packages must be a positive number"
    }
  ],
  container_number: [
    {
      validate: (value, data) => {
        if (!value) return true; // 可选字段
        if (data.cargo_type === "FCL") {
          return /^[A-Z]{4}\d{7}$/.test(value);
        }
        return true;
      },
      message: "Container number must be in format AAAA1234567 for FCL cargo"
    }
  ],
  master_bill_number: [
    {
      validate: (value, data) => {
        if (!value) return true; // 可选字段
        if (data.cargo_type === "LCL") {
          return /^[A-Z]{3}\d{6}$/.test(value);
        }
        return true;
      },
      message: "Master bill number must be in format AAA123456 for LCL cargo"
    }
  ],
  house_bill_number: [
    {
      validate: (value, data) => {
        if (!value) return true; // 可选字段
        if (data.cargo_type === "LCL") {
          return /^[A-Z]{2}\d{5}$/.test(value);
        }
        return true;
      },
      message: "House bill number must be in format AA12345 for LCL cargo"
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