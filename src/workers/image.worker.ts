// ============================================================
// JK Toolkit Studio — Image Processing Web Worker
// Runs off main thread: resize, bg remove prep, export
// ============================================================

import type { WorkerMessage, WorkerResponse } from '@/types';

self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { type, payload, requestId } = event.data;

  const respond = (result: unknown, error?: string, progress?: number) => {
    self.postMessage({ type, result, error, requestId, progress } as WorkerResponse);
  };

  try {
    switch (type) {
      case 'RESIZE_IMAGE': {
        const { dataUrl, targetWidth, targetHeight, quality } = payload as {
          dataUrl: string;
          targetWidth: number;
          targetHeight: number;
          quality: number;
        };
        // Use createImageBitmap for off-thread decode
        const resp = await fetch(dataUrl);
        const blob = await resp.blob();
        const bitmap = await createImageBitmap(blob, {
          resizeWidth: targetWidth,
          resizeHeight: targetHeight,
          resizeQuality: 'high',
        });
        const offscreen = new OffscreenCanvas(targetWidth, targetHeight);
        const ctx = offscreen.getContext('2d')!;
        ctx.drawImage(bitmap, 0, 0);
        bitmap.close();
        const outBlob = await offscreen.convertToBlob({ type: 'image/jpeg', quality });
        const reader = new FileReaderSync();
        const outDataUrl = reader.readAsDataURL(outBlob);
        respond(outDataUrl);
        break;
      }

      case 'GENERATE_SHEET': {
        // Layout generation is pure JS, runs here
        const { persons, config } = payload as { persons: unknown; config: unknown };
        // Dynamic import inside worker
        // Note: In production, bundle with webpack worker-loader
        respond({ persons, config, message: 'Sheet gen queued to main engine' });
        break;
      }

      default:
        respond(null, `Unknown worker message type: ${type}`);
    }
  } catch (err) {
    respond(null, err instanceof Error ? err.message : 'Worker error');
  }
};
