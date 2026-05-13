import type { PaperDimensions, PaperSize } from '@/types';

export const PAPER_DIMENSIONS: Record<PaperSize, PaperDimensions> = {
  A4: { width: 210, height: 297, label: 'A4 (210×297mm)' },
  A5: { width: 148, height: 210, label: 'A5 (148×210mm)' },
  Letter: { width: 216, height: 279, label: 'Letter (216×279mm)' },
  '4x6': { width: 102, height: 152, label: '4×6 inch (102×152mm)' },
};

export const MM_PER_INCH = 25.4;

export function mmToPx(mm: number, dpi: number): number {
  return (mm / MM_PER_INCH) * dpi;
}

export function pxToMm(px: number, dpi: number): number {
  return (px / dpi) * MM_PER_INCH;
}
