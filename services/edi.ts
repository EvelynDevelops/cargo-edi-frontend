import { CargoFormData } from "@/types/cargo";
import { prepareRequestData, processResponseData } from "@/utils/caseConverter";

export async function generateEdi(cargoItems: CargoFormData[]) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/edi/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(prepareRequestData({ cargoItems })),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail?.message || errorData.message || "Failed to generate EDI");
  }

  const data = await response.json();
  return processResponseData(data).edi;
}

export async function decodeEdi(ediContent: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/edi/decode`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ edi: ediContent }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail?.message || errorData.message || "Failed to decode EDI");
  }

  const data = await response.json();
  return processResponseData(data).cargoItems;
} 