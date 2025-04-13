import { saveAs } from 'file-saver';

interface DownloadOptions {
  type?: string;
  filename?: string;
}

/**
 * Hook for handling file downloads
 */
export function useFileDownload() {
  const downloadFile = (
    content: string,
    options: DownloadOptions = {}
  ) => {
    const {
      type = 'text/plain;charset=utf-8',
      filename = `download_${Date.now()}`
    } = options;

    const blob = new Blob([content], { type });
    saveAs(blob, filename);
  };

  const downloadJson = (
    content: any,
    filename = `data_${Date.now()}.json`
  ) => {
    const jsonString = JSON.stringify(content, null, 2);
    downloadFile(jsonString, {
      type: 'application/json;charset=utf-8',
      filename
    });
  };

  return {
    downloadFile,
    downloadJson
  };
} 