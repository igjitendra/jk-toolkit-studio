// ============================================================
// JK Toolkit Studio — Print Utilities
// DPI checks, print window, pre-flight warnings
// ============================================================

import type { Person } from '@/types';

export interface PrintWarning {
  type: 'low_dpi' | 'small_size' | 'no_face' | 'low_quality';
  message: string;
  personId?: string;
}

export function getPrintWarnings(
  persons: Person[],
  targetDpi: number
): PrintWarning[] {
  const warnings: PrintWarning[] = [];
  for (const p of persons) {
    if (!p.photoDataUrl && !p.processedDataUrl) continue;
    if (!p.faceDetected) {
      warnings.push({
        type: 'no_face',
        message: `${p.name}: Face not detected — please verify crop manually.`,
        personId: p.id,
      });
    }
  }
  return warnings;
}

export function printCanvasDirectly(canvas: HTMLCanvasElement): void {
  const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
  const win = window.open('');
  if (!win) return;
  win.document.write(`
    <html>
      <head>
        <title>JK Toolkit Studio — Print</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { background: #fff; }
          img { width: 100%; display: block; }
          @media print {
            @page { margin: 0; }
            body { margin: 0; }
          }
        </style>
      </head>
      <body>
        <img src="${dataUrl}" onload="window.print(); window.close();" />
      </body>
    </html>
  `);
  win.document.close();
}
