import "server-only";

import sharp from "sharp";

export type OptimizeImageFormat = "webp" | "jpeg" | "png";

export type OptimizeImageOptions = {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: OptimizeImageFormat;
};

const DEFAULT_OPTIONS: Required<OptimizeImageOptions> = {
  maxWidth: 1920,
  maxHeight: 1920,
  quality: 80,
  format: "webp",
};

function replaceExtension(filename: string, ext: string): string {
  return filename.replace(/\.[^/.]+$/, "") + ext;
}

export async function optimizeImageFile(
  file: File,
  options: OptimizeImageOptions = {},
): Promise<File> {
  const { maxWidth, maxHeight, quality, format } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  const input = Buffer.from(await file.arrayBuffer());
  let pipeline = sharp(input).rotate();

  pipeline = pipeline.resize(maxWidth, maxHeight, {
    fit: "inside",
    withoutEnlargement: true,
  });

  let output: Buffer;
  let mime: string;
  let ext: string;

  switch (format) {
    case "jpeg":
      output = await pipeline.jpeg({ quality, mozjpeg: true }).toBuffer();
      mime = "image/jpeg";
      ext = ".jpg";
      break;
    case "png":
      output = await pipeline.png({ compressionLevel: 9 }).toBuffer();
      mime = "image/png";
      ext = ".png";
      break;
    default:
      output = await pipeline.webp({ quality }).toBuffer();
      mime = "image/webp";
      ext = ".webp";
      break;
  }

  return new File([new Uint8Array(output)], replaceExtension(file.name, ext), {
    type: mime,
  });
}

export async function optimizeImageFiles(
  files: File[],
  options?: OptimizeImageOptions,
): Promise<File[]> {
  return Promise.all(files.map((file) => optimizeImageFile(file, options)));
}
