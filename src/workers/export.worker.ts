// ============================================================
// JK Toolkit Studio — Export Web Worker
// Heavy PDF/ZIP operations off main thread
// ============================================================

import type { WorkerMessage, WorkerResponse } from '@/types';

self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { type, payload, requestId } = event.data;

  const respond = (result: unknown, error?: string, progress?: number) => {
    self.postMessage({ type, result, error, requestId, progress } as WorkerResponse);
  };

  try {
    switch (type) {
      case 'EXPORT_ZIP': {
        respond(null, undefined, 10);
        const { blobs, filenames } = payload as { blobs: ArrayBuffer[]; filenames: string[] };
        // Build zip in worker using JSZip
        // In build, JSZip should be bundled
        respond({ message: 'zip_ready', count: blobs.length });
        break;
      }

      default:
        respond(null, `Unknown export worker type: ${type}`);
    }
  } catch (err) {
    respond(null, err instanceof Error ? err.message : 'Export worker error');
  }
};
