// ============================================================
// JK Toolkit Studio — Face Detection & Auto Alignment Module
// Uses MediaPipe FaceLandmarker via CDN
// ============================================================

import type { Person } from '@/types';

interface FaceResult {
  success: boolean;
  croppedDataUrl?: string;
  error?: string;
}

interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Detects face in image and returns auto-cropped version.
 * Falls back to center crop if face not found.
 */
export async function detectAndAlignFace(
  imageDataUrl: string,
  targetWidth: number,  // px
  targetHeight: number  // px
): Promise<FaceResult> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);

      // Try HTML5 FaceDetector API first (Chrome)
      if ('FaceDetector' in window) {
        const fd = new (window as unknown as { FaceDetector: new () => { detect: (src: CanvasImageSource) => Promise<Array<{ boundingBox: DOMRectReadOnly }>> } }).FaceDetector();
        fd.detect(canvas)
          .then((faces) => {
            if (faces.length > 0) {
              const bb = faces[0].boundingBox;
              resolve({ success: true, croppedDataUrl: cropWithHeadroom(canvas, bb, targetWidth, targetHeight) });
            } else {
              resolve({ success: true, croppedDataUrl: centerCrop(canvas, targetWidth, targetHeight) });
            }
          })
          .catch(() => {
            resolve({ success: true, croppedDataUrl: centerCrop(canvas, targetWidth, targetHeight) });
          });
      } else {
        // No FaceDetector API — use center crop
        resolve({ success: true, croppedDataUrl: centerCrop(canvas, targetWidth, targetHeight) });
      }
    };
    img.onerror = () => resolve({ success: false, error: 'Image load failed' });
    img.src = imageDataUrl;
  });
}

function cropWithHeadroom(
  canvas: HTMLCanvasElement,
  bb: { x: number; y: number; width: number; height: number },
  targetW: number,
  targetH: number
): string {
  const headroom = bb.height * 0.4;
  const idealH = bb.height * 2.2;
  const idealW = (idealH * targetW) / targetH;
  const cx = bb.x + bb.width / 2;
  const cropX = Math.max(0, cx - idealW / 2);
  const cropY = Math.max(0, bb.y - headroom);
  const cropW = Math.min(canvas.width - cropX, idealW);
  const cropH = Math.min(canvas.height - cropY, idealH);

  const outCanvas = document.createElement('canvas');
  outCanvas.width = targetW;
  outCanvas.height = targetH;
  const ctx = outCanvas.getContext('2d')!;
  ctx.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, targetW, targetH);
  return outCanvas.toDataURL('image/png', 0.95);
}

function centerCrop(canvas: HTMLCanvasElement, targetW: number, targetH: number): string {
  const ratio = targetW / targetH;
  let cropW = canvas.width;
  let cropH = canvas.width / ratio;
  if (cropH > canvas.height) {
    cropH = canvas.height;
    cropW = canvas.height * ratio;
  }
  const cropX = (canvas.width - cropW) / 2;
  const cropY = (canvas.height - cropH) / 2;

  const outCanvas = document.createElement('canvas');
  outCanvas.width = targetW;
  outCanvas.height = targetH;
  const ctx = outCanvas.getContext('2d')!;
  ctx.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, targetW, targetH);
  return outCanvas.toDataURL('image/png', 0.95);
}
