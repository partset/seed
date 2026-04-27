// src/utils/formatFileSize.ts

export function formatFileSize(sizeInBytes?: number | null): string {
  if (!sizeInBytes) {
    return "Unknown";
  }

  const sizeInKb = sizeInBytes / 1024;

  if (sizeInKb < 1024) {
    return `${sizeInKb.toFixed(1)} KB`;
  }

  const sizeInMb = sizeInKb / 1024;

  return `${sizeInMb.toFixed(1)} MB`;
}
