import type { OptimizeImageOptions } from "@/lib/images";

export const AVATAR_OPTIMIZE_OPTIONS: OptimizeImageOptions = {
  maxWidth: 512,
  maxHeight: 512,
  quality: 85,
  format: "webp",
};

export const LOGO_OPTIMIZE_OPTIONS: OptimizeImageOptions = {
  maxWidth: 512,
  maxHeight: 512,
  quality: 85,
  format: "webp",
};

export const DOCUMENT_IMAGE_OPTIMIZE_OPTIONS: OptimizeImageOptions = {
  maxWidth: 1280,
  maxHeight: 1280,
  quality: 82,
  format: "webp",
};
