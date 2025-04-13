import { ICargoFormData } from "@/types/cargo";
import { IDecodeRequest, IGenerateRequest, IApiResponse } from "@/types/api";

export async function generateEdi(cargoItems: ICargoFormData[]): Promise<IApiResponse> {
  const response = await fetch('/api/generate-edi', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cargo_items: cargoItems }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate EDI');
  }

  return response.json();
}

export async function decodeEdi(edi: string): Promise<IApiResponse> {
  const response = await fetch('/api/decode-edi', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ edi }),
  });

  if (!response.ok) {
    throw new Error('Failed to decode EDI');
  }

  return response.json();
} 