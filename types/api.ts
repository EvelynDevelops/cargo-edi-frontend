import { ICargoFormData } from "@/types/cargo";

/**
 * API response interface for EDI operations
 */
export interface IApiResponse {
  cargo_items?: ICargoFormData[];
  logs?: string[];
  error?: string;
  message?: string;
  detail?: {
    message?: string;
    logs?: string[];
  };
  edi?: string;
  status?: string;
  item_count?: number;
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
  cargo_items: ICargoFormData[];
} 