// ============================================================
// JK Toolkit Studio — Sheet Renderer
// Renders sheet layout to a high-DPI canvas for export
// ============================================================

import type { SheetLayout, Person } from '@/types';
import { PAPER_DIMENSIONS, mmToPx } from '@/constants/paper-sizes';

export interface RenderOptions {
  dpi: number;
  showCutGuides: boolean;
  showBleed: boolean;
  bleedSize: number;
  quality: number;
}

/**
 * Renders a sheet layout to an HTMLCanvasElement.
 * Call from main thread or offscreen canvas worker.
 */
export async function renderSheetToCanvas(
  layout: SheetLayout,
  persons: Person[],
  options: RenderOptions
): Promise<HTMLCanvasElement> {
  const paper = PAPER_DIMENSIONS[layout.config.paper];
  const pxW = mmToPx(paper.width, options.dpi);
  const pxH = mmToPx(paper.height, options.dpi);

  const canvas = document.createElement('canvas');
  canvas.width = pxW;
  canvas.height = pxH;
  const ctx = canvas.getContext('2d')!;

  // White background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, pxW, pxH);

  // Draw photos
  const personMap = new Map(persons.map((p) => [p.id, p]));
  const imageCache = new Map<string, HTMLImageElement>();

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    if (imageCache.has(src)) return Promise.resolve(imageCache.get(src)!);
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => { imageCache.set(src, img); resolve(img); };
      img.onerror = reject;
      img.src = src;
    });
  };

  for (const ph of layout.placed) {
    const person = personMap.get(ph.personId);
    if (!person) continue;
    const src = person.processedDataUrl ?? person.photoDataUrl;
    if (!src) continue;

    try {
      const img = await loadImage(src);
      const px = mmToPx(ph.x, options.dpi);
      const py = mmToPx(ph.y, options.dpi);
      const pw = mmToPx(ph.width, options.dpi);
      const ph2 = mmToPx(ph.height, options.dpi);

      ctx.save();
      if (ph.rotation !== 0) {
        ctx.translate(px + pw / 2, py + ph2 / 2);
        ctx.rotate((ph.rotation * Math.PI) / 180);
        ctx.drawImage(img, -pw / 2, -ph2 / 2, pw, ph2);
      } else {
        ctx.drawImage(img, px, py, pw, ph2);
      }
      ctx.restore();
    } catch {}
  }

  // Cut guides
  if (options.showCutGuides) {
    drawCutGuides(ctx, layout, options.dpi);
  }

  return canvas;
}

function drawCutGuides(
  ctx: CanvasRenderingContext2D,
  layout: SheetLayout,
  dpi: number
): void {
  ctx.save();
  ctx.strokeStyle = '#cccccc';
  ctx.lineWidth = 0.5;
  ctx.setLineDash([4, 4]);

  for (const ph of layout.placed) {
    const px = mmToPx(ph.x, dpi);
    const py = mmToPx(ph.y, dpi);
    const pw = mmToPx(ph.width, dpi);
    const ph2 = mmToPx(ph.height, dpi);
    ctx.strokeRect(px, py, pw, ph2);

    // Corner tick marks
    const tick = mmToPx(2, dpi);
    ctx.setLineDash([]);
    ctx.strokeStyle = '#999999';
    // TL
    ctx.beginPath(); ctx.moveTo(px - tick, py); ctx.lineTo(px + tick, py); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(px, py - tick); ctx.lineTo(px, py + tick); ctx.stroke();
    // TR
    ctx.beginPath(); ctx.moveTo(px + pw - tick, py); ctx.lineTo(px + pw + tick, py); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(px + pw, py - tick); ctx.lineTo(px + pw, py + tick); ctx.stroke();
    // BR
    ctx.beginPath(); ctx.moveTo(px + pw - tick, py + ph2); ctx.lineTo(px + pw + tick, py + ph2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(px + pw, py + ph2 - tick); ctx.lineTo(px + pw, py + ph2 + tick); ctx.stroke();
    // BL
    ctx.beginPath(); ctx.moveTo(px - tick, py + ph2); ctx.lineTo(px + tick, py + ph2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(px, py + ph2 - tick); ctx.lineTo(px, py + ph2 + tick); ctx.stroke();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = '#cccccc';
  }
  ctx.restore();
}
