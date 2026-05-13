// ============================================================
// JK Toolkit Studio — Intelligent Sheet Packing Engine
// Mixed-size bin-packing algorithm (Guillotine + Best Fit)
// ============================================================

import type { Person, PlacedPhoto, SheetConfig, SheetLayout } from '@/types';
import { PAPER_DIMENSIONS, mmToPx } from '@/constants/paper-sizes';

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PhotoItem {
  personId: string;
  instanceIndex: number;
  width: number;
  height: number;
}

/**
 * Splits a free rectangle after placing a photo inside it.
 * Uses guillotine split (horizontal first heuristic).
 */
function splitRect(freeRect: Rect, placed: Rect): Rect[] {
  const rects: Rect[] = [];
  // Right split
  if (freeRect.x + freeRect.width > placed.x + placed.width) {
    rects.push({
      x: placed.x + placed.width,
      y: freeRect.y,
      width: freeRect.x + freeRect.width - (placed.x + placed.width),
      height: freeRect.height,
    });
  }
  // Bottom split
  if (freeRect.y + freeRect.height > placed.y + placed.height) {
    rects.push({
      x: freeRect.x,
      y: placed.y + placed.height,
      width: placed.width + (placed.x - freeRect.x),
      height: freeRect.y + freeRect.height - (placed.y + placed.height),
    });
  }
  return rects;
}

/**
 * Find the best free rectangle for an item using Best Short Side fit.
 */
function findBestRect(
  freeRects: Rect[],
  w: number,
  h: number
): { rect: Rect; index: number; rotated: boolean } | null {
  let best: { rect: Rect; index: number; rotated: boolean; score: number } | null = null;

  for (let i = 0; i < freeRects.length; i++) {
    const fr = freeRects[i];
    for (const [itemW, itemH, rotated] of [
      [w, h, false] as const,
      [h, w, true] as const,
    ]) {
      if (itemW <= fr.width && itemH <= fr.height) {
        const score = Math.min(fr.width - itemW, fr.height - itemH);
        if (!best || score < best.score) {
          best = { rect: fr, index: i, rotated, score };
        }
      }
    }
  }
  return best;
}

/**
 * Main packing function.
 * Returns array of pages, each with placed photos.
 */
export function packPhotosToSheets(
  persons: Person[],
  config: SheetConfig
): SheetLayout[] {
  const paper = PAPER_DIMENSIONS[config.paper];
  const usableW = paper.width - config.margin * 2;
  const usableH = paper.height - config.margin * 2;

  // Flatten all instances into an array sorted largest first
  const items: PhotoItem[] = [];
  for (const p of persons) {
    if (!p.processedDataUrl && !p.photoDataUrl) continue;
    for (let i = 0; i < p.quantity; i++) {
      items.push({
        personId: p.id,
        instanceIndex: i,
        width: p.size.width + config.gutterH,
        height: p.size.height + config.gutterV,
      });
    }
  }

  // Sort largest area first
  items.sort((a, b) => b.width * b.height - a.width * a.height);

  const sheets: SheetLayout[] = [];
  let remaining = [...items];

  while (remaining.length > 0) {
    const sheetId = `sheet-${Date.now()}-${sheets.length}`;
    let freeRects: Rect[] = [{ x: 0, y: 0, width: usableW, height: usableH }];
    const placed: PlacedPhoto[] = [];
    const stillRemaining: PhotoItem[] = [];

    for (const item of remaining) {
      const best = findBestRect(freeRects, item.width, item.height);
      if (!best) {
        stillRemaining.push(item);
        continue;
      }
      const { rect, index, rotated } = best;
      const itemW = rotated ? item.height : item.width;
      const itemH = rotated ? item.width : item.height;

      const placedRect: Rect = { x: rect.x, y: rect.y, width: itemW, height: itemH };
      placed.push({
        personId: item.personId,
        instanceIndex: item.instanceIndex,
        x: config.margin + rect.x,
        y: config.margin + rect.y,
        width: itemW - config.gutterH,
        height: itemH - config.gutterV,
        rotation: rotated ? 90 : 0,
      });

      freeRects.splice(index, 1);
      freeRects.push(...splitRect(rect, placedRect));
      // Remove fully covered rects
      freeRects = freeRects.filter(
        (fr) =>
          fr.width > 0.5 &&
          fr.height > 0.5 &&
          !(fr.x >= placedRect.x && fr.y >= placedRect.y &&
            fr.x + fr.width <= placedRect.x + placedRect.width &&
            fr.y + fr.height <= placedRect.y + placedRect.height)
      );
    }

    const usedArea = placed.reduce((sum, p) => sum + p.width * p.height, 0);
    const totalArea = usableW * usableH;

    sheets.push({
      id: sheetId,
      config,
      placed,
      efficiency: usedArea / totalArea,
      createdAt: Date.now(),
    });

    remaining = stillRemaining;
    if (stillRemaining.length === remaining.length) break; // safety exit
  }

  return sheets;
}
