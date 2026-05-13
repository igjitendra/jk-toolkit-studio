// ============================================================
// JK Toolkit Studio — Export Module
// Supports: JPG, PNG, PDF (single/multi), ZIP batch
// ============================================================

import type { SheetLayout, Person, ExportOptions } from '@/types';
import { renderSheetToCanvas } from './sheet-renderer';

export async function exportAsJpg(
  layout: SheetLayout,
  persons: Person[],
  options: ExportOptions
): Promise<Blob> {
  const canvas = await renderSheetToCanvas(layout, persons, {
    dpi: options.dpi,
    showCutGuides: true,
    showBleed: false,
    bleedSize: 1,
    quality: options.quality,
  });
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Canvas blob failed'))),
      'image/jpeg',
      options.quality
    );
  });
}

export async function exportAsPng(
  layout: SheetLayout,
  persons: Person[],
  options: ExportOptions
): Promise<Blob> {
  const canvas = await renderSheetToCanvas(layout, persons, {
    dpi: options.dpi,
    showCutGuides: true,
    showBleed: false,
    bleedSize: 1,
    quality: options.quality,
  });
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Canvas blob failed'))),
      'image/png'
    );
  });
}

export async function exportAsPdf(
  layouts: SheetLayout[],
  persons: Person[],
  options: ExportOptions
): Promise<Blob> {
  const { jsPDF } = await import('jspdf');
  const firstLayout = layouts[0];
  const paper = firstLayout.config.paper;
  const orientation = firstLayout.config.orientation;

  const doc = new jsPDF({
    orientation: orientation === 'landscape' ? 'l' : 'p',
    unit: 'mm',
    format: paper === 'Letter' ? 'letter' : paper.toLowerCase() as 'a4' | 'a5',
  });

  for (let i = 0; i < layouts.length; i++) {
    if (i > 0) doc.addPage();
    const canvas = await renderSheetToCanvas(layouts[i], persons, {
      dpi: options.dpi,
      showCutGuides: true,
      showBleed: false,
      bleedSize: 1,
      quality: options.quality,
    });
    const imgData = canvas.toDataURL('image/jpeg', options.quality);
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    doc.addImage(imgData, 'JPEG', 0, 0, pageW, pageH);
  }

  return doc.output('blob');
}

export async function exportAsZip(
  layouts: SheetLayout[],
  persons: Person[],
  options: ExportOptions
): Promise<Blob> {
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();

  for (let i = 0; i < layouts.length; i++) {
    const blob = await exportAsJpg(layouts[i], persons, options);
    const buf = await blob.arrayBuffer();
    zip.file(`sheet_${String(i + 1).padStart(2, '0')}.jpg`, buf);
  }

  return zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
