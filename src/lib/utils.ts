import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Resolves a public asset path considering Vite's BASE_URL
 * Works seamlessly in localhost, GitHub Pages subpaths, or custom domains.
 */
export function getAssetUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  const base = import.meta.env.BASE_URL || "/";
  return base.endsWith("/") ? `${base}${cleanPath}` : `${base}/${cleanPath}`;
}

/**
 * Downloads a photo file reliably in the browser using blob object URL
 */
export async function downloadPhoto(url: string, filename: string): Promise<void> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Download failed");
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
  } catch (error) {
    console.warn("Direct blob download failed, falling back to anchor download", error);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
