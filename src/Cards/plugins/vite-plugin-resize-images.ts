import fs from 'fs';
import path from 'path';
import sharp, { Sharp } from 'sharp';

interface ResizeImagesPluginOptions {
  inputDir?: string;
  outputDir?: string;
  sizes?: { width: number; height: number; folder?: string; compression?: number }[];
}

const defaultOptions: ResizeImagesPluginOptions = {
  inputDir: 'images',
  outputDir: 'public/resized',
  sizes: [{ width: 200, height: 200, compression: 65 }],
};

export default function resizeImagesPlugin(options: ResizeImagesPluginOptions = {}) {
  const { inputDir, outputDir, sizes } = { ...defaultOptions, ...options };

  return {
    name: 'vite-plugin-resize-images',
    async buildStart(): Promise<void> {
      if (!sizes) return;

      await sizes.reduce(async (promise: Promise<void>, size): Promise<void> => {
        await promise;

        const sizeOutputDir: string = size.folder ? path.join(outputDir!, size.folder) : outputDir!;
        if (!fs.existsSync(sizeOutputDir)) {
          fs.mkdirSync(sizeOutputDir, { recursive: true });
        }

        const files: string[] = fs.readdirSync(inputDir!);
        await files.reduce(async (filePromise: Promise<void>, file: string): Promise<void> => {
          await filePromise;

          const inputFilePath: string = path.join(inputDir!, file);
          const outputFilePath: string = path.join(sizeOutputDir, file);

          if (fs.existsSync(outputFilePath)) {
            return;
          }

          const originalSize: number = fs.statSync(inputFilePath).size;

          let image: Sharp = sharp(inputFilePath).resize(size.width, size.height);

          const compressionQuality: number = size.compression ?? 65;
          image = image.jpeg({ quality: compressionQuality });

          await image.toFile(outputFilePath);

          const newSize: number = fs.statSync(outputFilePath).size;
          const reduction: number = ((originalSize - newSize) / originalSize) * 100;

          console.log(`Resized ${file}: original size = ${originalSize} bytes, new size = ${newSize} bytes, reduction = ${reduction.toFixed(2)}%`);
        }, Promise.resolve());
      }, Promise.resolve());
    },
  };
}
