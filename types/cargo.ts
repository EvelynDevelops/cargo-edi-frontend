export type CargoType = 'FCL' | 'LCL' | 'FCX' | '';

export interface ICargoFormData {
  id: number;  
  cargoType?: CargoType;
  packageCount?: number;
  containerNumber?: string;  // Optional, only required when cargoType is 'FCL'
  masterBillNumber?: string;  // Optional
  houseBillNumber?: string;  // Optional
}

export interface ICargoValidationErrors {
  cargoType?: string;
  packageCount?: string;
  containerNumber?: string;
  masterBillNumber?: string;
  houseBillNumber?: string;
}