import { CargoFormData } from "@/types/cargo";

/**
 * API response interface for EDI operations
 */
export interface IApiResponse {
  cargo_items?: CargoFormData[];
  logs?: string[];
  error?: string;
  message?: string;
  detail?: {
    message?: string;
    logs?: string[];
  };
}

/**
 * API request interface for EDI decode operation
 */
export interface IDecodeRequest {
  edi: string;
}

/**
 * API request interface for EDI generate operation
 */
export interface IGenerateRequest {
  cargo_items: CargoFormData[];
} 