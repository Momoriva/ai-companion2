import type { BackgroundTone } from "./appearanceTypes";

export function getToneFromLuminance(luminance: number): BackgroundTone {
  return luminance >= 0.56 ? "light" : "dark";
}

export function estimateImageTone(blob: Blob): Promise<BackgroundTone> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(blob);

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const size = 32;
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext("2d");

      if (!context) {
        URL.revokeObjectURL(url);
        reject(new Error("Canvas is not available"));
        return;
      }

      context.drawImage(image, 0, 0, size, size);
      const { data } = context.getImageData(0, 0, size, size);
      let luminance = 0;

      for (let index = 0; index < data.length; index += 4) {
        luminance += (0.2126 * data[index] + 0.7152 * data[index + 1] + 0.0722 * data[index + 2]) / 255;
      }

      URL.revokeObjectURL(url);
      resolve(getToneFromLuminance(luminance / (data.length / 4)));
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Image could not be loaded"));
    };

    image.src = url;
  });
}

