// Cloudinary configuration and helper utilities

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "ddu46zaxl";

/**
 * Generates an optimized Cloudinary URL for a given public ID or path.
 * If the input is already a full URL and not a Cloudinary image, it returns the input unchanged.
 */
export function getCloudinaryUrl(
  pathOrUrl: string,
  options: {
    width?: number;
    height?: number;
    crop?: "scale" | "fit" | "fill" | "thumb" | "pad";
    quality?: "auto" | number;
    format?: "auto" | string;
  } = {}
): string {
  if (!pathOrUrl) return "";

  // If it's a full URL and not a Cloudinary asset, return it as is
  if (pathOrUrl.startsWith("http") && !pathOrUrl.includes("res.cloudinary.com")) {
    return pathOrUrl;
  }

  // Extract public ID if full Cloudinary URL is passed
  let publicId = pathOrUrl;
  if (pathOrUrl.includes("res.cloudinary.com")) {
    const parts = pathOrUrl.split("/upload/");
    if (parts.length > 1) {
      // Remove version prefix if present (e.g. v12345678/)
      publicId = parts[1].replace(/^v\d+\//, "");
    }
  }

  // Clean public ID of leading slashes
  publicId = publicId.replace(/^\//, "");

  const transformations: string[] = [];

  // Add default optimizations: auto format, auto quality
  const format = options.format || "auto";
  const quality = options.quality || "auto";
  transformations.push(`f_${format}`);
  transformations.push(`q_${quality}`);

  if (options.width) {
    transformations.push(`w_${options.width}`);
  }
  if (options.height) {
    transformations.push(`h_${options.height}`);
  }
  if (options.crop) {
    transformations.push(`c_${options.crop}`);
  }

  const transformationString = transformations.join(",");

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformationString}/${publicId}`;
}
