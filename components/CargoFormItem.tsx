"use client";

import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import CrossIcon from "../public/icons/CrossIcon";

export type CargoType = "FCX" | "LCL" | "FCL";

export type CargoFormData = {
  cargo_type?: CargoType;
  package_count?: number;
  container_number?: string;
  master_bill_number?: string;
  house_bill_number?: string;
};

export type CargoFormErrors = {
  [K in keyof CargoFormData]: string;
};

type ValidationRules = {
  [K in keyof CargoFormData]: {
    pattern?: RegExp;
    message?: string;
    required?: boolean;
  };
};

const validationRules: ValidationRules = {
  cargo_type: {
    required: true,
    message: "Cargo type is required"
  },
  package_count: {
    required: true,
    message: "Package count is required"
  },
  container_number: {
    pattern: /^[a-zA-Z0-9]*$/,
    message: "Container number can only contain letters and numbers (no spaces)"
  },
  master_bill_number: {
    pattern: /^[a-zA-Z0-9]*$/,
    message: "Master bill number can only contain letters and numbers (no spaces)"
  },
  house_bill_number: {
    pattern: /^[a-zA-Z0-9]*$/,
    message: "House bill number can only contain letters and numbers (no spaces)"
  }
};

type Props = {
  index: number;
  data: CargoFormData;
  onChange: (index: number, updated: CargoFormData) => void;
  onDelete?: () => void;
  onValidate?: (index: number, isValid: boolean) => void;
};

export type CargoFormRef = {
  setFieldErrors: (errors: CargoFormErrors) => void;
};

const CargoFormItem = forwardRef<CargoFormRef, Props>(({ 
  index, 
  data, 
  onChange, 
  onDelete, 
  onValidate
}, ref) => {
  const [errors, setErrors] = useState<CargoFormErrors>({
    cargo_type: "",
    container_number: "",
    master_bill_number: "",
    house_bill_number: "",
    package_count: "",
  });

  useImperativeHandle(ref, () => ({
    setFieldErrors: (newErrors: CargoFormErrors) => {
      setErrors(newErrors);
    }
  }));

  // Trigger validation report to parent when errors change
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
      newErrors[field] = numValue === undefined && validationRules[field].required ? 
        validationRules[field].message || "Package count is required" : "";
    } else if (field !== "cargo_type" && typeof value === "string") {
      const rule = validationRules[field];
      const trimmedValue = value.trim();
      const isValid = value === "" || !rule.pattern || rule.pattern.test(trimmedValue);
      
      newErrors[field] = isValid ? "" : (rule.message || `Invalid ${field.replaceAll("_", " ")}`);
      
      if (value === "" || trimmedValue === "") {
        (updated as any)[field] = undefined;
      } else if (isValid) {
        (updated as any)[field] = trimmedValue;
      }
    } else if (field === "cargo_type") {
      const newValue = value === "" ? undefined : value as CargoType;
      updated.cargo_type = newValue;
      newErrors[field] = newValue === undefined && validationRules[field].required ?
        validationRules[field].message || "Cargo type is required" : "";
    }

    setErrors(newErrors);
    onChange(index, updated);
  };

  const handleBlur = (field: keyof CargoFormData, value: any) => {
    const newErrors = { ...errors };
    
    if (field === "package_count") {
      if (value === "" || value === undefined) {
        newErrors[field] = validationRules[field].required ? 
          validationRules[field].message || "Package count is required" : "";
      } else if (value < 1) {
        newErrors[field] = "Number of packages must be at least 1";
      }
    } else if (field === "cargo_type" && validationRules[field].required) {
      if (!data.cargo_type) {
        newErrors[field] = validationRules[field].message || "Cargo type is required";
      }
    }
    
    setErrors(newErrors);
  };

  const isValidCargoType = (value: string): value is CargoType => {
    return ["FCX", "LCL", "FCL"].includes(value);
  };

  return (
    <div className="bg-white border border-gray-300 rounded-xl px-6 py-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Cargo Item #{index + 1}</h3>
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="text-gray-700 transition"
          >
            <CrossIcon className="w-6 h-6 hover:scale-110 hover:font-bold" />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {/* Cargo Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cargo Type</label>
          <select
            className={`w-full border border-gray-300 rounded-md px-3 py-2 text-sm ${data.cargo_type ? 'text-gray-900' : 'text-gray-500'}`}
            value={data.cargo_type || ""}
            onChange={(e) => handleFieldChange("cargo_type", e.target.value as CargoType)}
            onBlur={(e) => handleBlur("cargo_type", e.target.value)}
            data-form-index={index}
            data-field="cargo_type"
          >
            <option value="" disabled className="text-gray-500">Select cargo type</option>
            <option value="FCX" className="text-gray-900">FCX</option>
            <option value="LCL" className="text-gray-900">LCL</option>
            <option value="FCL" className="text-gray-900">FCL</option>
          </select>
          {errors.cargo_type && (
            <p className="text-red-500 text-sm mt-1">{errors.cargo_type}</p>
          )}
        </div>

        {/* Number of Packages */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Number of Packages</label>
          <input
            type="number"
            min={1}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={data.package_count ?? ""}
            onChange={(e) => handleFieldChange("package_count", e.target.value === "" ? "" : Number(e.target.value))}
            onBlur={(e) => handleBlur("package_count", e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="Enter number of packages"
            data-form-index={index}
            data-field="package_count"
          />
          {errors.package_count && (
            <p className="text-red-500 text-sm mt-1">{errors.package_count}</p>
          )}
        </div>

        {/* Container Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Container Number (Optional)</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={data.container_number ?? ""}
            onChange={(e) => handleFieldChange("container_number", e.target.value)}
            onBlur={(e) => handleBlur("container_number", e.target.value)}
            placeholder="Enter container number (optional)"
            data-form-index={index}
            data-field="container_number"
          />
          {errors.container_number && (
            <p className="text-red-500 text-sm mt-1">{errors.container_number}</p>
          )}
        </div>

        {/* Master Bill */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Master Bill Number (Optional)</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={data.master_bill_number ?? ""}
            onChange={(e) => handleFieldChange("master_bill_number", e.target.value)}
            onBlur={(e) => handleBlur("master_bill_number", e.target.value)}
            placeholder="Enter master bill number (optional)"
            data-form-index={index}
            data-field="master_bill_number"
          />
          {errors.master_bill_number && (
            <p className="text-red-500 text-sm mt-1">{errors.master_bill_number}</p>
          )}
        </div>

        {/* House Bill */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">House Bill Number (Optional)</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={data.house_bill_number ?? ""}
            onChange={(e) => handleFieldChange("house_bill_number", e.target.value)}
            onBlur={(e) => handleBlur("house_bill_number", e.target.value)}
            placeholder="Enter house bill number (optional)"
            data-form-index={index}
            data-field="house_bill_number"
          />
          {errors.house_bill_number && (
            <p className="text-red-500 text-sm mt-1">{errors.house_bill_number}</p>
          )}
        </div>
      </div>
    </div>
  );
});

export default CargoFormItem;
