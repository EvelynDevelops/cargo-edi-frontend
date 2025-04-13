export type CargoType = 'FCL' | 'LCL' | 'FCX' | '';

export interface CargoFormData {
  id?: string;
  cargoType?: CargoType;
  packageCount?: number;
  containerNumber?: string;  // Optional, only required when cargoType is 'FCL'
  masterBillNumber?: string;  // Optional
  houseBillNumber?: string;  // Optional
}

export interface CargoValidationErrors {
  cargoType?: string;
  packageCount?: string;
  containerNumber?: string;
  masterBillNumber?: string;
  houseBillNumber?: string;
} 