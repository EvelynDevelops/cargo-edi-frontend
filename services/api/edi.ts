import { ICargoFormData } from "@/types/cargo";
import { prepareRequestData, processResponseData } from "@/utils/caseConverter";

// 自定义错误类型，包含日志字段
interface EdiError extends Error {
  logs?: string[];
}

export async function generateEdi(cargoItems: ICargoFormData[]) {
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
    const errorMessage = errorData.detail?.message || errorData.message || "Failed to decode EDI";
    const errorLogs = errorData.detail?.logs || [];
    
    // 创建带有日志信息的错误对象
    const error = new Error(errorMessage) as EdiError;
    error.logs = errorLogs; // 添加日志属性到错误对象
    
    throw error;
  }

  const data = await response.json();
  return processResponseData(data).cargoItems;
} 